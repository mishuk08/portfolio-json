export const GOOGLE_DRIVE_FOLDER_ID = '1CpcBC-OJAPng_p1tlfu_X2V1VvteIDOu';
export const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`;
export const GOOGLE_DRIVE_EMBED_URL = `https://drive.google.com/embeddedfolderview?id=${GOOGLE_DRIVE_FOLDER_ID}#list`;

// Verified live photos synced from Google Drive folder 1CpcBC-OJAPng_p1tlfu_X2V1VvteIDOu
export const VERIFIED_DRIVE_PHOTOS: string[] = [
  'https://lh3.googleusercontent.com/d/1kVwwJOnNdgvEg6E3hhx-HxfJWYnRdn4c',
  'https://lh3.googleusercontent.com/d/1U474vuPMNFDoIu8ex-57Q6oS6kPVupEy'
];

export const DEFAULT_PHOTOS: string[] = [...VERIFIED_DRIVE_PHOTOS];

// LocalStorage cache keys (versioned to drop stale non-Drive caches)
const CACHE_KEY = 'mishuk_drive_synced_photos_v6';
const LAST_SYNC_KEY = 'mishuk_drive_last_sync_ts_v6';

export function getCachedPhotos(): string[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((url: unknown): url is string => typeof url === 'string' && url.length > 0);
      }
    }
  } catch (e) {
    console.warn('Failed to read photo cache:', e);
  }
  return [...DEFAULT_PHOTOS];
}

export function saveCachedPhotos(photos: string[]): void {
  try {
    if (Array.isArray(photos) && photos.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(photos));
      localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    }
  } catch (e) {
    console.warn('Failed to save photo cache:', e);
  }
}

// Convert any Google Drive file ID to high-speed CDN direct image URL
export function getDriveDirectImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

// Robust extractor for Google Drive folder HTML & embeddedfolderview HTML
export function extractFileIdsFromHtml(html: string, folderId: string = GOOGLE_DRIVE_FOLDER_ID): string[] {
  const ids = new Set<string>();

  // Pattern 1: data-id attributes (modern Google Drive folder rows)
  const regexDataId = /data-id="([a-zA-Z0-9_-]{25,45})"/g;
  let m1;
  while ((m1 = regexDataId.exec(html)) !== null) {
    if (m1[1] && m1[1] !== folderId) {
      ids.add(m1[1]);
    }
  }

  // Pattern 2: Standard drive file links (e.g. embeddedfolderview & folder view)
  const regexFileLink = /\/file\/d\/([a-zA-Z0-9_-]{25,45})/g;
  let m2;
  while ((m2 = regexFileLink.exec(html)) !== null) {
    if (m2[1] && m2[1] !== folderId) {
      ids.add(m2[1]);
    }
  }

  // Pattern 3: Folder item arrays ["fileId",["folderId"]]
  const regexArray = new RegExp(`\\["([a-zA-Z0-9_-]{25,45})",\\["${folderId}"\\]`, 'g');
  let m3;
  while ((m3 = regexArray.exec(html)) !== null) {
    if (m3[1] && m3[1] !== folderId) {
      ids.add(m3[1]);
    }
  }

  return Array.from(ids);
}

// Live Dynamic Synchronizer
export async function syncGoogleDrivePhotos(): Promise<string[]> {
  // Strategy 1: Try API route (works in Vite dev server & Vercel serverless)
  try {
    const localRes = await fetch('/api/drive-photos', { signal: AbortSignal.timeout(4500) });
    const contentType = localRes.headers.get('content-type') || '';
    if (localRes.ok && contentType.includes('application/json')) {
      const data = await localRes.json();
      if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
        saveCachedPhotos(data.photos);
        return data.photos;
      }
    }
  } catch {
    // Continue to CORS proxies
  }

  // Strategy 2: Try public CORS proxies against folder & embedded view
  const targets = [GOOGLE_DRIVE_FOLDER_URL, GOOGLE_DRIVE_EMBED_URL];
  for (const targetUrl of targets) {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
    ];

    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl, {
          signal: AbortSignal.timeout(5000),
          headers: { Accept: 'text/html,application/xhtml+xml' }
        });

        if (response.ok) {
          const html = await response.text();
          const extracted = extractFileIdsFromHtml(html, GOOGLE_DRIVE_FOLDER_ID);
          if (extracted.length > 0) {
            const dynamicPhotos = extracted.map(id => getDriveDirectImageUrl(id));
            const unique = Array.from(new Set(dynamicPhotos));
            saveCachedPhotos(unique);
            return unique;
          }
        }
      } catch {
        // Continue to next proxy
      }
    }
  }

  // Strategy 3: Return cached or verified Drive photos
  const cached = getCachedPhotos();
  if (cached && cached.length > 0) {
    return cached;
  }

  return [...VERIFIED_DRIVE_PHOTOS];
}

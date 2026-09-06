export const GOOGLE_DRIVE_FOLDER_ID = '1CpcBC-OJAPng_p1tlfu_X2V1VvteIDOu';
export const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`;

// Pre-cached verified photos from Google Drive folder 1CpcBC-OJAPng_p1tlfu_X2V1VvteIDOu:
// 1. avatar 2.png -> 1FRtuWXH54F4rURwn-mIa7XdNoBYH1NKC
// 2. avatar.png -> 1rb6Rc1Pc6DRiUhtWYzczXyIUv5rtdT5k
// 3. IMG_20250619_231216_578.jpg -> 1U474vuPMNFDoIu8ex-57Q6oS6kPVupEy
export const VERIFIED_DRIVE_PHOTOS: string[] = [
  '/drive_photo_1.png',
  '/drive_photo_2.png',
  '/drive_photo_3.jpg'
];

export const DEFAULT_PHOTOS: string[] = [
  ...VERIFIED_DRIVE_PHOTOS,
  'https://lh3.googleusercontent.com/d/1FRtuWXH54F4rURwn-mIa7XdNoBYH1NKC',
  'https://lh3.googleusercontent.com/d/1rb6Rc1Pc6DRiUhtWYzczXyIUv5rtdT5k',
  'https://lh3.googleusercontent.com/d/1U474vuPMNFDoIu8ex-57Q6oS6kPVupEy'
];

// LocalStorage cache keys
const CACHE_KEY = 'mishuk_drive_synced_photos_v5';
const LAST_SYNC_KEY = 'mishuk_drive_last_sync_ts_v5';

export function getCachedPhotos(): string[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read photo cache:', e);
  }
  return [...VERIFIED_DRIVE_PHOTOS];
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

// Robust extractor for modern Google Drive folder HTML
export function extractFileIdsFromHtml(html: string, folderId: string = GOOGLE_DRIVE_FOLDER_ID): string[] {
  const ids = new Set<string>();

  // Pattern 1: data-id attributes (modern Google Drive folder rows)
  const regexDataId = /data-id="([a-zA-Z0-9_-]{28,45})"/g;
  let m1;
  while ((m1 = regexDataId.exec(html)) !== null) {
    if (m1[1] && m1[1] !== folderId) {
      ids.add(m1[1]);
    }
  }

  // Pattern 2: 33-character Google Drive file IDs in JS payload
  const regex33 = /"([a-zA-Z0-9_-]{33})"/g;
  let m2;
  while ((m2 = regex33.exec(html)) !== null) {
    if (m2[1] && m2[1] !== folderId && m2[1].startsWith('1')) {
      ids.add(m2[1]);
    }
  }

  // Pattern 3: Standard drive file links
  const regexFileLink = /\/file\/d\/([a-zA-Z0-9_-]{28,45})/g;
  let m3;
  while ((m3 = regexFileLink.exec(html)) !== null) {
    if (m3[1] && m3[1] !== folderId) {
      ids.add(m3[1]);
    }
  }

  // Pattern 4: Folder item arrays ["fileId",["folderId"]]
  const regexArray = new RegExp(`\\["([a-zA-Z0-9_-]{25,45})",\\["${folderId}"\\]`, 'g');
  let m4;
  while ((m4 = regexArray.exec(html)) !== null) {
    if (m4[1] && m4[1] !== folderId) {
      ids.add(m4[1]);
    }
  }

  return Array.from(ids);
}

// Live Dynamic Synchronizer
export async function syncGoogleDrivePhotos(): Promise<string[]> {
  // Strategy 1: Try local Vite API route (works in dev & preview, no CORS issue)
  try {
    const localRes = await fetch('/api/drive-photos', { signal: AbortSignal.timeout(4000) });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
        saveCachedPhotos(data.photos);
        return data.photos;
      }
    }
  } catch {
    // Continue to CORS proxies
  }

  // Strategy 2: Try public CORS proxies to scrape live folder changes
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_DRIVE_FOLDER_URL)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(GOOGLE_DRIVE_FOLDER_URL)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(GOOGLE_DRIVE_FOLDER_URL)}`
  ];

  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(5000),
        headers: { 'Accept': 'text/html,application/xhtml+xml' }
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

  // Strategy 3: Return cached or verified drive photos
  const cached = getCachedPhotos();
  if (cached && cached.length > 0) {
    return cached;
  }

  return [...VERIFIED_DRIVE_PHOTOS];
}

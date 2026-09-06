import avatar1Opt from '../assets/avatar_optimized.webp';
import avatar2Opt from '../assets/avatar2_optimized.webp';
import avatar1 from '../assets/drive_avatar_1.png';
import avatar2 from '../assets/drive_avatar_2.webp';

export const GOOGLE_DRIVE_FOLDER_ID = '1CpcBC-OJAPng_p1tlfu_X2V1VvteIDOu';
export const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`;

// Pre-bundled static fallbacks to guarantee 100% immediate render on any environment/Vercel
export const DEFAULT_PHOTOS: string[] = [
  avatar1Opt || avatar1 || '/avatar_optimized.webp',
  avatar2Opt || avatar2 || '/avatar2_optimized.webp'
].filter(Boolean);

// LocalStorage cache key (v4 to bust any corrupt previously cached string URLs)
const CACHE_KEY = 'mishuk_drive_synced_photos_v4';
const LAST_SYNC_KEY = 'mishuk_drive_last_sync_ts';

export function getCachedPhotos(): string[] {
  try {
    // Purge outdated v1/v2 cache keys that might contain broken URLs
    localStorage.removeItem('mishuk_drive_synced_photos');
    localStorage.removeItem('mishuk_drive_synced_photos_v2');
    localStorage.removeItem('mishuk_drive_synced_photos_v3');

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

// Extract Google Drive File IDs from raw HTML response
export function extractFileIdsFromHtml(html: string, folderId: string = GOOGLE_DRIVE_FOLDER_ID): string[] {
  const ids = new Set<string>();

  // Pattern 1: Folder item arrays [fileId, [folderId]]
  const regex1 = new RegExp(`\\["([a-zA-Z0-9_-]{25,45})",\\["${folderId}"\\]`, 'g');
  let m1;
  while ((m1 = regex1.exec(html)) !== null) {
    if (m1[1] && m1[1] !== folderId) {
      ids.add(m1[1]);
    }
  }

  // Pattern 2: Drive item IDs with ssk bindings or attributes
  const regex2 = /ssk=['"][^'"]*38:([a-zA-Z0-9_-]{28,45})/g;
  let m2;
  while ((m2 = regex2.exec(html)) !== null) {
    if (m2[1] && m2[1] !== folderId) {
      ids.add(m2[1]);
    }
  }

  // Pattern 3: Standard drive file links
  const regex3 = /\/file\/d\/([a-zA-Z0-9_-]{28,45})/g;
  let m3;
  while ((m3 = regex3.exec(html)) !== null) {
    if (m3[1] && m3[1] !== folderId) {
      ids.add(m3[1]);
    }
  }

  return Array.from(ids);
}

// Live Dynamic Synchronizer
export async function syncGoogleDrivePhotos(): Promise<string[]> {
  try {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_DRIVE_FOLDER_URL)}`,
      `https://corsproxy.io/?url=${encodeURIComponent(GOOGLE_DRIVE_FOLDER_URL)}`
    ];

    let foundIds: string[] = [];

    for (const proxyUrl of proxies) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: { 'Accept': 'text/html,application/xhtml+xml' }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const html = await response.text();
          const extracted = extractFileIdsFromHtml(html, GOOGLE_DRIVE_FOLDER_ID);
          if (extracted.length > 0) {
            foundIds = extracted;
            break;
          }
        }
      } catch {
        // Continue to fallback or next proxy
      }
    }

    if (foundIds.length > 0) {
      const dynamicPhotos = foundIds.map(id => getDriveDirectImageUrl(id));
      const unique = Array.from(new Set(dynamicPhotos));
      saveCachedPhotos(unique);
      return unique;
    }
  } catch (error) {
    console.info('Using reliable pre-cached photo bundle:', error);
  }

  return getCachedPhotos();
}

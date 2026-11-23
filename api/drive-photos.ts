import https from 'https';

const FOLDER_ID = '1CpcBC-OJAPng_p1tlfu_X2V1VvteIDOu';
const FALLBACK_IDS = [
  '1kVwwJOnNdgvEg6E3hhx-HxfJWYnRdn4c',
  '1U474vuPMNFDoIu8ex-57Q6oS6kPVupEy'
];

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PortfolioDriveSync/1.0)'
        }
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchHtml(res.headers.location).then(resolve).catch(reject);
          return;
        }
        let html = '';
        res.on('data', (chunk) => {
          html += chunk;
        });
        res.on('end', () => resolve(html));
      }
    );
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error('Request timeout'));
    });
  });
}

function extractDriveIds(html: string): string[] {
  const ids = new Set<string>();

  const rDataId = /data-id="([a-zA-Z0-9_-]{25,45})"/g;
  let m: RegExpExecArray | null;
  while ((m = rDataId.exec(html)) !== null) {
    if (m[1] && m[1] !== FOLDER_ID) ids.add(m[1]);
  }

  const rFileLink = /\/file\/d\/([a-zA-Z0-9_-]{25,45})/g;
  while ((m = rFileLink.exec(html)) !== null) {
    if (m[1] && m[1] !== FOLDER_ID) ids.add(m[1]);
  }

  return Array.from(ids);
}

export default async function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  try {
    let idList: string[] = [];
    try {
      const folderHtml = await fetchHtml(`https://drive.google.com/drive/folders/${FOLDER_ID}`);
      idList = extractDriveIds(folderHtml);
    } catch {
      // Fallback to embeddedfolderview
    }

    if (idList.length === 0) {
      try {
        const embedHtml = await fetchHtml(`https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#list`);
        idList = extractDriveIds(embedHtml);
      } catch {
        // Use fallback IDs below
      }
    }

    const finalIds = idList.length > 0 ? idList : FALLBACK_IDS;
    const photos = finalIds.map((id) => `https://lh3.googleusercontent.com/d/${id}`);

    res.status(200).json({
      success: true,
      folderId: FOLDER_ID,
      ids: finalIds,
      photos,
      count: photos.length,
      timestamp: Date.now()
    });
  } catch (err: any) {
    const photos = FALLBACK_IDS.map((id) => `https://lh3.googleusercontent.com/d/${id}`);
    res.status(200).json({
      success: false,
      error: err?.message || 'Drive sync fallback',
      folderId: FOLDER_ID,
      ids: FALLBACK_IDS,
      photos,
      count: photos.length,
      timestamp: Date.now()
    });
  }
}

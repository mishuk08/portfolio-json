import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import https from 'https';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function driveSyncPlugin(): Plugin {
  return {
    name: 'vite-plugin-drive-sync',
    configureServer(server) {
      server.middlewares.use('/api/drive-photos', async (_req, res) => {
        const folderId = '1CpcBC-OJAPng_p1tlfu_X2V1VvteIDOu';
        const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

        try {
          https.get(folderUrl, (driveRes) => {
            let html = '';
            driveRes.on('data', chunk => { html += chunk; });
            driveRes.on('end', () => {
              const ids = new Set<string>();

              // data-id
              const rDataId = /data-id="([a-zA-Z0-9_-]{28,45})"/g;
              let m;
              while ((m = rDataId.exec(html)) !== null) {
                if (m[1] !== folderId) ids.add(m[1]);
              }

              // 33-character Google Drive file IDs
              const r33 = /"([a-zA-Z0-9_-]{33})"/g;
              while ((m = r33.exec(html)) !== null) {
                if (m[1] !== folderId && m[1].startsWith('1')) ids.add(m[1]);
              }

              const idList = Array.from(ids);
              const photos = idList.length > 0 
                ? idList.map(id => `https://lh3.googleusercontent.com/d/${id}`)
                : [
                    'https://lh3.googleusercontent.com/d/1FRtuWXH54F4rURwn-mIa7XdNoBYH1NKC',
                    'https://lh3.googleusercontent.com/d/1rb6Rc1Pc6DRiUhtWYzczXyIUv5rtdT5k',
                    'https://lh3.googleusercontent.com/d/1U474vuPMNFDoIu8ex-57Q6oS6kPVupEy'
                  ];

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({
                success: true,
                folderId,
                ids: idList.length > 0 ? idList : [
                  '1FRtuWXH54F4rURwn-mIa7XdNoBYH1NKC',
                  '1rb6Rc1Pc6DRiUhtWYzczXyIUv5rtdT5k',
                  '1U474vuPMNFDoIu8ex-57Q6oS6kPVupEy'
                ],
                photos,
                count: photos.length,
                timestamp: Date.now()
              }));
            });
          }).on('error', (err) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({
              success: false,
              error: err.message,
              photos: [
                'https://lh3.googleusercontent.com/d/1FRtuWXH54F4rURwn-mIa7XdNoBYH1NKC',
                'https://lh3.googleusercontent.com/d/1rb6Rc1Pc6DRiUhtWYzczXyIUv5rtdT5k',
                'https://lh3.googleusercontent.com/d/1U474vuPMNFDoIu8ex-57Q6oS6kPVupEy'
              ]
            }));
          });
        } catch (e) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: String(e) }));
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      driveSyncPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'apple-touch-icon.png', 'avatar.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: {
          id: '/',
          name: 'Mishuk Babu Shoukhin Portfolio',
          short_name: 'Mishuk Babu',
          description: 'Official Portfolio of Mishuk Babu Shoukhin - Web & Software Developer.',
          theme_color: '#0d0e13',
          background_color: '#0b0c10',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/avatar.png',
              sizes: '1053x1056',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, copyFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/quickfit/',
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      closeBundle() {
        // Copy index.html to 404.html for GitHub Pages SPA fallback
        const src = resolve(__dirname, 'dist/index.html')
        const dest = resolve(__dirname, 'dist/404.html')
        try {
          const html = readFileSync(src, 'utf-8')
          const html404 = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QuickFit</title>
  <script>
    (function() {
      var redirect = sessionStorage.redirect;
      sessionStorage.removeItem('redirect');
      if (redirect) {
        window.location.href = redirect;
      } else {
        window.location.href = '/quickfit/';
      }
    })();
  </script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`
          writeFileSync(dest, html404)
        } catch (e) {}
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
})

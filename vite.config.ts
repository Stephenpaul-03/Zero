import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// @ts-expect-error The backend is plain Node.js, outside the browser program.
import { createEditorHandler } from './server/api.mjs'
// @ts-expect-error The read-only development content server is plain Node.js.
import { createPublicContentHandler, watchSavedCatalog } from './server/public.mjs'

export default defineConfig(({ mode }) => ({
  cacheDir: mode === 'admin' ? 'node_modules/.vite-admin' : 'node_modules/.vite-public',
  base: process.env.ZERO_BASE_PATH || '/',
  server: { host: '127.0.0.1', port: mode === 'admin' ? 5175 : 5173, strictPort: true, watch: { ignored: mode === 'admin' ? ['**/content/**', '**/public/zero-content/**'] : ['**/public/zero-content/**'] } },
  plugins: [react(), tailwindcss(), {
    name: 'zero-local-create',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(createPublicContentHandler(path.resolve(__dirname),process.env.ZERO_BASE_PATH||'/'))
      if (mode === 'admin') server.middlewares.use('/__zero', createEditorHandler(path.resolve(__dirname)))
      else watchSavedCatalog(server,path.resolve(__dirname))
    },
  }],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}))

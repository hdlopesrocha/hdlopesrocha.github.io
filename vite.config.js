import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages **user site** (hdlopesrocha.github.io) is served from `/`.
// Do NOT set a repository-specific base path here.
export default defineConfig({
  base: '/',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 600
  },
  server: {
    port: 5173
  }
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const now = new Date()
const buildDate = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-')

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site: https://rustygregory.github.io/incremental-api-blocking/
  base: '/incremental-api-blocking/',
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
})

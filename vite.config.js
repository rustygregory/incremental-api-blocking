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
  // Override for GitHub Pages: VITE_BASE=/incremental-api-blocking/ npm run build
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
})

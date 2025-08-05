// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1) Intercepta TODO lo que empiece por /api
      '/api': {
        // 2) Apunta directamente a tu API
        target: 'http://localhost/iconCRM/backend/api',
        changeOrigin: true,
        secure: false,
        // 3) Elimina el prefijo `/api` de la ruta
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

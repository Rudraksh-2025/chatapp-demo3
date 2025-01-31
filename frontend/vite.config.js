import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: 'window',
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.quickblox.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    host: '0.0.0.0',
    port: 5173,
  }
})

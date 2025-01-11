import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: "::",
    proxy: {
      // Fallback for client-side routing
      '*': {
        target: '/',
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : null
      }
    }
  },
  preview: {
    port: 8080,
    proxy: {
      '*': {
        target: '/',
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : null
      }
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  root: './client',
  build: { 
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production'
  },
  resolve: { 
    alias: { 
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './client/src'),
      '@shared': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './shared')
    } 
  },
  server: { 
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/config': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
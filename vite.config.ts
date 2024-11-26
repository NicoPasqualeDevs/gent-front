import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled'
    ]
  },
  build: {
    outDir: '../gents-back/static/frontend',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          styles: ['@emotion/react', '@emotion/styled']
        },
        assetFileNames: (assetInfo) => {
          const type = assetInfo.name.split('.').pop()
          const mapping = {
            woff: 'fonts',
            woff2: 'fonts',
            ttf: 'fonts',
            css: 'css',
          }
          const dir = mapping[type] || type
          return `assets/${dir}/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    manifest: true,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1500,
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://www.gentsbuilder.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    host: true,
    port: Number(process.env.PORT) || 3000,
    cors: true
  },
  base: '/',
}

export default defineConfig(config)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
  build: {
    outDir: '../gents-back/static/frontend',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
        assetFileNames: (assetInfo) => {
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name][extname]`
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/fonts/[name][extname]`
          }
          if (assetInfo.name === 'favicon.ico' || 
              assetInfo.name.startsWith('logo') || 
              assetInfo.name === 'manifest.json') {
            return `[name].[ext]`
          }
          return `assets/[ext]/[name]-[hash][extname]`
        },
        preserveModules: false,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.gentsbuilder.com',
        changeOrigin: true,
        secure: false,
      }
    },
    host: true,
    port: 3000,
  },
  base: '/',
})

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
          'vendor': ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material'],
          'app': [
            'formik',
            'yup',
            'react-toastify',
            'framer-motion'
          ]
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name].[ext]`
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name].[ext]`
          }
          return `assets/[ext]/[name].[ext]`
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
      },
    },
    manifest: true,
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    modulePreload: {
      polyfill: true
    },
    dynamicImportVarsOptions: {
      warnOnError: true
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.gentsbuilder.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'Accept': 'application/javascript'
        }
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/javascript',
    },
    host: true,
    port: 3000,
  },
  base: '/',
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      'formik',
      'yup',
      'react-toastify',
      'framer-motion'
    ]
  }
})

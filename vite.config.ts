import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    tsconfigPaths()
  ],

  resolve: {
    alias: [
      { find: './runtimeConfig', replacement: './runtimeConfig.browser' },
      // Removemos la línea de @mui/material
    ],
  },
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: '../gents-back/static/frontend',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'form': ['formik', 'yup'],
          'utils': ['react-toastify', 'framer-motion']
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].[ext]`
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].[ext]`
          }
          return `assets/[ext]/[name]-[hash].[ext]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    manifest: true,
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    target: ['es2015', 'chrome87', 'safari13'],
    cssMinify: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1500,
    modulePreload: {
      polyfill: true
    }
  },
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
  },
})

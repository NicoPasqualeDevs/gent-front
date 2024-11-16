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
    ],
  },
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: './build',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@mui/material'],
        },
        // Asegura que los assets coincidan con la configuración de Nginx
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false, // Necesario para desarrollo local
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'ws://localhost:8001',
        ws: true,
      }
    }
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
  },
})

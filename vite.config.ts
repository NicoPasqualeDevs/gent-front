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
    outDir: './build',
  },
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
  },
})

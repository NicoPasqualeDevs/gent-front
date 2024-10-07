import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(),react()],

  resolve: {
    alias: [{ find: './runtimeConfig', replacement: './runtimeConfig.browser' }],
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
})

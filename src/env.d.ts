/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_URL: string
  readonly VITE_API_URL: string
  readonly VITE_DEV_API_BASE: string
  readonly VITE_PROD_API_BASE: string
  // Agrega aquí otras variables de entorno
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
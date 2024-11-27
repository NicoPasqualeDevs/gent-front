/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROD_WS_URL: string
  readonly VITE_PROD_API_URL: string
  readonly VITE_DEV_API_BASE: string
  readonly VITE_PROD_API_BASE: string
  readonly MODE: string
  // Agrega aquí otras variables de entorno
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
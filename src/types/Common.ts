// Tipo básico para archivos
export type File = string | Blob;

// Tipo para respuestas de API
export interface ApiResponse<T> {
  data: T;
  status: string;
  error?: string;
}
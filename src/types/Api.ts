export interface Metadata {
  current_page: number;
  total_pages: number;
  total_items: number;
  page_size: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    current_page?: number;
    total_pages?: number;
    total_items?: number;
    page_size?: number;
    has_next?: boolean;
    has_previous?: boolean;
  };
}

export interface ApiError {
  status: string;
  error: string;
  data?: string;
}

// Tipo base para los datos de la API
export type ApiData = Record<string, unknown>;

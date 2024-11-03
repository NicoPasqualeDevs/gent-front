export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata?: Metadata;
}

export interface Metadata {
  current_page: number;
  total_pages: number;
  page_size: number;
  total_items: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: Metadata;
}

export interface ApiError {
  status: string;
  error: string;
  data?: string;
}

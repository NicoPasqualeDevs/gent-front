export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    metadata: Metadata;
}

export interface ApiResponseList<T> {
    success: boolean;
    message: string;
    data: T[];
    metadata: Metadata;
}

export interface Metadata {
    current_page?: number;
    total_pages?: number;
    total_items?: number;
    page_size?: number;
    [key: string]: number | string | undefined;
}
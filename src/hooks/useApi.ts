declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL: string;
    };
  }
}
import { useAppContext } from "@/context/app";
import { ApiResponse } from "@/types/Api";

// Primero definimos un tipo para los datos que se pueden enviar a la API
type ApiData = Record<string, unknown> | FormData;

interface ApiConfig extends Record<string, unknown> {
  headers?: Record<string, string>;
  skipCsrf?: boolean;
}

interface UseApiHook {
  apiGet: <T>(path: string, config?: ApiConfig) => Promise<ApiResponse<T>>;
  apiPost: <T>(path: string, data: ApiData, config?: ApiConfig) => Promise<ApiResponse<T>>;
  apiPut: <T>(path: string, data: ApiData, config?: ApiConfig) => Promise<ApiResponse<T>>;
  apiPatch: <T>(path: string, data: ApiData, config?: ApiConfig) => Promise<ApiResponse<T>>;
  apiDelete: <T>(path: string, config?: ApiConfig) => Promise<ApiResponse<T>>;
  apiBase: string;
  getCsrfToken: () => Promise<string>;
}

const useApi = (): UseApiHook => {
  const { auth } = useAppContext();
  const token = auth?.token;
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

  const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    const data = await response.json();
    return {
      success: true,
      message: "Success",
      data: data.data || data,
      metadata: data.metadata
    };
  };

  // Función para obtener el CSRF token
  const getCsrfToken = async (): Promise<string> => {
    const response = await fetch(`${apiBase}api/csrf/`, {
      method: 'GET',
      credentials: 'include', // Importante para que las cookies se envíen/reciban
    });
    const data = await response.json();
    return data.csrfToken;
  };

  // Modificamos getHeaders para manejar el Content-Type basado en el tipo de datos
  const getHeaders = async (data?: ApiData, config?: ApiConfig): Promise<Record<string, string>> => {
    let headers: Record<string, string> = {};

    // Si hay datos y no es FormData, establecer Content-Type
    if (data && !(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (!config?.skipCsrf) {
      const csrfToken = await getCsrfToken();
      headers['X-CSRFToken'] = csrfToken;
    }

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    if (config?.headers) {
      headers = { ...headers, ...config.headers };
    }

    return headers;
  };

  const apiGet = async <T>(path: string, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const headers = await getHeaders(config);
    const response = await fetch(`${apiBase}${path}`, {
      method: 'GET',
      headers,
      credentials: 'include',
      ...config,
    });
    return handleResponse<T>(response);
  };

  const apiPost = async <T>(
    url: string, 
    data: ApiData, 
    config?: ApiConfig
  ): Promise<ApiResponse<T>> => {
    const headers = await getHeaders(config);
    const response = await fetch(`${apiBase}${url}`, {
      method: 'POST',
      headers,
      credentials: config?.skipCsrf ? 'omit' : 'include',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...config,
    });
    return handleResponse<T>(response);
  };

  const apiPut = async <T>(path: string, data: ApiData, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const headers = await getHeaders(data, config);
    const response = await fetch(`${apiBase}${path}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...config,
    });
    return handleResponse<T>(response);
  };

  const apiPatch = async <T>(path: string, data: ApiData, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const headers = await getHeaders(data, config);
    const body = data instanceof FormData ? data : JSON.stringify(data);
    
    const response = await fetch(`${apiBase}${path}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body,
      ...config,
    });
    return handleResponse<T>(response);
  };

  const apiDelete = async <T>(path: string, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const headers = await getHeaders(config);
    const response = await fetch(`${apiBase}${path}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
      ...config,
    });
    return handleResponse<T>(response);
  };

  return {
    apiGet,
    apiPost,
    apiPut,
    apiPatch,
    apiDelete,
    apiBase,
    getCsrfToken
  };
};

export default useApi;

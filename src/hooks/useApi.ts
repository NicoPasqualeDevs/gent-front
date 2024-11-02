declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL: string;
    };
  }
}

import React from "react";
import { useAppContext } from "@/context/app";
import { ApiResponse } from "@/types/Api";

interface ApiConfig extends Record<string, any> {
  headers?: Record<string, string>;
  skipCsrf?: boolean;
}

interface UseApiHook {
  apiGet: <T>(path: string, config?: ApiConfig) => Promise<ApiResponse<T>>;
  apiPost: <T>(path: string, data: any, config?: ApiConfig) => Promise<ApiResponse<T>>;
  apiPut: <T>(path: string, data: any, config?: ApiConfig) => Promise<ApiResponse<T>>;
  apiDelete: <T>(path: string, config?: ApiConfig) => Promise<ApiResponse<T>>;
  apiBase: string;
  getCsrfToken: () => Promise<string>;
}

// Añadir la interfaz User con token
interface User {
  id: number;
  username: string;
  email: string;
  token: string;  // Añadido el campo token
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

  // Actualizar getHeaders para incluir el X-CSRFToken
  const getHeaders = async (config?: ApiConfig) => {
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Solo añadir CSRF si no está marcado para omitirlo
    if (!config?.skipCsrf) {
      const csrfToken = await getCsrfToken();
      headers['X-CSRFToken'] = csrfToken;
    }

    // Añadir token de autorización si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Añadir headers adicionales del config
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
      credentials: 'include', // Importante para las cookies
      ...config,
    });
    return handleResponse<T>(response);
  };

  const apiPost = async <T>(path: string, data: any, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const headers = await getHeaders(config);
    const response = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers,
      credentials: config?.skipCsrf ? 'omit' : 'include',  // No incluir cookies si skipCsrf es true
      body: JSON.stringify(data),
      ...config,
    });
    return handleResponse<T>(response);
  };

  const apiPut = async <T>(path: string, data: any, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const headers = await getHeaders(config);
    const response = await fetch(`${apiBase}${path}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
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
    apiDelete,
    apiBase,
    getCsrfToken
  };
};

export default useApi;

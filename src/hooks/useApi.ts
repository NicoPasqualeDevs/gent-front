import React from "react";
import { useAppContext } from "@/context/app";

type UseApiHook = {
  token?: string | null;
  apiBase: string;
  buildUri: <Q = Record<string, string>>(path: string, query?: Q) => string;
  apiPost: <B = unknown, R = unknown>(path: string, body: B, headers?: HeadersInit) => Promise<R>;
  noAuthPost: <B = unknown, R = unknown>(path: string, body: B, headers?: HeadersInit) => Promise<R>;
  noBodyApiPost: <R = unknown>(path: string) => Promise<R>;
  apiPut: <B = unknown, R = unknown>(path: string, body: B) => Promise<R>;
  apiPatch: <B = unknown, R = unknown>(path: string, body: B, headers?: HeadersInit) => Promise<R>;
  apiGet: <R = unknown, Q = Record<string, string>>(path: string, query?: Q) => Promise<R>;
  noAuthGet: <R = unknown, Q = Record<string, string>>(path: string, query?: Q) => Promise<R>;
  apiDelete: (path: string) => Promise<Response>;
};

const useApi = (): UseApiHook => {
  const { auth: { user } } = useAppContext();
  const token = user?.token;
  const apiBase = "http://127.0.0.1:8000/";

  // Función para obtener el token CSRF
  const getCsrfToken = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${apiBase}api/csrf/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const data = await response.json();
      // Usamos el token que viene en el JSON en lugar de buscar en las cookies
      if (data && data.csrfToken) {
        return data.csrfToken;
      }
      
      throw new Error('No CSRF token in response');
    } catch (error) {
      console.error('Error getting CSRF token:', error);
      return null;
    }
  };

  const buildUri = <Q = Record<string, string>>(path: string, query?: Q): string => {
    // Removemos la barra inicial de path si existe para evitar doble barra
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const fullUrl = `${apiBase}${cleanPath}`;
    
    if (!query) return fullUrl;

    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    return `${fullUrl}?${params.toString()}`;
  };

  const createHeaders = async (additionalHeaders?: HeadersInit): Promise<HeadersInit> => {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      throw new Error('No se pudo obtener el token CSRF');
    }
    
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    return {
      ...headers,
      ...additionalHeaders,
    };
  };

  const handleResponse = async <R>(response: Response): Promise<R> => {
    if (response.ok) {
      return await response.json();
    }
    throw {
      status: response.status,
      error: response.statusText,
      data: await response.json(),
    };
  };

  const apiCall = React.useCallback(
    async <R>(method: string, path: string, body?: unknown, headers?: HeadersInit): Promise<R> => {
      const isFormData = body instanceof FormData;
      const finalHeaders = await createHeaders(headers);

      const requestOptions: RequestInit = {
        method,
        headers: finalHeaders,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      };

      try {
        const response = await fetch(buildUri(path), requestOptions);
        if (response.status === 403) {
          // Si recibimos un 403, intentamos obtener un nuevo token CSRF y reintentamos la petición
          console.warn('CSRF token may be invalid, retrying with new token...');
          const newHeaders = await createHeaders(headers);
          const newRequestOptions = {
            ...requestOptions,
            headers: newHeaders,
          };
          const retryResponse = await fetch(buildUri(path), newRequestOptions);
          return await handleResponse<R>(retryResponse);
        }
        return await handleResponse<R>(response);
      } catch (err) {
        console.error('API call error:', err);
        throw err;
      }
    },
    [token]
  );

  // Modificamos los métodos para que no llamen a buildUri
  const noBodyApiPost = React.useCallback(<R>(path: string): Promise<R> => 
    apiCall<R>("POST", path), [apiCall]);

  const apiPost = React.useCallback(<B, R>(path: string, body: B, headers?: HeadersInit): Promise<R> => 
    apiCall<R>("POST", path, body, headers), [apiCall]);

  const noAuthPost = React.useCallback(<B, R>(path: string, body: B,): Promise<R> => 
    apiCall<R>("POST", path, body, { "Content-Type": "application/json" }), [apiCall]);

  const apiPut = React.useCallback(<B, R>(path: string, body: B): Promise<R> => 
    apiCall<R>("PUT", path, body), [apiCall]);

  const apiPatch = React.useCallback(<B, R>(path: string, body: B, headers?: HeadersInit): Promise<R> => 
    apiCall<R>("PATCH", path, body, headers), [apiCall]);

  const apiGet = React.useCallback(<R, Q = Record<string, string>>(path: string, query?: Q): Promise<R> => 
    apiCall<R>("GET", path, undefined, undefined), [apiCall]);

  const noAuthGet = React.useCallback(<R, Q = Record<string, string>>(path: string, query?: Q): Promise<R> =>
    apiCall<R>("GET", path, undefined, { "Content-Type": "application/json" }), [apiCall]);

  const apiDelete = React.useCallback((path: string): Promise<Response> => 
    apiCall("DELETE", path), [apiCall]);

  return {
    token,
    apiBase,
    buildUri,
    apiPost,
    noBodyApiPost,
    noAuthPost,
    apiPut,
    apiPatch,
    apiGet,
    noAuthGet,
    apiDelete,
  };
};

export default useApi;

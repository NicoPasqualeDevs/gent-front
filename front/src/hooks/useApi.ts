import React from "react";
import { useAppContext } from "@/context/app";

type UseApiHook = {
  token?: string | null;
  apiBase: string;
  buildUri: <Q = Record<string, string>>(path: string, query?: Q) => string;
  apiPost: <B = unknown, R = unknown>(path: string, body: B, headers?: HeadersInit) => Promise<R>;
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

  const buildUri = <Q = Record<string, string>>(path: string, query?: Q): string => {
    const fullUrl = `${apiBase}${path}`;
    if (!query) return fullUrl;

    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    return `${fullUrl}?${params.toString()}`;
  };

  const createHeaders = (additionalHeaders?: HeadersInit): HeadersInit => ({
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
    ...additionalHeaders,
  });

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
      const requestOptions: RequestInit = {
        method,
        headers: createHeaders(headers),
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      };

      try {
        const response = await fetch(path, requestOptions);
        return await handleResponse<R>(response);
      } catch (err) {
        throw err ? console.log(err) : console.log("unknown error");
      }
    },
    [token]
  );

  const noBodyApiPost = React.useCallback(<R>(path: string): Promise<R> => apiCall<R>("POST", buildUri(path)), [apiCall]);
  const apiPost = React.useCallback(<B, R>(path: string, body: B, headers?: HeadersInit): Promise<R> => apiCall<R>("POST", buildUri(path), body, headers), [apiCall]);
  const apiPut = React.useCallback(<B, R>(path: string, body: B): Promise<R> => apiCall<R>("PUT", buildUri(path), body), [apiCall]);
  const apiPatch = React.useCallback(<B, R>(path: string, body: B, headers?: HeadersInit): Promise<R> => apiCall<R>("PATCH", buildUri(path), body, headers), [apiCall]);
  const apiGet = React.useCallback(<R, Q = Record<string, string>>(path: string, query?: Q): Promise<R> => apiCall<R>("GET", buildUri(path, query)), [apiCall]);
  const noAuthGet = React.useCallback(<R, Q = Record<string, string>>(path: string, query?: Q): Promise<R> =>
    apiCall<R>("GET", buildUri(path, query), undefined, { "Content-Type": "application/json" }), [apiCall]);
  const apiDelete = React.useCallback((path: string): Promise<Response> => apiCall("DELETE", buildUri(path)), [apiCall]);

  return {
    token,
    apiBase,
    buildUri,
    apiPost,
    noBodyApiPost,
    apiPut,
    apiPatch,
    apiGet,
    noAuthGet,
    apiDelete,
  };
};

export default useApi;

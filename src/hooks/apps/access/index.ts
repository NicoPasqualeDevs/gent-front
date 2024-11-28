interface CsrfResponse {
  csrfToken?: string;
  status: 'success' | 'error';
  error?: string;
}

export const getCsrfToken = async (apiBase: string): Promise<string> => {
  const response = await fetch(`${apiBase}access/csrf/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  });

  const data: CsrfResponse = await response.json();
  
  if (data.status === 'error' || !data.csrfToken) {
    throw new Error(data.error || 'Error al obtener el token CSRF');
  }

  return data.csrfToken;
};
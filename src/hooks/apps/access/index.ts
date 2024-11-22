  // Función para obtener el CSRF token
 export const getCsrfToken = async (apiBase: string): Promise<string> => {
    const response = await fetch(`${apiBase}access/csrf/`, {
      method: 'GET',
    });
    const data = await response.json();
    return data.csrfToken;
  };
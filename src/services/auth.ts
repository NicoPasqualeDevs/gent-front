import { StoredAuth } from "@/types/Auth";

const AUTH_KEY = 'gent_auth';

export const authStorage = () => {
  const saveAuth = (auth: StoredAuth): void => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  };

  const getAuth = (): StoredAuth | null => {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  };

  const removeAuth = (): void => {
    localStorage.removeItem(AUTH_KEY);
  };

  return {
    saveAuth,
    getAuth,
    removeAuth
  };
}; 
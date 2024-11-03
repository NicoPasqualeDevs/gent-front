import { AuthUser } from "@/types/Auth";

const AUTH_KEY = 'gent_auth';

export const authStorage = () => {
  const saveAuth = (auth: AuthUser): void => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  };

  const getAuth = (): AuthUser | null => {
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
import { useCallback } from 'react';
import useApi from '@/hooks/api/useApi';
import { LoginResponse, RegisterResponse, UserCredentials, RegisterCredentials } from '@/types/Auth';
import { ApiResponse, ApiData } from '@/types/Api';

const useAuth = () => {
  const { apiPost } = useApi();

  const login = useCallback(
    async (credentials: UserCredentials): Promise<ApiResponse<LoginResponse>> => {
      return await apiPost<LoginResponse>('accounts/login/', credentials);
    },
    [apiPost]
  );

  const register = useCallback(
    async (userData: RegisterCredentials): Promise<ApiResponse<RegisterResponse>> => {
      return await apiPost<RegisterResponse>('accounts/register/', userData);
    },
    [apiPost]
  );

  const logout = useCallback(async (): Promise<ApiResponse<void>> => {
    return await apiPost<void>('accounts/logout/', {} as ApiData);
  }, [apiPost]);

  const validateToken = useCallback(async (): Promise<ApiResponse<LoginResponse>> => {
    return await apiPost<LoginResponse>('accounts/validate-token/', {} as ApiData);
  }, [apiPost]);

  return {
    login,
    register,
    logout,
    validateToken,
  };
};

export default useAuth; 
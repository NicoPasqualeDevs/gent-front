import useApi from '@/hooks/api/useApi';
import { LoginResponse, RegisterResponse, UserCredentials, RegisterCredentials } from '@/types/Auth';
import { ApiResponse, ApiData } from '@/types/Api';

interface UseAuthApi {
  login: (credentials: UserCredentials) => Promise<ApiResponse<LoginResponse>>;
  register: (userData: RegisterCredentials) => Promise<ApiResponse<RegisterResponse>>;
  logout: () => Promise<ApiResponse<void>>;
  validateToken: () => Promise<ApiResponse<LoginResponse>>;
}

const useAuthApi = (): UseAuthApi => {
  const { apiPost } = useApi();

  const login = async (credentials: UserCredentials): Promise<ApiResponse<LoginResponse>> => {
    return apiPost<LoginResponse>('accounts/login/', credentials);
  };

  const register = async (userData: RegisterCredentials): Promise<ApiResponse<RegisterResponse>> => {
    return apiPost<RegisterResponse>('accounts/register/', userData);
  };

  const logout = async (): Promise<ApiResponse<void>> => {
    return apiPost<void>('accounts/logout/', {} as ApiData);
  };

  const validateToken = async (): Promise<ApiResponse<LoginResponse>> => {
    return apiPost<LoginResponse>('accounts/validate-token/', {} as ApiData);
  };

  return {
    login,
    register,
    logout,
    validateToken,
  };
};

export default useAuthApi; 
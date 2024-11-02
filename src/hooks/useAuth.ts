import { AuthLoginData, AuthUser, AuthRegisterData, ValidationResult, User } from "@/types/Auth";
import { ApiResponse } from "@/types/Api";
import useApi from "./useApi";

interface ApiRequestConfig extends Record<string, any> {
  headers?: Record<string, string>;
}

type AuthHook = {
  registerUser: (data: AuthRegisterData) => Promise<ApiResponse<AuthUser>>;
  loginUser: (data: AuthLoginData) => Promise<ApiResponse<AuthUser>>;
  validateToken: (token: string) => Promise<ValidationResult>;
};

const useAuth = (): AuthHook => {
  const { apiPost, apiGet } = useApi();

  const registerUser = (data: AuthRegisterData): Promise<ApiResponse<AuthUser>> => {
    const path = "auth/register/";
    return apiPost(path, data);
  };

  const loginUser = (data: AuthLoginData): Promise<ApiResponse<AuthUser>> => {
    const path = "auth/login/";
    return apiPost(path, {
      email: data.email,
      code: data.password,
    }, { skipCsrf: true });
  };

  const validateToken = async (token: string): Promise<ValidationResult> => {
    try {
      const config: ApiRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await apiGet<User>("auth/validate/", config);

      return {
        isValid: true,
        user: response.data as User
      };
    } catch (error) {
      return {
        isValid: false
      };
    }
  };

  return {
    registerUser,
    loginUser,
    validateToken
  };
};

export default useAuth;

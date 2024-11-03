import { AuthLoginData, AuthUser, AuthRegisterData, ValidationResult, User, StoredAuth } from "@/types/Auth";
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

  const loginUser = async (data: AuthLoginData): Promise<ApiResponse<AuthUser>> => {
    const path = "auth/login/";
    const response = await apiPost<AuthUser>(path, {
      email: data.email,
      code: data.password,
    }, { skipCsrf: true });

    const standardizedAuth: StoredAuth = {
      token: response.data.token,
      uuid: response.data.uuid,
      email: response.data.email,
      first_name: response.data.first_name,
      last_name: response.data.last_name,
      is_superuser: response.data.is_superuser
    };

    return {
      ...response,
      data: standardizedAuth
    };
  };

  const validateToken = async (token: string): Promise<ValidationResult> => {
    try {
      const config: ApiRequestConfig = {
        headers: {
          Authorization: `Token ${token}`
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

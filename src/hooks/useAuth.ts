import { AuthLoginData, AuthUser, AuthRegisterData } from "@/types/Auth";
import { ApiResponse } from "@/types/Api";

import useApi from "./useApi";

type AuthHook = {
  token?: string;
  registerUser: (data: AuthRegisterData) => Promise<ApiResponse<AuthUser>>;
  loginUser: (data: AuthLoginData) => Promise<ApiResponse<AuthUser>>;
};

const useAuth = (): AuthHook => {
  const { noAuthPost } = useApi();

  const registerUser = (data: AuthRegisterData): Promise<ApiResponse<AuthUser>> => {
    const path = "api/register/";
    return noAuthPost(path, data);
  };

  const loginUser = (data: AuthLoginData): Promise<ApiResponse<AuthUser>> => {
    const path = "api/login/";
    return noAuthPost(path, data);
  };

  return {
    registerUser,
    loginUser,
  };
};

export default useAuth;

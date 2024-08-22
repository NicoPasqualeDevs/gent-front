import { AuthLoginData, AuthRegisterResponse, AuthUser } from "@/types/Auth";
import { SendRegister } from "@/types/Auth";

import useApi from "./useApi";

type AuthHook = {
  token?: string;
  registerUser: (data: SendRegister) => Promise<AuthRegisterResponse>;
  loginUser: (data: AuthLoginData) => Promise<AuthUser>;
};

const useAuth = (): AuthHook => {
  const { apiPost } = useApi();

  const registerUser = (data: SendRegister): Promise<AuthRegisterResponse> => {
    const path = "api/register";
    return apiPost(path, data);
  };

  const loginUser = (data: AuthLoginData): Promise<AuthUser> => {
    const path = "api/login/";
    return apiPost(path, data);
  };

  return {
    registerUser,
    loginUser,
  };
};

export default useAuth;

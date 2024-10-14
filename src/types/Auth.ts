export type AuthUser = {
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  token: string;
};

export interface AuthTempInfo {
  email?: string | null;
  password?: string;

  country?: string;
  businessName?: string;
}

export type SendRegister = {
  email: string;
};

export interface AuthRegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
}

export interface AuthRegisterResponse {
  message: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
  token: string;
}

export type AuthLoginData = {
  [propKey: string]: string;
  email: string;
  code: string;
};

export type AuthLoginResponse = {
  email: string;
  token: string;
  error?: string;
};

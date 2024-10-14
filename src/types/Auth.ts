export type AuthUser = {
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  token: string;
  is_superuser?: boolean;
};

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

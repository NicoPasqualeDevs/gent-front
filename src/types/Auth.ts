export type AuthUser = {
  email: string;
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

export type AuthRegisterResponse = {
  message?: string;
  error?: string;
};

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

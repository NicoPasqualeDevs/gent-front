export interface AuthUser {
  email: string;
  token: string;
  uuid: string;
  first_name?: string;
  last_name?: string;
  is_superuser?: boolean;
}

export interface AuthLoginData {
  email: string;
  password: string;
}

export interface AuthRegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  is_superuser?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  user?: AuthUser;
}


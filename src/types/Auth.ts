import { ApiData } from './Api';

// Interfaz para la respuesta del backend
export interface AuthResponse {
  token: string;
  user_id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_superuser?: boolean;
}

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

export interface AuthRegisterData extends Record<string, unknown> {
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

export interface UserCredentials extends ApiData {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface RegisterCredentials extends ApiData {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user_id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  };
}

export interface UpdateProfileData extends ApiData {
  email?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: unknown;
}

export interface ChangePasswordData extends ApiData {
  old_password: string;
  new_password: string;
  confirm_password: string;
  [key: string]: unknown;
}

export type ApiProviderType = 'OpenAI' | 'Anthropic' | 'Google' | 'Mistral AI' | 'Meta' | 'Custom';

export interface LLMProvider {
  value: ApiProviderType;
  label: string;
}

export interface LLMModel {
  value: string;
  label: string;
  provider: ApiProviderType;
}

export interface CreateApiKeyData extends ApiData {
  api_name: string;
  api_type: ApiProviderType;
  api_key: string;
  model?: string;
  [key: string]: unknown;
}

export interface AIModelsResponse {
  success: boolean;
  message?: string;
  data: {
    providers: LLMProvider[];
    models: LLMModel[];
  };
}


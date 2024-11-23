import { ApiResponse } from "@/types/Api";

export interface ApiKey {
  id: number;
  api_name: string;
  api_type: string;
  api_key: string;
}

export interface ApiKeyFormData extends Record<string, unknown> {
  api_name: string;
  api_type: 'openai' | 'anthropic' | 'google' | 'mistral' | 'meta' | 'custom';
  api_key: string;
  model?: string;
}

export interface ProfileUpdateData extends Record<string, unknown> {
  first_name: string;
  last_name: string;
  email: string;
}

export interface ProfileResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_superuser: boolean;
}

export interface ApiKeyResponse {
  success: boolean;
  message: string;
  data: ApiKey[];
}

export interface SetBotApiKeyResponse {
  bot_id: string;
  api_key_name: string;
  api_type: 'openai' | 'anthropic';
}

export interface UseProfileHook {
  // Profile methods
  getProfileDetails: () => Promise<ApiResponse<ProfileResponse>>;
  updateProfileDetails: (data: ProfileUpdateData) => Promise<ApiResponse<ProfileResponse>>;
  
  // API Key methods
  getApiKeys: () => Promise<ApiResponse<ApiKey[]>>;
  createApiKey: (data: ApiKeyFormData) => Promise<ApiResponse<ApiKey>>;
  getApiKey: (id: number) => Promise<ApiResponse<ApiKey>>;
  updateApiKey: (id: number, data: Partial<ApiKeyFormData>) => Promise<ApiResponse<ApiKey>>;
  deleteApiKey: (id: number) => Promise<ApiResponse<void>>;
  
  // Bot API Key methods
  setBotApiKey: (agentId: string, apiKeyId: number) => Promise<ApiResponse<SetBotApiKeyResponse>>;
  updateBotApiKey: (agentId: string, apiKeyId?: number) => Promise<ApiResponse<SetBotApiKeyResponse>>;
}

export interface LLMProvider {
  value: string;
  label: string;
}

export interface LLMModel {
  value: string;
  label: string;
  provider: string;
}

export interface ProfileState {
  isLoading: boolean;
  isSubmitting: boolean;
  apiKeys: ApiKey[];
  showNewKeyForm: boolean;
  error: string | null;
}

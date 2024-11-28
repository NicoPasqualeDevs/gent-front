import useApi from '@/hooks/api/useApi';
import { ApiResponse } from '@/types/Api';
import { UpdateProfileData, ChangePasswordData } from '@/types/Auth';

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
}

interface BotApiKeyResponse {
  bot_id: string;
  api_key_name: string;
  api_type: string;
  model?: string;
  status: 'active' | 'inactive';
}

interface BotApiKeyRequest extends Record<string, unknown> {
  api_key_id: number;
}

interface UseProfileApi {
  getProfile: () => Promise<ApiResponse<UserProfile>>;
  updateProfileDetails: (data: UpdateProfileData) => Promise<ApiResponse<UserProfile>>;
  changePassword: (data: ChangePasswordData) => Promise<ApiResponse<void>>;
  setBotApiKey: (agentId: string, apiKeyId: number) => Promise<ApiResponse<BotApiKeyResponse>>;
  updateBotApiKey: (agentId: string, apiKeyId?: number) => Promise<ApiResponse<BotApiKeyResponse>>;
}

const useProfileApi = (): UseProfileApi => {
  const { apiGet, apiPatch, apiPost } = useApi();

  const getProfile = async (): Promise<ApiResponse<UserProfile>> => {
    return apiGet<UserProfile>('accounts/profile/');
  };

  const updateProfileDetails = async (data: UpdateProfileData): Promise<ApiResponse<UserProfile>> => {
    return apiPatch<UserProfile>('accounts/profile/', data);
  };

  const changePassword = async (data: ChangePasswordData): Promise<ApiResponse<void>> => {
    return apiPost<void>('accounts/change-password/', data);
  };

  const setBotApiKey = async (agentId: string, apiKeyId: number): Promise<ApiResponse<BotApiKeyResponse>> => {
    const data: BotApiKeyRequest = { api_key_id: apiKeyId };
    return apiPost<BotApiKeyResponse>(`agents/${agentId}/api-key/`, data);
  };

  const updateBotApiKey = async (agentId: string, apiKeyId?: number): Promise<ApiResponse<BotApiKeyResponse>> => {
    const data: Partial<BotApiKeyRequest> = apiKeyId ? { api_key_id: apiKeyId } : {};
    return apiPatch<BotApiKeyResponse>(`agents/${agentId}/api-key/`, data);
  };

  return {
    getProfile,
    updateProfileDetails,
    changePassword,
    setBotApiKey,
    updateBotApiKey,
  };
};

export default useProfileApi; 
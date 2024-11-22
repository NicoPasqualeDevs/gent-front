import { useCallback } from 'react';
import useApi from '@/hooks/api/useApi';
import { ApiResponse } from '@/types/Api';
import { UpdateProfileData, ChangePasswordData } from '@/types/Auth';
import useApiKeys from './useApiKeys';

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

const useProfile = () => {
  const { apiGet, apiPatch, apiPost } = useApi();
  const apiKeysHook = useApiKeys();

  const getProfile = useCallback(async (): Promise<ApiResponse<UserProfile>> => {
    return await apiGet<UserProfile>('accounts/profile/');
  }, [apiGet]);

  const updateProfileDetails = useCallback(
    async (data: UpdateProfileData): Promise<ApiResponse<UserProfile>> => {
      return await apiPatch<UserProfile>('accounts/profile/', data);
    },
    [apiPatch]
  );

  const changePassword = useCallback(
    async (data: ChangePasswordData): Promise<ApiResponse<void>> => {
      return await apiPost<void>('accounts/change-password/', data);
    },
    [apiPost]
  );

  const setBotApiKey = useCallback(
    async (agentId: string, apiKeyId: number): Promise<ApiResponse<BotApiKeyResponse>> => {
      const data: BotApiKeyRequest = { api_key_id: apiKeyId };
      return await apiPost<BotApiKeyResponse>(`agents/${agentId}/api-key/`, data);
    },
    [apiPost]
  );

  const updateBotApiKey = useCallback(
    async (agentId: string, apiKeyId?: number): Promise<ApiResponse<BotApiKeyResponse>> => {
      const data: Partial<BotApiKeyRequest> = apiKeyId ? { api_key_id: apiKeyId } : {};
      return await apiPatch<BotApiKeyResponse>(`agents/${agentId}/api-key/`, data);
    },
    [apiPatch]
  );

  return {
    getProfile,
    updateProfileDetails,
    changePassword,
    setBotApiKey,
    updateBotApiKey,
    ...apiKeysHook
  };
};

export default useProfile; 
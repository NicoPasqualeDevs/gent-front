import useApi from "./api/useApi";
import { ApiResponse } from "@/types/Api";
import {
  ProfileResponse,
  ProfileUpdateData,
  ApiKey,
  ApiKeyFormData,
  UseProfileHook,
  SetBotApiKeyResponse
} from "@/types/UserProfile";

const useProfile = (): UseProfileHook => {
  const { apiGet, apiPost, apiPut, apiPatch, apiDelete } = useApi();

  const getProfileDetails = async (): Promise<ApiResponse<ProfileResponse>> => {
    return apiGet('auth/profile/');
  };

  const updateProfileDetails = async (data: ProfileUpdateData): Promise<ApiResponse<ProfileResponse>> => {
    return apiPatch('auth/profile/', data);
  };

  // API Key methods
  const getApiKeys = async (): Promise<ApiResponse<ApiKey[]>> => {
    return apiGet('users/me/api-keys/');
  };

  const createApiKey = async (data: ApiKeyFormData): Promise<ApiResponse<ApiKey>> => {
    return apiPost('users/me/api-keys/', data);
  };

  const getApiKey = async (id: number): Promise<ApiResponse<ApiKey>> => {
    return apiGet(`users/me/api-keys/${id}/`);
  };

  const updateApiKey = async (id: number, data: Partial<ApiKeyFormData>): Promise<ApiResponse<ApiKey>> => {
    return apiPut(`users/me/api-keys/${id}/`, data);
  };

  const deleteApiKey = async (id: number): Promise<ApiResponse<void>> => {
    return apiDelete(`users/me/api-keys/${id}/`);
  };

  // Nuevo método para asignar API key a un bot
  const setBotApiKey = async (botId: string, apiKeyId: number): Promise<ApiResponse<SetBotApiKeyResponse>> => {
    return apiPost<SetBotApiKeyResponse>(`bot/set-api-key/${botId}/${apiKeyId}/`, {});   
  };

  // Nuevo método para PATCH
  const updateBotApiKey = async (botId: string, apiKeyId?: number): Promise<ApiResponse<SetBotApiKeyResponse>> => {
    const endpoint = apiKeyId ? 
      `bot/set-api-key/${botId}/${apiKeyId}/` : 
      `bot/set-api-key/${botId}/`;
    return apiPatch<SetBotApiKeyResponse>(endpoint, {});
  };

  return {
    getProfileDetails,
    updateProfileDetails,
    getApiKeys,
    createApiKey,
    getApiKey,
    updateApiKey,
    deleteApiKey,
    setBotApiKey,
    updateBotApiKey
  };
};

export default useProfile; 
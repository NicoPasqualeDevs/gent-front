import { ApiResponse } from '@/types/Api';
import { ApiKey, ApiKeyFormData } from '@/types/UserProfile';
import useApi from '@/hooks/api/useApi';

interface UseApiKeysApi {
  getApiKeys: () => Promise<ApiResponse<ApiKey[]>>;
  createApiKey: (data: ApiKeyFormData) => Promise<ApiResponse<ApiKey>>;
  updateApiKey: (id: number, data: Partial<ApiKeyFormData>) => Promise<ApiResponse<ApiKey>>;
  deleteApiKey: (id: number) => Promise<ApiResponse<void>>;
}

const useApiKeys = (): UseApiKeysApi => {
  const { apiGet, apiPost, apiPatch, apiDelete } = useApi();

  const getApiKeys = async (): Promise<ApiResponse<ApiKey[]>> => {
    return apiGet<ApiKey[]>('accounts/users/me/api-keys/');
  };

  const createApiKey = async (data: ApiKeyFormData): Promise<ApiResponse<ApiKey>> => {
    return apiPost<ApiKey>('accounts/users/me/api-keys/', data);
  };

  const updateApiKey = async (id: number, data: Partial<ApiKeyFormData>): Promise<ApiResponse<ApiKey>> => {
    return apiPatch<ApiKey>(`accounts/users/me/api-keys/${id}/`, data);
  };

  const deleteApiKey = async (id: number): Promise<ApiResponse<void>> => {
    return apiDelete(`accounts/users/me/api-keys/${id}/`);
  };

  return {
    getApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
};

export default useApiKeys; 
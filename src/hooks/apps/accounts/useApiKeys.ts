import { useCallback } from 'react';
import useApi from '@/hooks/api/useApi';
import { ApiResponse } from '@/types/Api';
import { CreateApiKeyData } from '@/types/Auth';

interface ApiKey {
  id: number;
  api_name: string;
  api_type: string;
  api_key: string;
  model?: string;
  is_active: boolean;
  created_at: string;
}

const useApiKeys = () => {
  const { apiGet, apiPost, apiPatch, apiDelete } = useApi();

  const getApiKeys = useCallback(async (): Promise<ApiResponse<ApiKey[]>> => {
    return await apiGet<ApiKey[]>('accounts/users/me/api-keys/');
  }, [apiGet]);

  const createApiKey = useCallback(
    async (data: CreateApiKeyData): Promise<ApiResponse<ApiKey>> => {
      return await apiPost<ApiKey>('accounts/users/me/api-keys/', data);
    },
    [apiPost]
  );

  const updateApiKey = useCallback(
    async (id: number, data: Partial<CreateApiKeyData>): Promise<ApiResponse<ApiKey>> => {
      return await apiPatch<ApiKey>(`accounts/users/me/api-keys/${id}/`, data);
    },
    [apiPatch]
  );

  const deleteApiKey = useCallback(
    async (id: number): Promise<ApiResponse<void>> => {
      return await apiDelete(`accounts/users/me/api-keys/${id}/`);
    },
    [apiDelete]
  );

  return {
    getApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
};

export default useApiKeys; 
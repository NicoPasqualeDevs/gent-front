import { useCallback } from 'react';
import useApi from '@/hooks/api/useApi';
import { ApiResponse } from '@/types/Api';

interface LLMModel {
  value: string;
  label: string;
  provider: string;
}

const useAccountsApi = () => {
  const { apiGet } = useApi();

  const getAIModels = useCallback(async (): Promise<ApiResponse<LLMModel[]>> => {
    const response = await apiGet<LLMModel[]>('accounts/ai-models/');
    if (response.data) {
      response.data = response.data.map(model => ({
        ...model,
        provider: model.provider.toLowerCase()
      }));
    }
    return response;
  }, [apiGet]);

  return {
    getAIModels,
  };
};

export default useAccountsApi;

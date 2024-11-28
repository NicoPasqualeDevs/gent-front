import useApi from '@/hooks/api/useApi';
import { ApiResponse } from '@/types/Api';
import { LLMProvider, LLMModel } from '@/types/Auth';

interface UseAiModelsApi {
  getAIModels: () => Promise<ApiResponse<{providers: LLMProvider[]; models: LLMModel[]}>>;
}

const useAiModelsApi = (): UseAiModelsApi => {
  const { apiGet } = useApi();

  const getAIModels = async (): Promise<ApiResponse<{providers: LLMProvider[]; models: LLMModel[]}>> => {
    return await apiGet<{providers: LLMProvider[]; models: LLMModel[]}>('accounts/ai-models/');
  };

  return {
    getAIModels,
  };
};

export default useAiModelsApi;

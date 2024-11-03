import { useCallback } from 'react';
import { WidgetData, CustomGreetingData } from "@/types/Bots";
import { ApiResponse } from "@/types/Api";
import useApi from "./useApi";

interface UseWidgetApi {
  getWidget: (botId: string) => Promise<ApiResponse<WidgetData>>;
  patchWidget: (widgetId: string, data: Partial<WidgetData>) => Promise<ApiResponse<WidgetData>>;
  getCustomMessages: (botId: string) => Promise<ApiResponse<{ data: CustomGreetingData[] }>>;
}

const useWidget = (): UseWidgetApi => {
  const { apiGet, apiPatch } = useApi();

  const getWidget = useCallback(async (botId: string): Promise<ApiResponse<WidgetData>> => {
    return apiGet(`api/widgets/${botId}`);
  }, [apiGet]);

  const patchWidget = useCallback(async (widgetId: string, data: Partial<WidgetData>): Promise<ApiResponse<WidgetData>> => {
    return apiPatch(`api/widgets/${widgetId}`, data);
  }, [apiPatch]);

  const getCustomMessages = useCallback(async (botId: string): Promise<ApiResponse<{ data: CustomGreetingData[] }>> => {
    return apiGet(`api/widgets/${botId}/messages`);
  }, [apiGet]);

  return {
    getWidget,
    patchWidget,
    getCustomMessages
  };
};

export default useWidget; 
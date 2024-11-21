import { useCallback, useMemo } from 'react';
import { WidgetData, CustomGreetingData } from "@/types/WidgetProps";
import { ApiResponse } from "@/types/Api";
import useApi from "./api/useApi";

interface UseWidgetApi {
  getWidget: (botId: string) => Promise<ApiResponse<WidgetData>>;
  patchWidget: (widgetId: string, data: Partial<WidgetData>) => Promise<ApiResponse<WidgetData>>;
  getCustomMessages: (botId: string) => Promise<ApiResponse<{ data: CustomGreetingData[] }>>;
}

const useWidget = (): UseWidgetApi => {
  const { apiGet, apiPatch } = useApi();

  const getWidget = useCallback(async (botId: string): Promise<ApiResponse<WidgetData>> => {
    return apiGet(`widget/${botId}`);
  }, [apiGet]);

  const patchWidget = useCallback(async (
    widgetId: string, 
    data: Partial<WidgetData>
  ): Promise<ApiResponse<WidgetData>> => {
    const hasFiles = Object.values(data).some(value => value instanceof File);

    if (hasFiles) {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
          } else {
            formData.append(key, String(value));
          }
        }
      });

      return apiPatch(`widget/${widgetId}`, formData);
    }

    const jsonData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);

    return apiPatch(`widget/${widgetId}`, jsonData);
  }, [apiPatch]);

  const getCustomMessages = useCallback(async (botId: string): Promise<ApiResponse<{ data: CustomGreetingData[] }>> => {
    return apiGet(`widget/${botId}/messages`);
  }, [apiGet]);

  return useMemo(() => ({
    getWidget,
    patchWidget,
    getCustomMessages
  }), [getWidget, patchWidget, getCustomMessages]);
};

export default useWidget; 
import { useCallback, useMemo, useState } from 'react';
import { WidgetData, CustomGreetingData } from "@/types/WidgetProps";
import { ApiResponse } from "@/types/Api";
import useApi from "../../api/useApi";

interface UseWidgetApi {
  getWidget: (agentId: string) => Promise<ApiResponse<WidgetData>>;
  patchWidget: (widgetId: string, data: Partial<WidgetData>) => Promise<ApiResponse<WidgetData>>;
  getCustomMessages: (agentId: string) => Promise<ApiResponse<{ data: CustomGreetingData[] }>>;
}

export const useWidget = (): UseWidgetApi => {
  const { apiGet, apiPatch } = useApi();

  const getWidget = useCallback(async (agentId: string): Promise<ApiResponse<WidgetData>> => {
    return apiGet(`widget/${agentId}`);
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

  const getCustomMessages = useCallback(async (agentId: string): Promise<ApiResponse<{ data: CustomGreetingData[] }>> => {
    return apiGet(`widget/${agentId}/messages`);
  }, [apiGet]);

  return useMemo(() => ({
    getWidget,
    patchWidget,
    getCustomMessages
  }), [getWidget, patchWidget, getCustomMessages]);
};

export const useWidgetPreview = () => {
  const [chatState, setChatState] = useState(false);
  const [popUpState, setPopUpState] = useState(false);

  const toggleChat = () => setChatState(prev => !prev);
  const togglePopUp = () => setPopUpState(prev => !prev);

  return {
    chatState,
    popUpState,
    toggleChat,
    togglePopUp
  };
};

export default useWidget; 
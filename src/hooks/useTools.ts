import { useCallback } from "react";
import { ToolData } from "@/types/Bots";
import useApi from "./api/useApi";
import { ApiResponse } from "@/types/Api";

const useTools = () => {
  const { apiPost, apiGet, apiPatch } = useApi();

  const postTool = useCallback(async (formData: FormData): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiPost("api/tools", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al crear la herramienta");
    }
  }, []);

  const patchTool = useCallback(async (toolId: string, formData: FormData): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiPatch<ToolData>(`api/tools/${toolId}`, formData as unknown as Record<string, unknown>, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al actualizar la herramienta");
    }
  }, []);

  const getTool = useCallback(async (toolId: string): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiGet(`api/tools/${toolId}`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener la herramienta");
    }
  }, []);

  const getClientTools = useCallback(async (clientId: string): Promise<ApiResponse<ToolData[]>> => {
    try {
      return await apiGet(`api/tools/client/${clientId}`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener las herramientas del cliente");
    }
  }, [apiGet]);

  const getBotTools = useCallback(async (botId: string): Promise<ToolData[]> => {
    try {
      const response = await apiGet(`api/tools/bot/${botId}`);
      return response.data as ToolData[];
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener las herramientas del bot");
    }
  }, [apiGet]);

  const addToolToBot = useCallback(async (botId: string, toolIds: number[]): Promise<void> => {
    try {
      await apiPost(`api/tools/bot/${botId}/relate`, { tool_ids: toolIds });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al relacionar las herramientas con el bot");
    }
  }, [apiPost]);

  const removeToolFromBot = useCallback(async (botId: string, toolIds: number[]): Promise<void> => {
    try {
      await apiPost(`api/tools/bot/${botId}/unrelate`, { tool_ids: toolIds });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al desrelacionar las herramientas del bot");
    }
  }, [apiPost]);

  return { 
    postTool, 
    patchTool, 
    getTool, 
    getClientTools, 
    getBotTools,
    addToolToBot,
    removeToolFromBot
  };
};

export default useTools; 
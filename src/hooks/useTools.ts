import { useCallback } from "react";
import { ToolData } from "@/types/Tools";
import useApi from "./api/useApi";
import { ApiResponse } from "@/types/Api";

const useTools = () => {
  const { apiPost, apiGet, apiPatch } = useApi();

  const postTool = useCallback(async (formData: FormData): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiPost("tool/create/", formData, {
        skipCsrf: true
      });
    } catch (error: unknown) {
      console.error('Error creating tool:', error);
      throw new Error(error instanceof Error ? error.message : "Error al crear la herramienta");
    }
  }, [apiPost]);

  const patchTool = useCallback(async (toolId: string, formData: FormData): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiPatch(`tool/modify/${toolId}/`, formData, {
      });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al actualizar la herramienta");
    }
  }, [apiPatch]);

  const getTool = useCallback(async (toolId: string): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiGet(`tool/modify/${toolId}/`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener la herramienta");
    }
  }, [apiGet]);

  const getClientTools = useCallback(async (userId: string): Promise<ApiResponse<ToolData[]>> => {
    try {
      return await apiGet(`tool/user/${userId}/`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener las herramientas del usuario");
    }
  }, [apiGet]);

  const getBotTools = useCallback(async (botId: string): Promise<ApiResponse<ToolData[]>> => {
    try {
      return await apiGet(`tool/list/${botId}/`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener las herramientas del bot");
    }
  }, [apiGet]);

  const addToolToBot = useCallback(async (botId: string, toolIds: number[]): Promise<void> => {
    try {
      await apiPost(`tool/relate/${botId}/`, { agent_tool_ids: toolIds });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al relacionar las herramientas con el bot");
    }
  }, [apiPost]);

  const removeToolFromBot = useCallback(async (botId: string, toolIds: number[]): Promise<void> => {
    try {
      await apiPost(`tool/remove/${botId}/`, { agent_tool_ids: toolIds });
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
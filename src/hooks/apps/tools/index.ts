import { useCallback } from "react";
import { ToolData } from "@/types/Tools";
import useApi from "@/hooks/api/useApi";
import { ApiResponse } from "@/types/Api";

interface ToolResponse {
  id: string;
  name: string;
  description: string;
  type: string;
  is_active: boolean;
}

export interface ToolRelation {
  agent_tool_ids: number[];
  agent_id?: string;
  tool_id?: string;
  is_active?: boolean;
  [key: string]: unknown;
}

const useTools = () => {
  const { apiPost, apiGet, apiPatch, apiDelete } = useApi();

  const postTool = useCallback(async (formData: FormData): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiPost("tools/create/", formData, {
        skipCsrf: true
      });
    } catch (error: unknown) {
      console.error('Error creating tool:', error);
      throw new Error(error instanceof Error ? error.message : "Error al crear la herramienta");
    }
  }, [apiPost]);

  const patchTool = useCallback(async (toolId: string, formData: FormData): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiPatch(`tools/modify/${toolId}/`, formData);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al actualizar la herramienta");
    }
  }, [apiPatch]);

  const getTool = useCallback(async (toolId: string): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiGet(`tools/modify/${toolId}/`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener la herramienta");
    }
  }, [apiGet]);

  const getClientTools = useCallback(async (userId: string): Promise<ApiResponse<ToolData[]>> => {
    try {
      return await apiGet(`tools/user/${userId}/`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener las herramientas del usuario");
    }
  }, [apiGet]);

  const getBotTools = useCallback(async (agentId: string): Promise<ApiResponse<ToolData[]>> => {
    try {
      return await apiGet(`tools/list/${agentId}/`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener las herramientas del bot");
    }
  }, [apiGet]);

  const addToolToBot = useCallback(async (agentId: string, toolIds: number[]): Promise<void> => {
    try {
      await apiPost(`tools/add/${agentId}/`, { agent_tool_ids: toolIds });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al relacionar las herramientas con el bot");
    }
  }, [apiPost]);

  const removeToolFromBot = useCallback(async (agentId: string, toolIds: number[]): Promise<void> => {
    try {
      await apiPost(`tools/remove/${agentId}/`, { agent_tool_ids: toolIds });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al desrelacionar las herramientas del bot");
    }
  }, [apiPost]);

  const getAllTools = useCallback(async (): Promise<ApiResponse<ToolResponse[]>> => {
    try {
      return await apiGet('agents/all-tools/');
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener todas las herramientas");
    }
  }, [apiGet]);

  const getAgentTools = useCallback(async (agentId: string): Promise<ApiResponse<ToolResponse[]>> => {
    try {
      return await apiGet(`agents/${agentId}/tools/`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al obtener las herramientas del agente");
    }
  }, [apiGet]);

  const setToolRelation = useCallback(async (data: ToolRelation): Promise<ApiResponse<void>> => {
    try {
      return await apiPost('agents/set-tool-Relation/', data);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al establecer la relación de la herramienta");
    }
  }, [apiPost]);

  const removeToolRelation = useCallback(async (data: ToolRelation): Promise<ApiResponse<void>> => {
    try {
      return await apiDelete('agents/remove-tool-Relation/', data);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Error al eliminar la relación de la herramienta");
    }
  }, [apiDelete]);

  return { 
    postTool, 
    patchTool, 
    getTool, 
    getClientTools, 
    getBotTools,
    addToolToBot,
    removeToolFromBot,
    getAllTools,
    getAgentTools,
    setToolRelation,
    removeToolRelation
  };
};

export default useTools; 
import { useCallback } from "react";
import { ToolData } from "@/types/Bots";
import useApi from "./useApi";
import { ApiResponse } from "@/types/Api";

const useTools = () => {
  const { apiPost, apiPatch, apiGet } = useApi();

  const postTool = useCallback(async (formData: FormData): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiPost("api/tools", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      throw new Error(error?.message || "Error al crear la herramienta");
    }
  }, []);

  const patchTool = useCallback(async (toolId: string, formData: FormData): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiPatch(`api/tools/${toolId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      throw new Error(error?.message || "Error al actualizar la herramienta");
    }
  }, []);

  const getTool = useCallback(async (toolId: string): Promise<ApiResponse<ToolData>> => {
    try {
      return await apiGet(`api/tools/${toolId}`);
    } catch (error: any) {
      throw new Error(error?.message || "Error al obtener la herramienta");
    }
  }, []);

  return { postTool, patchTool, getTool };
};

export default useTools; 
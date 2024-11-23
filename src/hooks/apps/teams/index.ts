import { useCallback } from 'react';
import { AiTeamsDetails } from '@/types/Teams';
import { ApiResponse } from '@/types/Api';
import useApi from '@/hooks/api/useApi'
import { useAppContext } from '@/context';

interface UseAiTeamsApiHook {
  getMyAiTeams: (filterParams: string) => Promise<ApiResponse<AiTeamsDetails[]>>;
  getAiTeamsByOwner: (ownerId: string, filterParams: string) => Promise<ApiResponse<AiTeamsDetails[]>>;
  getAiTeamDetails: (teamId: string) => Promise<ApiResponse<AiTeamsDetails>>;
  deleteAiTeamDetails: (teamId: string) => Promise<ApiResponse<void>>;
  createAiTeam: (data: AiTeamsDetails) => Promise<ApiResponse<AiTeamsDetails>>;
  updateAiTeam: (data: AiTeamsDetails, teamId: string) => Promise<ApiResponse<AiTeamsDetails>>;
}

const useAiTeamsApi = (): UseAiTeamsApiHook => {
  const { apiGet, apiPost, apiPut, apiDelete } = useApi();
  const { auth } = useAppContext();

  const getMyAiTeams = useCallback(async (filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    const baseParams = filterParams.startsWith('?') ? filterParams.substring(1) : filterParams;
    return apiGet(`teams/my-teams/?${baseParams}`);
  }, [apiGet]);

  const getAiTeamsByOwner = useCallback(async (ownerId: string, filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    const baseParams = filterParams.startsWith('?') ? filterParams.substring(1) : filterParams;
    const separator = baseParams ? '&' : '';
    return apiGet(`teams/list-by-owner/?${baseParams}${separator}owner=${ownerId}`);
  }, [apiGet]);

  const getAiTeamDetails = useCallback(async (teamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiGet(`teams/${teamId}/`);
  }, [apiGet]);

  const deleteAiTeamDetails = useCallback(async (teamId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiDelete(`teams/${teamId}/`);
      return {
        success: true,
        message: response.message || "Información eliminada correctamente",
        data: response.data as void
      };
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }, [apiDelete]);

  const createAiTeam = useCallback(async (data: AiTeamsDetails): Promise<ApiResponse<AiTeamsDetails>> => {
    if (!auth?.token) {
      throw new Error('No authentication token available');
    }

    const formattedData = {
      name: data.name,
      address: data.address,
      description: data.description
    };
    
    return apiPost('teams/', formattedData);
  }, [apiPost, auth?.token]);

  const updateAiTeam = useCallback(async (data: AiTeamsDetails, teamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    if (!auth?.token) {
      throw new Error('No authentication token available');
    }

    const formattedData = {
      name: data.name,
      address: data.address,
      description: data.description
    };
    
    return apiPut(`teams/${teamId}/`, formattedData);
  }, [apiPut, auth?.token]);

  return {
    getMyAiTeams,
    getAiTeamsByOwner,
    getAiTeamDetails,
    deleteAiTeamDetails,
    createAiTeam,
    updateAiTeam
  };
};

export default useAiTeamsApi; 
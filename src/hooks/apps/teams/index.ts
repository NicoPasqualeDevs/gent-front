import { useCallback } from 'react';
import { AiTeamsDetails } from '@/types/Teams';
import { ApiResponse } from '@/types/Api';
import useApi from '@/hooks/api/useApi'
import { useAppContext } from '@/context';

interface UseAiTeamsApiHook {
  getMyAiTeams: (filterParams: string) => Promise<ApiResponse<AiTeamsDetails[]>>;
  getAiTeamsByOwner: (ownerId: string, filterParams: string) => Promise<ApiResponse<AiTeamsDetails[]>>;
  getAiTeamDetails: (aiTeamId: string) => Promise<ApiResponse<AiTeamsDetails>>;
  deleteAiTeamDetails: (aiTeamId: string) => Promise<ApiResponse<void>>;
  createAiTeam: (data: AiTeamsDetails) => Promise<ApiResponse<AiTeamsDetails>>;
  updateAiTeam: (data: AiTeamsDetails, aiTeamId: string) => Promise<ApiResponse<AiTeamsDetails>>;
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

  const getAiTeamDetails = useCallback(async (aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiGet(`teams/${aiTeamId}/`);
  }, [apiGet]);

  const deleteAiTeamDetails = useCallback(async (aiTeamId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`teams/${aiTeamId}/`);
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

  const updateAiTeam = useCallback(async (data: AiTeamsDetails, aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    if (!auth?.token) {
      throw new Error('No authentication token available');
    }

    const formattedData = {
      name: data.name,
      address: data.address,
      description: data.description
    };
    
    return apiPut(`teams/${aiTeamId}/`, formattedData);
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
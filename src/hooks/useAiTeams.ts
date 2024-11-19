import { useCallback } from 'react';
import { AiTeamsDetails } from '@/types/AiTeams';
import { ApiResponse } from '@/types/Api';
import useApi from './api/useApi'
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

  const getMyAiTeams = useCallback((filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    const baseParams = filterParams.startsWith('?') ? filterParams.substring(1) : filterParams;
    return apiGet(`team_details/my_clients/?${baseParams}`);
  }, [apiGet]);

  const getAiTeamsByOwner = useCallback((ownerId: string, filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    const baseParams = filterParams.startsWith('?') ? filterParams.substring(1) : filterParams;
    const separator = baseParams ? '&' : '';
    return apiGet(`team_details/list_by_owner/?${baseParams}${separator}owner=${ownerId}`);
  }, [apiGet]);

  const getAiTeamDetails = useCallback((aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiGet(`team_details/team_details/${aiTeamId}/`);
  }, [apiGet]);

  const deleteAiTeamDetails = useCallback((aiTeamId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`team_details/${aiTeamId}/`);
  }, [apiDelete]);

  const createAiTeam = useCallback(async (data: AiTeamsDetails): Promise<ApiResponse<AiTeamsDetails>> => {
    if (!auth?.token) {
      throw new Error('No authentication token available');
    }

    const formattedData = {
      id: data.id,
      name: data.name,
      address: data.address,
      description: data.description,
      owner_data: data.owner_data,
      email: data.owner_data?.email
    };
    
    return apiPost('team_details/', formattedData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${auth.token}`
      }
    });
  }, [apiPost, auth?.token]);

  const updateAiTeam = useCallback(async (data: AiTeamsDetails, aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    if (!auth?.token) {
      throw new Error('No authentication token available');
    }

    const formattedData = {
      id: data.id,
      name: data.name,
      address: data.address,
      description: data.description,
      owner_data: data.owner_data,
      email: data.owner_data?.email
    };
    
    return apiPut(`team_details/${aiTeamId}/`, formattedData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${auth.token}`
      }
    });
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
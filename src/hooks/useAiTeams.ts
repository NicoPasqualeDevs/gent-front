import { useCallback } from 'react';
import { AiTeamsDetails } from '@/types/AiTeams';
import { ApiResponse } from '@/types/Api';
import useApi from './api/useApi';

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

  const getMyAiTeams = useCallback((filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    const baseParams = filterParams.startsWith('?') ? filterParams.substring(1) : filterParams;
    return apiGet(`api/team_details/my_clients/?${baseParams}`);
  }, [apiGet]);

  const getAiTeamsByOwner = useCallback((ownerId: string, filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    const baseParams = filterParams.startsWith('?') ? filterParams.substring(1) : filterParams;
    const separator = baseParams ? '&' : '';
    return apiGet(`api/team_details/list_by_owner/?${baseParams}${separator}owner=${ownerId}`);
  }, [apiGet]);

  const getAiTeamDetails = useCallback((aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiGet(`api/team_details/team_details/${aiTeamId}/`);
  }, [apiGet]);

  const deleteAiTeamDetails = useCallback((aiTeamId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`api/team_details/${aiTeamId}/`);
  }, [apiDelete]);

  const createAiTeam = useCallback(async (data: AiTeamsDetails): Promise<ApiResponse<AiTeamsDetails>> => {
    const formattedData = {
      name: data.name,
      address: data.address,
      description: data.description,
      owner_data: data.owner_data,
      email: data.email
    };
    return apiPost('api/team_details/', formattedData);
  }, [apiPost]);

  const updateAiTeam = useCallback(async (data: AiTeamsDetails, aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    const formattedData = {
      name: data.name,
      address: data.address,
      description: data.description,
      owner_data: data.owner_data,
      email: data.email
    };
    return apiPut(`api/team_details/${aiTeamId}/`, formattedData);
  }, [apiPut]);

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
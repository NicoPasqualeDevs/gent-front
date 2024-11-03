import { useCallback } from 'react';
import { AiTeamsDetails, AiTeamsFormData } from '@/types/AiTeams';
import { ApiResponse } from '@/types/Api';
import useApi from './api/useApi';

interface UseAiTeamsApiHook {
  getMyAiTeams: (filterParams: string) => Promise<ApiResponse<AiTeamsDetails[]>>;
  getAiTeamsByOwner: (ownerId: string, filterParams: string) => Promise<ApiResponse<AiTeamsDetails[]>>;
  getAiTeamDetails: (aiTeamId: string) => Promise<ApiResponse<AiTeamsDetails>>;
  deleteAiTeamDetails: (aiTeamId: string) => Promise<ApiResponse<void>>;
  createAiTeam: (data: AiTeamsFormData) => Promise<ApiResponse<AiTeamsDetails>>;
  updateAiTeam: (data: AiTeamsFormData, aiTeamId: string) => Promise<ApiResponse<AiTeamsDetails>>;
}

const useAiTeamsApi = (): UseAiTeamsApiHook => {
  const { apiGet, apiPost, apiPut, apiDelete } = useApi();

  const getMyAiTeams = useCallback((filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    const params = filterParams.startsWith('?') ? filterParams : `?${filterParams}`;
    return apiGet(`api/team_details/my_clients/${params}`);
  }, [apiGet]);

  const getAiTeamsByOwner = useCallback((ownerId: string, filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    const params = filterParams.startsWith('?') ? filterParams : `?${filterParams}`;
    return apiGet(`api/team_details/list_by_owner/${params}&owner=${ownerId}`);
  }, [apiGet]);

  const getAiTeamDetails = useCallback((aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiGet(`api/team_details/${aiTeamId}/`);
  }, [apiGet]);

  const deleteAiTeamDetails = useCallback((aiTeamId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`api/team_details/${aiTeamId}/`);
  }, [apiDelete]);

  const createAiTeam = useCallback(async (data: AiTeamsFormData): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiPost('api/team_details/', data as unknown as Record<string, unknown>);
  }, [apiPost]);

  const updateAiTeam = useCallback(async (data: AiTeamsFormData, aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiPut(`api/team_details/${aiTeamId}/`, data as unknown as Record<string, unknown>);
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
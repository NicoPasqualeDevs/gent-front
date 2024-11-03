import { ApiResponse } from "@/types/Api";
import { AiTeamsDetails, AiTeamsFormData } from "@/types/AiTeams";
import useApi from "./useApi";

interface UseAiTeamsApiHook {
  getMyAiTeams: (filterParams: string) => Promise<ApiResponse<AiTeamsDetails[]>>;
  getAiTeamsByOwner: (ownerId: string, filterParams: string) => Promise<ApiResponse<AiTeamsDetails[]>>;
  getAiTeamDetails: (aiTeamId: string) => Promise<ApiResponse<AiTeamsDetails>>;
  createAiTeam: (data: AiTeamsFormData) => Promise<ApiResponse<AiTeamsDetails>>;
  updateAiTeam: (data: AiTeamsFormData, aiTeamId: string) => Promise<ApiResponse<AiTeamsDetails>>;
  deleteAiTeam: (aiTeamId: string) => Promise<ApiResponse<AiTeamsDetails>>;
}

const useAiTeamsApi = (): UseAiTeamsApiHook => {
  const { apiGet, apiPost, apiPut, apiDelete } = useApi();

  const getMyAiTeams = (filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    return apiGet(`ai-teams/${filterParams}`);
  };

  const getAiTeamsByOwner = (ownerId: string, filterParams: string): Promise<ApiResponse<AiTeamsDetails[]>> => {
    return apiGet(`ai-teams/owner/${ownerId}${filterParams}`);
  };

  const getAiTeamDetails = (aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiGet(`ai-teams/${aiTeamId}/`);
  };

  const createAiTeam = (data: AiTeamsFormData): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiPost('ai-teams/', data);
  };

  const updateAiTeam = (data: AiTeamsFormData, aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiPut(`ai-teams/${aiTeamId}/`, data);
  };

  const deleteAiTeam = (aiTeamId: string): Promise<ApiResponse<AiTeamsDetails>> => {
    return apiDelete(`ai-teams/${aiTeamId}/`);
  };

  return {
    getMyAiTeams,
    getAiTeamsByOwner,
    getAiTeamDetails,
    createAiTeam,
    updateAiTeam,
    deleteAiTeam
  };
};

export default useAiTeamsApi;

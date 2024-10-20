import useApi from "@/hooks/useApi.ts";
import { AiTeamsDetails } from "@/types/AiTeams";
import { ApiResponseList } from "@/types/Api";

type UseAiTeamsApiHook = {
  getAiTeamsList: (
    filterParams: string
  ) => Promise<ApiResponseList<AiTeamsDetails>>;
  getAiTeamDetails: (aiTeamId: string) => Promise<AiTeamsDetails>;
  postAiTeamDetails: (data: AiTeamsDetails) => Promise<AiTeamsDetails>;
  putAiTeamDetails: (
    data: AiTeamsDetails,
    aiTeamId: string
  ) => Promise<AiTeamsDetails>;
  deleteAiTeamDetails: (aiTeamId: string) => Promise<{ message: string }>;
  getMyAiTeams: () => Promise<ApiResponseList<AiTeamsDetails>>;
};

const useAiTeamsApi = (): UseAiTeamsApiHook => {
  const { apiPut, apiPost, apiGet, apiDelete } = useApi();

  // GETS
  const getAiTeamsList = (
    filterParams: string
  ): Promise<ApiResponseList<AiTeamsDetails>> => {
    const path = `api/ai_teams/${filterParams}`;
    return apiGet<ApiResponseList<AiTeamsDetails>>(path);
  };

  const getAiTeamDetails = (aiTeamId: string): Promise<AiTeamsDetails> => {
    const path = `api/ai_teams/${aiTeamId}/`;
    return apiGet<AiTeamsDetails>(path);
  };

  const getMyAiTeams = (): Promise<ApiResponseList<AiTeamsDetails>> => {
    const path = `api/ai_teams/my_clients/`;  // Actualizado el endpoint
    return apiGet<ApiResponseList<AiTeamsDetails>>(path);
  };

  // POST
  const postAiTeamDetails = (data: AiTeamsDetails): Promise<AiTeamsDetails> => {
    const path = `api/ai_teams/`;
    return apiPost(path, data);
  };

  // PUTS
  const putAiTeamDetails = (
    data: AiTeamsDetails,
    aiTeamId: string
  ): Promise<AiTeamsDetails> => {
    const path = `api/ai_teams/${aiTeamId}/`;
    return apiPut(path, data);
  };

  // DELETE
  const deleteAiTeamDetails = (aiTeamId: string): Promise<{ message: string }> => {
    const path = `api/ai_teams/${aiTeamId}/`;
    return apiDelete(path).then(response => response.json());
  };

  return {
    getAiTeamsList,
    getAiTeamDetails,
    postAiTeamDetails,
    putAiTeamDetails,
    deleteAiTeamDetails,
    getMyAiTeams,
  };
};

export default useAiTeamsApi;

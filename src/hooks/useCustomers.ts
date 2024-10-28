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
  getMyAiTeams: (filterParams: string) => Promise<ApiResponseList<AiTeamsDetails>>;
  getAiTeamsByOwner: (owner: string, filterParams: string) => Promise<ApiResponseList<AiTeamsDetails>>;
};

const useAiTeamsApi = (): UseAiTeamsApiHook => {
  const { apiPut, apiPost, apiGet, apiDelete } = useApi();

  // GETS
  const getAiTeamsList = (
    filterParams: string
  ): Promise<ApiResponseList<AiTeamsDetails>> => {
    const path = `api/team_details/${filterParams}`;
    return apiGet<ApiResponseList<AiTeamsDetails>>(path);
  };

  const getAiTeamDetails = (aiTeamId: string): Promise<AiTeamsDetails> => {
    const path = `api/team_details/${aiTeamId}`;
    return apiGet<AiTeamsDetails>(path);
  };

  const getMyAiTeams = (filterParams: string): Promise<ApiResponseList<AiTeamsDetails>> => {
    const path = `api/team_details/my_clients/${filterParams}`;
    return apiGet<ApiResponseList<AiTeamsDetails>>(path);
  };

  const getAiTeamsByOwner = (owner: string, filterParams: string): Promise<ApiResponseList<AiTeamsDetails>> => {
    // Corregir la construcción de la URL
    const path = `api/team_details/list_by_owner/${filterParams ? `?${filterParams}&` : '?'}owner=${owner}`;
    return apiGet<ApiResponseList<AiTeamsDetails>>(path);
  };

  // POST
  const postAiTeamDetails = (data: AiTeamsDetails): Promise<AiTeamsDetails> => {
    const path = `api/team_details/create_client/`;
    return apiPost(path, data);
  };

  // PUTS
  const putAiTeamDetails = (
    data: AiTeamsDetails,
    aiTeamId: string
  ): Promise<AiTeamsDetails> => {
    const path = `api/team_details/${aiTeamId}/`;
    return apiPut(path, data);
  };

  // DELETE
  const deleteAiTeamDetails = (aiTeamId: string): Promise<{ message: string }> => {
    const path = `api/team_details/${aiTeamId}/`;
    return apiDelete(path).then(response => response.json());
  };

  return {
    getAiTeamsList,
    getAiTeamDetails,
    postAiTeamDetails,
    putAiTeamDetails,
    deleteAiTeamDetails,
    getMyAiTeams,
    getAiTeamsByOwner,
  };
};

export default useAiTeamsApi;

import useApi from "@/hooks/useApi.ts";
import { AiTeamsDetails } from "@/types/AiTeams";
import { ApiResponseList } from "@/types/Api";

type UseCustomersApiHook = {
  getCustomerList: (
    filterParams: string
  ) => Promise<ApiResponseList<AiTeamsDetails>>;
  getClientDetails: (aiTeamId: string) => Promise<AiTeamsDetails>;
  postClientDetails: (data: AiTeamsDetails) => Promise<AiTeamsDetails>;
  putClientDetails: (
    data: AiTeamsDetails,
    aiTeamId: string
  ) => Promise<AiTeamsDetails>;
  deleteClientDetails: (aiTeamId: string) => Promise<Response>;
  getMyClients: () => Promise<ApiResponseList<AiTeamsDetails>>;
};

const useCustomersApi = (): UseCustomersApiHook => {
  const { apiPut, apiPost, apiGet, apiDelete } = useApi();

  // GETS
  const getCustomerList = (
    filterParams: string
  ): Promise<ApiResponseList<AiTeamsDetails>> => {
    const path = `api/client/actions/${filterParams}`;
    return apiGet<ApiResponseList<AiTeamsDetails>>(path);
  };

  const getClientDetails = (aiTeamId: string): Promise<AiTeamsDetails> => {
    const path = `api/client/actions/${aiTeamId}/`;
    return apiGet<AiTeamsDetails>(path);
  };

  const getMyClients = (): Promise<ApiResponseList<AiTeamsDetails>> => {
    const path = `api/client/actions/clients/my_clients/`;
    return apiGet<ApiResponseList<AiTeamsDetails>>(path);
  };

  // POST
  const postClientDetails = (data: AiTeamsDetails): Promise<AiTeamsDetails> => {
    const path = `api/client/actions/clients/`;
    return apiPost(path, data);
  };

  // PUTS
  const putClientDetails = (
    data: AiTeamsDetails,
    aiTeamId: string
  ): Promise<AiTeamsDetails> => {
    const path = `api/client/actions/${aiTeamId}/`;
    return apiPut(path, data);
  };

  const deleteClientDetails = (aiTeamId: string): Promise<Response> => {
    const path = `api/client/actions/${aiTeamId}/`;
    return apiDelete(path);
  };

  return {
    getCustomerList,
    getClientDetails,
    postClientDetails,
    putClientDetails,
    deleteClientDetails,
    getMyClients,
  };
};

export default useCustomersApi;

import useApi from "@/hooks/useApi.ts";
import { AiTeamsDetails } from "@/types/AiTeams";
import { ApiResponseList } from "@/types/Api";

type UseCustomersApiHook = {
  getCustomerList: (
    filterParams: string
  ) => Promise<ApiResponseList<AiTeamsDetails>>;
  getClientDetails: (clientId: string) => Promise<AiTeamsDetails>;
  postClientDetails: (data: AiTeamsDetails) => Promise<AiTeamsDetails>;
  putClientDetails: (
    data: AiTeamsDetails,
    clientId: string
  ) => Promise<AiTeamsDetails>;
  deleteClientDetails: (clientId: string) => Promise<Response>;
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

  const getClientDetails = (clientId: string): Promise<AiTeamsDetails> => {
    const path = `api/client/actions/${clientId}/`;
    return apiGet<AiTeamsDetails>(path);
  };

  // POST
  const postClientDetails = (data: AiTeamsDetails): Promise<AiTeamsDetails> => {
    const path = "api/client/actions/";
    return apiPost(path, data);
  };

  // PUTS
  const putClientDetails = (
    data: AiTeamsDetails,
    clientId: string
  ): Promise<AiTeamsDetails> => {
    const path = `api/client/actions/${clientId}/`;
    return apiPut(path, data);
  };

  const deleteClientDetails = (clientId: string): Promise<Response> => {
    const path = `api/client/actions/${clientId}/`;
    return apiDelete(path);
  };

  return {
    getCustomerList,
    getClientDetails,
    postClientDetails,
    putClientDetails,
    deleteClientDetails,
  };
};

export default useCustomersApi;

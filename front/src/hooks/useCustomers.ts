import useApi from "@/hooks/useApi.ts";
import { ClientDetails } from "@/types/Clients";
import { ApiResponseList, ApiResponse } from "@/types/Api";

type UseCustomersApiHook = {
  getCustomerList: () => Promise<ApiResponseList<ClientDetails>>;
  getClientDetails: (clientId: string) => Promise<ApiResponse<ClientDetails>>;
  postClientDetails: (data: ClientDetails) => Promise<ClientDetails>;
  putClientDetails: (
    data: ClientDetails,
    clientId: string
  ) => Promise<ClientDetails>;
  deleteClientDetails: (clientId: string) => Promise<Response>;
};

const useCustomersApi = (): UseCustomersApiHook => {
  const { apiPut, apiPost, apiGet, apiDelete } = useApi();

  // GETS
  const getCustomerList = (): Promise<ApiResponseList<ClientDetails>> => {
    const path = "api/client/actions/";
    return apiGet<ApiResponseList<ClientDetails>>(path);
  };

  const getClientDetails = (clientId: string): Promise<ApiResponse<ClientDetails>> => {
    const path = `api/client/actions/${clientId}/`;
    return apiGet<ApiResponse<ClientDetails>>(path);
  };

  // POST
  const postClientDetails = (data: ClientDetails): Promise<ClientDetails> => {
    const path = "api/client/actions/";
    return apiPost(path, data);
  };

  // PUTS
  const putClientDetails = (
    data: ClientDetails,
    clientId: string
  ): Promise<ClientDetails> => {
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

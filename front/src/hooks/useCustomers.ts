import useApi from "@/hooks/useApi.ts";
import { ClientDetails } from "@/types/Clients";
import { ApiResponseList } from "@/types/Api";

type UseCustomersApiHook = {
  getCustomerList: (
    filterParams: string
  ) => Promise<ApiResponseList<ClientDetails>>;
  getClientDetails: (clientId: string) => Promise<ClientDetails>;
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
  const getCustomerList = (
    filterParams: string
  ): Promise<ApiResponseList<ClientDetails>> => {
    const path = `api/client/actions/${filterParams}`;
    return apiGet<ApiResponseList<ClientDetails>>(path);
  };

  const getClientDetails = (clientId: string): Promise<ClientDetails> => {
    const path = `api/client/actions/${clientId}/`;
    return apiGet<ClientDetails>(path);
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

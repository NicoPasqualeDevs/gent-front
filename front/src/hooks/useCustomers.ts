import useApi from "@/hooks/useApi.ts";
import { ClientDetails } from "@/types/Clients";

type UseCustomersApiHook = {
  getCustomerList: () => Promise<ClientDetails[]>;
  getClientDetails: (clientId: string) => Promise<ClientDetails>;
  postClientDetails: (data: ClientDetails) => Promise<ClientDetails>;
  putClientDetails: (
    data: ClientDetails,
    clientId: string
  ) => Promise<ClientDetails>;
};

const useCustomersApi = (): UseCustomersApiHook => {
  const { apiPut, apiPost, apiGet } = useApi();

  // GETS
  const getCustomerList = (): Promise<ClientDetails[]> => {
    const path = "api/client/actions";
    return apiGet<ClientDetails[]>(path);
  };

  const getClientDetails = (clientId: string): Promise<ClientDetails> => {
    const path = `/api/customer/details/${clientId}`;
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

  return {
    getCustomerList,
    getClientDetails,
    postClientDetails,
    putClientDetails,
  };
};

export default useCustomersApi;

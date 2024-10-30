import useApi from "@/hooks/useApi";
import { ApiResponse } from "@/types/Api";

interface NonSuperUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

type UseAdminHook = {
  listNonSuperUsers: () => Promise<ApiResponse<NonSuperUser[]>>;
};

const useAdmin = (): UseAdminHook => {
  const { apiGet } = useApi();

  const listNonSuperUsers = (): Promise<ApiResponse<NonSuperUser[]>> => {
    const path = "api/list-non-super-users/";
    return apiGet<ApiResponse<NonSuperUser[]>>(path);
  };

  return {
    listNonSuperUsers,
  };
};

export default useAdmin;


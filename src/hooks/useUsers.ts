import useApi from "@/hooks/api/useApi";
import { User } from "@/types/AiTeams";
import { ApiResponse } from "@/types/Api";

interface UserResponse {
    status: boolean;
    message: string;
    data: User[];
}

const useUsers = () => {
    const { apiGet } = useApi();

    const getNoSuperAdminUsers = async (): Promise<ApiResponse<User[]>> => {
        try {
            const respuesta = await apiGet<UserResponse>("api/list-non-super-users/");
            return {
                success: respuesta.success,
                message: respuesta.message,
                data: respuesta.data.data || []
            };
        } catch (error) {
            throw new Error("Error al obtener la lista de usuarios");
        }
    };

    return {
        getNoSuperAdminUsers
    };
};

export default useUsers; 
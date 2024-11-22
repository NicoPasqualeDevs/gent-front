import { useCallback } from 'react';
import useApi from '@/hooks/api/useApi';
import { ApiResponse } from '@/types/Api';
import { AdminUser, UserStats } from '@/types/Admin';

interface UseAdminServicesHook {
  getNonSuperUsers: () => Promise<ApiResponse<AdminUser[]>>;
  getUserStats: () => Promise<ApiResponse<UserStats>>;
}

const useAdminServices = (): UseAdminServicesHook => {
  const { apiGet } = useApi();

  const getNonSuperUsers = useCallback(async (): Promise<ApiResponse<AdminUser[]>> => {
    try {
      return await apiGet('admin-services/users/non-super/');
    } catch (error) {
      console.error('Error fetching non-super users:', error);
      throw new Error('Error al obtener usuarios no superusuarios');
    }
  }, [apiGet]);

  const getUserStats = useCallback(async (): Promise<ApiResponse<UserStats>> => {
    try {
      return await apiGet('admin-services/users/stats/');
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Error al obtener estadísticas de usuarios');
    }
  }, [apiGet]);

  return {
    getNonSuperUsers,
    getUserStats
  };
};

export default useAdminServices; 
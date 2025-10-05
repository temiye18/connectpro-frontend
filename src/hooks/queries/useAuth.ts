import { useQuery } from '@tanstack/react-query';
import { authService } from '@/src/services/auth.service';
import { queryKeys } from '@/src/constants/queryKeys';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data.user;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
    retry: false,
  });
};

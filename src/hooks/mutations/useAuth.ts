import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService, RegisterData, LoginData, GuestData } from '@/src/services/auth.service';
import { queryKeys } from '@/src/constants/queryKeys';
import { useAuthStore } from '@/src/store/authStore';

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login: loginStore } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (response) => {
      // Update Zustand store
      loginStore(response.data.user, response.data.token);

      // Update query cache with user data
      queryClient.setQueryData(queryKeys.auth.user(), response.data.user);

      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login: loginStore } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (response) => {
      // Update Zustand store
      loginStore(response.data.user, response.data.token);

      // Update query cache with user data
      queryClient.setQueryData(queryKeys.auth.user(), response.data.user);

      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
};

export const useGuestSession = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login: loginStore } = useAuthStore();

  return useMutation({
    mutationFn: (data: GuestData) => authService.createGuestSession(data),
    onSuccess: (response) => {
      // Update Zustand store
      loginStore(response.data.user, response.data.token);

      // Update query cache with user data
      queryClient.setQueryData(queryKeys.auth.user(), response.data.user);

      // Note: Do NOT redirect here - let the calling component handle navigation
      // because guests might be joining a specific meeting
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout: logoutStore } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear Zustand store
      logoutStore();

      // Clear query cache
      queryClient.clear();

      // Redirect to landing page
      router.push('/');
    },
  });
};

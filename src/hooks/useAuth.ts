import { trpc } from '@/providers/trpc';
import { useEffect } from 'react';

export function useAuth() {
  const { data: user, refetch, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    enabled: localStorage.getItem('excel_token') !== null,
  });
  const loginMutation = trpc.auth.login.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const login = async (email: string, keyCode: string, name?: string) => {
    const result = await loginMutation.mutateAsync({ email, keyCode, name });
    localStorage.setItem('excel_token', result.token);
    await refetch();
    return result;
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    localStorage.removeItem('excel_token');
    await refetch();
  };

  return { user, isLoading, login, logout, refetch };
}

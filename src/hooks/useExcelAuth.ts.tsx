import { useAuth } from './useAuth';
import { trpc } from '@/providers/trpc';

export function useExcelAuth() {
  const { user, isLoading } = useAuth();
  const isAuthorized = user?.role === 'admin' || user?.isExcelAuthorized === true;

  const { data: progress, refetch } = trpc.excel.getUserProgress.useQuery(undefined, {
    enabled: isAuthorized,
  });

  return { user, isLoading, isAuthorized, progress, refetchProgress: refetch };
}
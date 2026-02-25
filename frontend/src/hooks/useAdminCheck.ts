import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useAdminCheck() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 60000,
  });
}

// Backward-compatible alias used by older components
export function useIsAdmin() {
  const query = useAdminCheck();
  return {
    isAdmin: query.data ?? false,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
  };
}

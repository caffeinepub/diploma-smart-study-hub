import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';

export function useActiveSubscriptions() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Principal[]>({
    queryKey: ['activeSubscriptions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllActiveSubscriptions();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 30000, // Cache for 30 seconds
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    activeSubscriptions: query.data || [],
  };
}

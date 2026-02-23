import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSubscription() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['subscriptionStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isSubscriptionActive();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    refetchInterval: 30000, // Refetch every 30 seconds to keep status synchronized
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    isActive: query.data === true,
  };
}

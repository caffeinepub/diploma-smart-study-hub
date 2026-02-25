import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSubscription() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isSubscriptionActive();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

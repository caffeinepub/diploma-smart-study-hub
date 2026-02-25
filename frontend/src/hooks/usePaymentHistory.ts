import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PaymentRecord } from '../backend';

export function usePaymentHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<PaymentRecord[]>({
    queryKey: ['paymentHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const payments = await actor.getCallerPayments();
      // Sort by timestamp descending (most recent first)
      return payments.sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 30000, // Cache for 30 seconds
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    payments: query.data || [],
  };
}

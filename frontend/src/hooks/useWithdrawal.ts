import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { WithdrawalRequest } from '../backend';

export function useSubmitWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, phoneNumber }: { amount: number; phoneNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Validate phone number (10 digits, numeric only)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error('Phone number must be exactly 10 digits');
      }

      // Validate amount
      if (amount < 50) {
        throw new Error('Minimum withdrawal amount is ₹50');
      }

      return await actor.submitWithdrawalRequest(amount, phoneNumber);
    },
    onSuccess: () => {
      // Invalidate withdrawal requests to refresh the list
      queryClient.invalidateQueries({ queryKey: ['withdrawalRequests'] });
    },
  });
}

export function useGetAllWithdrawalRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ['withdrawalRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getAllWithdrawalRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetWithdrawalRequest(withdrawalId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WithdrawalRequest | null>({
    queryKey: ['withdrawalRequest', withdrawalId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getWithdrawalRequest(withdrawalId);
    },
    enabled: !!actor && !actorFetching && !!withdrawalId,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import { Principal } from '@icp-sdk/core/principal';

export function useUserActivation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: Principal): Promise<void> => {
      if (!actor) throw new Error('Actor not available');
      await actor.activateUserAccount(userId);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminPayments'] });
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptions'] });
      
      toast.success('Account Activated', {
        description: 'User account has been successfully activated and all study materials are now unlocked.',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Activation Failed', {
        description: error.message || 'Failed to activate user account. Please try again.',
        duration: 5000,
      });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function usePaymentConfirmation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<boolean> => {
      if (!actor) throw new Error('Actor not available');
      
      // Call backend to finalize checkout and activate subscription
      const result = await actor.finalizeStripeCheckout(sessionId);
      
      if (!result) {
        throw new Error('Payment confirmation failed. Please contact support.');
      }
      
      return result;
    },
    onSuccess: () => {
      // Invalidate subscription queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      
      // Show success toast
      toast.success('Payment successful! Your subscription is now active and all content is unlocked.', {
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to confirm payment. Please try again or contact support.', {
        duration: 5000,
      });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export interface PaymentAuthorizationSettings {
  autoPaymentEnabled: boolean;
  maxAuthorizedAmount: number;
}

// Hook to fetch user's payment authorization settings
export function useGetPaymentAuthorization() {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentAuthorizationSettings>({
    queryKey: ['paymentAuthorization'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      // return actor.getPaymentAuthorizationSettings();
      
      // Temporary fallback - return default settings
      return {
        autoPaymentEnabled: false,
        maxAuthorizedAmount: 0,
      };
    },
    enabled: !!actor && !isFetching,
  });
}

// Hook to update payment authorization settings
export function useUpdatePaymentAuthorization() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: PaymentAuthorizationSettings): Promise<void> => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend method not yet implemented
      // await actor.setPaymentAuthorizationSettings(settings);
      
      // Temporary: Show warning that backend is not ready
      throw new Error('Payment authorization feature is not yet available. Backend implementation pending.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentAuthorization'] });
      toast.success('Payment authorization settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update payment authorization settings');
    },
  });
}

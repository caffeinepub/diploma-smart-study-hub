import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useActor } from './useActor';

// Hook to fetch the UPI ID from backend
export function usePhonePeUPI() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['phonePeUPI'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPhonePePaymentsUPI();
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity, // UPI ID doesn't change frequently
  });
}

// Utility function to mask UPI ID for display
export function maskUpiId(upiId: string): string {
  // Extract parts: "9392412728-2@axl" -> "93924*****@axl"
  const parts = upiId.split('@');
  if (parts.length !== 2) return '****@***'; // Fallback for invalid format
  
  const [localPart, domain] = parts;
  
  // Mask the middle portion, keep first 5 and last 0 characters visible
  if (localPart.length <= 5) {
    return `*****@${domain}`;
  }
  
  const visibleStart = localPart.slice(0, 5);
  const maskedPart = '*'.repeat(Math.min(localPart.length - 5, 5));
  
  return `${visibleStart}${maskedPart}@${domain}`;
}

export function usePhonePePayment() {
  const { data: upiId } = usePhonePeUPI();

  return useMutation({
    mutationFn: async (amount: number): Promise<void> => {
      if (!upiId) {
        throw new Error('UPI ID not available. Please try again.');
      }

      // Use the actual UPI ID from backend for payment processing
      const name = 'MCF Education';
      const transactionNote = 'Weekly Subscription Payment';
      
      // UPI deep link format - uses full UPI ID internally
      const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
      
      // Try to open PhonePe app or UPI payment interface
      try {
        // Check if we're on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // On mobile, try to open UPI app
          window.location.href = upiUrl;
        } else {
          // On desktop, show instructions
          toast.info('Payment Instructions', {
            description: 'Please scan the QR code below using your mobile UPI app to complete the payment.',
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('PhonePe payment error:', error);
        throw new Error('Failed to initiate PhonePe payment. Please use the QR code instead.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to initiate payment. Please try scanning the QR code.', {
        duration: 5000,
      });
    },
  });
}

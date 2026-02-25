import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export interface SubscriptionPromptDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export default function SubscriptionPromptDialog({ open, onOpenChange, onClose }: SubscriptionPromptDialogProps) {
  const navigate = useNavigate();

  const handleOpenChange = (value: boolean) => {
    if (onOpenChange) onOpenChange(value);
    if (!value && onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto h-16 w-16 rounded-full bg-warning/20 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-warning" />
          </div>
          <DialogTitle className="text-center text-2xl">Subscription Required</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Subscribe to unlock all study materials, PDFs, videos, galleries, and important links
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-muted/50 rounded-xl p-6">
            <p className="font-semibold mb-4 text-center">What you'll get:</p>
            <ul className="space-y-3">
              {[
                'Access to all study materials',
                'Chapter-wise PDFs and notes',
                'Image galleries and diagrams',
                'Video lectures',
                'All branches & semesters',
                'Instant access after payment',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center space-y-1">
            <p className="text-3xl font-bold text-primary">₹5/week</p>
            <p className="text-sm text-muted-foreground">Also available: ₹29/month · ₹99/6 months</p>
          </div>

          <Button
            className="w-full py-6 text-lg rounded-full"
            size="lg"
            onClick={() => {
              handleOpenChange(false);
              navigate({ to: '/subscription' });
            }}
          >
            Subscribe Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

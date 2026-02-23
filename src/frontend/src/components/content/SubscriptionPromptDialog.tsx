import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { CheckCircle, Lock } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface SubscriptionPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionPromptDialog({ open, onOpenChange }: SubscriptionPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                'Daily quizzes',
                'Certificates and leaderboard',
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

          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-2">₹5/week</p>
            <p className="text-sm text-muted-foreground">Affordable learning for everyone</p>
          </div>

          <Button asChild className="w-full py-6 text-lg rounded-full shadow-warm" size="lg">
            <Link to="/subscription">Subscribe Now</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

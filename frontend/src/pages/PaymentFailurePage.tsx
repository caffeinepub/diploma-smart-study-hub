import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.18_0.08_255)] via-[oklch(0.22_0.09_255)] to-[oklch(0.28_0.11_255)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-500/30 bg-white shadow-navy-lg">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-foreground">Payment Failed</h2>
            <p className="text-sm text-muted-foreground">
              Your payment could not be processed. No charges were made to your account.
            </p>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-left">
              <p className="text-sm font-semibold text-foreground mb-2">Common reasons:</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Insufficient funds</li>
                <li>• Card declined by bank</li>
                <li>• Network connectivity issue</li>
                <li>• Payment session expired</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => navigate({ to: '/subscription' })}
                className="w-full bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/dashboard' })}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

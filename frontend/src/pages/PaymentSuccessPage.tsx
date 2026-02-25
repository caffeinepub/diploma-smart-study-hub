import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { usePaymentConfirmation } from '../hooks/usePaymentConfirmation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const confirmPayment = usePaymentConfirmation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      confirmPayment.mutate(sessionId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.18_0.08_255)] via-[oklch(0.22_0.09_255)] to-[oklch(0.28_0.11_255)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-green-500/30 bg-white shadow-navy-lg">
          <CardContent className="p-8 text-center">
            {confirmPayment.isPending ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                </div>
                <h2 className="font-heading font-bold text-xl text-foreground">Activating Subscription...</h2>
                <p className="text-sm text-muted-foreground">Please wait while we confirm your payment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-foreground">Payment Successful!</h2>
                <p className="text-sm text-muted-foreground">
                  Your subscription has been activated. You now have full access to all study materials.
                </p>
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-left space-y-2">
                  <p className="text-sm font-semibold text-foreground">What's unlocked:</p>
                  {['All branch notes & PDFs', 'Video lectures', 'Semester-wise content', 'Premium study materials'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={() => navigate({ to: '/branches' })}
                    className="w-full bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold"
                  >
                    <BookOpen className="w-4 h-4 mr-2" /> Start Learning <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: '/dashboard' })}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

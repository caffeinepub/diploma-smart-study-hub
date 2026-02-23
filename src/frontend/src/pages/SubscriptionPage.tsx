import { useState } from 'react';
import { CheckCircle, QrCode, AlertCircle, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Separator } from '../components/ui/separator';
import { useSubscription } from '../hooks/useSubscription';
import { Badge } from '../components/ui/badge';
import { usePaymentConfirmation } from '../hooks/usePaymentConfirmation';
import { usePhonePePayment } from '../hooks/usePhonePePayment';
import { usePaymentHistory } from '../hooks/usePaymentHistory';
import PaymentQRSection from '../components/content/PaymentQRSection';
import PaymentHistoryList from '../components/content/PaymentHistoryList';
import { toast } from 'sonner';

export default function SubscriptionPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { isActive, isLoading } = useSubscription();
  const confirmPayment = usePaymentConfirmation();
  const phonePePayment = usePhonePePayment();
  const { payments, isLoading: paymentsLoading } = usePaymentHistory();
  const isAuthenticated = !!identity;

  const handlePhonePePayment = async () => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
      return;
    }

    try {
      await phonePePayment.mutateAsync(5); // ₹5 subscription amount
    } catch (error) {
      console.error('PhonePe payment error:', error);
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Generate a unique session ID for manual payment confirmation
      const sessionId = `manual_payment_${Date.now()}_${identity?.getPrincipal().toString().slice(0, 8)}`;
      
      // Call the payment confirmation mutation
      await confirmPayment.mutateAsync(sessionId);
      
      // Navigate to success page
      navigate({ to: '/payment-success' });
    } catch (error) {
      console.error('Payment confirmation error:', error);
      toast.error('Failed to confirm payment. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-display font-bold tracking-tight sm:text-6xl">
            Simple, <span className="text-primary">Affordable</span> Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get unlimited access to all study materials for just ₹5 per week
          </p>
        </div>

        {!isAuthenticated && (
          <Alert className="border-2">
            <AlertDescription className="text-base">
              Please log in to subscribe and access all study materials.
            </AlertDescription>
          </Alert>
        )}

        {isAuthenticated && !isLoading && isActive && (
          <Alert className="border-2 border-success bg-success/10">
            <CheckCircle className="h-5 w-5 text-success" />
            <AlertDescription className="text-success-foreground text-base">
              Your subscription is currently active! You have full access to all study materials.
            </AlertDescription>
          </Alert>
        )}

        {isAuthenticated && !isLoading && !isActive && (
          <Alert className="border-2 border-warning bg-warning/10">
            <AlertCircle className="h-5 w-5 text-warning" />
            <AlertDescription className="text-warning-foreground text-base">
              Your subscription has expired or is not active. Subscribe now to unlock all materials.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-10 lg:grid-cols-2">
          <Card className="border-4 border-primary shadow-warm-lg">
            <CardHeader className="text-center pb-10 space-y-6">
              <div className="flex items-center justify-center gap-3">
                <CardTitle className="text-4xl font-display">Weekly Plan</CardTitle>
                {isAuthenticated && !isLoading && isActive && (
                  <Badge className="bg-success hover:bg-success text-lg px-4 py-1">Active</Badge>
                )}
              </div>
              <div className="mt-6">
                <span className="text-7xl font-bold text-primary">₹5</span>
                <span className="text-2xl text-muted-foreground">/week</span>
              </div>
              <CardDescription className="text-lg mt-6">
                Perfect for students who want flexible, affordable access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <ul className="space-y-4">
                {[
                  'Access to all study materials across all branches',
                  'Chapter-wise PDFs, notes, and documents',
                  'Image galleries with diagrams and visuals',
                  'Video lectures and important links',
                  'Daily quizzes and practice tests',
                  'Study reminders and notifications',
                  'Leaderboard access and competition',
                  'Earn certificates for achievements',
                  'Download materials for offline study',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center">Choose Payment Method</h3>
                
                <Button
                  onClick={handlePhonePePayment}
                  disabled={!isAuthenticated || phonePePayment.isPending}
                  className="w-full py-6 text-lg rounded-full shadow-warm bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  {phonePePayment.isPending ? 'Opening PhonePe...' : 'Pay with PhonePe'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or scan QR code</span>
                  </div>
                </div>
              </div>

              <PaymentQRSection phoneNumber="9392412728" amount="₹5" />

              <Button
                onClick={handlePaymentConfirmation}
                disabled={isProcessing || !isAuthenticated || confirmPayment.isPending}
                className="w-full py-6 text-lg rounded-full shadow-warm"
                size="lg"
              >
                {isProcessing || confirmPayment.isPending ? 'Processing...' : 'I Have Completed Payment'}
              </Button>

              {confirmPayment.isError && (
                <Alert className="border-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to confirm payment. Please try again or contact support at +91 9392412728.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Why Subscribe?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base">
                <p className="text-muted-foreground leading-relaxed">
                  Get unlimited access to comprehensive study materials curated specifically for diploma engineering students.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Updated content aligned with latest syllabus</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Quality-checked materials by experts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>24/7 access from any device</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Regular updates and new content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-2xl">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base">
                <p className="text-muted-foreground leading-relaxed">
                  If you face any issues with payment or subscription activation, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Phone: +91 9392412728</p>
                  <p className="text-muted-foreground text-sm">Available 9 AM - 9 PM (Mon-Sat)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {isAuthenticated && (
          <div className="mt-12">
            <PaymentHistoryList payments={payments} isLoading={paymentsLoading} />
          </div>
        )}
      </div>
    </div>
  );
}

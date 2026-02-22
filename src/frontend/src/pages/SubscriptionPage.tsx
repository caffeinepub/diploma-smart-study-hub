import { useState } from 'react';
import { CheckCircle, CreditCard, Smartphone, QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Separator } from '../components/ui/separator';

export default function SubscriptionPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
      return;
    }

    setIsProcessing(true);
    // Simulate processing and redirect to payment success
    setTimeout(() => {
      setIsProcessing(false);
      navigate({ to: '/payment-success' });
    }, 1500);
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, <span className="text-primary">Affordable</span> Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to all study materials for just ₹5 per week
          </p>
        </div>

        {!isAuthenticated && (
          <Alert>
            <AlertDescription>
              Please log in to subscribe and access all study materials.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-2 border-primary shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl mb-2">Weekly Plan</CardTitle>
              <div className="mt-4">
                <span className="text-6xl font-bold text-primary">₹5</span>
                <span className="text-xl text-muted-foreground">/week</span>
              </div>
              <CardDescription className="text-base mt-4">
                Perfect for students who want flexible, affordable access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Access to all study materials across all branches</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Chapter-wise PDFs, notes, and documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Video lectures and important links</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Daily quizzes and practice tests</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Study reminders and notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Leaderboard access and competition</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Earn certificates for achievements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Download materials for offline study</span>
                </li>
              </ul>

              <Separator />

              {/* QR Code Payment Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    Scan to Pay
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use any UPI app to scan and pay
                  </p>
                </div>

                {/* Payment Instructions */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span>Open PhonePe, Google Pay, or Paytm app</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <span>Tap on "Scan QR Code"</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <span>Scan the QR code shown below</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          4
                        </span>
                        <span>Enter amount: <strong className="text-primary">₹5</strong></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          5
                        </span>
                        <span>Complete the payment</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                {/* QR Code Display */}
                <Card className="border-2 border-primary/20 bg-white dark:bg-gray-900">
                  <CardContent className="pt-6 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <img
                        src="/assets/generated/phonepe-qr-code.dim_400x400.png"
                        alt="PhonePe QR Code for Payment"
                        className="w-64 h-64 sm:w-80 sm:h-80"
                      />
                    </div>
                    <div className="mt-4 text-center space-y-2">
                      <p className="text-sm font-medium">Payment will be sent to:</p>
                      <p className="text-lg font-bold text-primary flex items-center justify-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        9392412728
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Diploma Study Hub
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {isProcessing ? 'Processing...' : 'I Have Completed Payment'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                After payment, click the button above to activate your subscription. Our admin team will verify your payment.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Scan & Pay</h3>
                    <p className="text-sm text-muted-foreground">
                      Pay just ₹5 via UPI by scanning the QR code with PhonePe, Google Pay, or any UPI app
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Confirm Payment</h3>
                    <p className="text-sm text-muted-foreground">
                      After completing payment, click the confirmation button to notify our team
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Access Everything</h3>
                    <p className="text-sm text-muted-foreground">
                      Once verified, instantly unlock all study materials for your branch
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Why Students Love Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Most affordable study platform for diploma students</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Content updated regularly with latest syllabus</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Works perfectly on mobile devices</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>No hidden charges or surprise fees</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Secure UPI payment to verified number</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

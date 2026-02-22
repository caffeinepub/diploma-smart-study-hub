import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function PaymentSuccessPage() {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-green-500">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Initiated!</CardTitle>
            <CardDescription>
              Your subscription payment has been received
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-primary/50 bg-primary/5">
              <AlertDescription className="text-sm">
                <p className="font-medium mb-2">
                  Please ensure you have completed the payment of <strong className="text-primary">₹5</strong> to phone number:
                </p>
                <p className="flex items-center justify-center gap-2 text-lg font-bold text-primary">
                  <Smartphone className="h-5 w-5" />
                  9392412728
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  via the QR code scan
                </p>
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-center">
              <p className="text-muted-foreground">
                Your subscription will be activated once the payment is verified by our admin team. This usually takes a few minutes.
              </p>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/branches">Browse Materials</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

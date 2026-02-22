import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { XCircle, Smartphone } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-destructive">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
            <CardDescription>
              There was an issue processing your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-center space-y-2">
              <p className="text-muted-foreground">
                Payment to phone number <strong className="text-foreground flex items-center justify-center gap-1 mt-1">
                  <Smartphone className="h-4 w-4" />
                  9392412728
                </strong> could not be completed.
              </p>
              <p className="text-muted-foreground">
                Please try scanning the QR code again or contact support if the issue persists.
              </p>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/subscription">Try Again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

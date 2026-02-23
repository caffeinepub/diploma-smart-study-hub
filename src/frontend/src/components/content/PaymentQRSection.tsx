import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { QrCode, Smartphone, CheckCircle } from 'lucide-react';
import { usePhonePeUPI, maskUpiId } from '../../hooks/usePhonePePayment';

interface PaymentQRSectionProps {
  phoneNumber: string;
  amount: string;
}

export default function PaymentQRSection({ phoneNumber, amount }: PaymentQRSectionProps) {
  const { data: upiId, isLoading } = usePhonePeUPI();
  
  // Mask the UPI ID for display
  const maskedUpiId = upiId ? maskUpiId(upiId) : '****@***';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-3 flex items-center justify-center gap-2">
          <QrCode className="h-6 w-6 text-primary" />
          Scan to Pay
        </h3>
        <p className="text-base text-muted-foreground mb-6">
          Use any UPI app to scan and pay
        </p>
      </div>

      <div className="flex justify-center">
        <div className="p-6 bg-white rounded-2xl shadow-warm">
          <img
            src="/assets/Screenshot_2026-02-22-08-38-52-30_944a2809ea1b4cda6ef12d1db9048ed3-1.jpg"
            alt="PhonePe QR Code for Payment"
            className="w-64 h-64 object-contain"
            loading="eager"
          />
        </div>
      </div>

      <Card className="bg-muted/50 border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-background rounded-lg">
            <span className="text-muted-foreground">Amount:</span>
            <span className="text-xl font-bold text-primary">{amount}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-background rounded-lg">
            <span className="text-muted-foreground">UPI ID:</span>
            <span className="text-lg font-mono text-muted-foreground">
              {isLoading ? 'Loading...' : maskedUpiId}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-background rounded-lg">
            <span className="text-muted-foreground">Phone Number:</span>
            <span className="text-lg font-semibold">{phoneNumber}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Supported Payment Apps:</p>
            <div className="flex flex-wrap gap-2">
              {['PhonePe', 'Google Pay', 'Paytm', 'BHIM UPI'].map((app) => (
                <span key={app} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {app}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 border-2">
        <CardContent className="pt-6">
          <ol className="space-y-4 text-base">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                1
              </span>
              <span>Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                2
              </span>
              <span>Scan the QR code above</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                3
              </span>
              <span>Enter {amount} as the payment amount</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                4
              </span>
              <span>Complete the payment to {phoneNumber}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                5
              </span>
              <span>Click "I Have Completed Payment" button below after successful payment</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

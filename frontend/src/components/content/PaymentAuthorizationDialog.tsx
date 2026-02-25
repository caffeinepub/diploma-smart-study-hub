import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Shield, Info } from 'lucide-react';
import { useGetPaymentAuthorization, useUpdatePaymentAuthorization } from '../../hooks/usePaymentAuthorization';

interface PaymentAuthorizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PaymentAuthorizationDialog({
  open,
  onOpenChange,
}: PaymentAuthorizationDialogProps) {
  const { data: settings, isLoading } = useGetPaymentAuthorization();
  const updateSettings = useUpdatePaymentAuthorization();

  const [autoPaymentEnabled, setAutoPaymentEnabled] = useState(false);
  const [maxAmount, setMaxAmount] = useState('');
  const [error, setError] = useState('');

  // Initialize form with current settings
  useEffect(() => {
    if (settings) {
      setAutoPaymentEnabled(settings.autoPaymentEnabled);
      setMaxAmount(settings.maxAuthorizedAmount > 0 ? settings.maxAuthorizedAmount.toString() : '');
    }
  }, [settings]);

  const handleSave = async () => {
    setError('');

    // Validate amount
    const amount = parseFloat(maxAmount);
    if (autoPaymentEnabled && (isNaN(amount) || amount <= 0)) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (autoPaymentEnabled && amount < 5) {
      setError('Minimum authorized amount must be at least ₹5 (subscription cost)');
      return;
    }

    try {
      await updateSettings.mutateAsync({
        autoPaymentEnabled,
        maxAuthorizedAmount: autoPaymentEnabled ? amount : 0,
      });
      onOpenChange(false);
    } catch (err) {
      // Error is handled by the mutation hook
    }
  };

  const handleCancel = () => {
    // Reset form to current settings
    if (settings) {
      setAutoPaymentEnabled(settings.autoPaymentEnabled);
      setMaxAmount(settings.maxAuthorizedAmount > 0 ? settings.maxAuthorizedAmount.toString() : '');
    }
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            Payment Authorization Settings
          </DialogTitle>
          <DialogDescription className="text-base">
            Configure automatic payment authorization for seamless subscription renewals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert className="border-2 border-primary/20 bg-primary/5">
            <Info className="h-5 w-5 text-primary" />
            <AlertDescription className="text-sm">
              When enabled, payments within your authorized limit will be processed automatically without
              requiring manual confirmation each time.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="auto-payment" className="text-base font-semibold">
                  Enable Automatic Payments
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically process payments within your authorized limit
                </p>
              </div>
              <Switch
                id="auto-payment"
                checked={autoPaymentEnabled}
                onCheckedChange={setAutoPaymentEnabled}
                disabled={isLoading || updateSettings.isPending}
              />
            </div>

            {autoPaymentEnabled && (
              <div className="space-y-3 p-4 rounded-lg border-2 bg-muted/30">
                <Label htmlFor="max-amount" className="text-base font-semibold">
                  Maximum Authorized Amount (₹)
                </Label>
                <Input
                  id="max-amount"
                  type="number"
                  min="5"
                  step="1"
                  placeholder="Enter maximum amount (e.g., 50)"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  disabled={isLoading || updateSettings.isPending}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Payments exceeding this amount will require manual confirmation. Minimum: ₹5
                </p>
              </div>
            )}
          </div>

          {autoPaymentEnabled && (
            <Alert className="border-2 border-warning bg-warning/10">
              <AlertCircle className="h-5 w-5 text-warning" />
              <AlertDescription className="text-sm space-y-2">
                <p className="font-semibold">Important Security Notice:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Automatic payments will be processed for amounts up to ₹{maxAmount || '0'}</li>
                  <li>You will receive notifications for all automatic payments</li>
                  <li>You can disable this feature at any time</li>
                  <li>Payments exceeding your limit will require manual approval</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateSettings.isPending}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || updateSettings.isPending}
            className="rounded-full"
          >
            {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

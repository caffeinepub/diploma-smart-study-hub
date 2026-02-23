import { useEffect, useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAdminCheck';
import { useSubmitWithdrawalRequest, useGetAllWithdrawalRequests } from '../../hooks/useWithdrawal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Users, FileText, DollarSign, TrendingUp, Upload, Phone, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { identity } = useInternetIdentity();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastWithdrawalId, setLastWithdrawalId] = useState<string | null>(null);

  const submitWithdrawal = useSubmitWithdrawalRequest();
  const { data: withdrawalRequests } = useGetAllWithdrawalRequests();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  useEffect(() => {
    if (!adminLoading && identity && !isAdmin) {
      toast.error('Access Denied', {
        description: 'You do not have admin permissions to access this page.',
      });
      navigate({ to: '/dashboard' });
    }
  }, [isAdmin, adminLoading, identity, navigate]);

  if (!identity || adminLoading) return null;

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access Denied: You do not have admin permissions to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleWithdrawalSubmit = async () => {
    const amount = parseFloat(withdrawalAmount);
    
    if (isNaN(amount) || amount < 50) {
      toast.error('Please enter a valid amount (minimum ₹50)');
      return;
    }

    if (!phoneNumber || phoneNumber.length !== 10 || !/^[0-9]{10}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const withdrawalId = await submitWithdrawal.mutateAsync({ amount, phoneNumber });
      setLastWithdrawalId(withdrawalId);
      setShowWithdrawalDialog(false);
      setShowConfirmation(true);
      setWithdrawalAmount('');
      setPhoneNumber('');
      toast.success('Withdrawal request submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdrawal request');
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  // Calculate total earnings and available balance from withdrawal requests
  const totalEarnings = 1245; // Mock data - replace with actual calculation
  const availableBalance = 845; // Mock data - replace with actual calculation

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Admin Mode Banner */}
        <div className="rounded-lg bg-accent/10 border-2 border-accent p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-accent-foreground">Admin Mode Active</h2>
              <p className="text-sm text-muted-foreground">You have full administrative access to the platform</p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform and monitor performance</p>
        </div>

        {/* Wallet Summary */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Admin Wallet</CardTitle>
            <CardDescription>Your earnings and withdrawal status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold text-primary">₹{totalEarnings.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold text-primary">₹{availableBalance.toLocaleString()}</p>
              </div>
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setShowWithdrawalDialog(true)}
              disabled={availableBalance < 50}
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Withdraw Funds (Min ₹50)
            </Button>
            {withdrawalRequests && withdrawalRequests.length > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                Last withdrawal: ₹{Number(withdrawalRequests[withdrawalRequests.length - 1].amount).toFixed(0)} on{' '}
                {new Date(Number(withdrawalRequests[withdrawalRequests.length - 1].timestamp)).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">249</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">187</div>
              <p className="text-xs text-muted-foreground">75% of users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">PDFs, videos, links</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Upload className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Upload and manage study materials</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/content">Manage Content</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>View users and approve payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Withdrawal Dialog */}
      <Dialog open={showWithdrawalDialog} onOpenChange={setShowWithdrawalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter the amount you want to withdraw and your phone number for payment processing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (min ₹50)"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                min="50"
                step="1"
              />
              <p className="text-xs text-muted-foreground">
                Available balance: ₹{availableBalance.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="pl-10"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your 10-digit Indian mobile number for payment processing
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleWithdrawalSubmit}
              disabled={submitWithdrawal.isPending}
            >
              {submitWithdrawal.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdrawal Request Submitted</DialogTitle>
            <DialogDescription>
              Your withdrawal request has been successfully submitted and is pending approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Request ID:</span>
                <span className="text-sm font-medium">{lastWithdrawalId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-sm font-medium">₹{parseFloat(withdrawalAmount || '0').toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone Number:</span>
                <span className="text-sm font-medium">{phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="text-sm font-medium text-amber-600">Pending</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your withdrawal will be processed within 2-3 business days. You will receive the payment at the provided phone number.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowConfirmation(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

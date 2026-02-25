import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAdminCheck';
import { useActiveSubscriptions } from '../../hooks/useActiveSubscriptions';
import { useAdminPayments } from '../../hooks/useAdminPayments';
import { useUserActivation } from '../../hooks/useUserActivation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Shield, AlertCircle, Users, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import PaymentTransactionTable from '../../components/admin/PaymentTransactionTable';

export default function UserManagementPage() {
  const { identity } = useInternetIdentity();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();

  const { data: activeSubscriptions = [], isLoading: subsLoading } = useActiveSubscriptions();
  const { data: payments = [], isLoading: paymentsLoading } = useAdminPayments();
  const activateUser = useUserActivation();

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
              <p className="text-sm text-muted-foreground">You have full administrative access to manage users</p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users, subscriptions, and payments</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subsLoading ? '...' : activeSubscriptions.length}</div>
              <p className="text-xs text-muted-foreground">Currently subscribed users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentsLoading ? '...' : payments.length}</div>
              <p className="text-xs text-muted-foreground">All time transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{paymentsLoading ? '...' : payments.reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total collected</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subscriptions">
          <TabsList>
            <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscribers</CardTitle>
                <CardDescription>Users with active subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                {subsLoading ? (
                  <p className="text-muted-foreground text-sm">Loading...</p>
                ) : activeSubscriptions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No active subscriptions found.</p>
                ) : (
                  <div className="space-y-2">
                    {activeSubscriptions.map((principal, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium font-mono">
                              {principal.toString().slice(0, 16)}...
                            </p>
                            <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs mt-0.5">
                              Active
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => {
                            toast.info('Use deactivate function to remove subscription.');
                          }}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Deactivate
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <PaymentTransactionTable payments={payments} isLoading={paymentsLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

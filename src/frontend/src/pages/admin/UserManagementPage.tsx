import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAdminCheck';
import { useActiveSubscriptions } from '../../hooks/useActiveSubscriptions';
import { useAdminPayments } from '../../hooks/useAdminPayments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle, XCircle, Ban, UserCheck, Shield, AlertCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import UserActivationDialog from '../../components/admin/UserActivationDialog';
import PaymentTransactionTable from '../../components/admin/PaymentTransactionTable';
import { Principal } from '@icp-sdk/core/principal';

export default function UserManagementPage() {
  const { identity } = useInternetIdentity();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { activeSubscriptions, isLoading: subsLoading } = useActiveSubscriptions();
  const { payments, isLoading: paymentsLoading } = useAdminPayments();
  const navigate = useNavigate();

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

  // Get unique users from payments
  const uniqueUsers = Array.from(
    new Map(
      payments.map((payment) => [
        payment.userId.toString(),
        {
          principal: payment.userId,
          lastPayment: payment.timestamp,
          totalPayments: payments.filter((p) => p.userId.toString() === payment.userId.toString()).length,
        },
      ])
    ).values()
  );

  const isUserActive = (userId: Principal): boolean => {
    return activeSubscriptions.some((sub) => sub.toString() === userId.toString());
  };

  const pendingPayments = payments.filter((p) => p.status === 'pending');

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
          <p className="text-muted-foreground">Manage users, activate accounts, and review payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers.length}</div>
              <p className="text-xs text-muted-foreground">Registered users with payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
              <p className="text-xs text-muted-foreground">Users with active access</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="payments">
              All Payments
              <Badge className="ml-2">{payments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Approvals
              <Badge className="ml-2 bg-warning">{pendingPayments.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>View and manage all platform users with payment history</CardDescription>
              </CardHeader>
              <CardContent>
                {subsLoading || paymentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : uniqueUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Principal ID</TableHead>
                        <TableHead>Total Payments</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uniqueUsers.map((user) => {
                        const isActive = isUserActive(user.principal);
                        return (
                          <TableRow key={user.principal.toString()}>
                            <TableCell className="font-mono text-sm break-all max-w-[300px]">
                              {user.principal.toString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.totalPayments}</Badge>
                            </TableCell>
                            <TableCell>
                              {isActive ? (
                                <Badge className="bg-success hover:bg-success">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <UserActivationDialog
                                userId={user.principal}
                                userName={user.principal.toString().slice(0, 10) + '...'}
                                isActive={isActive}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <PaymentTransactionTable payments={payments} isLoading={paymentsLoading} />
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Payment Approval Queue</CardTitle>
                <CardDescription>Review and approve pending payment confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : pendingPayments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending payments</p>
                    <p className="text-sm mt-2">All payments have been processed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPayments.map((payment) => {
                      const isActive = isUserActive(payment.userId);
                      return (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-mono text-sm break-all">{payment.userId.toString()}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              ₹{Number(payment.amount) || 5} • ID: {payment.id} •{' '}
                              {new Date(Number(payment.timestamp) / 1000000).toLocaleDateString()}
                            </p>
                            {isActive && (
                              <Badge className="mt-2 bg-success hover:bg-success">Already Active</Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <UserActivationDialog
                              userId={payment.userId}
                              userName={payment.userId.toString().slice(0, 10) + '...'}
                              isActive={isActive}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

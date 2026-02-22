import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { CheckCircle, XCircle, Ban, UserCheck } from 'lucide-react';

export default function UserManagementPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  const users = [
    { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', roll: 'CSE2023001', branch: 'CSE', status: 'active', blocked: false },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', roll: 'ECE2023045', branch: 'ECE', status: 'expired', blocked: false },
    { id: 3, name: 'Amit Patel', email: 'amit@example.com', roll: 'MECH2023012', branch: 'MECH', status: 'active', blocked: false },
  ];

  const pendingPayments = [
    { id: 1, user: 'Sneha Reddy', email: 'sneha@example.com', amount: '₹5', txn: 'TXN789012', date: 'Today' },
    { id: 2, user: 'Vikram Singh', email: 'vikram@example.com', amount: '₹5', txn: 'TXN789013', date: 'Today' },
  ];

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and approve payments</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="payments">
              Pending Payments
              <Badge className="ml-2">{pendingPayments.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>View and manage all platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.roll}</TableCell>
                        <TableCell>{user.branch}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              {user.blocked ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Approval Queue</CardTitle>
                <CardDescription>Review and approve pending payment confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.user}</p>
                        <p className="text-sm text-muted-foreground">{payment.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {payment.amount} • TXN: {payment.txn} • {payment.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

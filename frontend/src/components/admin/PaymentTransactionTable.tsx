import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { PaymentRecord, PaymentStatus } from '../../backend';
import { CheckCircle, XCircle, Clock, AlertCircle, Filter } from 'lucide-react';

interface PaymentTransactionTableProps {
  payments: PaymentRecord[];
  isLoading: boolean;
}

export default function PaymentTransactionTable({ payments, isLoading }: PaymentTransactionTableProps) {
  const [filterMethod, setFilterMethod] = useState<'all' | 'phonepe' | 'stripe' | 'razorpay'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all');

  const formatDate = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-success hover:bg-success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-warning text-warning">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentMethod = (payment: PaymentRecord): 'Stripe' | 'Razorpay' | 'PhonePe/QR' => {
    if (payment.stripeSessionId) {
      // Distinguish Razorpay payments by checking if the session ID starts with 'rzp_'
      if (payment.stripeSessionId.startsWith('rzp_') || payment.stripeSessionId.startsWith('pay_')) {
        return 'Razorpay';
      }
      return 'Stripe';
    }
    return 'PhonePe/QR';
  };

  const getMethodBadge = (payment: PaymentRecord) => {
    const method = getPaymentMethod(payment);
    if (method === 'Stripe') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
          Stripe
        </Badge>
      );
    }
    if (method === 'Razorpay') {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.5 2L6 14h6.5L10 22l10-12h-6.5L14.5 2z" />
          </svg>
          Razorpay
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
        PhonePe/QR
      </Badge>
    );
  };

  const filteredPayments = payments.filter((payment) => {
    const method = getPaymentMethod(payment);
    const methodMatch =
      filterMethod === 'all' ||
      (filterMethod === 'phonepe' && method === 'PhonePe/QR') ||
      (filterMethod === 'stripe' && method === 'Stripe') ||
      (filterMethod === 'razorpay' && method === 'Razorpay');

    const statusMatch = filterStatus === 'all' || payment.status === filterStatus;

    return methodMatch && statusMatch;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>Loading payment data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Transactions</CardTitle>
        <CardDescription>View and manage all payment transactions across users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by Method:</span>
          </div>
          <Tabs value={filterMethod} onValueChange={(v) => setFilterMethod(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="phonepe">PhonePe/QR</TabsTrigger>
              <TabsTrigger value="stripe">Stripe</TabsTrigger>
              <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-medium">Status:</span>
          </div>
          <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No payment transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{formatDate(payment.timestamp)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground break-all max-w-[200px]">
                      {payment.userId.toString().slice(0, 20)}...
                    </TableCell>
                    <TableCell className="font-semibold">₹{Number(payment.amount) || 5}</TableCell>
                    <TableCell>{getMethodBadge(payment)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.stripeSessionId ? payment.stripeSessionId.slice(0, 20) + '...' : payment.id}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Total Transactions: {filteredPayments.length}</span>
          <span>
            Total Amount: ₹
            {filteredPayments.reduce((sum, p) => sum + (Number(p.amount) || 5), 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

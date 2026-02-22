import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Mail, BookOpen, Calendar, Award } from 'lucide-react';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">John Doe</CardTitle>
                <CardDescription className="text-base mt-1">
                  Computer Science Engineering • 3rd Semester
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge>Active Subscriber</Badge>
                  <Badge variant="outline">Member since Jan 2026</Badge>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Roll Number</p>
                  <p className="text-sm text-muted-foreground">CSE2023001</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Joined</p>
                  <p className="text-sm text-muted-foreground">January 15, 2026</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Downloads</span>
                <span className="text-2xl font-bold text-primary">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quiz Average</span>
                <span className="text-2xl font-bold text-primary">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Study Hours</span>
                <span className="text-2xl font-bold text-primary">48h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Certificates</span>
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscription History</CardTitle>
            <CardDescription>Your payment and subscription records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: 'Feb 21, 2026', amount: '₹5', status: 'Active', txn: 'TXN123456' },
                { date: 'Feb 14, 2026', amount: '₹5', status: 'Completed', txn: 'TXN123455' },
                { date: 'Feb 7, 2026', amount: '₹5', status: 'Completed', txn: 'TXN123454' },
              ].map((payment, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{payment.date}</p>
                    <p className="text-xs text-muted-foreground">Transaction ID: {payment.txn}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{payment.amount}</p>
                    <Badge variant={payment.status === 'Active' ? 'default' : 'outline'} className="text-xs">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

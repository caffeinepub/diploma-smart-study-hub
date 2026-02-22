import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Calendar, Download, TrendingUp, Award, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export default function DashboardPage() {
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Here's your learning progress</p>
        </div>

        {/* Subscription Status */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subscription Status</CardTitle>
                <CardDescription>Your current plan and remaining days</CardDescription>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Days Remaining</span>
              <span className="text-2xl font-bold text-primary">5 days</span>
            </div>
            <Progress value={71} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Expires on Feb 26, 2026</span>
              <Button variant="outline" size="sm">Renew Now</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Average score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Downloads</CardTitle>
              <CardDescription>Your recently accessed materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Data Structures - Chapter 3', date: 'Today', type: 'PDF' },
                  { name: 'Digital Electronics Notes', date: 'Yesterday', type: 'Notes' },
                  { name: 'Thermodynamics Lecture', date: '2 days ago', type: 'Video' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reminders</CardTitle>
              <CardDescription>Your scheduled study sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Database Exam', date: 'Feb 25, 2026', time: '10:00 AM' },
                  { title: 'Assignment Submission', date: 'Feb 27, 2026', time: '5:00 PM' },
                  { title: 'Study Session', date: 'Feb 28, 2026', time: '3:00 PM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.date} at {item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

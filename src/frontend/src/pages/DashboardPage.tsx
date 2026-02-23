import { useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Calendar, Download, TrendingUp, Award, Clock, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useSubscription } from '../hooks/useSubscription';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { isActive, isLoading } = useSubscription();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  return (
    <div className="container py-12">
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Welcome back!</h1>
          <p className="text-lg text-muted-foreground">Here's your learning progress</p>
        </div>

        {/* Subscription Status */}
        {!isLoading && (
          <Card className={`border-4 ${isActive ? 'border-success shadow-warm' : 'border-warning shadow-warm'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Subscription Status</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {isActive ? 'Your current plan and access' : 'Subscribe to unlock all materials'}
                  </CardDescription>
                </div>
                {isActive ? (
                  <Badge className="bg-success hover:bg-success text-lg px-4 py-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-2 border-warning text-warning text-lg px-4 py-2">
                    <Lock className="h-4 w-4 mr-2" />
                    Inactive
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isActive ? (
                <>
                  <Alert className="border-2 border-success bg-success/10">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <AlertDescription className="text-base text-success-foreground">
                      You have full access to all study materials, PDFs, videos, galleries, and important links across all branches!
                    </AlertDescription>
                  </Alert>
                  <div className="flex items-center justify-between text-base">
                    <span className="text-muted-foreground">Weekly Plan - ₹5</span>
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link to="/subscription">Manage Subscription</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Alert className="border-2 border-warning bg-warning/10">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    <AlertDescription className="text-base text-warning-foreground">
                      Your subscription has expired or is not active. Subscribe now to unlock all study materials!
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-xl p-6 text-base">
                      <p className="font-semibold mb-3">What you're missing:</p>
                      <ul className="space-y-2 text-muted-foreground">
                        {['All PDFs and study notes', 'Video lectures', 'Image galleries', 'Important links and resources'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <Lock className="h-4 w-4" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild className="w-full py-6 text-lg rounded-full shadow-warm" size="lg">
                      <Link to="/subscription">
                        Subscribe Now - Just ₹5/week
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Download, label: 'Downloads', value: '24', change: '+3 this week', color: 'primary' },
            { icon: TrendingUp, label: 'Quiz Score', value: '85%', change: 'Average score', color: 'accent' },
            { icon: Clock, label: 'Study Time', value: '12h', change: 'This week', color: 'secondary' },
            { icon: Award, label: 'Certificates', value: '3', change: 'Earned', color: 'primary' },
          ].map((stat, i) => (
            <Card key={i} className="border-2 hover:border-primary/50 transition-all hover:shadow-warm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 text-${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: BookOpen, title: 'Study Materials', desc: 'Access PDFs, notes, and videos', link: '/branches' },
            { icon: Calendar, title: 'Daily Quiz', desc: 'Test your knowledge today', link: '/quizzes' },
            { icon: TrendingUp, title: 'Leaderboard', desc: 'See your ranking', link: '/leaderboard' },
          ].map((action, i) => (
            <Card key={i} className="border-2 hover:border-primary/50 transition-all hover:shadow-warm cursor-pointer group">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">{action.title}</CardTitle>
                <CardDescription className="text-base">{action.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link to={action.link}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

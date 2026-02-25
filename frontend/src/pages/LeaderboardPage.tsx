import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function LeaderboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  const topUsers = [
    { rank: 1, name: 'Rahul Kumar', score: 2450, downloads: 156, quizzes: 48 },
    { rank: 2, name: 'Priya Sharma', score: 2380, downloads: 142, quizzes: 45 },
    { rank: 3, name: 'Amit Patel', score: 2310, downloads: 138, quizzes: 43 },
    { rank: 4, name: 'Sneha Reddy', score: 2240, downloads: 134, quizzes: 41 },
    { rank: 5, name: 'Vikram Singh', score: 2180, downloads: 128, quizzes: 39 },
    { rank: 6, name: 'Anjali Gupta', score: 2120, downloads: 124, quizzes: 38 },
    { rank: 7, name: 'Rohan Mehta', score: 2050, downloads: 118, quizzes: 36 },
    { rank: 8, name: 'Pooja Verma', score: 1980, downloads: 112, quizzes: 34 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">Compete with fellow students and climb the ranks</p>
        </div>

        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Rank</CardTitle>
                <CardDescription>Keep learning to improve your position</CardDescription>
              </div>
              <Badge className="text-lg px-4 py-2">#12</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">1850</p>
                <p className="text-sm text-muted-foreground">Total Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">98</p>
                <p className="text-sm text-muted-foreground">Downloads</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">28</p>
                <p className="text-sm text-muted-foreground">Quizzes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            {topUsers.map((user) => (
              <Card key={user.rank} className={user.rank <= 3 ? 'border-2 border-primary/30' : ''}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex items-center justify-center">{getRankIcon(user.rank)}</div>
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{user.name}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{user.downloads} downloads</span>
                        <span>{user.quizzes} quizzes</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{user.score}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Monthly leaderboard data will be displayed here
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alltime" className="space-y-4">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                All-time leaderboard data will be displayed here
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

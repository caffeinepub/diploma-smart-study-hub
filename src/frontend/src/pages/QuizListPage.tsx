import { useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';

export default function QuizListPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  const quizzes = [
    { id: '1', title: 'Data Structures Quiz', subject: 'Computer Science', questions: 10, duration: 15, completed: true, score: 85 },
    { id: '2', title: 'Digital Electronics', subject: 'Electronics', questions: 15, duration: 20, completed: false },
    { id: '3', title: 'Thermodynamics Basics', subject: 'Mechanical', questions: 12, duration: 18, completed: true, score: 92 },
    { id: '4', title: 'Database Management', subject: 'Computer Science', questions: 20, duration: 25, completed: false },
  ];

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Daily Quizzes</h1>
          <p className="text-muted-foreground">Test your knowledge and track your progress</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <CardDescription className="mt-1">{quiz.subject}</CardDescription>
                  </div>
                  {quiz.completed ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {quiz.score}%
                    </Badge>
                  ) : (
                    <Badge variant="outline">New</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{quiz.questions} questions</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {quiz.duration} min
                  </span>
                </div>
                <Button asChild className="w-full" variant={quiz.completed ? 'outline' : 'default'}>
                  <Link to="/quiz/$quizId" params={{ quizId: quiz.id }}>
                    {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

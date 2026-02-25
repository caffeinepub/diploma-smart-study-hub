import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

const mockQuizzes = [
  { id: '1', title: 'Data Structures Quiz', subject: 'CSE', questions: 20, duration: 30, completed: true, score: 85 },
  { id: '2', title: 'Algorithms Basics', subject: 'CSE', questions: 15, duration: 20, completed: false },
  { id: '3', title: 'Digital Electronics', subject: 'ECE', questions: 25, duration: 35, completed: true, score: 92 },
  { id: '4', title: 'Thermodynamics Fundamentals', subject: 'MECH', questions: 20, duration: 30, completed: false },
];

export default function QuizListPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Quizzes</h1>
          <p className="text-muted-foreground">Test your knowledge with subject-specific quizzes</p>
        </div>

        <div className="grid gap-4">
          {mockQuizzes.map((quiz) => (
            <Card key={quiz.id} className="border-2 hover:border-primary/50 transition-all">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                      {quiz.completed && (
                        <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{quiz.subject}</span>
                      <span>{quiz.questions} questions</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {quiz.duration} min
                      </span>
                      {quiz.completed && quiz.score && (
                        <span className="text-green-600 font-medium">Score: {quiz.score}%</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate({ to: '/dashboard' })}
                  variant={quiz.completed ? 'outline' : 'default'}
                  size="sm"
                >
                  {quiz.completed ? 'Retake' : 'Start Quiz'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

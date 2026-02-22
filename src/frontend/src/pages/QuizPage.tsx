import { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';

export default function QuizPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { quizId } = useParams({ from: '/quiz/$quizId' });

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Structures Quiz</CardTitle>
                <CardDescription>Question 1 of 10</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">14:32</p>
                <p className="text-xs text-muted-foreground">Time remaining</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={10} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">What is the time complexity of binary search?</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="option-1">
              <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <RadioGroupItem value="option-1" id="option-1" />
                <Label htmlFor="option-1" className="flex-1 cursor-pointer">O(n)</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <RadioGroupItem value="option-2" id="option-2" />
                <Label htmlFor="option-2" className="flex-1 cursor-pointer">O(log n)</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <RadioGroupItem value="option-3" id="option-3" />
                <Label htmlFor="option-3" className="flex-1 cursor-pointer">O(n²)</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <RadioGroupItem value="option-4" id="option-4" />
                <Label htmlFor="option-4" className="flex-1 cursor-pointer">O(1)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1">Previous</Button>
          <Button className="flex-1">Next Question</Button>
        </div>
      </div>
    </div>
  );
}

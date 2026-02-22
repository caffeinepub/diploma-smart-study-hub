import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Award, Download, Calendar } from 'lucide-react';

export default function CertificatesPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  const certificates = [
    { id: 1, title: 'Data Structures Mastery', date: '2026-02-15', type: 'Course Completion' },
    { id: 2, title: 'Quiz Champion - Week 7', date: '2026-02-10', type: 'Achievement' },
    { id: 3, title: 'Active Learner - January', date: '2026-02-01', type: 'Monthly Award' },
  ];

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
          <p className="text-muted-foreground">Your earned achievements and milestones</p>
        </div>

        {certificates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {certificates.map((cert) => (
              <Card key={cert.id} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline">{cert.type}</Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">{cert.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Earned on {new Date(cert.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
              <p className="text-muted-foreground mb-6">
                Complete courses, ace quizzes, and stay active to earn certificates
              </p>
              <Button onClick={() => navigate({ to: '/quizzes' })}>Take a Quiz</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

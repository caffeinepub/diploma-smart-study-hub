import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Award, Download, Star } from 'lucide-react';

const mockCertificates = [
  { id: '1', title: 'Data Structures Mastery', date: '2024-01-15', score: 92 },
  { id: '2', title: 'Algorithms Expert', date: '2024-02-20', score: 88 },
  { id: '3', title: 'Database Systems Pro', date: '2024-03-10', score: 95 },
];

export default function CertificatesPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Certificates</h1>
          <p className="text-muted-foreground">Your earned certificates and achievements</p>
        </div>

        {mockCertificates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Award className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Complete quizzes and courses to earn certificates
              </p>
              <Button onClick={() => navigate({ to: '/branches' })}>
                Start Learning
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockCertificates.map((cert) => (
              <Card key={cert.id} className="border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                  <CardDescription>
                    Earned on {new Date(cert.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{cert.score}% Score</span>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

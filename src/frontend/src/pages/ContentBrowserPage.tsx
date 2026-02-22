import { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FileText, Video, Link as LinkIcon, Download, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function ContentBrowserPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { branch } = useParams({ from: '/content/$branch' });

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  const branchNames: Record<string, string> = {
    cse: 'Computer Science Engineering',
    ece: 'Electronics & Communication',
    eee: 'Electrical & Electronics',
    mech: 'Mechanical Engineering',
    civil: 'Civil Engineering',
    other: 'Other Branches',
  };

  const semesters = [
    { id: '1', name: 'Semester 1', subjects: 5 },
    { id: '2', name: 'Semester 2', subjects: 6 },
    { id: '3', name: 'Semester 3', subjects: 6 },
    { id: '4', name: 'Semester 4', subjects: 5 },
    { id: '5', name: 'Semester 5', subjects: 6 },
    { id: '6', name: 'Semester 6', subjects: 5 },
  ];

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{branchNames[branch] || 'Branch'}</h1>
          <p className="text-muted-foreground">Select a semester to view study materials</p>
        </div>

        <Tabs defaultValue="1" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {semesters.map((sem) => (
              <TabsTrigger key={sem.id} value={sem.id}>
                Sem {sem.id}
              </TabsTrigger>
            ))}
          </TabsList>

          {semesters.map((sem) => (
            <TabsContent key={sem.id} value={sem.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{sem.name}</CardTitle>
                  <CardDescription>{sem.subjects} subjects available</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {['Data Structures', 'Digital Electronics', 'Mathematics III', 'Computer Networks'].map(
                  (subject, i) => (
                    <Card key={i} className="border-2 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{subject}</CardTitle>
                          <Badge>12 chapters</Badge>
                        </div>
                        <CardDescription>Complete study materials and resources</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="p-3 rounded-lg bg-muted">
                            <FileText className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="font-medium">24 PDFs</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <Video className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="font-medium">8 Videos</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <LinkIcon className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="font-medium">5 Links</p>
                          </div>
                        </div>
                        <Button className="w-full">View Chapters</Button>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

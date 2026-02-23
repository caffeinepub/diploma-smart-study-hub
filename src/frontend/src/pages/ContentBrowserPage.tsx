import { useEffect } from 'react';
import { useNavigate, useParams, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FileText, Video, Link as LinkIcon, Lock, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useSubscription } from '../hooks/useSubscription';
import { useContentAccess } from '../hooks/useContentAccess';
import { useGetGalleriesByCategory } from '../hooks/useGalleryContent';
import { useIsAdmin } from '../hooks/useAdminCheck';
import LockedContentIndicator from '../components/content/LockedContentIndicator';
import SubscriptionPromptDialog from '../components/content/SubscriptionPromptDialog';
import GalleryGrid from '../components/content/GalleryGrid';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function ContentBrowserPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { branch } = useParams({ from: '/content/$branch' });
  const { isActive, isLoading } = useSubscription();
  const { isAccessible, handleContentClick, showPromptDialog, setShowPromptDialog } = useContentAccess();
  const { isAdmin } = useIsAdmin();

  // Example: fetch galleries for a specific category
  const { data: galleries = [] } = useGetGalleriesByCategory(branch, '1', 'Data Structures', 'Chapter 1');

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

  const subjects = [
    { id: 'ds', name: 'Data Structures', chapters: 8 },
    { id: 'algo', name: 'Algorithms', chapters: 10 },
    { id: 'dbms', name: 'Database Management', chapters: 12 },
    { id: 'os', name: 'Operating Systems', chapters: 9 },
    { id: 'networks', name: 'Computer Networks', chapters: 11 },
  ];

  const chapters = [
    { id: '1', name: 'Chapter 1: Introduction', items: 15 },
    { id: '2', name: 'Chapter 2: Fundamentals', items: 20 },
    { id: '3', name: 'Chapter 3: Advanced Topics', items: 18 },
    { id: '4', name: 'Chapter 4: Applications', items: 22 },
  ];

  const contentItems = {
    pdfs: [
      { id: '1', name: 'Introduction to Data Structures.pdf', size: '2.5 MB' },
      { id: '2', name: 'Arrays and Linked Lists.pdf', size: '3.1 MB' },
      { id: '3', name: 'Stacks and Queues.pdf', size: '2.8 MB' },
    ],
    notes: [
      { id: '1', name: 'Quick Reference Notes.pdf', size: '1.2 MB' },
      { id: '2', name: 'Important Formulas.pdf', size: '0.8 MB' },
    ],
    videos: [
      { id: '1', name: 'Lecture 1: Introduction', duration: '45:30' },
      { id: '2', name: 'Lecture 2: Arrays', duration: '52:15' },
    ],
    links: [
      { id: '1', name: 'Official Documentation', url: 'https://example.com' },
      { id: '2', name: 'Practice Problems', url: 'https://example.com' },
    ],
  };

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight">
              {branchNames[branch] || 'Content Browser'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse and access study materials organized by semester, subject, and chapter
            </p>
          </div>
          {!isAdmin && !isLoading && !isActive && (
            <Button asChild variant="default" size="lg" className="rounded-full shadow-warm">
              <Link to="/subscription">
                <Lock className="h-4 w-4 mr-2" />
                Subscribe to Unlock
              </Link>
            </Button>
          )}
        </div>

        {!isAdmin && !isLoading && !isActive && (
          <Alert className="border-2 border-warning bg-warning/10">
            <Lock className="h-5 w-5 text-warning" />
            <AlertDescription className="text-base">
              Subscribe for just ₹5/week to unlock all study materials across all branches, semesters, and subjects.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Semesters</CardTitle>
              <CardDescription>Select a semester to view subjects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {semesters.map((semester) => (
                <Button
                  key={semester.id}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => handleContentClick()}
                >
                  <span>{semester.name}</span>
                  <Badge variant="secondary">{semester.subjects} subjects</Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>Select a subject to view chapters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {subjects.map((subject) => (
                <Button
                  key={subject.id}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => handleContentClick()}
                >
                  <span>{subject.name}</span>
                  <Badge variant="secondary">{subject.chapters} chapters</Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Chapters</CardTitle>
              <CardDescription>Select a chapter to view content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {chapters.map((chapter) => (
                <Button
                  key={chapter.id}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => handleContentClick()}
                >
                  <span className="text-left">{chapter.name}</span>
                  <Badge variant="secondary">{chapter.items} items</Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Content Library
              {!isAccessible && !isAdmin && <Lock className="h-5 w-5 text-muted-foreground" />}
            </CardTitle>
            <CardDescription>
              Access PDFs, notes, videos, important links, and galleries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pdfs" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="pdfs">
                  <FileText className="h-4 w-4 mr-2" />
                  PDFs
                </TabsTrigger>
                <TabsTrigger value="notes">
                  <FileText className="h-4 w-4 mr-2" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="videos">
                  <Video className="h-4 w-4 mr-2" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="links">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Links
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pdfs" className="space-y-4 mt-6">
                {contentItems.pdfs.map((pdf) => {
                  const content = (
                    <Card
                      className={`border ${isAccessible || isAdmin ? 'hover:border-primary cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => handleContentClick()}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{pdf.name}</p>
                            <p className="text-sm text-muted-foreground">{pdf.size}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  );

                  if (!isAccessible && !isAdmin) {
                    return (
                      <div key={pdf.id}>
                        <LockedContentIndicator contentType="PDF">{content}</LockedContentIndicator>
                      </div>
                    );
                  }

                  return <div key={pdf.id}>{content}</div>;
                })}
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-6">
                {contentItems.notes.map((note) => {
                  const content = (
                    <Card
                      className={`border ${isAccessible || isAdmin ? 'hover:border-primary cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => handleContentClick()}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-medium">{note.name}</p>
                            <p className="text-sm text-muted-foreground">{note.size}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  );

                  if (!isAccessible && !isAdmin) {
                    return (
                      <div key={note.id}>
                        <LockedContentIndicator contentType="Notes">{content}</LockedContentIndicator>
                      </div>
                    );
                  }

                  return <div key={note.id}>{content}</div>;
                })}
              </TabsContent>

              <TabsContent value="videos" className="space-y-4 mt-6">
                {contentItems.videos.map((video) => {
                  const content = (
                    <Card
                      className={`border ${isAccessible || isAdmin ? 'hover:border-primary cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => handleContentClick()}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <Video className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium">{video.name}</p>
                            <p className="text-sm text-muted-foreground">{video.duration}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          Watch
                        </Button>
                      </CardContent>
                    </Card>
                  );

                  if (!isAccessible && !isAdmin) {
                    return (
                      <div key={video.id}>
                        <LockedContentIndicator contentType="Video">{content}</LockedContentIndicator>
                      </div>
                    );
                  }

                  return <div key={video.id}>{content}</div>;
                })}
              </TabsContent>

              <TabsContent value="links" className="space-y-4 mt-6">
                {contentItems.links.map((link) => {
                  const content = (
                    <Card
                      className={`border ${isAccessible || isAdmin ? 'hover:border-primary cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => handleContentClick()}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <LinkIcon className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{link.name}</p>
                            <p className="text-sm text-muted-foreground">{link.url}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          Open
                        </Button>
                      </CardContent>
                    </Card>
                  );

                  if (!isAccessible && !isAdmin) {
                    return (
                      <div key={link.id}>
                        <LockedContentIndicator contentType="Link">{content}</LockedContentIndicator>
                      </div>
                    );
                  }

                  return <div key={link.id}>{content}</div>;
                })}
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <GalleryGrid
                  galleries={galleries}
                  isAccessible={isAccessible}
                  onLockedClick={() => setShowPromptDialog(true)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {!isAdmin && <SubscriptionPromptDialog open={showPromptDialog} onOpenChange={setShowPromptDialog} />}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAdminCheck';
import { useGetGalleriesByCategory } from '../../hooks/useGalleryContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import GalleryUploadSection from '../../components/admin/GalleryUploadSection';
import GalleryPreviewGrid from '../../components/admin/GalleryPreviewGrid';

const BRANCHES = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];
const SEMESTERS = ['1', '2', '3', '4', '5', '6'];
const SUBJECTS: Record<string, string[]> = {
  CSE: ['Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems', 'Computer Networks'],
  ECE: ['Digital Electronics', 'Signals and Systems', 'Communication Systems', 'Microprocessors'],
  MECH: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Processes'],
  CIVIL: ['Structural Analysis', 'Concrete Technology', 'Surveying', 'Geotechnical Engineering'],
  EEE: ['Electrical Machines', 'Power Systems', 'Control Systems', 'Electrical Circuits'],
};

export default function ContentManagementPage() {
  const { identity } = useInternetIdentity();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();

  const [selectedBranch, setSelectedBranch] = useState<string>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<string>('1');
  const [selectedSubject, setSelectedSubject] = useState<string>('Data Structures');
  const [selectedChapter, setSelectedChapter] = useState<string>('Chapter 1');

  const { data: galleries = [], isLoading: galleriesLoading } = useGetGalleriesByCategory(
    selectedBranch,
    selectedSemester,
    selectedSubject,
    selectedChapter
  );

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  useEffect(() => {
    if (!adminLoading && identity && !isAdmin) {
      toast.error('Access Denied', {
        description: 'You do not have admin permissions to access this page.',
      });
      navigate({ to: '/dashboard' });
    }
  }, [isAdmin, adminLoading, identity, navigate]);

  useEffect(() => {
    // Update subject when branch changes
    const subjects = SUBJECTS[selectedBranch] || [];
    if (subjects.length > 0 && !subjects.includes(selectedSubject)) {
      setSelectedSubject(subjects[0]);
    }
  }, [selectedBranch, selectedSubject]);

  if (!identity || adminLoading) return null;

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access Denied: You do not have admin permissions to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const availableSubjects = SUBJECTS[selectedBranch] || [];

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Admin Mode Banner */}
        <div className="rounded-lg bg-accent/10 border-2 border-accent p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-accent-foreground">Admin Mode Active</h2>
              <p className="text-sm text-muted-foreground">You have full administrative access to manage content</p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Upload and manage study materials</p>
        </div>

        {/* Category Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Select Category</CardTitle>
            <CardDescription>Choose the branch, semester, subject, and chapter for content management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chapter">Chapter</Label>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger id="chapter">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={`Chapter ${num}`}>
                        Chapter {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="pdfs">PDFs</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            <GalleryUploadSection
              branch={selectedBranch}
              semester={selectedSemester}
              subject={selectedSubject}
              chapter={selectedChapter}
            />

            <Card>
              <CardHeader>
                <CardTitle>Existing Galleries</CardTitle>
                <CardDescription>
                  View and manage galleries for {selectedBranch} - Semester {selectedSemester} - {selectedSubject} - {selectedChapter}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {galleriesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading galleries...</div>
                ) : (
                  <GalleryPreviewGrid galleries={galleries} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdfs">
            <Card>
              <CardHeader>
                <CardTitle>PDF Management</CardTitle>
                <CardDescription>Upload and manage PDF study materials</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">PDF upload functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Video Management</CardTitle>
                <CardDescription>Upload and manage video lectures</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Video upload functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle>Link Management</CardTitle>
                <CardDescription>Add and manage important links</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Link management functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

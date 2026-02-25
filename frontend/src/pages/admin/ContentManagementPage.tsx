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
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];
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
                <Label>Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((sem) => (
                      <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chapter</Label>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5'].map((ch) => (
                      <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="gallery">
          <TabsList>
            <TabsTrigger value="gallery">Gallery Upload</TabsTrigger>
            <TabsTrigger value="preview">Preview Content</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-6">
            <GalleryUploadSection
              branch={selectedBranch}
              semester={selectedSemester}
              subject={selectedSubject}
              chapter={selectedChapter}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            {galleriesLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading galleries...</div>
            ) : galleries.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">No galleries found for the selected category.</p>
                </CardContent>
              </Card>
            ) : (
              <GalleryPreviewGrid galleries={galleries} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

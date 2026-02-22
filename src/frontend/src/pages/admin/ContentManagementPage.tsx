import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Upload, FileText, Video, Link as LinkIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function ContentManagementPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Upload and organize study materials</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Content</TabsTrigger>
            <TabsTrigger value="manage">Manage Content</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Content</CardTitle>
                <CardDescription>Add PDFs, notes, videos, or links to the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cse">Computer Science</SelectItem>
                        <SelectItem value="ece">Electronics & Communication</SelectItem>
                        <SelectItem value="eee">Electrical & Electronics</SelectItem>
                        <SelectItem value="mech">Mechanical</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g., Data Structures" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chapter">Chapter</Label>
                    <Input id="chapter" placeholder="e.g., Chapter 3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Content Title</Label>
                  <Input id="title" placeholder="e.g., Arrays and Linked Lists" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of the content..." rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Content Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="video">Video Link</SelectItem>
                      <SelectItem value="link">Important Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File / Enter URL</Label>
                  <Input id="file" type="file" />
                  <Input id="url" placeholder="Or paste URL here..." className="mt-2" />
                </div>

                <Button className="w-full" size="lg">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Manage your uploaded content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: 'Data Structures - Arrays', type: 'PDF', branch: 'CSE', date: 'Today' },
                    { title: 'Digital Logic Video', type: 'Video', branch: 'ECE', date: 'Yesterday' },
                    { title: 'Thermodynamics Notes', type: 'Notes', branch: 'MECH', date: '2 days ago' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {item.type === 'PDF' && <FileText className="h-5 w-5 text-primary" />}
                          {item.type === 'Video' && <Video className="h-5 w-5 text-primary" />}
                          {item.type === 'Notes' && <FileText className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.branch} • {item.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

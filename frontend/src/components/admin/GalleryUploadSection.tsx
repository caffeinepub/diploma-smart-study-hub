import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Upload, X, Loader2, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { useCreateGallery, useUploadGalleryImages, useUploadGalleryVideos } from '../../hooks/useGalleryManagement';
import { toast } from 'sonner';
import type { GalleryImage, GalleryVideo } from '../../backend';
import { ExternalBlob } from '../../backend';
import { validateVideoSize, validateVideoType } from '../../utils/fileValidation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface GalleryUploadSectionProps {
  branch: string;
  semester: string;
  subject: string;
  chapter: string;
}

export default function GalleryUploadSection({
  branch,
  semester,
  subject,
  chapter,
}: GalleryUploadSectionProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const createGallery = useCreateGallery();
  const uploadImages = useUploadGalleryImages();
  const uploadVideos = useUploadGalleryVideos();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    );

    if (imageFiles.length !== files.length) {
      toast.error('Only JPEG, PNG, and WebP images are supported');
    }

    const validFiles = imageFiles.filter((file) => file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== imageFiles.length) {
      toast.error('Some files exceed 10MB size limit');
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validVideos: File[] = [];

    for (const file of files) {
      const typeValidation = validateVideoType(file);
      if (!typeValidation.valid) {
        toast.error(typeValidation.error || 'Invalid video type');
        continue;
      }

      const sizeValidation = validateVideoSize(file);
      if (!sizeValidation.valid) {
        toast.error(sizeValidation.error || 'Video too large');
        continue;
      }

      validVideos.push(file);
    }

    setSelectedVideos((prev) => [...prev, ...validVideos]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error('Please enter a gallery title');
      return;
    }

    if (selectedImages.length === 0 && selectedVideos.length === 0) {
      toast.error('Please select at least one image or video');
      return;
    }

    try {
      const galleryId = await createGallery.mutateAsync({
        title,
        description,
        branch,
        semester,
        subject,
        chapter,
      });

      // Upload images
      if (selectedImages.length > 0) {
        const galleryImages: GalleryImage[] = await Promise.all(
          selectedImages.map(async (file, index) => {
            const arrayBuffer = await file.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);

            setUploadProgress((prev) => ({ ...prev, [file.name]: 50 }));

            return {
              id: `${galleryId}_img_${index}_${Date.now()}`,
              blob: bytes,
              fileName: file.name,
            };
          })
        );

        await uploadImages.mutateAsync({ galleryId, images: galleryImages });
      }

      // Upload videos
      if (selectedVideos.length > 0) {
        const galleryVideos: GalleryVideo[] = await Promise.all(
          selectedVideos.map(async (file, index) => {
            const arrayBuffer = await file.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);

            const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
              setUploadProgress((prev) => ({ ...prev, [file.name]: percentage }));
            });

            return {
              id: `${galleryId}_vid_${index}_${Date.now()}`,
              blob: externalBlob,
              fileName: file.name,
            };
          })
        );

        await uploadVideos.mutateAsync({ galleryId, videos: galleryVideos });
      }

      setTitle('');
      setDescription('');
      setSelectedImages([]);
      setSelectedVideos([]);
      setUploadProgress({});
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const isUploading = createGallery.isPending || uploadImages.isPending || uploadVideos.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Gallery Content</CardTitle>
        <CardDescription>
          Create a new gallery and upload images and videos for {branch} - Semester {semester} - {subject} - {chapter}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="gallery-title">Gallery Title *</Label>
          <Input
            id="gallery-title"
            placeholder="e.g., Circuit Diagrams, Lab Equipment, etc."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gallery-description">Description</Label>
          <Textarea
            id="gallery-description"
            placeholder="Brief description of the gallery content..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isUploading}
            rows={3}
          />
        </div>

        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="images">
              <ImageIcon className="h-4 w-4 mr-2" />
              Images ({selectedImages.length})
            </TabsTrigger>
            <TabsTrigger value="videos">
              <VideoIcon className="h-4 w-4 mr-2" />
              Videos ({selectedVideos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="gallery-images"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                <label htmlFor="gallery-images" className="cursor-pointer">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Click to upload images</p>
                  <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP (max 10MB each)</p>
                </label>
              </div>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                    {uploadProgress[file.name] !== undefined && (
                      <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Videos</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="gallery-videos"
                  multiple
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                <label htmlFor="gallery-videos" className="cursor-pointer">
                  <VideoIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Click to upload videos</p>
                  <p className="text-xs text-muted-foreground">MP4, WebM, or MOV (max 100MB each)</p>
                </label>
              </div>
            </div>

            {selectedVideos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedVideos.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <VideoIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveVideo(index)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                    {uploadProgress[file.name] !== undefined && (
                      <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Button onClick={handleUpload} disabled={isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Gallery
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

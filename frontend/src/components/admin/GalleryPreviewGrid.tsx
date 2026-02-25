import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { useDeleteGallery, useDeleteGalleryImage, useDeleteGalleryVideo } from '../../hooks/useGalleryManagement';
import type { Gallery } from '../../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface GalleryPreviewGridProps {
  galleries: Gallery[];
}

export default function GalleryPreviewGrid({ galleries }: GalleryPreviewGridProps) {
  const deleteGallery = useDeleteGallery();
  const deleteImage = useDeleteGalleryImage();
  const deleteVideo = useDeleteGalleryVideo();

  if (galleries.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No galleries found for the selected category
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {galleries.map((gallery) => {
        const totalItems = gallery.images.length + gallery.videos.length;
        
        return (
          <Card key={gallery.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{gallery.title}</CardTitle>
                  <CardDescription>{gallery.description}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    {gallery.images.length} image{gallery.images.length !== 1 ? 's' : ''}, {gallery.videos.length} video{gallery.videos.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Gallery
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Gallery</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{gallery.title}"? This will remove all {totalItems} items. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteGallery.mutate(gallery.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gallery.images.map((image) => {
                  const imageUrl = `data:image/jpeg;base64,${btoa(
                    String.fromCharCode(...new Uint8Array(image.blob))
                  )}`;

                  return (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={imageUrl}
                          alt={image.fileName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Image</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this image? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteImage.mutate({ galleryId: gallery.id, imageId: image.id })
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{image.fileName}</p>
                    </div>
                  );
                })}

                {gallery.videos.map((video) => {
                  const videoUrl = video.blob.getDirectURL();

                  return (
                    <div key={video.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <video
                            src={videoUrl}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <VideoIcon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Video</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this video? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteVideo.mutate({ galleryId: gallery.id, videoId: video.id })
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{video.fileName}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Lock, Image as ImageIcon, Video as VideoIcon, Play } from 'lucide-react';
import type { Gallery } from '../../backend';
import MediaLightbox from './MediaLightbox';
import LockedContentIndicator from './LockedContentIndicator';
import { useIsAdmin } from '../../hooks/useAdminCheck';
import { useSubscription } from '../../hooks/useSubscription';

interface GalleryGridProps {
  galleries: Gallery[];
  isAccessible: boolean;
  onLockedClick: () => void;
}

type MediaItem = {
  type: 'image' | 'video';
  id: string;
  fileName: string;
  blob?: Uint8Array;
  videoUrl?: string;
};

export default function GalleryGrid({ galleries, isAccessible, onLockedClick }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const { isAdmin } = useIsAdmin();
  const { data: isActive } = useSubscription();

  // Admins and subscribed users always have access
  const hasAccess = isAdmin || isActive === true || isAccessible;

  const handleMediaClick = (gallery: Gallery, mediaIndex: number) => {
    if (!hasAccess) {
      onLockedClick();
      return;
    }
    setCurrentGallery(gallery);
    setCurrentMediaIndex(mediaIndex);
    setLightboxOpen(true);
  };

  if (galleries.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No gallery content available for this chapter</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {galleries.map((gallery) => {
          const mediaItems: MediaItem[] = [
            ...gallery.images.map((img) => ({
              type: 'image' as const,
              id: img.id,
              fileName: img.fileName,
              blob: img.blob,
            })),
            ...gallery.videos.map((vid) => ({
              type: 'video' as const,
              id: vid.id,
              fileName: vid.fileName,
              videoUrl: vid.blob.getDirectURL(),
            })),
          ];

          return (
            <Card key={gallery.id} className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {gallery.title}
                  {!hasAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
                </CardTitle>
                <CardDescription>{gallery.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaItems.map((media, index) => {
                    const mediaContent = (
                      <div
                        className={`relative aspect-square rounded-lg overflow-hidden bg-muted group ${
                          hasAccess ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}
                        onClick={() => handleMediaClick(gallery, index)}
                      >
                        {media.type === 'image' && media.blob ? (
                          <>
                            <img
                              src={`data:image/jpeg;base64,${btoa(
                                String.fromCharCode(...new Uint8Array(media.blob))
                              )}`}
                              alt={media.fileName}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            {hasAccess && (
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </>
                        ) : media.type === 'video' && media.videoUrl ? (
                          <>
                            <video
                              src={media.videoUrl}
                              className="w-full h-full object-cover"
                              preload="metadata"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="bg-white/90 rounded-full p-3">
                                <Play className="h-6 w-6 text-primary fill-primary" />
                              </div>
                            </div>
                            {hasAccess && (
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                            )}
                          </>
                        ) : null}
                      </div>
                    );

                    if (!hasAccess) {
                      return (
                        <div key={media.id} onClick={onLockedClick}>
                          <LockedContentIndicator contentType="Gallery">
                            {mediaContent}
                          </LockedContentIndicator>
                        </div>
                      );
                    }

                    return <div key={media.id}>{mediaContent}</div>;
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {currentGallery && (
        <MediaLightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          gallery={currentGallery}
          currentIndex={currentMediaIndex}
          onIndexChange={setCurrentMediaIndex}
        />
      )}
    </>
  );
}

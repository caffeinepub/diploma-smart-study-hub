import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import type { Gallery } from '../../backend';

interface MediaLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gallery: Gallery;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

type MediaItem = {
  type: 'image' | 'video';
  id: string;
  fileName: string;
  blob?: Uint8Array;
  videoUrl?: string;
};

export default function MediaLightbox({
  open,
  onOpenChange,
  gallery,
  currentIndex,
  onIndexChange,
}: MediaLightboxProps) {
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

  const currentMedia = mediaItems[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onOpenChange(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex]);

  const handlePrevious = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0);
  };

  const handleDownload = () => {
    if (!currentMedia) return;
    
    if (currentMedia.type === 'image' && currentMedia.blob) {
      const imageUrl = `data:image/jpeg;base64,${btoa(
        String.fromCharCode(...new Uint8Array(currentMedia.blob))
      )}`;
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = currentMedia.fileName;
      link.click();
    } else if (currentMedia.type === 'video' && currentMedia.videoUrl) {
      const link = document.createElement('a');
      link.href = currentMedia.videoUrl;
      link.download = currentMedia.fileName;
      link.click();
    }
  };

  if (!currentMedia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{gallery.title}</p>
              <p className="text-sm text-muted-foreground">
                {currentIndex + 1} of {mediaItems.length} - {currentMedia.fileName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 flex items-center justify-center p-6 bg-muted/30">
          {currentMedia.type === 'image' && currentMedia.blob ? (
            <img
              src={`data:image/jpeg;base64,${btoa(
                String.fromCharCode(...new Uint8Array(currentMedia.blob))
              )}`}
              alt={currentMedia.fileName}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : currentMedia.type === 'video' && currentMedia.videoUrl ? (
            <video
              src={currentMedia.videoUrl}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg"
              controlsList="nodownload"
            />
          ) : null}

          {mediaItems.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

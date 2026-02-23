import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PdfPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file?: File;
  url?: string;
  title?: string;
}

export default function PdfPreviewDialog({ open, onOpenChange, file, url, title }: PdfPreviewDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (url) {
      setPreviewUrl(url);
    }
  }, [file, url]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title || 'PDF Preview'}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {previewUrl ? (
            <iframe src={previewUrl} className="w-full h-full border-0" title="PDF Preview" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No preview available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

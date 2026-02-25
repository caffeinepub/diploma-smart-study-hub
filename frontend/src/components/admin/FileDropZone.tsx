import { useCallback, useState } from 'react';
import { Card } from '../ui/card';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileDropZoneProps {
  onFilesAccepted: (files: File[]) => void;
  acceptedFileTypes?: string[];
  multiple?: boolean;
  maxSizeMB?: number;
}

export default function FileDropZone({
  onFilesAccepted,
  acceptedFileTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
  multiple = true,
  maxSizeMB = 50,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = useCallback(
    (files: File[]): { accepted: File[]; rejected: File[] } => {
      const accepted: File[] = [];
      const rejected: File[] = [];

      files.forEach((file) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        const sizeMB = file.size / (1024 * 1024);

        if (!extension || !acceptedFileTypes.includes(extension)) {
          rejected.push(file);
        } else if (sizeMB > maxSizeMB) {
          rejected.push(file);
        } else {
          accepted.push(file);
        }
      });

      return { accepted, rejected };
    },
    [acceptedFileTypes, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const { accepted, rejected } = validateFiles(files);

      if (accepted.length > 0) {
        onFilesAccepted(accepted);
      }

      if (rejected.length > 0) {
        console.warn(`${rejected.length} files rejected due to type or size constraints`);
      }
    },
    [onFilesAccepted, validateFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const { accepted } = validateFiles(files);

      if (accepted.length > 0) {
        onFilesAccepted(accepted);
      }
    },
    [onFilesAccepted, validateFiles]
  );

  return (
    <Card
      className={cn(
        'border-2 border-dashed transition-all cursor-pointer hover:border-primary/50',
        isDragging && 'border-primary bg-primary/5'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
        <Upload className={cn('h-12 w-12 mb-4 text-muted-foreground', isDragging && 'text-primary')} />
        <p className="text-lg font-medium mb-2">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
        <p className="text-xs text-muted-foreground">
          Accepted: {acceptedFileTypes.join(', ')} • Max size: {maxSizeMB}MB
        </p>
        <input
          type="file"
          className="hidden"
          multiple={multiple}
          accept={acceptedFileTypes.map((type) => `.${type}`).join(',')}
          onChange={handleFileInput}
        />
      </label>
    </Card>
  );
}

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { formatFileSize, formatUploadSpeed } from '../../utils/fileValidation';
import type { FileUploadItem } from '../../hooks/useFileUpload';

interface UploadProgressItemProps {
  item: FileUploadItem;
  onRetry?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function UploadProgressItem({ item, onRetry, onRemove }: UploadProgressItemProps) {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'uploading':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />;
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="flex-shrink-0">{getStatusIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.file.name}</p>
        <p className="text-sm text-muted-foreground">{formatFileSize(item.file.size)}</p>
        {item.status === 'uploading' && (
          <div className="mt-2 space-y-1">
            <Progress value={item.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{item.progress}%</span>
              <span>{formatUploadSpeed(item.speed)}</span>
            </div>
          </div>
        )}
        {item.status === 'error' && (
          <p className="text-sm text-destructive mt-1">{item.error || 'Upload failed'}</p>
        )}
      </div>
      <div className="flex gap-2">
        {item.status === 'error' && onRetry && (
          <Button variant="outline" size="sm" onClick={() => onRetry(item.id)}>
            Retry
          </Button>
        )}
        {(item.status === 'pending' || item.status === 'error') && onRemove && (
          <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

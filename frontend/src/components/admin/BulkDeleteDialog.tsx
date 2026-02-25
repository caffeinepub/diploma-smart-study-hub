import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { AlertTriangle } from 'lucide-react';

interface BulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Array<{ id: string; name: string; itemCount: number }>;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function BulkDeleteDialog({
  open,
  onOpenChange,
  categories,
  onConfirm,
  isLoading,
}: BulkDeleteDialogProps) {
  const totalItems = categories.reduce((sum, cat) => sum + cat.itemCount, 0);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <p>
              You are about to delete <strong>{categories.length}</strong> categories containing a total of{' '}
              <strong>{totalItems}</strong> items. This action cannot be undone.
            </p>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Categories to be deleted:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge key={cat.id} variant="destructive">
                    {cat.name} ({cat.itemCount} items)
                  </Badge>
                ))}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
            {isLoading ? 'Deleting...' : 'Delete All'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

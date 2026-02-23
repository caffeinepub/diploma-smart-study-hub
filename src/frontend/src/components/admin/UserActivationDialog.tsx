import { useState } from 'react';
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
import { Button } from '../ui/button';
import { UserCheck, AlertTriangle } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';
import { useUserActivation } from '../../hooks/useUserActivation';

interface UserActivationDialogProps {
  userId: Principal;
  userName: string;
  userEmail?: string;
  isActive: boolean;
}

export default function UserActivationDialog({
  userId,
  userName,
  userEmail,
  isActive,
}: UserActivationDialogProps) {
  const [open, setOpen] = useState(false);
  const activateUser = useUserActivation();

  const handleActivate = async () => {
    try {
      await activateUser.mutateAsync(userId);
      setOpen(false);
    } catch (error) {
      console.error('Activation error:', error);
    }
  };

  if (isActive) {
    return (
      <Button variant="outline" size="sm" disabled className="bg-success/10 text-success border-success">
        <UserCheck className="h-4 w-4 mr-2" />
        Active
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm">
          <UserCheck className="h-4 w-4 mr-2" />
          Activate Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Activate User Account
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">User Details:</p>
              <div className="bg-muted p-3 rounded-lg space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {userName}
                </p>
                {userEmail && (
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {userEmail}
                  </p>
                )}
                <p className="text-sm text-muted-foreground break-all">
                  <span className="font-medium">Principal:</span> {userId.toString()}
                </p>
              </div>
            </div>
            <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Warning:</strong> Activating this account will unlock all study materials including PDFs,
                videos, galleries, quizzes, and important links for this user.
              </p>
            </div>
            <p className="text-sm">Are you sure you want to activate this user's account?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={activateUser.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleActivate}
            disabled={activateUser.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {activateUser.isPending ? 'Activating...' : 'Confirm Activation'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

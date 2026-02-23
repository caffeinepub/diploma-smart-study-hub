import { useState } from 'react';
import { useSubscription } from './useSubscription';
import { useIsAdmin } from './useAdminCheck';

export function useContentAccess() {
  const { isActive, isLoading: subscriptionLoading } = useSubscription();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [showPromptDialog, setShowPromptDialog] = useState(false);

  // Admins always have access, regardless of subscription status
  const isAccessible = isAdmin || isActive;
  const isLoading = subscriptionLoading || adminLoading;

  const handleContentClick = (callback?: () => void) => {
    if (isAccessible) {
      callback?.();
    } else {
      setShowPromptDialog(true);
    }
  };

  return {
    isAccessible,
    isLoading,
    handleContentClick,
    showPromptDialog,
    setShowPromptDialog,
  };
}

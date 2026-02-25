import { useAdminCheck } from './useAdminCheck';
import { useSubscription } from './useSubscription';
import { useInternetIdentity } from './useInternetIdentity';

export function useContentAccess() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useAdminCheck();
  const { data: isSubscribed } = useSubscription();

  const isAuthenticated = !!identity;
  const hasAccess = isAdmin === true || isSubscribed === true;

  return {
    hasAccess,
    isAdmin: isAdmin === true,
    isSubscribed: isSubscribed === true,
    isAuthenticated,
  };
}

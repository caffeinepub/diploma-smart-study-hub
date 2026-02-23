import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useIsAdmin } from '../../hooks/useAdminCheck';
import { useSubscription } from '../../hooks/useSubscription';

interface LockedContentIndicatorProps {
  children: React.ReactNode;
  contentType?: string;
}

export default function LockedContentIndicator({ children, contentType = 'content' }: LockedContentIndicatorProps) {
  const { isAdmin } = useIsAdmin();
  const { isActive } = useSubscription();

  // Don't show lock indicator for admin users or users with active subscription
  if (isAdmin || isActive) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative cursor-not-allowed">
            <div className="opacity-60 pointer-events-none">{children}</div>
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-warning/20 border-2 border-warning flex items-center justify-center">
                <Lock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">Subscribe to unlock {contentType}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileDashboardProps {
  children?: React.ReactNode;
  onRefresh?: () => Promise<void>;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  children,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
            />
          </Button>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="px-4 py-4 space-y-4">{children}</div>
    </div>
  );
};

interface MobileCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
}) => {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
};

export const TouchButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'w-full h-12 text-base font-medium touch-manipulation active:scale-95 transition-transform',
        className
      )}
    >
      {children}
    </Button>
  );
};

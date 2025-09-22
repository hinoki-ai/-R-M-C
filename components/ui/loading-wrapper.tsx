import React from 'react';
import { Skeleton } from './skeleton';

interface DashboardSectionProps {
  isLoading?: boolean;
  type?: string;
  children: React.ReactNode;
}

export function DashboardSection({ isLoading = false, children }: DashboardSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
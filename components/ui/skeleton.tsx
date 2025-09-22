'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      style={style}
    />
  );
}

interface ShimmerProps {
  className?: string;
  children: React.ReactNode;
}

export function Shimmer({ className, children }: ShimmerProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className='absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent' />
      {children}
    </div>
  );
}

// Dashboard-specific skeleton components
export function DashboardCardSkeleton() {
  return (
    <div className='rounded-lg border bg-card p-6'>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[200px]' />
          <Skeleton className='h-4 w-[160px]' />
        </div>
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className='rounded-lg border bg-card p-6'>
      <div className='flex items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-4 w-4 rounded' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-[60px]' />
        <Skeleton className='h-3 w-[140px]' />
      </div>
    </div>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <div className='rounded-lg border bg-card p-6'>
      <div className='space-y-4'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-2 flex-1'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-3 w-3/4' />
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-2 flex-1'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-3 w-2/3' />
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-2 flex-1'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-3 w-4/5' />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CameraFeedSkeleton() {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <div className='aspect-video rounded-lg bg-muted mb-4'>
        <Skeleton className='h-full w-full rounded-lg' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-1/2' />
      </div>
    </div>
  );
}
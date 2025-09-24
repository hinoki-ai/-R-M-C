'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoGridItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  hover?: boolean;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid auto-rows-[minmax(200px,auto)] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  hover = true,
}: BentoGridItemProps) {
  const gridClasses = {
    'col-span-1': colSpan === 1,
    'col-span-2': colSpan === 2,
    'col-span-3': colSpan === 3,
    'col-span-4': colSpan === 4,
    'row-span-1': rowSpan === 1,
    'row-span-2': rowSpan === 2,
    'row-span-3': rowSpan === 3,
    'row-span-4': rowSpan === 4,
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm',
        hover &&
          'hover:shadow-md transition-all duration-300 hover:-translate-y-1',
        gridClasses,
        className
      )}
    >
      {children}
    </div>
  );
}

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Panel } from './panel';

interface CardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  variant?: string;
}

/**
 * Standardized Card component with guaranteed contrast
 *
 * This component uses the 'content' panel variant to ensure proper contrast ratios
 * across all themes for content-heavy cards. Custom background classes
 * are filtered out to prevent contrast issues.
 */
function Card({ className, variant, children, ...props }: CardProps) {
  // Filter out background-related classes that could interfere with panel contrast
  const filteredClassName = className
    ?.split(' ')
    .filter(cls =>
      !cls.startsWith('bg-') &&
      !cls.includes('background') &&
      !cls.includes('card') &&
      cls !== 'border-0' // Allow removing borders but not changing backgrounds
    )
    .join(' ');

  return (
    <Panel
      data-slot="card"
      className={cn(
        'text-card-foreground flex flex-col gap-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5',
        filteredClassName
      )}
      variant="content"
      rounded="xl"
      padding="none"
      {...props}
    >
      {children}
    </Panel>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};

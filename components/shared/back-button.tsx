'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  text?: string;
}

export function BackButton({
  className,
  variant = 'ghost',
  size = 'sm',
  showText = true,
  text = 'Volver',
}: BackButtonProps) {
  const router = useRouter();
  const canGoBack = typeof window !== 'undefined' ? window.history.length > 1 : false;

  if (!canGoBack) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => router.back()}
      className={cn('flex items-center gap-2', className)}
    >
      <ArrowLeft className="h-4 w-4" />
      {showText && <span>{text}</span>}
    </Button>
  );
}

// Hook for programmatic back navigation
export function useBackNavigation() {
  const router = useRouter();
  const canGoBack = typeof window !== 'undefined' ? window.history.length > 1 : false;
  return { goBack: () => router.back(), canGoBack };
}

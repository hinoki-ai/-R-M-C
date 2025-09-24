import { ReactNode } from 'react';
import { LoadingState } from './loading-state';
import { ErrorState } from './error-state';
import { ConvexError } from '@/hooks/use-convex-error-handler';

interface DataStateProps {
  loading?: boolean;
  error?: string | ConvexError | null;
  loadingMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
  className?: string;
  showErrorDetails?: boolean;
}

/**
 * Unified component for handling loading, error, and success states
 * Simplifies data fetching UI patterns across the app
 */
export const DataState = ({
  loading = false,
  error = null,
  loadingMessage = 'Cargando datos...',
  onRetry,
  children,
  className = '',
  showErrorDetails = false,
}: DataStateProps) => {
  if (loading) {
    return <LoadingState message={loadingMessage} className={className} />;
  }

  if (error) {
    // Handle ConvexError objects
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const convexError = error as ConvexError;
      return (
        <ErrorState
          title={convexError.message}
          message={
            showErrorDetails && convexError.originalError
              ? convexError.originalError.message
              : undefined
          }
          onRetry={convexError.retryable ? onRetry : undefined}
          className={className}
        />
      );
    }

    // Handle string errors
    return (
      <ErrorState
        message={typeof error === 'string' ? error : 'Ocurrió un error inesperado'}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  return <>{children}</>;
};

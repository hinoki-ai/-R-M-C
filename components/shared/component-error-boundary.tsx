'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import * as React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { logReactError } from '@/lib/error-logger';

interface ComponentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
  retryCount: number;
}

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    onRetry: () => void;
    onDismiss: () => void;
    errorId: string;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  componentName?: string;
  showErrorDetails?: boolean;
}

// Simple error fallback for components
function DefaultComponentErrorFallback({
  error,
  onRetry,
  onDismiss,
  errorId,
  showErrorDetails = false,
}: {
  error: Error;
  onRetry: () => void;
  onDismiss: () => void;
  errorId: string;
  showErrorDetails?: boolean;
}) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium">Error en el componente</p>
          {showErrorDetails && (
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">ID: {errorId}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="h-8 px-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-8 px-2"
          >
            Ocultar
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export class ComponentErrorBoundary extends React.Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  constructor(props: ComponentErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<ComponentErrorBoundaryState> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, componentName = 'unknown' } = this.props;
    const { errorId } = this.state;

    // Log the error
    logReactError(error, errorInfo, {
      componentName,
      errorId,
      retryCount: this.state.retryCount,
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorId: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  private handleDismiss = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorId) {
      const FallbackComponent =
        this.props.fallback || DefaultComponentErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          onRetry={this.handleRetry}
          onDismiss={this.handleDismiss}
          errorId={this.state.errorId}
          showErrorDetails={this.props.showErrorDetails}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to use error boundaries
export function useComponentErrorBoundary(componentName?: string) {
  const [error, setError] = React.useState<Error | null>(null);
  const [errorId, setErrorId] = React.useState<string | null>(null);

  const captureError = React.useCallback(
    (error: Error) => {
      const id = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setError(error);
      setErrorId(id);

      logReactError(
        error,
        { componentStack: '' },
        {
          componentName: componentName || 'unknown',
          errorId: id,
          hook: 'useComponentErrorBoundary',
        }
      );
    },
    [componentName]
  );

  const resetError = React.useCallback(() => {
    setError(null);
    setErrorId(null);
  }, []);

  // Throw error to be caught by error boundary
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return {
    captureError,
    resetError,
    hasError: !!error,
    errorId,
  };
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ComponentErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ComponentErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ComponentErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

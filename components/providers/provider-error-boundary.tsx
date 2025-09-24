'use client';

import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';
import * as React from 'react';

import {
  ComponentErrorBoundary,
  useComponentErrorBoundary,
} from '@/components/shared/component-error-boundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ProviderErrorBoundaryProps {
  children: React.ReactNode;
  providerName?: string;
  onProviderError?: (error: Error) => void;
  critical?: boolean; // If true, shows more prominent error UI
}

// Specialized error fallback for providers
function ProviderErrorFallback({
  error,
  onRetry,
  onDismiss,
  errorId,
  providerName = 'proveedor',
  critical = false,
}: {
  error: Error;
  onRetry: () => void;
  onDismiss: () => void;
  errorId: string;
  providerName?: string;
  critical?: boolean;
}) {
  if (critical) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <div className="text-center">
            <Settings className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-destructive mb-2">
              Error Crítico del Sistema
            </h1>
            <p className="text-muted-foreground mb-4">
              El {providerName} ha fallado. Esto puede afectar el funcionamiento
              de la aplicación.
            </p>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error.message}
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={onRetry} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
            <Button onClick={onDismiss} variant="outline">
              Continuar de todas formas
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            ID del error: {errorId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium">Error en el {providerName}</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
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

export function ProviderErrorBoundary({
  children,
  providerName = 'proveedor',
  onProviderError,
  critical = false,
}: ProviderErrorBoundaryProps) {
  const handleError = React.useCallback(
    (error: Error, errorInfo: React.ErrorInfo) => {
      if (onProviderError) {
        onProviderError(error);
      }
    },
    [onProviderError]
  );

  return (
    <ComponentErrorBoundary
      componentName={`Provider-${providerName}`}
      onError={handleError}
      fallback={props => (
        <ProviderErrorFallback
          {...props}
          providerName={providerName}
          critical={critical}
        />
      )}
      maxRetries={critical ? 5 : 3}
      showErrorDetails={true}
    >
      {children}
    </ComponentErrorBoundary>
  );
}

// Hook for provider error handling
export function useProviderErrorHandler(providerName?: string) {
  const { captureError, resetError, hasError, errorId } =
    useComponentErrorBoundary(`Provider-${providerName || 'unknown'}`);

  const handleProviderError = React.useCallback(
    (error: Error | string) => {
      const errorObj = typeof error === 'string' ? new Error(error) : error;
      captureError(errorObj);
    },
    [captureError]
  );

  const handleInitializationError = React.useCallback(
    (message: string) => {
      const error = new Error(`Provider initialization failed: ${message}`);
      error.name = 'ProviderInitializationError';
      captureError(error);
    },
    [captureError]
  );

  return {
    handleProviderError,
    handleInitializationError,
    resetError,
    hasError,
    errorId,
    isCriticalError: hasError && errorId ? true : false,
  };
}

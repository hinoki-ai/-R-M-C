'use client';

import { AlertTriangle, RefreshCw, Save, X } from 'lucide-react';
import * as React from 'react';

import {
  ComponentErrorBoundary,
  useComponentErrorBoundary,
} from '@/components/shared/component-error-boundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FormErrorBoundaryProps {
  children: React.ReactNode;
  formName?: string;
  onFormError?: (error: Error) => void;
  showDetailedErrors?: boolean;
}

// Specialized error fallback for forms
function FormErrorFallback({
  error,
  onRetry,
  onDismiss,
  errorId,
  showErrorDetails = false,
  formName = 'formulario',
}: {
  error: Error;
  onRetry: () => void;
  onDismiss: () => void;
  errorId: string;
  showErrorDetails?: boolean;
  formName?: string;
}) {
  const isValidationError =
    error.message.toLowerCase().includes('validation') ||
    error.message.toLowerCase().includes('invalid') ||
    error.message.toLowerCase().includes('required');

  return (
    <Card className="border-destructive/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-lg text-destructive">
            Error en el {formName}
          </CardTitle>
        </div>
        <CardDescription>
          Ocurrió un problema al procesar el formulario. Tus datos están
          seguros.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showErrorDetails && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Detalles del error:</strong> {error.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button onClick={onRetry} variant="default" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
          <Button onClick={onDismiss} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">ID del error: {errorId}</p>
      </CardContent>
    </Card>
  );
}

export function FormErrorBoundary({
  children,
  formName = 'formulario',
  onFormError,
  showDetailedErrors = false,
}: FormErrorBoundaryProps) {
  const handleError = React.useCallback(
    (error: Error, errorInfo: React.ErrorInfo) => {
      if (onFormError) {
        onFormError(error);
      }
    },
    [onFormError]
  );

  return (
    <ComponentErrorBoundary
      componentName={`Form-${formName}`}
      onError={handleError}
      fallback={props => (
        <FormErrorFallback
          {...props}
          showErrorDetails={showDetailedErrors}
          formName={formName}
        />
      )}
      maxRetries={2}
    >
      {children}
    </ComponentErrorBoundary>
  );
}

// Hook for form error handling
export function useFormErrorHandler(formName?: string) {
  const { captureError, resetError, hasError, errorId } =
    useComponentErrorBoundary(`Form-${formName || 'unknown'}`);

  const handleFormError = React.useCallback(
    (error: Error | string) => {
      const errorObj = typeof error === 'string' ? new Error(error) : error;
      captureError(errorObj);
    },
    [captureError]
  );

  const handleValidationError = React.useCallback(
    (field: string, message: string) => {
      const error = new Error(`Validation error in ${field}: ${message}`);
      error.name = 'ValidationError';
      captureError(error);
    },
    [captureError]
  );

  return {
    handleFormError,
    handleValidationError,
    resetError,
    hasError,
    errorId,
    isValidationError: hasError && errorId ? true : false,
  };
}

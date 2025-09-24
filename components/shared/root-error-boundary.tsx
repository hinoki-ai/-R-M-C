'use client';

import {
  AlertTriangle,
  Home,
  RefreshCw,
  Wifi,
  WifiOff,
  Shield,
  Bug,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { logReactError } from '@/lib/error-logger';

// Error types for better categorization
export enum RootErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'auth',
  PERMISSION = 'permission',
  DATA = 'data',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

interface RootErrorInfo {
  type: RootErrorType;
  message: string;
  details?: string;
  recoverable: boolean;
  retryable: boolean;
  reportable: boolean;
}

interface RootErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  lastErrorTime: number;
  isOnline: boolean;
}

interface RootErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: RootErrorInfo;
    onRetry: () => void;
    onGoHome: () => void;
    onReport: () => void;
  }>;
  maxRetries?: number;
  retryDelay?: number;
  enableOfflineDetection?: boolean;
}

// Network detection hook
function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Error categorization function
function categorizeError(error: Error, isOnline: boolean): RootErrorInfo {
  const message = error.message.toLowerCase();
  const stack = error.stack?.toLowerCase() || '';

  // Offline errors
  if (!isOnline) {
    return {
      type: RootErrorType.NETWORK,
      message: 'Sin conexión a internet',
      details:
        'No se puede conectar al servidor. Verifica tu conexión a internet.',
      recoverable: true,
      retryable: true,
      reportable: false,
    };
  }

  // Network errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('failed to fetch') ||
    message.includes('net::') ||
    stack.includes('network')
  ) {
    return {
      type: RootErrorType.NETWORK,
      message: 'Error de conexión',
      details:
        'No se pudo conectar al servidor. Verifica tu conexión a internet.',
      recoverable: true,
      retryable: true,
      reportable: true,
    };
  }

  // Authentication errors
  if (
    message.includes('auth') ||
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('not authenticated') ||
    message.includes('authentication required') ||
    message.includes('401') ||
    message.includes('403')
  ) {
    return {
      type: RootErrorType.AUTHENTICATION,
      message: 'Requiere autenticación',
      details: 'Tu sesión ha expirado o necesitas iniciar sesión nuevamente.',
      recoverable: true,
      retryable: false,
      reportable: false,
    };
  }

  // Permission errors
  if (
    message.includes('permission') ||
    message.includes('access denied') ||
    message.includes('not allowed') ||
    message.includes('insufficient permissions')
  ) {
    return {
      type: RootErrorType.PERMISSION,
      message: 'Sin permisos',
      details: 'No tienes permisos para realizar esta acción.',
      recoverable: true,
      retryable: false,
      reportable: false,
    };
  }

  // Server errors
  if (
    message.includes('500') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('504') ||
    message.includes('server error') ||
    message.includes('internal server')
  ) {
    return {
      type: RootErrorType.SERVER,
      message: 'Error del servidor',
      details:
        'El servidor está experimentando problemas. Inténtalo más tarde.',
      recoverable: true,
      retryable: true,
      reportable: true,
    };
  }

  // Data validation errors
  if (
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required') ||
    message.includes('format') ||
    message.includes('type error')
  ) {
    return {
      type: RootErrorType.DATA,
      message: 'Datos inválidos',
      details:
        'Los datos proporcionados no son válidos. Verifica la información.',
      recoverable: true,
      retryable: false,
      reportable: false,
    };
  }

  // Client-side JavaScript errors
  if (
    stack.includes('chunk') ||
    stack.includes('webpack') ||
    message.includes('cannot read') ||
    message.includes('undefined') ||
    message.includes('null')
  ) {
    return {
      type: RootErrorType.CLIENT,
      message: 'Error de aplicación',
      details:
        'Ocurrió un error en la aplicación. Se ha reportado automáticamente.',
      recoverable: true,
      retryable: true,
      reportable: true,
    };
  }

  // Unknown errors
  return {
    type: RootErrorType.UNKNOWN,
    message: 'Error desconocido',
    details: 'Ocurrió un error inesperado. Se ha reportado para su revisión.',
    recoverable: true,
    retryable: true,
    reportable: true,
  };
}

// Default error fallback component
function DefaultErrorFallback({
  error,
  onRetry,
  onGoHome,
  onReport,
}: {
  error: RootErrorInfo;
  onRetry: () => void;
  onGoHome: () => void;
  onReport: () => void;
}) {
  const getErrorIcon = () => {
    switch (error.type) {
      case RootErrorType.NETWORK:
        return <WifiOff className="h-12 w-12 text-red-500" />;
      case RootErrorType.AUTHENTICATION:
        return <Shield className="h-12 w-12 text-yellow-500" />;
      case RootErrorType.PERMISSION:
        return <Shield className="h-12 w-12 text-orange-500" />;
      case RootErrorType.SERVER:
        return <AlertTriangle className="h-12 w-12 text-red-500" />;
      case RootErrorType.CLIENT:
        return <Bug className="h-12 w-12 text-purple-500" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getErrorIcon()}</div>
          <CardTitle className="text-2xl font-bold text-destructive">
            {error.message}
          </CardTitle>
          {error.details && (
            <CardDescription className="text-base">
              {error.details}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Si este error persiste, contacta al soporte técnico.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2">
            {error.retryable && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Intentar nuevamente
              </Button>
            )}

            <Button variant="outline" onClick={onGoHome} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Button>

            {error.reportable && (
              <Button
                variant="ghost"
                onClick={onReport}
                className="w-full text-sm"
              >
                <Bug className="mr-2 h-4 w-4" />
                Reportar error
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export class RootErrorBoundary extends React.Component<
  RootErrorBoundaryProps,
  RootErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: RootErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: 0,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<RootErrorBoundaryState> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorInfoObj = {
      type: 'client' as const,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      additionalData: {
        errorBoundary: 'root',
        retryCount: this.state.retryCount,
        lastErrorTime: this.state.lastErrorTime,
      },
    };

    logReactError(error, errorInfo, {
      errorBoundary: 'root',
      retryCount: this.state.retryCount,
      lastErrorTime: this.state.lastErrorTime,
    });

    this.setState({
      errorInfo,
    });
  }

  componentDidMount() {
    // Listen for network changes
    if (this.props.enableOfflineDetection !== false) {
      const handleOnline = () => this.setState({ isOnline: true });
      const handleOffline = () => this.setState({ isOnline: false });

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Store cleanup function
      this.cleanup = () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
    if (this.cleanup) {
      this.cleanup();
    }
  }

  private cleanup: (() => void) | null = null;

  private handleRetry = () => {
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState({ retryCount: retryCount + 1 });

    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    // Delay retry to prevent rapid retries
    this.retryTimeoutId = setTimeout(
      () => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
        });
      },
      retryDelay * Math.pow(2, retryCount)
    ); // Exponential backoff
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReport = () => {
    // Create a detailed error report
    const report = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      retryCount: this.state.retryCount,
      isOnline: this.state.isOnline,
    };

    // Copy to clipboard for easy reporting
    navigator.clipboard
      .writeText(JSON.stringify(report, null, 2))
      .then(() => {
        alert(
          'Error report copied to clipboard. Please send it to the development team.'
        );
      })
      .catch(() => {
        console.log('Error report:', report);
        alert(
          'Error report logged to console. Please check the browser console and send the details to the development team.'
        );
      });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const errorInfo = categorizeError(this.state.error, this.state.isOnline);
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={errorInfo}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          onReport={this.handleReport}
        />
      );
    }

    return this.props.children;
  }
}

// React hook version for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
    logReactError(
      error,
      { componentStack: '' },
      {
        hook: 'useErrorBoundary',
      }
    );
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError, hasError: !!error };
}

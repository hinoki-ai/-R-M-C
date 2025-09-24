'use client';

import {
  IconAlertCircle,
  IconBug,
  IconClock,
  IconHome,
  IconMessage,
  IconRefresh,
  IconWifi,
  IconWifiOff,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { logReactError } from '@/lib/error-logger';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'auth',
  PERMISSION = 'permission',
  DATA = 'data',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

interface DashboardErrorInfo {
  type: ErrorType;
  message: string;
  details?: string;
  recoverable: boolean;
  retryable: boolean;
}

interface DashboardErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  lastErrorTime: number;
}

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: DashboardErrorInfo;
    onRetry: () => void;
    onGoHome: () => void;
  }>;
  maxRetries?: number;
  retryDelay?: number;
}

// Network detection hook
function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
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
function categorizeError(error: Error): DashboardErrorInfo {
  const message = error.message.toLowerCase();

  // Network errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection')
  ) {
    return {
      type: ErrorType.NETWORK,
      message: 'Connection Error',
      details:
        'Unable to connect to the server. Please check your internet connection.',
      recoverable: true,
      retryable: true,
    };
  }

  // Authentication errors
  if (
    message.includes('auth') ||
    message.includes('unauthorized') ||
    message.includes('forbidden')
  ) {
    return {
      type: ErrorType.AUTHENTICATION,
      message: 'Authentication Required',
      details: 'Your session has expired or you need to sign in again.',
      recoverable: true,
      retryable: false,
    };
  }

  // Permission errors
  if (message.includes('permission') || message.includes('access denied')) {
    return {
      type: ErrorType.PERMISSION,
      message: 'Access Denied',
      details: "You don't have permission to access this resource.",
      recoverable: false,
      retryable: false,
    };
  }

  // Data/query errors
  if (
    message.includes('query') ||
    message.includes('data') ||
    message.includes('validation')
  ) {
    return {
      type: ErrorType.DATA,
      message: 'Data Error',
      details: 'There was a problem loading the data. This might be temporary.',
      recoverable: true,
      retryable: true,
    };
  }

  // Server errors
  if (
    message.includes('server') ||
    message.includes('internal') ||
    message.includes('500')
  ) {
    return {
      type: ErrorType.SERVER,
      message: 'Server Error',
      details: 'The server encountered an error. Our team has been notified.',
      recoverable: true,
      retryable: true,
    };
  }

  // Unknown errors
  return {
    type: ErrorType.UNKNOWN,
    message: 'Unexpected Error',
    details:
      'An unexpected error occurred. Please try again or contact support.',
    recoverable: true,
    retryable: true,
  };
}

export class DashboardErrorBoundary extends React.Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<DashboardErrorBoundaryState> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      'Dashboard Error Boundary caught an error:',
      error,
      errorInfo
    );
    this.setState({ error, errorInfo });

    // Log the error for tracking and debugging
    logReactError(error, errorInfo, {
      component: 'DashboardErrorBoundary',
      retryCount: this.state.retryCount,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  handleRetry = () => {
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState({ retryCount: retryCount + 1 });

      // Exponential backoff
      const delay = retryDelay * Math.pow(2, retryCount);

      this.retryTimeoutId = setTimeout(() => {
        this.resetError();
      }, delay);
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const errorInfo = categorizeError(this.state.error);

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={errorInfo}
            onRetry={this.handleRetry}
            onGoHome={() => (window.location.href = '/dashboard')}
          />
        );
      }

      return (
        <DefaultDashboardErrorFallback
          error={errorInfo}
          onRetry={this.handleRetry}
          onReset={this.resetError}
          retryCount={this.state.retryCount}
          maxRetries={this.props.maxRetries || 3}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultDashboardErrorFallbackProps {
  error: DashboardErrorInfo;
  onRetry: () => void;
  onReset: () => void;
  retryCount: number;
  maxRetries: number;
}

function DefaultDashboardErrorFallback({
  error,
  onRetry,
  onReset,
  retryCount,
  maxRetries,
}: DefaultDashboardErrorFallbackProps) {
  const router = useRouter();
  const isOnline = useNetworkStatus();
  const [showDetails, setShowDetails] = React.useState(false);

  const getErrorIcon = (type: ErrorType) => {
    switch (type) {
      case ErrorType.NETWORK:
        return isOnline ? (
          <IconWifi className="h-8 w-8" />
        ) : (
          <IconWifiOff className="h-8 w-8" />
        );
      case ErrorType.AUTHENTICATION:
        return <IconAlertCircle className="h-8 w-8" />;
      case ErrorType.PERMISSION:
        return <IconAlertCircle className="h-8 w-8" />;
      case ErrorType.DATA:
        return <IconBug className="h-8 w-8" />;
      case ErrorType.SERVER:
        return <IconAlertCircle className="h-8 w-8" />;
      default:
        return <IconAlertCircle className="h-8 w-8" />;
    }
  };

  const getErrorColor = (type: ErrorType) => {
    switch (type) {
      case ErrorType.NETWORK:
        return isOnline ? 'text-blue-500' : 'text-red-500';
      case ErrorType.AUTHENTICATION:
        return 'text-yellow-500';
      case ErrorType.PERMISSION:
        return 'text-red-500';
      case ErrorType.DATA:
        return 'text-orange-500';
      case ErrorType.SERVER:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted ${getErrorColor(error.type)}`}
          >
            {getErrorIcon(error.type)}
          </div>
          <CardTitle className="text-2xl">{error.message}</CardTitle>
          <CardDescription className="text-base">
            {error.details}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Network Status Alert */}
          {!isOnline && (
            <Alert>
              <IconWifiOff className="h-4 w-4" />
              <AlertDescription>
                You appear to be offline. Please check your internet connection.
              </AlertDescription>
            </Alert>
          )}

          {/* Retry Information */}
          {retryCount > 0 && (
            <Alert>
              <IconClock className="h-4 w-4" />
              <AlertDescription>
                Retry attempt {retryCount} of {maxRetries}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {error.retryable && retryCount < maxRetries && (
              <Button onClick={onRetry} className="flex items-center gap-2">
                <IconRefresh className="h-4 w-4" />
                Try Again{' '}
                {retryCount > 0 && `(${maxRetries - retryCount} left)`}
              </Button>
            )}

            {error.type === ErrorType.AUTHENTICATION && (
              <Button
                onClick={() => router.push('/sign-in')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <IconAlertCircle className="h-4 w-4" />
                Sign In
              </Button>
            )}

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex items-center gap-2"
            >
              <IconHome className="h-4 w-4" />
              Go to Dashboard
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="sm:ml-auto"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>

          {/* Error Details */}
          {showDetails && (
            <div className="space-y-3">
              <div className="rounded-md bg-muted p-4">
                <h4 className="font-medium mb-2">Error Information:</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Type:</strong> {error.type}
                  </p>
                  <p>
                    <strong>Recoverable:</strong>{' '}
                    {error.recoverable ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Retryable:</strong> {error.retryable ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Retry Count:</strong> {retryCount}/{maxRetries}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Support Information */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <IconMessage className="h-4 w-4" />
              Need help? Contact support or try refreshing the page
            </p>
            <p className="mt-1">
              Error ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

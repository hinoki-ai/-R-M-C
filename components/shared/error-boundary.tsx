'use client'

import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import * as React from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return <DefaultErrorFallback
        error={this.state.error!}
        errorInfo={this.state.errorInfo}
        onReset={this.resetError}
      />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error: Error
  errorInfo: React.ErrorInfo | null
  onReset: () => void
}

export function DefaultErrorFallback({ error, errorInfo, onReset }: DefaultErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false)

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
            <AlertTriangle className='h-6 w-6 text-destructive' />
          </div>
          <CardTitle className='text-xl'>Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Our team has been notified and is working to fix this issue.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <Alert>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              <strong>Error:</strong> {error.message}
            </AlertDescription>
          </Alert>

          <div className='flex flex-col sm:flex-row gap-3'>
            <Button onClick={onReset} className='flex items-center gap-2'>
              <RefreshCw className='h-4 w-4' />
              Try Again
            </Button>

            <Button variant='outline' onClick={() => window.location.href = '/'} className='flex items-center gap-2'>
              <Home className='h-4 w-4' />
              Go Home
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowDetails(!showDetails)}
              className='sm:ml-auto'
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>

          {showDetails && (
            <div className='space-y-3'>
              <div className='rounded-md bg-muted p-3'>
                <h4 className='font-medium mb-2'>Error Details:</h4>
                <pre className='text-sm text-muted-foreground whitespace-pre-wrap'>
                  {error.stack}
                </pre>
              </div>

              {errorInfo && (
                <div className='rounded-md bg-muted p-3'>
                  <h4 className='font-medium mb-2'>Component Stack:</h4>
                  <pre className='text-sm text-muted-foreground whitespace-pre-wrap'>
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className='text-center text-sm text-muted-foreground'>
            <p>
              Error ID: {Date.now().toString(36)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { AlertTriangle, Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import * as React from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({
  message = 'Cargando...',
  size = 'md',
  className = ''
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-muted-foreground`} />
        <p className='text-sm text-muted-foreground'>{message}</p>
      </div>
    </div>
  )
}

interface ErrorStateProps {
  error: string | Error
  onRetry?: () => void
  retryable?: boolean
  title?: string
  description?: string
  showDetails?: boolean
  className?: string
}

export function ErrorState({
  error,
  onRetry,
  retryable = true,
  title = 'Error',
  description,
  showDetails = false,
  className = ''
}: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
            <AlertTriangle className='h-6 w-6 text-destructive' />
          </div>
          <CardTitle className='text-lg text-destructive'>{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className='space-y-4'>
          {showDetails && (
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                <strong>Detalles:</strong> {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {retryable && onRetry && (
            <Button onClick={onRetry} className='w-full'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Intentar nuevamente
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = 'No hay datos',
  description = 'No se encontraron elementos para mostrar.',
  icon,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className='text-center space-y-4'>
        {icon && (
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
            {icon}
          </div>
        )}
        <div className='space-y-2'>
          <h3 className='text-lg font-medium'>{title}</h3>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}

interface OfflineStateProps {
  onRetry?: () => void
  className?: string
}

export function OfflineState({ onRetry, className = '' }: OfflineStateProps) {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20'>
            <WifiOff className='h-6 w-6 text-orange-600 dark:text-orange-400' />
          </div>
          <CardTitle className='text-lg'>Sin conexión</CardTitle>
          <CardDescription>
            No se puede conectar al servidor. Verifica tu conexión a internet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onRetry && (
            <Button onClick={onRetry} variant='outline' className='w-full'>
              <Wifi className='mr-2 h-4 w-4' />
              Reintentar conexión
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Generic data state manager component
interface DataStateProps<T> {
  data: T | undefined
  loading: boolean
  error: string | null
  onRetry?: () => void
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
  offlineComponent?: React.ReactNode
  isOffline?: boolean
  children: (data: T) => React.ReactNode
  emptyCondition?: (data: T) => boolean
}

export function DataState<T>({
  data,
  loading,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  offlineComponent,
  isOffline = false,
  children,
  emptyCondition
}: DataStateProps<T>) {
  // Show offline state
  if (isOffline) {
    return offlineComponent || <OfflineState onRetry={onRetry} />
  }

  // Show loading state
  if (loading) {
    return loadingComponent || <LoadingState />
  }

  // Show error state
  if (error) {
    return errorComponent || (
      <ErrorState
        error={error}
        onRetry={onRetry}
        retryable={!!onRetry}
      />
    )
  }

  // Show empty state
  if (!data || (emptyCondition && emptyCondition(data))) {
    return emptyComponent || <EmptyState />
  }

  // Show data
  return <>{children(data)}</>
}

// Skeleton loading components for different content types
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className='space-y-4'>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className='flex space-x-4'>
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className='h-4 flex-1' />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-2/3' />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-20 w-full' />
      </div>
      <Skeleton className='h-10 w-32' />
    </div>
  )
}

// Hook for managing async data states
export function useDataState<T>(
  asyncFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = React.useState<T | undefined>()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const execute = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await asyncFn()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [asyncFn])

  React.useEffect(() => {
    execute()
  }, dependencies)

  const retry = React.useCallback(() => {
    execute()
  }, [execute])

  return {
    data,
    loading,
    error,
    retry,
    refetch: execute
  }
}
'use client'

import { useQuery } from 'convex/react'
import { useCallback, useEffect, useState } from 'react'

import { logConvexError } from '@/lib/error-logger'
import { withRetry, networkRetryOptions, isRetryableError } from '@/lib/utils/retry'

// Error types matching the dashboard error boundary
export enum ConvexErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'auth',
  PERMISSION = 'permission',
  DATA = 'data',
  SERVER = 'server',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

export interface ConvexError {
  type: ConvexErrorType
  message: string
  originalError?: Error
  retryable: boolean
  recoverable: boolean
}

export interface ConvexQueryState<T> {
  data: T | undefined
  error: ConvexError | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  retryCount: number
  canRetry: boolean
}

interface UseConvexErrorHandlerOptions {
  maxRetries?: number
  retryDelay?: number
  timeout?: number
  onError?: (error: ConvexError) => void
  onRetry?: (retryCount: number) => void
  onSuccess?: (data: any) => void
}

// Categorize Convex errors
function categorizeConvexError(error: any): ConvexError {
  if (!error) {
    return {
      type: ConvexErrorType.UNKNOWN,
      message: 'Unknown error occurred',
      retryable: true,
      recoverable: true
    }
  }

  const errorMessage = error.message?.toLowerCase() || ''
  const errorString = String(error).toLowerCase()

  // Network errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('failed to fetch') ||
    errorString.includes('network')
  ) {
    return {
      type: ConvexErrorType.NETWORK,
      message: 'Network connection error. Please check your internet connection.',
      originalError: error,
      retryable: true,
      recoverable: true
    }
  }

  // Authentication errors
  if (
    errorMessage.includes('auth') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('forbidden') ||
    errorMessage.includes('not authenticated') ||
    errorMessage.includes('authentication required')
  ) {
    return {
      type: ConvexErrorType.AUTHENTICATION,
      message: 'Authentication required. Please sign in again.',
      originalError: error,
      retryable: false,
      recoverable: true
    }
  }

  // Permission errors
  if (
    errorMessage.includes('permission') ||
    errorMessage.includes('access denied') ||
    errorMessage.includes('not allowed')
  ) {
    return {
      type: ConvexErrorType.PERMISSION,
      message: 'You don\'t have permission to access this data.',
      originalError: error,
      retryable: false,
      recoverable: false
    }
  }

  // Timeout errors
  if (
    errorMessage.includes('timeout') ||
    errorMessage.includes('timed out') ||
    errorString.includes('timeout')
  ) {
    return {
      type: ConvexErrorType.TIMEOUT,
      message: 'Request timed out. Please try again.',
      originalError: error,
      retryable: true,
      recoverable: true
    }
  }

  // Server errors
  if (
    errorMessage.includes('server') ||
    errorMessage.includes('internal') ||
    errorMessage.includes('500') ||
    errorMessage.includes('503') ||
    errorMessage.includes('502')
  ) {
    return {
      type: ConvexErrorType.SERVER,
      message: 'Server error occurred. Our team has been notified.',
      originalError: error,
      retryable: true,
      recoverable: true
    }
  }

  // Data/query errors
  if (
    errorMessage.includes('query') ||
    errorMessage.includes('data') ||
    errorMessage.includes('validation') ||
    errorMessage.includes('invalid')
  ) {
    return {
      type: ConvexErrorType.DATA,
      message: 'Data error occurred. Please try refreshing the page.',
      originalError: error,
      retryable: true,
      recoverable: true
    }
  }

  // Default unknown error
  return {
    type: ConvexErrorType.UNKNOWN,
    message: error.message || 'An unexpected error occurred.',
    originalError: error,
    retryable: true,
    recoverable: true
  }
}

// Custom hook for Convex queries with enhanced error handling
export function useConvexQueryWithError<T>(
  query: any,
  queryArgsOrOptions?: any,
  options?: UseConvexErrorHandlerOptions
): ConvexQueryState<T> & { retry: () => void } {
  // Handle different call signatures
  let queryArgs: any = {}
  let finalOptions: UseConvexErrorHandlerOptions = {}

  if (options !== undefined) {
    // Called as useConvexQueryWithError(query, queryArgs, options)
    queryArgs = queryArgsOrOptions || {}
    finalOptions = options
  } else if (queryArgsOrOptions && typeof queryArgsOrOptions === 'object' && !Array.isArray(queryArgsOrOptions)) {
    // Check if it's options or queryArgs
    if ('maxRetries' in queryArgsOrOptions || 'onError' in queryArgsOrOptions) {
      finalOptions = queryArgsOrOptions
    } else {
      queryArgs = queryArgsOrOptions
    }
  }
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 30000,
    onError,
    onRetry,
    onSuccess
  } = finalOptions

  const [retryCount, setRetryCount] = useState(0)
  const [manualRetryTrigger, setManualRetryTrigger] = useState(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  // Handle both query functions and query results
  let convexData: any
  if (typeof query === 'function') {
    // query is a Convex query function
    convexData = useQuery(query, { ...queryArgs, _retryTrigger: manualRetryTrigger })
  } else {
    // query is already the result of useQuery
    convexData = query
  }

  // Clear timeout on unmount or when data changes
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  // Handle successful data loading
  useEffect(() => {
    if (convexData !== undefined && convexData !== null && !(convexData instanceof Error)) {
      onSuccess?.(convexData)
      // Reset retry count on success
      setRetryCount(0)
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
        setTimeoutId(null)
      }
    }
  }, [convexData, onSuccess, timeoutId])

  // Categorize error when it occurs
  const categorizedError = convexData instanceof Error ? categorizeConvexError(convexData) : null

  // Handle errors
  useEffect(() => {
    if (categorizedError) {
      onError?.(categorizedError)

      // Log the error for tracking
      logConvexError(categorizedError, {
        retryCount,
        maxRetries,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        component: 'useConvexQueryWithError'
      })

      // Auto-retry logic for retryable errors
      if (categorizedError.retryable && retryCount < maxRetries) {
        const delay = retryDelay * Math.pow(2, retryCount) // Exponential backoff

        const id = setTimeout(() => {
          setRetryCount(prev => prev + 1)
          onRetry?.(retryCount + 1)
          setManualRetryTrigger(prev => prev + 1)
        }, delay)

        setTimeoutId(id)
      }
    }
  }, [categorizedError, retryCount, maxRetries, retryDelay, onError, onRetry])

  // Manual retry function
  const retry = useCallback(() => {
    if (categorizedError?.retryable || !categorizedError) {
      setRetryCount(0)
      setManualRetryTrigger(prev => prev + 1)
    }
  }, [categorizedError])

  // Set timeout for long-running queries
  useEffect(() => {
    if (convexData === undefined && !categorizedError) {
      const id = setTimeout(() => {
        const timeoutError = new Error('Query timed out')
        onError?.(categorizeConvexError(timeoutError))
      }, timeout)

      setTimeoutId(id)

      return () => clearTimeout(id)
    }
  }, [convexData, categorizedError, timeout, onError])

  const isLoading = convexData === undefined
  const isError = categorizedError !== null
  const isSuccess = !isLoading && !isError
  const canRetry = Boolean(categorizedError?.retryable && retryCount < maxRetries)

  return {
    data: isError ? undefined : convexData,
    error: categorizedError,
    isLoading,
    isError,
    isSuccess,
    retryCount,
    canRetry,
    retry
  }
}

// Hook for handling multiple Convex queries with shared error state
export function useConvexQueriesWithError<T extends Record<string, any>>(
  queries: { [K in keyof T]: any },
  options: UseConvexErrorHandlerOptions = {}
): {
  data: { [K in keyof T]: T[K] | undefined }
  errors: { [K in keyof T]: ConvexError | null }
  isLoading: { [K in keyof T]: boolean }
  hasAnyError: boolean
  hasAnyLoading: boolean
  retryAll: () => void
  retryQuery: (key: keyof T) => void
} {
  const [retryTriggers, setRetryTriggers] = useState<Record<keyof T, number>>({} as Record<keyof T, number>)

  const queryResults = Object.entries(queries).reduce((acc, [key, query]) => {
    const result = useConvexQueryWithError(query, {
      ...options,
      onError: (error: ConvexError) => {
        console.error(`Error in query ${key}:`, error)
        options.onError?.(error)
      }
    })

    acc.data[key] = result.data
    acc.errors[key] = result.error
    acc.isLoading[key] = result.isLoading
    acc.retryFunctions[key] = result.retry

    return acc
  }, {
    data: {} as Record<string, any>,
    errors: {} as Record<string, ConvexError | null>,
    isLoading: {} as Record<string, boolean>,
    retryFunctions: {} as Record<string, () => void>
  })

  const hasAnyError = Object.values(queryResults.errors).some(error => error !== null)
  const hasAnyLoading = Object.values(queryResults.isLoading).some(loading => loading)

  const retryAll = useCallback(() => {
    Object.keys(queries).forEach(key => {
      setRetryTriggers(prev => ({
        ...prev,
        [key]: (prev[key] || 0) + 1
      }))
    })
  }, [queries])

  const retryQuery = useCallback((key: keyof T) => {
    setRetryTriggers(prev => ({
      ...prev,
      [key as string]: (prev[key as string] || 0) + 1
    }))
  }, [])

  return {
    data: queryResults.data as { [K in keyof T]: T[K] | undefined },
    errors: queryResults.errors as { [K in keyof T]: ConvexError | null },
    isLoading: queryResults.isLoading as { [K in keyof T]: boolean },
    hasAnyError,
    hasAnyLoading,
    retryAll,
    retryQuery
  }
}

// Simple hook for Convex operations with error handling
export function useConvexErrorHandler<T = any>(
  convexFunction: any,
  options: UseConvexErrorHandlerOptions & { args?: any } = {}
) {
  const { args, ...errorOptions } = options

  // For queries, use useConvexQueryWithError
  if (convexFunction.kind === 'query' || typeof convexFunction === 'function') {
    return useConvexQueryWithError(convexFunction, args, errorOptions)
  }

  // For mutations/actions, we need a different approach since they don't return data directly
  // This is a simplified version that just wraps the mutation call
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ConvexError | null>(null)
  const [data, setData] = useState<T | undefined>(undefined)

  const mutate = useCallback(async (mutationArgs?: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await convexFunction(mutationArgs || args || {})
      setData(result)
      errorOptions.onSuccess?.(result)
      return result
    } catch (err) {
      const categorizedError = categorizeConvexError(err)
      setError(categorizedError)
      errorOptions.onError?.(categorizedError)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [convexFunction, args, errorOptions])

  return {
    mutate,
    data,
    error,
    isLoading,
    isError: error !== null,
    isSuccess: data !== undefined && error === null
  }
}

// Hook for offline detection and cached data fallback
export function useOfflineFallback<T>(
  onlineQuery: any,
  options: {
    storageKey?: string
    maxAge?: number // in milliseconds
    onOffline?: () => void
    onOnline?: () => void
  } = {}
) {
  const { storageKey, maxAge = 24 * 60 * 60 * 1000, onOffline, onOnline } = options
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [cachedData, setCachedData] = useState<T | null>(null)

  // Network status detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      onOnline?.()
    }
    const handleOffline = () => {
      setIsOnline(false)
      onOffline?.()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onOffline, onOnline])

  // Load cached data on mount
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(storageKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          const now = Date.now()

          // Check if cache is still valid
          if (now - parsed.timestamp < maxAge) {
            setCachedData(parsed.data)
          } else {
            localStorage.removeItem(storageKey)
          }
        }
      } catch (error) {
        console.warn('Failed to load cached data:', error)
      }
    }
  }, [storageKey, maxAge])

  // Use Convex query when online
  const onlineResult = useConvexQueryWithError(onlineQuery, {})

  // Cache successful data
  useEffect(() => {
    if (onlineResult.isSuccess && onlineResult.data && storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          data: onlineResult.data,
          timestamp: Date.now()
        }))
        setCachedData(onlineResult.data as T)
      } catch (error) {
        console.warn('Failed to cache data:', error)
      }
    }
  }, [onlineResult.isSuccess, onlineResult.data, storageKey])

  // Return cached data when offline, otherwise return online data
  if (!isOnline && cachedData) {
    return {
      ...onlineResult,
      data: cachedData,
      isOffline: true,
      cached: true
    }
  }

  return {
    ...onlineResult,
    isOffline: false,
    cached: false
  }
}
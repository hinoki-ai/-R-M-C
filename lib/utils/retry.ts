export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
  retryCondition?: (error: Error) => boolean
  onRetry?: (attempt: number, error: Error) => void
  timeout?: number
}

export class RetryError extends Error {
  public readonly attempts: number
  public readonly lastError: Error

  constructor(message: string, attempts: number, lastError: Error) {
    super(message)
    this.name = 'RetryError'
    this.attempts = attempts
    this.lastError = lastError
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    retryCondition = () => true,
    onRetry,
    timeout
  } = options

  let lastError: Error
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add timeout if specified
      let promise = operation()
      if (timeout) {
        promise = Promise.race([
          promise,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Operation timed out after ${timeout}ms`)), timeout)
          )
        ])
      }

      return await promise
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry if this is the last attempt
      if (attempt === maxRetries) {
        break
      }

      // Check if we should retry this error
      if (!retryCondition(lastError)) {
        break
      }

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, lastError)
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * backoffFactor, maxDelay)
    }
  }

  throw new RetryError(
    `Operation failed after ${maxRetries + 1} attempts`,
    maxRetries + 1,
    lastError!
  )
}

// Network-specific retry conditions
export const isNetworkError = (error: Error): boolean => {
  const message = error.message.toLowerCase()
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    message.includes('failed to fetch') ||
    message.includes('net::') ||
    error.name === 'NetworkError' ||
    error.name === 'TypeError' // Often indicates network issues in fetch
  )
}

export const isServerError = (error: Error): boolean => {
  const message = error.message.toLowerCase()
  return (
    message.includes('500') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('504') ||
    message.includes('server error') ||
    message.includes('internal server') ||
    message.includes('service unavailable')
  )
}

export const isRetryableError = (error: Error): boolean => {
  return isNetworkError(error) || isServerError(error)
}

// Pre-configured retry strategies
export const networkRetryOptions: RetryOptions = {
  maxRetries: 5,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: isNetworkError,
  onRetry: (attempt, error) => {
    console.warn(`Network retry attempt ${attempt} for error:`, error.message)
  }
}

export const serverRetryOptions: RetryOptions = {
  maxRetries: 3,
  initialDelay: 2000,
  maxDelay: 15000,
  backoffFactor: 2,
  retryCondition: isServerError,
  onRetry: (attempt, error) => {
    console.warn(`Server retry attempt ${attempt} for error:`, error.message)
  }
}

export const aggressiveRetryOptions: RetryOptions = {
  maxRetries: 10,
  initialDelay: 500,
  maxDelay: 5000,
  backoffFactor: 1.5,
  retryCondition: isRetryableError,
  onRetry: (attempt, error) => {
    console.warn(`Aggressive retry attempt ${attempt} for error:`, error.message)
  }
}

// React hook for retrying operations
import { useState, useCallback } from 'react'

export function useRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [attempts, setAttempts] = useState(0)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    setAttempts(0)

    try {
      const result = await withRetry(operation, {
        ...options,
        onRetry: (attempt, error) => {
          setAttempts(attempt)
          options.onRetry?.(attempt, error)
        }
      })
      return result
    } catch (error) {
      const retryError = error instanceof RetryError ? error.lastError : error
      setError(retryError instanceof Error ? retryError : new Error(String(retryError)))
      throw error
    } finally {
      setLoading(false)
    }
  }, [operation, options])

  const retry = useCallback(() => execute(), [execute])

  return {
    execute,
    retry,
    loading,
    error,
    attempts
  }
}

// Circuit breaker pattern for preventing cascading failures
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly recoveryTimeout: number = 60000, // 1 minute
    private readonly monitoringPeriod: number = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'half-open'
      } else {
        throw new Error('Circuit breaker is open')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = 'closed'
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.failures >= this.failureThreshold) {
      this.state = 'open'
    }
  }

  getState() {
    return this.state
  }

  reset() {
    this.failures = 0
    this.lastFailureTime = 0
    this.state = 'closed'
  }
}
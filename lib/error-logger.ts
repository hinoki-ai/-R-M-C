import { ConvexErrorType } from '@/hooks/use-convex-error-handler'

export interface ErrorLogEntry {
  id: string
  timestamp: number
  type: ConvexErrorType | 'unknown'
  message: string
  stack?: string
  componentStack?: string
  userAgent?: string
  url?: string
  userId?: string
  additionalData?: Record<string, any>
  resolved?: boolean
  resolvedAt?: number
  retryCount?: number
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = []
  private maxLogs = 100
  private storageKey = 'error-logs'

  constructor() {
    this.loadLogs()
    this.setupGlobalErrorHandler()
  }

  private loadLogs() {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const parsedLogs = JSON.parse(stored)
        this.logs = parsedLogs.slice(-this.maxLogs) // Keep only the most recent logs
      }
    } catch (error) {
      console.warn('Failed to load error logs:', error)
    }
  }

  private saveLogs() {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs))
    } catch (error) {
      console.warn('Failed to save error logs:', error)
    }
  }

  private setupGlobalErrorHandler() {
    if (typeof window === 'undefined') return

    // Global error handler for unhandled errors
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'unknown',
        message: event.message,
        stack: event.error?.stack,
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      })
    })

    // Global promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'unknown',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        additionalData: {
          reason: event.reason
        }
      })
    })
  }

  logError(error: Omit<ErrorLogEntry, 'id' | 'timestamp'>) {
    const logEntry: ErrorLogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      ...error
    }

    this.logs.push(logEntry)

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    this.saveLogs()

    // Also log to console for development
    console.error('Error logged:', logEntry)

    // In production, you might want to send this to a logging service
    this.reportError(logEntry)
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private async reportError(logEntry: ErrorLogEntry) {
    // In a real application, you would send this to your error reporting service
    // For example: Sentry, LogRocket, Bugsnag, etc.

    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Report')
      console.log('ID:', logEntry.id)
      console.log('Type:', logEntry.type)
      console.log('Message:', logEntry.message)
      console.log('Timestamp:', new Date(logEntry.timestamp).toISOString())
      console.log('Stack:', logEntry.stack)
      if (logEntry.additionalData) {
        console.log('Additional Data:', logEntry.additionalData)
      }
      console.groupEnd()
    }

    // Example of how you might send to a service:
    /*
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      })
    } catch (error) {
      console.warn('Failed to report error:', error)
    }
    */
  }

  getLogs(limit?: number): ErrorLogEntry[] {
    const sortedLogs = [...this.logs].sort((a, b) => b.timestamp - a.timestamp)
    return limit ? sortedLogs.slice(0, limit) : sortedLogs
  }

  getLogsByType(type: ConvexErrorType | 'unknown', limit?: number): ErrorLogEntry[] {
    const filteredLogs = this.logs.filter(log => log.type === type)
    const sortedLogs = filteredLogs.sort((a, b) => b.timestamp - a.timestamp)
    return limit ? sortedLogs.slice(0, limit) : sortedLogs
  }

  markResolved(id: string) {
    const log = this.logs.find(log => log.id === id)
    if (log) {
      log.resolved = true
      log.resolvedAt = Date.now()
      this.saveLogs()
    }
  }

  clearLogs() {
    this.logs = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey)
    }
  }

  getStats() {
    const now = Date.now()
    const last24Hours = now - (24 * 60 * 60 * 1000)
    const last7Days = now - (7 * 24 * 60 * 60 * 1000)

    const recentLogs = this.logs.filter(log => log.timestamp > last24Hours)
    const weeklyLogs = this.logs.filter(log => log.timestamp > last7Days)

    const typeCounts = this.logs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: this.logs.length,
      last24Hours: recentLogs.length,
      last7Days: weeklyLogs.length,
      byType: typeCounts,
      unresolved: this.logs.filter(log => !log.resolved).length
    }
  }

  // Utility method to log React error boundaries
  logReactError(error: Error, errorInfo: React.ErrorInfo, additionalData?: Record<string, any>) {
    this.logError({
      type: 'unknown',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack ? errorInfo.componentStack : undefined,
      additionalData: {
        ...additionalData,
        errorBoundary: true
      }
    })
  }

  // Utility method to log Convex errors
  logConvexError(error: any, additionalData?: Record<string, any>) {
    const errorType = error?.type || 'unknown'
    const message = error?.message || 'Unknown Convex error'

    this.logError({
      type: errorType,
      message,
      stack: error?.originalError?.stack,
      additionalData: {
        ...additionalData,
        convex: true,
        retryable: error?.retryable,
        recoverable: error?.recoverable
      }
    })
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger()

// Utility functions for easy logging
export const logError = (error: Omit<ErrorLogEntry, 'id' | 'timestamp'>) => {
  errorLogger.logError(error)
}

export const logReactError = (error: Error, errorInfo: React.ErrorInfo, additionalData?: Record<string, any>) => {
  errorLogger.logReactError(error, errorInfo, additionalData)
}

export const logConvexError = (error: any, additionalData?: Record<string, any>) => {
  errorLogger.logConvexError(error, additionalData)
}

// Hook for using error logger in React components
export function useErrorLogger() {
  return {
    logError,
    logReactError,
    logConvexError,
    getLogs: errorLogger.getLogs.bind(errorLogger),
    getLogsByType: errorLogger.getLogsByType.bind(errorLogger),
    getStats: errorLogger.getStats.bind(errorLogger),
    clearLogs: errorLogger.clearLogs.bind(errorLogger),
    markResolved: errorLogger.markResolved.bind(errorLogger)
  }
}
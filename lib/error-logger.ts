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
  reported?: boolean
  reportId?: string
}

export interface ErrorReportingConfig {
  enabled: boolean
  endpoint?: string
  apiKey?: string
  reportThreshold: 'all' | 'critical' | 'unresolved'
  batchSize: number
  batchInterval: number
  retryAttempts: number
}

const defaultReportingConfig: ErrorReportingConfig = {
  enabled: process.env.NODE_ENV === 'production',
  endpoint: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT,
  apiKey: process.env.NEXT_PUBLIC_ERROR_REPORTING_API_KEY,
  reportThreshold: 'critical',
  batchSize: 10,
  batchInterval: 30000, // 30 seconds
  retryAttempts: 3
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = []
  private maxLogs = 100
  private storageKey = 'error-logs'
  private reportingConfig: ErrorReportingConfig
  private reportQueue: ErrorLogEntry[] = []
  private reportBatchTimer: NodeJS.Timeout | null = null
  private isReporting = false

  constructor(config: Partial<ErrorReportingConfig> = {}) {
    this.reportingConfig = { ...defaultReportingConfig, ...config }
    this.loadLogs()
    this.setupGlobalErrorHandler()
    this.setupReporting()
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

  // Error reporting functionality
  private setupReporting() {
    if (!this.reportingConfig.enabled || typeof window === 'undefined') return

    // Set up periodic batch reporting
    this.reportBatchTimer = setInterval(() => {
      this.processReportBatch()
    }, this.reportingConfig.batchInterval)

    // Process any pending reports on page unload
    window.addEventListener('beforeunload', () => {
      this.processReportBatch(true)
    })
  }

  private shouldReportError(error: ErrorLogEntry): boolean {
    if (!this.reportingConfig.enabled) return false

    switch (this.reportingConfig.reportThreshold) {
      case 'all':
        return true
      case 'critical':
        return this.isCriticalError(error)
      case 'unresolved':
        return !error.resolved
      default:
        return false
    }
  }

  private isCriticalError(error: ErrorLogEntry): boolean {
    const criticalTypes = ['server', 'database', 'auth']
    const criticalMessages = [
      'network',
      'connection',
      'timeout',
      'internal server',
      'unauthorized',
      'forbidden'
    ]

    return (
      criticalTypes.includes(error.type) ||
      criticalMessages.some(msg => error.message.toLowerCase().includes(msg)) ||
      (error.additionalData?.critical === true)
    )
  }

  private async reportErrors(errors: ErrorLogEntry[]): Promise<void> {
    if (!this.reportingConfig.endpoint || errors.length === 0) return

    const payload = {
      errors: errors.map(error => ({
        ...error,
        // Add client information
        clientInfo: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          sessionId: this.getSessionId()
        }
      })),
      apiKey: this.reportingConfig.apiKey
    }

    try {
      const response = await fetch(this.reportingConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        // Mark errors as reported
        errors.forEach((error, index) => {
          const logIndex = this.logs.findIndex(log => log.id === error.id)
          if (logIndex > -1) {
            this.logs[logIndex].reported = true
            this.logs[logIndex].reportId = result.reportIds?.[index]
          }
        })
        this.saveLogs()
      } else {
        console.warn('Error reporting failed:', response.status, response.statusText)
      }
    } catch (error) {
      console.warn('Error reporting request failed:', error)
    }
  }

  private async processReportBatch(force = false): Promise<void> {
    if (this.isReporting && !force) return

    const errorsToReport = this.logs.filter(
      error => !error.reported && this.shouldReportError(error)
    )

    if (errorsToReport.length === 0) return

    const batchSize = force ? errorsToReport.length : this.reportingConfig.batchSize
    const batch = errorsToReport.slice(0, batchSize)

    this.isReporting = true
    try {
      await this.reportErrors(batch)
    } finally {
      this.isReporting = false
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('error-session-id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('error-session-id', sessionId)
    }
    return sessionId
  }

  // Public methods for error reporting
  async reportErrorNow(errorId: string): Promise<boolean> {
    const error = this.logs.find(log => log.id === errorId)
    if (!error || error.reported) return false

    try {
      await this.reportErrors([error])
      return true
    } catch {
      return false
    }
  }

  getUnreportedErrors(): ErrorLogEntry[] {
    return this.logs.filter(error => !error.reported && this.shouldReportError(error))
  }

  updateReportingConfig(config: Partial<ErrorReportingConfig>): void {
    this.reportingConfig = { ...this.reportingConfig, ...config }

    if (this.reportingConfig.enabled && !this.reportBatchTimer) {
      this.setupReporting()
    } else if (!this.reportingConfig.enabled && this.reportBatchTimer) {
      clearInterval(this.reportBatchTimer)
      this.reportBatchTimer = null
    }
  }

  getReportingConfig(): ErrorReportingConfig {
    return { ...this.reportingConfig }
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
    markResolved: errorLogger.markResolved.bind(errorLogger),
    // Reporting methods
    reportErrorNow: errorLogger.reportErrorNow.bind(errorLogger),
    getUnreportedErrors: errorLogger.getUnreportedErrors.bind(errorLogger),
    updateReportingConfig: errorLogger.updateReportingConfig.bind(errorLogger),
    getReportingConfig: errorLogger.getReportingConfig.bind(errorLogger)
  }
}
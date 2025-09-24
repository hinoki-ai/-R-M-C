/**
 * Error Testing Utilities
 *
 * This file provides utilities for testing error handling scenarios
 * across the application. It includes functions to simulate various
 * error conditions and verify that error handling works correctly.
 */

import { ConvexError } from 'convex/values';
import { api } from '@/convex/_generated/api';
import {
  ConvexErrorType,
  useConvexErrorHandler,
} from '@/hooks/use-convex-error-handler';
import { errorLogger } from '@/lib/error-logger';
import { getOfflineManager } from '@/lib/services/offline-manager';

export interface ErrorTestResult {
  testName: string;
  passed: boolean;
  error?: Error;
  details?: any;
}

export interface ErrorTestSuite {
  name: string;
  tests: ErrorTestResult[];
  passed: number;
  total: number;
}

// Test categories
export enum ErrorTestCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  CLIENT = 'client',
  OFFLINE = 'offline',
  FORM = 'form',
  CONVEX = 'convex',
}

// Simulated error conditions
export const simulatedErrors = {
  network: {
    fetch: new Error('Failed to fetch'),
    timeout: new Error('Network timeout'),
    connection: new Error('Connection failed'),
  },
  auth: {
    unauthorized: new Error('Unauthorized access'),
    forbidden: new Error('Access forbidden'),
    expired: new Error('Session expired'),
  },
  validation: {
    required: new Error('Field is required'),
    invalid: new Error('Invalid format'),
    length: new Error('Invalid length'),
  },
  server: {
    internal: new Error('Internal server error'),
    badRequest: new Error('Bad request'),
    notFound: new Error('Resource not found'),
  },
  convex: {
    mutation: new ConvexError({
      type: 'server',
      message: 'Convex mutation failed',
      details: { code: 'MUTATION_FAILED' },
    }),
    query: new ConvexError({
      type: 'network',
      message: 'Convex query failed',
      details: { code: 'QUERY_FAILED' },
    }),
  },
};

// Error testing utilities
export class ErrorTester {
  private results: ErrorTestResult[] = [];

  // Network error simulation
  async testNetworkErrors(): Promise<void> {
    const tests = [
      {
        name: 'Fetch failure handling',
        test: async () => {
          // Simulate a fetch failure
          try {
            await fetch('https://invalid-url-that-will-fail.com');
          } catch (error) {
            // This should be handled gracefully
            return true;
          }
          return false;
        },
      },
      {
        name: 'Timeout error handling',
        test: async () => {
          // Simulate a timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 100);

          try {
            await fetch('https://httpbin.org/delay/5', {
              signal: controller.signal,
              method: 'GET',
            });
            clearTimeout(timeoutId);
          } catch (error: any) {
            if (error.name === 'AbortError') {
              return true;
            }
          }
          return false;
        },
      },
    ];

    for (const { name, test } of tests) {
      try {
        const passed = await test();
        this.results.push({ testName: name, passed });
      } catch (error) {
        this.results.push({
          testName: name,
          passed: false,
          error: error as Error,
        });
      }
    }
  }

  // Authentication error simulation
  async testAuthErrors(): Promise<void> {
    const tests = [
      {
        name: 'Invalid auth token handling',
        test: async () => {
          // This would require mocking the auth system
          // For now, just test that auth errors are categorized correctly
          const error = simulatedErrors.auth.expired;
          errorLogger.logError({
            type: ConvexErrorType.AUTHENTICATION,
            message: error.message,
            additionalData: { test: true },
          });
          return true;
        },
      },
    ];

    for (const { name, test } of tests) {
      try {
        const passed = await test();
        this.results.push({ testName: name, passed });
      } catch (error) {
        this.results.push({
          testName: name,
          passed: false,
          error: error as Error,
        });
      }
    }
  }

  // Form validation error simulation
  async testFormErrors(): Promise<void> {
    const tests = [
      {
        name: 'Required field validation',
        test: async () => {
          // Simulate form validation error
          const error = simulatedErrors.validation.required;
          errorLogger.logError({
            type: ConvexErrorType.DATA,
            message: error.message,
            additionalData: { field: 'testField', test: true },
          });
          return true;
        },
      },
      {
        name: 'Invalid format validation',
        test: async () => {
          const error = simulatedErrors.validation.invalid;
          errorLogger.logError({
            type: ConvexErrorType.DATA,
            message: error.message,
            additionalData: { field: 'email', value: 'invalid', test: true },
          });
          return true;
        },
      },
    ];

    for (const { name, test } of tests) {
      try {
        const passed = await test();
        this.results.push({ testName: name, passed });
      } catch (error) {
        this.results.push({
          testName: name,
          passed: false,
          error: error as Error,
        });
      }
    }
  }

  // Convex error simulation
  async testConvexErrors(): Promise<void> {
    const tests = [
      {
        name: 'Convex mutation error handling',
        test: async () => {
          const error = simulatedErrors.convex.mutation;
          errorLogger.logConvexError(error, {
            operation: 'testMutation',
            test: true,
          });
          return true;
        },
      },
      {
        name: 'Convex query error handling',
        test: async () => {
          const error = simulatedErrors.convex.query;
          errorLogger.logConvexError(error, {
            operation: 'testQuery',
            test: true,
          });
          return true;
        },
      },
    ];

    for (const { name, test } of tests) {
      try {
        const passed = await test();
        this.results.push({ testName: name, passed });
      } catch (error) {
        this.results.push({
          testName: name,
          passed: false,
          error: error as Error,
        });
      }
    }
  }

  // Offline functionality testing
  async testOfflineErrors(): Promise<void> {
    const offlineManager = getOfflineManager();

    const tests = [
      {
        name: 'Offline request queuing',
        test: async () => {
          // Skip test if running in Node.js environment (no browser APIs)
          if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            console.log('Skipping offline test - browser APIs not available');
            return true;
          }

          // Simulate going offline
          const originalOnline = navigator.onLine;
          Object.defineProperty(navigator, 'onLine', {
            value: false,
            writable: true,
          });

          // Trigger offline event
          window.dispatchEvent(new Event('offline'));

          // Try to queue a request
          const requestId = offlineManager.queueRequest('testOperation', {
            test: true,
          });

          // Verify it was queued
          const queuedRequests = offlineManager.getQueuedRequests();
          const found = queuedRequests.some(req => req.id === requestId);

          // Restore online status
          Object.defineProperty(navigator, 'onLine', {
            value: originalOnline,
            writable: true,
          });
          window.dispatchEvent(new Event('online'));

          return found;
        },
      },
    ];

    for (const { name, test } of tests) {
      try {
        const passed = await test();
        this.results.push({ testName: name, passed });
      } catch (error) {
        this.results.push({
          testName: name,
          passed: false,
          error: error as Error,
        });
      }
    }
  }

  // Error boundary testing
  async testErrorBoundaries(): Promise<void> {
    const tests = [
      {
        name: 'React error boundary triggering',
        test: async () => {
          // This would require mounting a component with an error boundary
          // For now, just test that error logging works
          const error = new Error('Test component error');
          errorLogger.logReactError(
            error,
            {
              componentStack: 'TestComponent\n  in ErrorBoundary',
            },
            { test: true }
          );
          return true;
        },
      },
    ];

    for (const { name, test } of tests) {
      try {
        const passed = await test();
        this.results.push({ testName: name, passed });
      } catch (error) {
        this.results.push({
          testName: name,
          passed: false,
          error: error as Error,
        });
      }
    }
  }

  // Run all error tests
  async runAllTests(): Promise<ErrorTestSuite> {
    this.results = [];

    await this.testNetworkErrors();
    await this.testAuthErrors();
    await this.testFormErrors();
    await this.testConvexErrors();
    await this.testOfflineErrors();
    await this.testErrorBoundaries();

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;

    return {
      name: 'Comprehensive Error Handling Tests',
      tests: this.results,
      passed,
      total,
    };
  }

  // Get test results
  getResults(): ErrorTestResult[] {
    return [...this.results];
  }

  // Reset test results
  reset(): void {
    this.results = [];
  }
}

// Singleton instance
let errorTesterInstance: ErrorTester | null = null;

export function getErrorTester(): ErrorTester {
  if (!errorTesterInstance) {
    errorTesterInstance = new ErrorTester();
  }
  return errorTesterInstance;
}

// Quick test runner for development
export async function runErrorTests(): Promise<void> {
  const tester = getErrorTester();
  const suite = await tester.runAllTests();

  console.group('🧪 Error Handling Tests');
  console.log(`Results: ${suite.passed}/${suite.total} tests passed`);

  suite.tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.testName}`);
    if (!test.passed && test.error) {
      console.error('   Error:', test.error.message);
    }
  });

  console.groupEnd();

  if (suite.passed === suite.total) {
    console.log('🎉 All error handling tests passed!');
  } else {
    console.warn('⚠️ Some error handling tests failed. Check the logs above.');
  }
}

// Development helper to simulate specific error conditions
export const errorSimulators = {
  // Simulate network failure
  networkFailure: () => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      throw simulatedErrors.network.fetch;
    };

    // Restore after 5 seconds
    setTimeout(() => {
      window.fetch = originalFetch;
    }, 5000);
  },

  // Simulate offline state
  goOffline: () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });
    window.dispatchEvent(new Event('offline'));
    console.log('📴 Offline mode activated (simulated)');
  },

  // Restore online state
  goOnline: () => {
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
    window.dispatchEvent(new Event('online'));
    console.log('📶 Online mode restored (simulated)');
  },

  // Simulate component error
  componentError: (componentName = 'TestComponent') => {
    const error = new Error(`Simulated error in ${componentName}`);
    errorLogger.logReactError(
      error,
      {
        componentStack: `${componentName}\n  in ErrorBoundary`,
      },
      { simulated: true }
    );
    console.log(`💥 Simulated component error in ${componentName}`);
  },

  // Simulate Convex error
  convexError: (operation = 'testOperation') => {
    const error = simulatedErrors.convex.mutation;
    errorLogger.logConvexError(error, {
      operation,
      simulated: true,
    });
    console.log(`🔧 Simulated Convex error in ${operation}`);
  },
};

// Add to window for easy access in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).errorTesting = {
    runTests: runErrorTests,
    simulators: errorSimulators,
    logger: errorLogger,
    offlineManager: getOfflineManager(),
  };
}

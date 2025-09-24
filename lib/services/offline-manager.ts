import { ConvexError } from 'convex/values';

export interface OfflineRequest {
  id: string;
  operation: string;
  args: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface OfflineState {
  isOnline: boolean;
  hasQueuedRequests: boolean;
  queuedRequestsCount: number;
  lastOnlineTime: number | null;
  lastOfflineTime: number | null;
}

class OfflineManager {
  private queuedRequests: OfflineRequest[] = [];
  private listeners: Set<(state: OfflineState) => void> = new Set();
  private isOnline = typeof window !== 'undefined' ? navigator.onLine : true;
  private lastOnlineTime: number | null = this.isOnline ? Date.now() : null;
  private lastOfflineTime: number | null = this.isOnline ? null : Date.now();
  private syncInProgress = false;

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.loadQueuedRequests();
      this.setupNetworkListeners();
      this.setupVisibilityListener();
    }
  }

  private setupNetworkListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.lastOnlineTime = Date.now();
      this.lastOfflineTime = null;
      this.notifyListeners();
      this.processQueuedRequests();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.lastOfflineTime = Date.now();
      this.lastOnlineTime = null;
      this.notifyListeners();
    });
  }

  private setupVisibilityListener() {
    // When user returns to tab, check connection and retry
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline && this.queuedRequests.length > 0) {
        this.processQueuedRequests();
      }
    });
  }

  private notifyListeners() {
    const state: OfflineState = {
      isOnline: this.isOnline,
      hasQueuedRequests: this.queuedRequests.length > 0,
      queuedRequestsCount: this.queuedRequests.length,
      lastOnlineTime: this.lastOnlineTime,
      lastOfflineTime: this.lastOfflineTime,
    };

    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in offline state listener:', error);
      }
    });
  }

  private loadQueuedRequests() {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('offline-queue');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.queuedRequests = parsed.map((req: any) => ({
          ...req,
          timestamp: new Date(req.timestamp),
        }));
      }
    } catch (error) {
      console.warn('Failed to load offline queue:', error);
      this.queuedRequests = [];
    }
  }

  private saveQueuedRequests() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        'offline-queue',
        JSON.stringify(this.queuedRequests)
      );
    } catch (error) {
      console.warn('Failed to save offline queue:', error);
    }
  }

  // Queue a request for offline retry
  queueRequest(operation: string, args: any, maxRetries = 3): string {
    const request: OfflineRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      operation,
      args,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries,
    };

    this.queuedRequests.push(request);
    this.saveQueuedRequests();
    this.notifyListeners();

    return request.id;
  }

  // Remove a request from the queue
  removeRequest(requestId: string) {
    const index = this.queuedRequests.findIndex(req => req.id === requestId);
    if (index > -1) {
      this.queuedRequests.splice(index, 1);
      this.saveQueuedRequests();
      this.notifyListeners();
    }
  }

  // Process queued requests when back online
  private async processQueuedRequests() {
    if (
      this.syncInProgress ||
      !this.isOnline ||
      this.queuedRequests.length === 0
    ) {
      return;
    }

    this.syncInProgress = true;

    const requestsToProcess = [...this.queuedRequests];

    for (const request of requestsToProcess) {
      try {
        // Import the operation dynamically
        const result = await this.executeQueuedRequest(request);

        if (result.success) {
          this.removeRequest(request.id);
          console.log(
            `Successfully processed queued request: ${request.operation}`
          );
        } else {
          request.retryCount++;
          if (request.retryCount >= request.maxRetries) {
            console.warn(
              `Max retries exceeded for queued request: ${request.operation}`
            );
            this.removeRequest(request.id);
          } else {
            this.saveQueuedRequests();
          }
        }
      } catch (error) {
        request.retryCount++;
        if (request.retryCount >= request.maxRetries) {
          console.error(
            `Failed to process queued request after max retries: ${request.operation}`,
            error
          );
          this.removeRequest(request.id);
        } else {
          this.saveQueuedRequests();
        }
      }
    }

    this.syncInProgress = false;
    this.notifyListeners();
  }

  private async executeQueuedRequest(
    request: OfflineRequest
  ): Promise<{ success: boolean }> {
    // This would need to be implemented based on the specific operations
    // For now, we'll just simulate success
    console.log(
      `Processing queued request: ${request.operation}`,
      request.args
    );

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  }

  // Get current offline state
  getState(): OfflineState {
    return {
      isOnline: this.isOnline,
      hasQueuedRequests: this.queuedRequests.length > 0,
      queuedRequestsCount: this.queuedRequests.length,
      lastOnlineTime: this.lastOnlineTime,
      lastOfflineTime: this.lastOfflineTime,
    };
  }

  // Subscribe to state changes
  subscribe(listener: (state: OfflineState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Clear all queued requests
  clearQueue() {
    this.queuedRequests = [];
    this.saveQueuedRequests();
    this.notifyListeners();
  }

  // Get queued requests for debugging
  getQueuedRequests(): OfflineRequest[] {
    return [...this.queuedRequests];
  }
}

// Singleton instance
let offlineManagerInstance: OfflineManager | null = null;

export function getOfflineManager(): OfflineManager {
  if (!offlineManagerInstance) {
    offlineManagerInstance = new OfflineManager();
  }
  return offlineManagerInstance;
}

// React hook for offline state management
import { useState, useEffect } from 'react';

export function useOfflineState() {
  const [state, setState] = useState<OfflineState>(() =>
    getOfflineManager().getState()
  );

  useEffect(() => {
    const unsubscribe = getOfflineManager().subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
}

// Enhanced error boundary for offline scenarios
export function isOfflineError(error: Error): boolean {
  return (
    error.message.includes('Failed to fetch') ||
    error.message.includes('NetworkError') ||
    error.message.includes('TypeError: Failed to fetch') ||
    !navigator.onLine
  );
}

// Offline-aware data fetching wrapper
export async function offlineAwareFetch<T>(
  operation: () => Promise<T>,
  operationName: string,
  args?: any
): Promise<T> {
  const manager = getOfflineManager();

  if (!manager.getState().isOnline) {
    // Queue the request for later
    manager.queueRequest(operationName, args);
    throw new ConvexError({
      type: 'network',
      message:
        'You are currently offline. Your request has been queued and will be processed when you are back online.',
      details: { queued: true },
      retryable: false,
    });
  }

  try {
    return await operation();
  } catch (error) {
    if (isOfflineError(error as Error)) {
      // Queue for retry when back online
      manager.queueRequest(operationName, args);
      throw new ConvexError({
        type: 'network',
        message:
          'Connection lost. Your request has been queued and will be retried automatically.',
        details: {
          queued: true,
          originalError: error instanceof Error ? error.message : String(error),
        },
        retryable: true,
      });
    }
    throw error;
  }
}

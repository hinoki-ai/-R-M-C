/**
 * Rate Limiting Configuration
 *
 * Provides rate limiting for API endpoints to prevent abuse and ensure fair usage.
 * Supports different limits for different types of endpoints and user roles.
 */

import { NextRequest, NextResponse } from 'next/server';

// Extend globalThis to include our custom properties
declare global {
  var rateLimitStore: Map<string, { count: number; resetTime: number }> | undefined;
}

// Rate limit configurations
export const RATE_LIMITS = {
  // General API endpoints
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests',
      message: 'You have exceeded the request limit. Please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 auth requests per windowMs
    message: {
      error: 'Too many authentication attempts',
      message: 'Too many authentication attempts. Please wait before trying again.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Camera feeds and media endpoints
  camera: {
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 camera requests per minute
    message: {
      error: 'Camera access rate limited',
      message: 'Too many camera requests. Please wait before accessing camera feeds.',
      retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // File upload endpoints
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 uploads per hour
    message: {
      error: 'Upload rate limited',
      message: 'Too many file uploads. Please wait before uploading more files.',
      retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Admin endpoints
  admin: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // Allow more requests for admin users
    message: {
      error: 'Admin endpoint rate limited',
      message: 'Too many admin requests. Please wait before making more requests.',
      retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Public API endpoints (more restrictive)
  public: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Very restrictive for public endpoints
    message: {
      error: 'Public API rate limited',
      message: 'Too many public API requests. Please wait before making more requests.',
      retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
  }
} as const;

/**
 * Get rate limit configuration based on endpoint type
 */
export function getRateLimitConfig(endpointType: keyof typeof RATE_LIMITS) {
  return RATE_LIMITS[endpointType];
}

/**
 * Determine endpoint type from request path
 */
export function getEndpointType(pathname: string): keyof typeof RATE_LIMITS {
  if (pathname.startsWith('/api/auth') || pathname.includes('/clerk')) {
    return 'auth';
  }

  if (pathname.startsWith('/api/camera') || pathname.includes('/camera')) {
    return 'camera';
  }

  if (pathname.startsWith('/api/upload') || pathname.includes('/upload')) {
    return 'upload';
  }

  if (pathname.startsWith('/api/admin') || pathname.includes('/admin')) {
    return 'admin';
  }

  if (pathname.startsWith('/api/public') || pathname.includes('/public')) {
    return 'public';
  }

  return 'general';
}

/**
 * Note: Express rate limiting is handled by Next.js middleware
 * The createRateLimiter function has been removed as it requires server-side only packages
 */

/**
 * Next.js middleware for rate limiting
 */
export function createRateLimitMiddleware(endpointType: keyof typeof RATE_LIMITS = 'general') {
  const config = getRateLimitConfig(endpointType);

  return function rateLimitMiddleware(request: NextRequest) {
    // For Next.js middleware, we'll use a simple in-memory store
    // In production, consider using Redis or another distributed store
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
    const key = `${endpointType}:${clientIP}`;
    const now = Date.now();

    // Simple in-memory rate limiting (not suitable for production clusters)
    if (typeof globalThis !== 'undefined' && !globalThis.rateLimitStore) {
      globalThis.rateLimitStore = new Map();
    }

    const store = globalThis.rateLimitStore as Map<string, { count: number; resetTime: number }>;

    if (!store.has(key)) {
      store.set(key, { count: 1, resetTime: now + config.windowMs });
    } else {
      const data = store.get(key)!;

      if (now > data.resetTime) {
        // Reset the window
        data.count = 1;
        data.resetTime = now + config.windowMs;
      } else if (data.count >= config.max) {
        // Rate limit exceeded
        const response = NextResponse.json(config.message, {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((data.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': config.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(data.resetTime).toISOString(),
          },
        });
        return response;
      } else {
        data.count++;
      }
    }

    // Add rate limit headers to successful requests
    const data = store.get(key)!;
    const remaining = Math.max(0, config.max - data.count);

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', config.max.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(data.resetTime).toISOString());

    return response;
  };
}

/**
 * Convex HTTP endpoint rate limiter
 * This can be used in Convex HTTP actions
 */
export class ConvexRateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();

  constructor(private config: {
    windowMs: number;
    max: number;
    message: { error: string; message: string; retryAfter: string };
    standardHeaders: boolean;
    legacyHeaders: boolean;
  }) {}

  checkLimit(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const key = identifier;
    const now = Date.now();

    if (!this.store.has(key)) {
      this.store.set(key, { count: 1, resetTime: now + this.config.windowMs });
      return { allowed: true, remaining: this.config.max - 1 };
    }

    const data = this.store.get(key)!;

    if (now > data.resetTime) {
      // Reset the window
      data.count = 1;
      data.resetTime = now + this.config.windowMs;
      return { allowed: true, remaining: this.config.max - 1 };
    }

    if (data.count >= this.config.max) {
      return { allowed: false, resetTime: data.resetTime };
    }

    data.count++;
    return { allowed: true, remaining: this.config.max - data.count };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.store.entries()) {
      if (now > data.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

/**
 * Rate limiter instances for different endpoint types
 */
export const rateLimiters = {
  general: new ConvexRateLimiter(RATE_LIMITS.general),
  auth: new ConvexRateLimiter(RATE_LIMITS.auth),
  camera: new ConvexRateLimiter(RATE_LIMITS.camera),
  upload: new ConvexRateLimiter(RATE_LIMITS.upload),
  admin: new ConvexRateLimiter(RATE_LIMITS.admin),
  public: new ConvexRateLimiter(RATE_LIMITS.public),
};

/**
 * Clean up expired rate limit entries periodically
 */
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    Object.values(rateLimiters).forEach(limiter => limiter.cleanup());
  }, 60000); // Clean up every minute
}
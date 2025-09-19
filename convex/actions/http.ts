"use node";

import type { WebhookEvent } from '@clerk/backend';
import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';

import { internalMutation } from '../_generated/server';
import { internal } from '../_generated/api';
import { httpAction } from '../_generated/server';
import { transformWebhookData } from '../utils/paymentAttemptTypes';

// Rate limiting for Convex HTTP endpoints
class ConvexRateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();

  constructor(
    private windowMs: number,
    private maxRequests: number
  ) {}

  checkLimit(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const key = identifier;
    const now = Date.now();

    if (!this.store.has(key)) {
      this.store.set(key, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    const data = this.store.get(key)!;

    if (now > data.resetTime) {
      // Reset the window
      data.count = 1;
      data.resetTime = now + this.windowMs;
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    if (data.count >= this.maxRequests) {
      return { allowed: false, resetTime: data.resetTime };
    }

    data.count++;
    return { allowed: true, remaining: this.maxRequests - data.count };
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

// Rate limiters for different endpoint types
const webhookLimiter = new ConvexRateLimiter(60 * 1000, 10); // 10 webhooks per minute
const apiLimiter = new ConvexRateLimiter(60 * 1000, 60); // 60 API calls per minute

// Clean up expired rate limit entries periodically
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    webhookLimiter.cleanup();
    apiLimiter.cleanup();
  }, 60000); // Clean up every minute
}

const http = httpRouter();

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Apply rate limiting for webhook endpoints
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    const rateLimitResult = webhookLimiter.checkLimit(`webhook:${clientIP}`);

    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime || Date.now() + 60000;
      return new Response(
        JSON.stringify({
          error: 'Too many webhook requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetTime).toISOString(),
          },
        }
      );
    }

    const event = await validateRequest(request);
    if (!event) {
      return new Response('Error occured', { status: 400 });
    }
    switch ((event as any).type) {
      case 'user.created': // intentional fallthrough
      case 'user.updated':
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data as any,
        });
        break;

      case 'user.deleted': {
        const clerkUserId = (event.data as any).id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }

      case 'paymentAttempt.updated': {
        const paymentAttemptData = transformWebhookData((event as any).data);
        await ctx.runMutation(internal.payment_attempts.savePaymentAttempt, {
          paymentAttemptData,
        });
        break;
      }



      default:
        console.log('Ignored webhook event', (event as any).type);
    }

    // Return success response with rate limit headers
    const response = new Response(null, { status: 200 });
    if (rateLimitResult.remaining !== undefined) {
      response.headers.set('X-RateLimit-Limit', '10');
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    }
    return response;
  }),
});

// Health check endpoint with rate limiting
http.route({
  path: '/health',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    // Apply rate limiting for health checks (more permissive)
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    const rateLimitResult = apiLimiter.checkLimit(`health:${clientIP}`);

    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime || Date.now() + 60000;
      return new Response(
        JSON.stringify({
          error: 'Too many health check requests',
          status: 'rate_limited'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Return health status
    const response = new Response(
      JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': (rateLimitResult.remaining || 59).toString(),
        },
      }
    );

    return response;
  }),
});

// API status endpoint
http.route({
  path: '/api/status',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    // Apply rate limiting for status endpoint
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    const rateLimitResult = apiLimiter.checkLimit(`status:${clientIP}`);

    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime || Date.now() + 60000;
      return new Response(
        JSON.stringify({
          error: 'Too many status requests',
          status: 'rate_limited'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Get basic stats from Convex (simplified for HTTP action)
    return new Response(
      JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        stats: {
          users: 0, // Would need to call a query function
          cameras: 0, // Would need to call a query function
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': (rateLimitResult.remaining || 59).toString(),
        },
      }
    );
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook event', error);
    return null;
  }
}

export default http;
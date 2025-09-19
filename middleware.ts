import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import { createRateLimitMiddleware, getEndpointType } from './lib/utils/rate-limiter';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// Combined middleware that handles both Clerk authentication and rate limiting
export default clerkMiddleware(async (auth, req) => {
  // Handle Clerk authentication first
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Apply rate limiting to all requests
  const rateLimitResponse = applyRateLimiting(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  return NextResponse.next();
});

// Rate limiting function
function applyRateLimiting(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Skip rate limiting for static assets, Next.js internals, and health checks
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/sw.js') ||
    pathname === '/api/health' ||
    pathname === '/'
  ) {
    return null;
  }

  // Determine endpoint type and apply appropriate rate limiting
  const endpointType = getEndpointType(pathname);
  const rateLimitMiddleware = createRateLimitMiddleware(endpointType);

  return rateLimitMiddleware(request) as NextResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
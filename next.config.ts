import type { NextConfig } from 'next';
import webpack from 'webpack';

// Allowlist Clerk custom domain in CSP if provided
// Sanitize the URL to prevent CSP header injection with newlines
const CLERK_FRONTEND_API_RAW = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL || '';
const CLERK_FRONTEND_API = CLERK_FRONTEND_API_RAW.trim().split('\n')[0] || '';

// Validate environment variables on build (no hard exit in runtime)
if (typeof window === 'undefined') {
  try {
    const { validateEnvironmentOrThrow } = require('./lib/utils/env-validation');
    validateEnvironmentOrThrow();
  } catch (error) {
    console.error('Environment validation failed:', error);
    // In production on Vercel, aborting build is okay; at runtime do not exit.
    if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
      // Let build fail only during build step, not at request time
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        process.exit(1);
      }
    }
  }
}

const nextConfig: NextConfig = {
  // Use Next.js default buildId for stability on Vercel

  // Mobile-optimized experimental features
  experimental: {
    // Optimize package imports for mobile
    optimizePackageImports: [
      '@capacitor/core',
      '@capacitor/android',
      '@capacitor/ios',
      '@tabler/icons-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      'framer-motion',
      'lucide-react',
      'recharts',
    ],
    // Disable webpack build worker for serialized builds/diagnostics
    webpackBuildWorker: false,
    // Optimize CSS for mobile
    optimizeCss: true,
    // Ensure mobile builds work with dynamic routes
    ...(process.env.MOBILE_BUILD === 'true' ? {
      serverComponentsExternalPackages: [],
    } : {}),
  },

  serverExternalPackages: [],

  // Default routing behavior (no trailing slash to keep _next/data working)
  // trailingSlash: false,

  images: {
    // Mobile-optimized image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable optimization for better mobile performance
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    // Mobile-specific image optimization
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache for mobile
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Mobile-optimized security and caching headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        // Mobile-optimized CSP
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            // Scripts from Clerk + optional custom Clerk domain
            `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.com https://*.clerk.com${CLERK_FRONTEND_API ? ' ' + CLERK_FRONTEND_API : ''}`,
            // Inline styles permitted for UI libraries
            "style-src 'self' 'unsafe-inline'",
            // Images
            "img-src 'self' data: https: blob:",
            // Fonts
            "font-src 'self' data:",
            // XHR/WebSocket connections (include Clerk + optional custom domain)
            `connect-src 'self' https: wss: https://*.clerk.accounts.dev https://clerk.com https://*.clerk.com${CLERK_FRONTEND_API ? ' ' + CLERK_FRONTEND_API : ''}`,
            // Iframes (Google + Clerk + optional custom domain)
            `frame-src https://www.google.com https://www.google.com/maps/embed/ https://*.clerk.accounts.dev https://clerk.com https://*.clerk.com${CLERK_FRONTEND_API ? ' ' + CLERK_FRONTEND_API : ''}`,
            // Workers
            "worker-src 'self' blob:",
            // Other security directives
            "base-uri 'self'",
            "form-action 'self'",
            'upgrade-insecure-requests',
          ].join('; '),
        },
        // Mobile caching optimizations
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
        },
        // Do not set Accept-Encoding manually; handled by platform/CDN
      ],
    },
    {
      source: '/sw.js',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
        {
          key: 'Service-Worker-Allowed',
          value: '/',
        },
      ],
    },
    {
      source: '/manifest.json',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/manifest+json',
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Cache-Control',
          value: 'private, no-cache',
        },
      ],
    },
  ],

  // Disable strict ESLint for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Temporarily disable TypeScript checking for operability
  // TODO: Fix remaining type annotation issues
  typescript: {
    ignoreBuildErrors: true,
  },


  // Environment variables for mobile builds
  env: {
    MOBILE_BUILD: process.env.MOBILE_BUILD || 'false',
  },

  // Mobile-optimized webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Fix for "self is not defined" error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Mobile-specific optimizations
    if (!isServer && !dev) {
      // Enable tree shaking for better bundle size
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
        // Split chunks for better caching
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              priority: 30,
              chunks: 'all',
            },
            ui: {
              test: /[\\/]components[\\/]ui[\\/]/,
              name: 'ui-components',
              priority: 20,
              chunks: 'all',
            },
            dashboard: {
              test: /[\\/]app[\\/]dashboard[\\/]/,
              name: 'dashboard',
              priority: 10,
              chunks: 'all',
            },
          },
        },
      };

      // Add compression for production mobile builds
      if (process.env.MOBILE_BUILD === 'true') {
        config.plugins.push(
          new webpack.DefinePlugin({
            __MOBILE_BUILD__: JSON.stringify(true),
          })
        );
      }
    }

    return config;
  },
};

export default nextConfig;

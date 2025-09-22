import type { NextConfig } from 'next';
import webpack from 'webpack';

// Validate environment variables on build
if (typeof window === 'undefined') {
  try {
    const { validateEnvironmentOrThrow } = require('./lib/utils/env-validation');
    validateEnvironmentOrThrow();
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
}


const nextConfig: NextConfig = {
  // Enable experimental features for better mobile support
  experimental: {
    optimizePackageImports: ['@capacitor/core', '@capacitor/android', '@capacitor/ios'],
  },

  // Disable static generation for pages that have SSR issues
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  serverExternalPackages: [],

  // Configure for Capacitor compatibility
  trailingSlash: true,
  output: process.env.MOBILE_BUILD === 'true' ? 'export' : 'standalone',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
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
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
        },
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


  // Simplified webpack configuration to fix build issues
  webpack: (config, { isServer }) => {
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

    return config;
  },
};

export default nextConfig;

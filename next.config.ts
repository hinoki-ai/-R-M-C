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
  serverExternalPackages: [],

  // Disable static optimization to avoid build issues
  trailingSlash: true,
  output: 'standalone',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },

  // PWA and mobile optimizations
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
      ],
    },
  ],

  // Disable strict ESLint for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript checking for deployment
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

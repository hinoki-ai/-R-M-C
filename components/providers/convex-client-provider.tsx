'use client';

import { useAuth } from '@clerk/nextjs';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ReactNode, useMemo } from 'react';

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize Convex client inside the component to avoid module-level issues
  const convex = useMemo(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

    console.log('ConvexClientProvider - Initializing Convex client');
    console.log('NEXT_PUBLIC_CONVEX_URL:', convexUrl);

    if (!convexUrl || !convexUrl.startsWith('https://') || !convexUrl.includes('.convex.cloud')) {
      console.warn('Invalid or missing Convex URL - running without Convex');
      return null;
    }

    try {
      return new ConvexReactClient(convexUrl);
    } catch (error) {
      console.error('Failed to initialize Convex client:', error);
      return null;
    }
  }, []);

  // If Convex is not initialized, just render children without Convex
  if (!convex) {
    return <>{children}</>;
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

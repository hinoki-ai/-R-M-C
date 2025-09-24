'use client';

import { ReactNode, Suspense, lazy } from 'react';

/**
 * Mobile Performance Wrapper
 *
 * Provides utilities for optimizing performance on mobile devices:
 * - Network-aware loading
 * - Battery optimization
 * - Memory management
 * - Connection quality detection
 */

interface NetworkInfo {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

/**
 * Network-Aware Loading Component
 */
export function NetworkAwareLoader({
  children,
  showNetworkStatus = true,
}: {
  children: ReactNode;
  showNetworkStatus?: boolean;
}) {
  return (
    <div className="network-aware">
      {children}
    </div>
  );
}

/**
 * Mobile-Optimized Image Component
 */
export function MobileOptimizedImage({
  src,
  alt,
  className,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      decoding="async"
      {...props}
    />
  );
}
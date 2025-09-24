'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Mobile Performance Optimization Hook
 *
 * Provides utilities for optimizing performance on mobile devices:
 * - Network-aware loading
 * - Battery optimization
 * - Memory management
 * - Connection quality detection
 */

// Extend Navigator interface for non-standard APIs
declare global {
  interface Navigator {
    connection?: {
      effectiveType: string;
      downlink: number;
      rtt: number;
      saveData: boolean;
      addEventListener: (event: string, handler: () => void) => void;
      removeEventListener: (event: string, handler: () => void) => void;
    };
    mozConnection?: Navigator['connection'];
    webkitConnection?: Navigator['connection'];
    getBattery?: () => Promise<{
      charging: boolean;
      chargingTime: number;
      dischargingTime: number;
      level: number;
      addEventListener: (event: string, handler: () => void) => void;
      removeEventListener: (event: string, handler: () => void) => void;
    }>;
  }
}

interface NetworkInfo {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface BatteryInfo {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

export interface MobilePerformanceConfig {
  // Network-based optimizations
  enableNetworkAwareLoading: boolean;
  slowConnectionThreshold: number; // Mbps

  // Battery optimizations
  enableBatteryOptimization: boolean;
  lowBatteryThreshold: number; // 0-1

  // Memory management
  enableMemoryOptimization: boolean;
  memoryCleanupInterval: number; // ms

  // Feature toggles based on device capabilities
  disableHeavyAnimations: boolean;
  reduceImageQuality: boolean;
  disableRealTimeUpdates: boolean;
}

const DEFAULT_CONFIG: MobilePerformanceConfig = {
  enableNetworkAwareLoading: true,
  slowConnectionThreshold: 1.5, // 1.5 Mbps
  enableBatteryOptimization: true,
  lowBatteryThreshold: 0.2, // 20%
  enableMemoryOptimization: true,
  memoryCleanupInterval: 30000, // 30 seconds
  disableHeavyAnimations: false,
  reduceImageQuality: false,
  disableRealTimeUpdates: false,
};

export function useMobilePerformance(config: Partial<MobilePerformanceConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [isLowBattery, setIsLowBattery] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        ('ontouchstart' in window && window.innerWidth <= 768);

      setIsMobileDevice(isMobile);
    };

    checkMobile();
  }, []);

  // Network information monitoring
  useEffect(() => {
    if (!finalConfig.enableNetworkAwareLoading || !isMobileDevice) return;

    const updateNetworkInfo = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (connection) {
        const info: NetworkInfo = {
          effectiveType: (connection.effectiveType as NetworkInfo['effectiveType']) || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 50,
          saveData: connection.saveData || false,
        };

        setNetworkInfo(info);
        setIsSlowConnection(
          info.downlink < finalConfig.slowConnectionThreshold ||
          info.effectiveType === 'slow-2g' ||
          info.effectiveType === '2g' ||
          info.saveData
        );
      }
    };

    updateNetworkInfo();

    // Listen for network changes
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, [finalConfig.enableNetworkAwareLoading, finalConfig.slowConnectionThreshold, isMobileDevice]);

  // Battery information monitoring
  useEffect(() => {
    if (!finalConfig.enableBatteryOptimization || !isMobileDevice) return;

    const updateBatteryInfo = async () => {
      try {
        const battery = await navigator.getBattery?.();

        if (battery) {
          const info: BatteryInfo = {
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
            level: battery.level,
          };

          setBatteryInfo(info);
          setIsLowBattery(info.level < finalConfig.lowBatteryThreshold && !info.charging);
        }
      } catch (error) {
        console.warn('Battery API not supported:', error);
      }
    };

    updateBatteryInfo();

    // Listen for battery changes
    const batteryPromise = navigator.getBattery?.();
    if (batteryPromise) {
      batteryPromise.then((battery) => {
        const updateBattery = () => updateBatteryInfo();

        battery.addEventListener('chargingchange', updateBattery);
        battery.addEventListener('levelchange', updateBattery);

        return () => {
          battery.removeEventListener('chargingchange', updateBattery);
          battery.removeEventListener('levelchange', updateBattery);
        };
      });
    }
  }, [finalConfig.enableBatteryOptimization, finalConfig.lowBatteryThreshold, isMobileDevice]);

  // Memory cleanup
  useEffect(() => {
    if (!finalConfig.enableMemoryOptimization || !isMobileDevice) return;

    const cleanup = () => {
      // Force garbage collection if available (dev tools only)
      if ('gc' in window) {
        // @ts-ignore
        window.gc();
      }

      // Clear unused caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('temp') || name.includes('unused')) {
              caches.delete(name);
            }
          });
        });
      }
    };

    const interval = setInterval(cleanup, finalConfig.memoryCleanupInterval);
    return () => clearInterval(interval);
  }, [finalConfig.enableMemoryOptimization, finalConfig.memoryCleanupInterval, isMobileDevice]);

  // Computed performance settings based on device state
  const performanceSettings = {
    // Reduce animations on slow connections or low battery
    disableHeavyAnimations: finalConfig.disableHeavyAnimations ||
      (isMobileDevice && (isSlowConnection || isLowBattery)),

    // Reduce image quality on slow connections
    reduceImageQuality: finalConfig.reduceImageQuality ||
      (isMobileDevice && isSlowConnection),

    // Disable real-time updates on slow connections or low battery
    disableRealTimeUpdates: finalConfig.disableRealTimeUpdates ||
      (isMobileDevice && (isSlowConnection || isLowBattery)),

    // Network-aware loading priority
    loadingPriority: isSlowConnection ? 'lazy' : 'eager',

    // Battery-aware polling intervals
    pollingInterval: isLowBattery ? 60000 : 30000, // 1min vs 30sec
  };

  // Lazy loading helper with network awareness
  const createLazyComponent = useCallback((importFn: () => Promise<any>) => {
    return async () => {
      // Delay loading on slow connections
      if (isSlowConnection) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      return importFn();
    };
  }, [isSlowConnection]);

  // Network-aware API calls
  const networkAwareFetch = useCallback(async (url: string, options?: RequestInit) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), isSlowConnection ? 10000 : 5000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        // Reduce priority on slow connections
        priority: isSlowConnection ? 'low' : 'auto',
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, [isSlowConnection]);

  return {
    // Device detection
    isMobileDevice,
    isSlowConnection,
    isLowBattery,

    // Raw sensor data
    networkInfo,
    batteryInfo,

    // Computed performance settings
    performanceSettings,

    // Utility functions
    createLazyComponent,
    networkAwareFetch,

    // Configuration
    config: finalConfig,
  };
}

// Hook for battery-aware real-time updates
export function useBatteryAwareUpdates(enabled: boolean = true) {
  const { isLowBattery, isMobileDevice } = useMobilePerformance();

  const [updateInterval, setUpdateInterval] = useState(enabled ? 30000 : 0);

  useEffect(() => {
    if (!enabled || !isMobileDevice) return;

    // Reduce update frequency when battery is low
    const newInterval = isLowBattery ? 120000 : 30000; // 2min vs 30sec
    setUpdateInterval(newInterval);
  }, [isLowBattery, isMobileDevice, enabled]);

  return {
    updateInterval,
    shouldUpdate: updateInterval > 0,
    isBatteryOptimized: isLowBattery,
  };
}

// Hook for network-aware image loading
export function useNetworkAwareImage() {
  const { isSlowConnection, isMobileDevice } = useMobilePerformance();

  const getImageConfig = useCallback(() => {
    if (!isMobileDevice) {
      return { quality: 90, priority: 'high' as const };
    }

    if (isSlowConnection) {
      return { quality: 60, priority: 'low' as const };
    }

    return { quality: 75, priority: 'auto' as const };
  }, [isSlowConnection, isMobileDevice]);

  return {
    imageConfig: getImageConfig(),
    isSlowConnection,
    shouldLazyLoad: isMobileDevice && isSlowConnection,
  };
}
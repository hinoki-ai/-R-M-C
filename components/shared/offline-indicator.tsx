'use client';

import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

import { usePWAStatus } from '@/hooks/use-pwa';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function OfflineIndicator({ className, showDetails = true }: OfflineIndicatorProps) {
  const { isOnline, serviceWorkerRegistered } = usePWAStatus();
  const [showIndicator, setShowIndicator] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowIndicator(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // Show "back online" message briefly
      setShowIndicator(true);
      const timer = setTimeout(() => setShowIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!showIndicator) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-orange-600 text-white',
        className
      )}
    >
      <div className='max-w-7xl mx-auto px-4 py-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            {isOnline ? (
              <Wifi className='h-4 w-4' />
            ) : (
              <WifiOff className='h-4 w-4' />
            )}
            <span className='text-sm font-medium'>
              {isOnline ? 'Conexión Restablecida' : 'Sin Conexión a Internet'}
            </span>
          </div>

          {showDetails && !isOnline && (
            <div className='flex items-center space-x-4 text-xs'>
              <div className='flex items-center space-x-1'>
                <AlertTriangle className='h-3 w-3' />
                <span>Modo offline activado</span>
              </div>
              {serviceWorkerRegistered && (
                <span className='text-green-200'>
                  ✓ Contenido en caché disponible
                </span>
              )}
            </div>
          )}

          {isOnline && wasOffline && (
            <span className='text-xs text-green-200'>
              Sincronizando datos...
            </span>
          )}
        </div>

        {showDetails && !isOnline && (
          <div className='mt-2 text-xs opacity-90'>
            <p>
              Puedes continuar usando la aplicación con funcionalidades limitadas.
              Los cambios se sincronizarán automáticamente cuando recuperes la conexión.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for components that need to know online status
export function useOfflineStatus() {
  const { isOnline } = usePWAStatus();
  const [wasOffline, setWasOffline] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    }
  }, [isOnline]);

  return {
    isOnline,
    wasOffline,
    justCameBackOnline: wasOffline && isOnline,
  };
}

// Component for showing offline-specific content
export function OfflineContent({ children, fallback }: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isOnline } = usePWAStatus();

  if (!isOnline && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Network status badge component
export function NetworkStatusBadge({ className }: { className?: string }) {
  const { isOnline } = usePWAStatus();

  return (
    <div
      className={cn(
        'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
        isOnline
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        className
      )}
    >
      {isOnline ? (
        <Wifi className='h-3 w-3' />
      ) : (
        <WifiOff className='h-3 w-3' />
      )}
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
}
import { useEffect, useState } from 'react';

import { getPWAController, PWAStatus } from '@/lib/services/pwa';

export function usePWAStatus(): PWAStatus {
  const [status, setStatus] = useState<PWAStatus>({
    isSupported: false,
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    serviceWorkerRegistered: false,
    serviceWorkerState: null,
  });

  useEffect(() => {
    const controller = getPWAController();
    setStatus(controller.getStatus());

    const unsubscribe = controller.subscribeToUpdates(setStatus);
    return unsubscribe;
  }, []);

  return status;
}

export function usePWAController() {
  const [controller] = useState(() => getPWAController());

  return {
    install: controller.install.bind(controller),
    requestNotificationPermission: controller.requestNotificationPermission.bind(controller),
    getStatus: controller.getStatus.bind(controller),
  };
}
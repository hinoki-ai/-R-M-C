'use client';

import { useUser } from '@clerk/nextjs';
import { BackButton } from '@/components/shared/back-button';
import { Suspense } from 'react';

function NotificationsContent() {
  const { user } = useUser();

  return (
    <>
      <BackButton className="mb-6" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Basic notification system. Advanced motion detection notifications
          have been removed.
        </p>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This is a simplified notifications page. Motion detection and
            complex notification systems have been removed to keep the codebase
            maintainable.
          </p>
        </div>
      </div>
    </>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <NotificationsContent />
    </Suspense>
  );
}

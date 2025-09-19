import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';

export default async function NotificationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <DashboardLayout
      user={{
        id: userId,
        name: 'User', // This would come from your user data
        email: '', // Email would come from user data
        role: 'user' as const,
        isAdmin: false,
      }}
      showBreadcrumbs={true}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Basic notification system. Advanced motion detection notifications have been removed.
        </p>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This is a simplified notifications page. Motion detection and complex notification systems have been removed to keep the codebase maintainable.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const metadata = {
  title: 'Motion Notifications - Pinto Pellines',
  description: 'Real-time motion detection notifications and alert system',
};
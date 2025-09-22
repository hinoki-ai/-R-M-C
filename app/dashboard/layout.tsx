'use client';

export const dynamic = 'force-dynamic';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AppSidebar } from '@/app/dashboard/app-sidebar';
import { LoadingBar } from '@/app/dashboard/loading-bar';
import { SiteHeader } from '@/app/dashboard/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardErrorBoundary } from '@/components/dashboard/dashboard-error-boundary';

function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <LoadingBar />
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6 lg:gap-8 lg:py-8'>
              <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
                {children}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  // Don't render anything if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

  return (
    <SidebarProvider
      style={
        {
          // 16rem = 256px for desktop sidebar width
          '--sidebar-width': '16rem',
          '--sidebar-width-icon': '3rem',
          '--header-height': '3rem',
        } as React.CSSProperties
      }
      className='group/layout'
    >
      <SidebarContent>
        <DashboardErrorBoundary>
          {children}
        </DashboardErrorBoundary>
      </SidebarContent>
    </SidebarProvider>
  );
}
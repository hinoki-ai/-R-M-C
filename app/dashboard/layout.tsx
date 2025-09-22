'use client';

export const dynamic = 'force-dynamic';

import { AppSidebar } from '@/app/dashboard/app-sidebar';
import { LoadingBar } from '@/app/dashboard/loading-bar';
import { SiteHeader } from '@/app/dashboard/site-header';
import { DashboardErrorBoundary } from '@/components/dashboard/dashboard-error-boundary';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
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
  // Since middleware protects /dashboard routes, we can assume user is authenticated
  // No need for additional client-side auth checks that could cause conflicts

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
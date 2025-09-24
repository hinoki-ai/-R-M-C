'use client';

// Force dynamic rendering for all dashboard routes to avoid prerendering issues
export const dynamic = 'force-dynamic';

import { AppSidebar } from '@/app/dashboard/app-sidebar';
import { LoadingBar } from '@/app/dashboard/loading-bar';
import { DashboardErrorBoundary } from '@/components/dashboard/dashboard-error-boundary';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NetworkAwareLoader } from '@/components/mobile/mobile-performance-wrapper';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconBell, IconSearch, IconSettings } from '@tabler/icons-react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/router-context';
import { getBreadcrumbs as getNavBreadcrumbs } from '@/lib/dashboard-navigation';

function SidebarContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { open, setOpen } = useSidebar();

  // Prevent SSR issues with client-side hooks
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    // Register service worker for mobile optimization
    if ('serviceWorker' in navigator && !window.location.hostname.includes('localhost')) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('[SW] Registered successfully:', registration.scope);

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('[SW] New version available');
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('[SW] Registration failed:', error);
        });
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-1 flex-col ml-0 md:ml-[300px] transition-all duration-300">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2 py-2 sm:gap-4 sm:py-4 md:gap-6 md:py-6 lg:gap-8 lg:py-8">
              <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use shared breadcrumb builder for consistency
  const breadcrumbs = getNavBreadcrumbs(pathname);

  return (
    <>
      <ScrollProgress />
      <AppSidebar />
      <div className="flex flex-1 flex-col ml-0 md:ml-[300px] transition-all duration-300">
        <LoadingBar />
        <header
          className={cn(
            'sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 transition-all duration-300 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12',
            isScrolled &&
              'bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm'
          )}
        >
          <div className="flex items-center gap-2 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="-ml-1"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.url} className="flex items-center">
                    {index > 0 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={breadcrumb.url}>{breadcrumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="ml-auto flex items-center gap-2 px-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={ROUTES.DASHBOARD_SEARCH}>
                <IconSearch className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon">
              <IconBell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href={ROUTES.DASHBOARD_SETTINGS}>
                <IconSettings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2 py-2 sm:gap-4 sm:py-4 md:gap-6 md:py-6 lg:gap-8 lg:py-8">
              <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
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
    <SidebarProvider>
      <div className="group/layout min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <NetworkAwareLoader>
          <SidebarContent>
            <DashboardErrorBoundary>{children}</DashboardErrorBoundary>
          </SidebarContent>
        </NetworkAwareLoader>
      </div>
    </SidebarProvider>
  );
}

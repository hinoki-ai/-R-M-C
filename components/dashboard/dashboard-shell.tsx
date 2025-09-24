'use client';

import { AppSidebar } from '@/app/dashboard/app-sidebar';
import { LoadingBar } from '@/app/dashboard/loading-bar';
import { DashboardErrorBoundary } from '@/components/dashboard/dashboard-error-boundary';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useCurrentRoute } from '@/lib/router-context';
import { getBreadcrumbs as getNavBreadcrumbs } from '@/lib/dashboard-navigation';
import { useEffect, useState } from 'react';
import { IconBell, IconSearch, IconSettings } from '@tabler/icons-react';
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
import Link from 'next/link';

function SidebarContent({ children }: { children: React.ReactNode }) {
  const currentRoute = useCurrentRoute();
  const [isScrolled, setIsScrolled] = useState(false);
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const breadcrumbs = getNavBreadcrumbs(currentRoute.path);

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
                          <Link
                            href={breadcrumb.url}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {breadcrumb.label}
                          </Link>
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
              <Link href="/dashboard/search">
                <IconSearch className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon">
              <IconBell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/settings">
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

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="group/layout min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <SidebarContent>
          <DashboardErrorBoundary>{children}</DashboardErrorBoundary>
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
}

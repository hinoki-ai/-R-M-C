'use client';

import { useCurrentRoute } from '@/lib/router-context';

import { ModeToggle } from '@/components/layout/mode-toggle';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

function getPageTitle(path: string): string {
  // Handle exact matches first
  switch (path) {
    case '/dashboard':
      return 'Dashboard';
    case '/dashboard/payment-gated':
      return 'Payment gated';
    default:
      return 'Page';
  }
}

export function SiteHeader() {
  const currentRoute = useCurrentRoute();
  const pageTitle = getPageTitle(currentRoute.path);
  const { open, setOpen } = useSidebar();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="-ml-1"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2 px-4">
        <ModeToggle />
      </div>
    </header>
  );
}

"use client";

export const dynamic = "force-dynamic";

import { AppSidebar } from "@/app/dashboard/app-sidebar";
import { LoadingBar } from "@/app/dashboard/loading-bar";
import { SiteHeader } from "@/app/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <LoadingBar />
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
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
  return (
    <SidebarProvider
      style={
        {
          // 64 * 0.25rem = 16rem to match default desktop sidebar width
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="group/layout"
    >
      <SidebarContent>{children}</SidebarContent>
    </SidebarProvider>
  );
}
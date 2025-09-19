"use client";

import { AppSidebar } from "@/app/dashboard/app-sidebar";
import { LoadingBar } from "@/app/dashboard/loading-bar";
import { SiteHeader } from "@/app/dashboard/site-header";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { useEdgeSwipe } from "@/hooks/use-edge-swipe";
import { Protect } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function UpgradeCard() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
            Parking Dashboard - Upgrade Required
          </h1>
          <p className="text-lg text-muted-foreground">
            Upgrade to access the full parking management dashboard with advanced analytics and monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Enable edge swipe gesture for mobile sidebar
  useEdgeSwipe();

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
    <Protect
      condition={(has) => {
        // Check if user has any of the paid plans
        return !has({ plan: "free_user" });
      }}
      fallback={<UpgradeCard />}
    >
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
    </Protect>
  );
}
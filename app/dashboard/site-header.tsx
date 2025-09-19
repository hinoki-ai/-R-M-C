"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  IconSearch,
  IconBell,
  IconSettings,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader({ tab }: { tab?: string }) {
  const pathname = usePathname();

  const getTitle = () => {
    // Prefer explicit prop if provided; otherwise derive from path
    const inferredTab =
      tab ||
      (() => {
        const segments = pathname.split("/").filter(Boolean);
        // Expect paths like /dashboard, /dashboard/<section>
        if (segments[0] === "dashboard" && segments.length >= 2) {
          return segments[1];
        }
        return "overview";
      })();

    switch (inferredTab) {
      case "overview":
        return "Dashboard Overview";
      case "revenue":
        return "Revenue Management";
      case "customers":
        return "Customer Management";
      case "maintenance":
        return "Maintenance Operations";
      case "pricing":
        return "Pricing Management";
      case "calendar":
        return "Calendar System";
      case "search":
        return "Search";
      case "settings":
        return "Settings";
      case "help":
        return "Help & Documentation";
      default:
        return "Dashboard Overview";
    }
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      { title: "Dashboard", url: "/dashboard" },
    ];

    if (segments[0] === "dashboard" && segments.length > 1) {
      const section = segments[1];

      // Add section breadcrumb
      switch (section) {
        case "customers":
          breadcrumbs.push({
            title: "Customer Management",
            url: "/dashboard/customers",
          });
          break;
        case "revenue":
          breadcrumbs.push({
            title: "Revenue",
            url: "/dashboard/revenue",
          });
          break;
        case "maintenance":
          breadcrumbs.push({
            title: "Maintenance",
            url: "/dashboard/maintenance",
          });
          break;
        case "calendar":
          breadcrumbs.push({
            title: "Calendar",
            url: "/dashboard/calendar",
          });
          break;
        case "settings":
          breadcrumbs.push({
            title: "Settings",
            url: "/dashboard/settings",
          });
          break;
        case "search":
          breadcrumbs.push({
            title: "Search",
            url: "/dashboard/search",
          });
          break;
        case "help":
          breadcrumbs.push({
            title: "Help",
            url: "/dashboard/help",
          });
          break;
      }

      // Add sub-section if exists
      if (segments.length > 2) {
        const subsection = segments[2];
        breadcrumbs.push({
          title: subsection.charAt(0).toUpperCase() + subsection.slice(1),
          url: pathname,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.url} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={breadcrumb.url}>{breadcrumb.title}</Link>
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
  );
}
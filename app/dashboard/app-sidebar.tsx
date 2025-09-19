"use client";

import {
  IconActivity,
  IconAlertTriangle,
  IconBolt,
  IconBrain,
  IconBuilding,
  IconCalendar,
  IconCalendarEvent,
  IconCalendarPlus,
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconClipboardList,
  IconConfetti,
  IconCpu,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconDesk,
  IconDeviceMobile,
  IconDog,
  IconEye,
  IconFileReport,
  IconFileText,
  IconFileTypography,
  IconHelp,
  IconHome,
  IconMail,
  IconMapPin,
  IconMessageCircle,
  IconReceipt,
  IconReport,
  IconSearch,
  IconSettings,
  IconShield,
  IconSparkles,
  IconStar,
  IconTool,
  IconTrendingUp,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";

import { NavMain } from "@/app/dashboard/nav-main";
import { NavSecondary } from "@/app/dashboard/nav-secondary";
import { NavUser } from "@/app/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface SidebarProps {
  children?: React.ReactNode;
}

export function AppSidebar(props: SidebarProps) {
  const data = {
    navMain: [
      {
        title: "Parking Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
        items: [
          {
            title: "Overview",
            url: "/dashboard",
            icon: IconHome,
          },
          {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: IconChartBar,
          },
          {
            title: "Parking Monitor",
            url: "/dashboard/monitor",
            icon: IconEye,
          },
        ],
      },
      {
        title: "Operations",
        url: "/dashboard/operations",
        icon: IconActivity,
        items: [
          {
            title: "Revenue Management",
            url: "/dashboard/revenue",
            icon: IconCreditCard,
          },
          {
            title: "Maintenance",
            url: "/dashboard/maintenance",
            icon: IconTool,
          },
          {
            title: "Customer Management",
            url: "/dashboard/customers",
            icon: IconUsers,
          },
          {
            title: "Infractions",
            url: "/dashboard/infractions",
            icon: IconAlertTriangle,
          },
        ],
      },
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: IconFileReport,
        items: [
          {
            title: "Automated Reports",
            url: "/dashboard/reports/automated",
            icon: IconFileText,
          },
          {
            title: "Custom Reports",
            url: "/dashboard/reports/custom",
            icon: IconClipboardList,
          },
        ],
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: IconSettings,
        items: [
          {
            title: "General Settings",
            url: "/dashboard/settings",
            icon: IconSettings,
          },
          {
            title: "Pricing Engine",
            url: "/dashboard/settings/pricing",
            icon: IconTrendingUp,
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Help & Support",
        url: "/dashboard/help",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "/dashboard/search",
        icon: IconSearch,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <IconBuilding className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Parking Manager</span>
                  <span className="truncate text-xs">Pinto Los Pellines</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
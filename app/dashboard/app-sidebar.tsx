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
  IconCamera,
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconClipboardList,
  IconCloud,
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
  IconTrophy,
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
import { usePathname } from "next/navigation";

interface SidebarProps {
  children?: React.ReactNode;
}

export function AppSidebar(props: SidebarProps) {
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
        items: [
          {
            title: "Overview",
            url: "/dashboard",
            icon: IconHome,
          },
          {
            title: "Announcements",
            url: "/dashboard/announcements",
            icon: IconFileText,
          },
          {
            title: "Maintenance",
            url: "/dashboard/maintenance",
            icon: IconTool,
          },
          {
            title: "Events",
            url: "/dashboard/events",
            icon: IconCalendar,
          },
          {
            title: "Emergencies",
            url: "/dashboard/emergencies",
            icon: IconAlertTriangle,
          },
          {
            title: "Settings",
            url: "/dashboard/settings",
            icon: IconSettings,
          },
        ],
      },
      {
        title: "Admin",
        url: "#",
        icon: IconShield,
        isActive: pathname?.startsWith('/dashboard/admin'),
        items: [
          {
            title: "Comunicados",
            url: "/dashboard/admin/announcements",
            icon: IconFileText,
          },
        ],
      },
      {
        title: "Quick Access",
        url: "#",
        icon: IconBolt,
        items: [
          {
            title: "Weather",
            url: "/dashboard/weather",
            icon: IconCloud,
          },
          {
            title: "Cameras",
            url: "/dashboard/cameras",
            icon: IconCamera,
          },
          {
            title: "Announcements",
            url: "/dashboard/announcements",
            icon: IconFileText,
          },
          {
            title: "Maintenance",
            url: "/dashboard/maintenance",
            icon: IconTool,
          },
        ],
      },
      {
        title: "Ranking",
        url: "/dashboard/ranking",
        icon: IconTrophy,
      },
    ],
    navSecondary: [
      {
        title: "Help & Support",
        url: "/dashboard/help",
        icon: IconHelp,
      },
      {
        title: "Feedback",
        url: "/dashboard/help",
        icon: IconMessageCircle,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <IconDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Pellines</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
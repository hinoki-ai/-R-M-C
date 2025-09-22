'use client';

import {
  IconActivity,
  IconAlertTriangle,
  IconBuilding,
  IconCalendar,
  IconCalendarEvent,
  IconCamera,
  IconChartBar,
  IconChartLine,
  IconCloud,
  IconCreditCard,
  IconDashboard,
  IconEye,
  IconFileText,
  IconFileTypography,
  IconHelp,
  IconHome,
  IconMail,
  IconMap,
  IconMessageCircle,
  IconPhone,
  IconRadio,
  IconReceipt,
  IconSearch,
  IconSettings,
  IconShield,
  IconSparkles,
  IconTool,
  IconTrendingUp,
  IconTrophy,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavMain } from '@/app/dashboard/nav-main';
import { NavSecondary } from '@/app/dashboard/nav-secondary';
import { NavUser } from '@/app/dashboard/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: 'Dashboard Overview',
        url: '/dashboard',
        icon: IconDashboard,
        items: [
          {
            title: 'Overview',
            url: '/dashboard',
            icon: IconHome,
          },
          {
            title: 'Analytics',
            url: '/dashboard/revenue/analytics',
            icon: IconChartBar,
          },
          {
            title: 'Charts',
            url: '/dashboard/revenue',
            icon: IconChartLine,
          },
        ],
      },
      {
        title: 'Security & Safety',
        url: '#',
        icon: IconShield,
        items: [
          {
            title: 'Cameras',
            url: '/dashboard/cameras',
            icon: IconCamera,
          },
          {
            title: 'Camera Events',
            url: '/dashboard/cameras/events',
            icon: IconEye,
          },
          {
            title: 'LS Vision Monitor',
            url: '/dashboard/cameras/lsvision',
            icon: IconActivity,
          },
          {
            title: 'Emergencies',
            url: '/dashboard/emergencies',
            icon: IconAlertTriangle,
          },
          {
            title: 'Maintenance',
            url: '/dashboard/maintenance',
            icon: IconTool,
          },
        ],
      },
      {
        title: 'Community Hub',
        url: '#',
        icon: IconUsers,
        items: [
          {
            title: 'Announcements',
            url: '/dashboard/announcements',
            icon: IconFileText,
          },
          {
            title: 'Community',
            url: '/dashboard/community',
            icon: IconUsersGroup,
          },
          {
            title: 'Events',
            url: '/dashboard/events',
            icon: IconCalendarEvent,
          },
          {
            title: 'Calendar',
            url: '/dashboard/calendar',
            icon: IconCalendar,
          },
        ],
      },
      {
        title: 'Communication',
        url: '#',
        icon: IconMessageCircle,
        items: [
          {
            title: 'Radio',
            url: '/dashboard/radio',
            icon: IconRadio,
          },
          {
            title: 'Notifications',
            url: '/dashboard/notifications',
            icon: IconMail,
          },
        ],
      },
      {
        title: 'Financial Management',
        url: '#',
        icon: IconCreditCard,
        items: [
          {
            title: 'Payments',
            url: '/dashboard/payments',
            icon: IconReceipt,
          },
          {
            title: 'Revenue',
            url: '/dashboard/revenue',
            icon: IconTrendingUp,
          },
          {
            title: 'Payment Methods',
            url: '/dashboard/revenue/payment-methods',
            icon: IconCreditCard,
          },
          {
            title: 'Contributions',
            url: '/dashboard/payment-gated',
            icon: IconSparkles,
          },
          {
            title: 'Ranking',
            url: '/dashboard/ranking',
            icon: IconTrophy,
          },
        ],
      },
      {
        title: 'Resources & Information',
        url: '#',
        icon: IconFileText,
        items: [
          {
            title: 'Weather',
            url: '/dashboard/weather',
            icon: IconCloud,
          },
          {
            title: 'Emergency Info',
            url: '/dashboard/emergency-info',
            icon: IconAlertTriangle,
          },
          {
            title: 'Documents',
            url: '/dashboard/documents',
            icon: IconFileTypography,
          },
          {
            title: 'Photo Gallery',
            url: '/dashboard/photos',
            icon: IconCamera,
          },
          {
            title: 'Business Directory',
            url: '/dashboard/businesses',
            icon: IconBuilding,
          },
          {
            title: 'Contacts',
            url: '/dashboard/contacts',
            icon: IconPhone,
          },
          {
            title: 'Maps',
            url: '/dashboard/maps',
            icon: IconMap,
          },
          {
            title: 'Search',
            url: '/dashboard/search',
            icon: IconSearch,
          },
        ],
      },
      {
        title: 'Administration',
        url: '#',
        icon: IconShield,
        isActive: pathname?.startsWith('/dashboard/admin'),
        items: [
          {
            title: 'Admin Dashboard',
            url: '/dashboard/admin',
            icon: IconShield,
          },
          {
            title: 'Comunicados',
            url: '/dashboard/admin/announcements',
            icon: IconFileText,
          },
          {
            title: 'Customers',
            url: '/dashboard/customers',
            icon: IconUser,
          },
          {
            title: 'Settings',
            url: '/dashboard/settings',
            icon: IconSettings,
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: 'Help & Support',
        url: '/dashboard/help',
        icon: IconHelp,
      },
      {
        title: 'Feedback',
        url: '/dashboard/help',
        icon: IconMessageCircle,
      },
      {
        title: 'Add Camera',
        url: '/dashboard/cameras/add',
        icon: IconCamera,
      },
    ],
  };

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/dashboard'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <IconDashboard className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Pellines</span>
                  <span className='truncate text-xs'>Dashboard</span>
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
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
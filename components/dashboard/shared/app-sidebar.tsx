'use client'

import {
  IconBell,
  IconCalendar,
  IconCamera,
  IconChartBar,
  IconCloud,
  IconDatabase,
  IconFile,
  IconFileText,
  IconHelp,
  IconLayoutDashboard,
  IconMessageCircle,
  IconSearch,
  IconSettings,
  IconShield,
  IconSparkles,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react'
import {
  BarChart3,
  Bell,
  Calendar,
  Camera,
  Cloud,
  HelpCircle,
  LayoutDashboard,
  MessageCircle,
  Search,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { NavMain } from '@/app/dashboard/nav-main'
import { NavSecondary } from '@/app/dashboard/nav-secondary'
import { NavUser } from '@/app/dashboard/nav-user'
import { NavDocuments } from '@/components/dashboard/shared/nav-documents'
import { ChatMaxingIconColoured } from '@/components/logo'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  navMain: [
    {
      title: 'Panel General',
      url: '/dashboard',
      icon: IconLayoutDashboard,
    },
    {
      title: 'Cámaras de Seguridad',
      url: '/dashboard/cameras',
      icon: IconCamera,
    },
    {
      title: 'Monitoreo LS Vision',
      url: '/dashboard/cameras/lsvision',
      icon: IconShield,
    },
    {
      title: 'Comunidad',
      url: '/dashboard/community',
      icon: IconUsers,
    },
    {
      title: 'Eventos Comunidad',
      url: '/dashboard/events',
      icon: IconCalendar,
    },
    {
      title: 'Documentos',
      url: '/dashboard/documents',
      icon: IconFile,
    },
    {
      title: 'Mantenimiento',
      url: '/dashboard/maintenance',
      icon: IconSettings,
    },
    {
      title: 'Contribuciones',
      url: '/dashboard/payment-gated',
      icon: IconSparkles,
    },
    {
      title: 'Clima Comunidad',
      url: '/dashboard/weather',
      icon: IconCloud,
    },
    {
      title: 'Monitoreo de Rendimiento',
      url: '/dashboard/performance',
      icon: IconTrendingUp,
    },
    {
      title: 'Notificaciones',
      url: '/dashboard/notifications',
      icon: IconBell,
    },
  ],
  navSecondary: [
    {
      title: 'Anuncios',
      url: '/dashboard/announcements',
      icon: IconMessageCircle,
    },
    {
      title: 'Aportes',
      url: '/dashboard/payments',
      icon: IconTrendingUp,
    },
    {
      title: 'Configuración',
      url: '/dashboard/settings',
      icon: IconSettings,
    },
    {
      title: 'Ayuda',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Buscar',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Biblioteca de Datos',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'Eventos de Cámaras',
      url: '/dashboard/cameras/events',
      icon: IconChartBar,
    },
    {
      name: 'Transmisiones',
      url: '/dashboard/cameras/feeds',
      icon: IconFileText,
    },
    {
      name: 'Asistente Documental',
      url: '#',
      icon: IconFileText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <Link href='/'>
                <ChatMaxingIconColoured className='!size-6' />
                <span className='text-base font-semibold'>Junta Vecinos<br />Pinto Los Pellines</span>
                <Badge variant='outline' className='text-muted-foreground text-xs'>Comunidad</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

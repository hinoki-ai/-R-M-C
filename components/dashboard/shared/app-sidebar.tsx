'use client'

import {
  Bell,
  Calendar,
  Camera,
  Cloud,
  LayoutDashboard,
  Database,
  FileText,
  FileText as FileText,
  HelpCircle,
  MessageCircle,
  BarChart3,
  Search,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { NavDocuments } from '@/components/dashboard/shared/nav-documents'
import { NavMain } from '@/app/dashboard/nav-main'
import { NavSecondary } from '@/app/dashboard/nav-secondary'
import { NavUser } from '@/app/dashboard/nav-user'
import { ChatMaxingIconColoured } from '@/components/layout/logo'
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
      icon: LayoutDashboard,
    },
    {
      title: 'Cámaras de Seguridad',
      url: '/dashboard/cameras',
      icon: Camera,
    },
    {
      title: 'Monitoreo LS Vision',
      url: '/dashboard/cameras/lsvision',
      icon: Shield,
    },
    {
      title: 'Comunidad',
      url: '/dashboard/community',
      icon: Users,
    },
    {
      title: 'Eventos Comunidad',
      url: '/dashboard/events',
      icon: Calendar,
    },
    {
      title: 'Documentos',
      url: '/dashboard/documents',
      icon: FileText,
    },
    {
      title: 'Mantenimiento',
      url: '/dashboard/maintenance',
      icon: Settings,
    },
    {
      title: 'Contribuciones',
      url: '/dashboard/payment-gated',
      icon: Sparkles,
    },
    {
      title: 'Clima Comunidad',
      url: '/dashboard/weather',
      icon: Cloud,
    },
    {
      title: 'Monitoreo de Rendimiento',
      url: '/dashboard/performance',
      icon: TrendingUp,
    },
    {
      title: 'Notificaciones',
      url: '/dashboard/notifications',
      icon: Bell,
    },
  ],
  navSecondary: [
    {
      title: 'Anuncios',
      url: '/dashboard/announcements',
      icon: MessageCircle,
    },
    {
      title: 'Aportes',
      url: '/dashboard/payments',
      icon: TrendingUp,
    },
    {
      title: 'Configuración',
      url: '/dashboard/settings',
      icon: Settings,
    },
    {
      title: 'Ayuda',
      url: '#',
      icon: HelpCircle,
    },
    {
      title: 'Buscar',
      url: '#',
      icon: Search,
    },
  ],
  documents: [
    {
      name: 'Biblioteca de Datos',
      url: '#',
      icon: Database,
    },
    {
      name: 'Eventos de Cámaras',
      url: '/dashboard/cameras/events',
      icon: BarChart3,
    },
    {
      name: 'Transmisiones',
      url: '/dashboard/cameras/feeds',
      icon: FileText,
    },
    {
      name: 'Asistente Documental',
      url: '#',
      icon: FileText,
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

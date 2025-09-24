'use client';

import {
  IconActivity,
  IconAlertTriangle,
  IconBell,
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
  IconShoppingCart,
  IconSparkles,
  IconTool,
  IconTrendingUp,
  IconTrophy,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import { useNavigation, useCurrentRoute, ROUTES } from '@/lib/router-context';
import Link from 'next/link';
import { useClerk, useUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function AppSidebar() {
  const { navigate } = useNavigation();
  const currentRoute = useCurrentRoute();
  const { openUserProfile } = useClerk();
  const { theme } = useTheme();
  const { user: clerkUser } = useUser();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Vista General':
      currentRoute.path === '/dashboard' ||
      currentRoute.path === '/dashboard/dashboard-charts' ||
      false,
    Comunidad:
      currentRoute.path.startsWith('/dashboard/announcements') ||
      currentRoute.path.startsWith('/dashboard/community') ||
      currentRoute.path.startsWith('/dashboard/events') ||
      currentRoute.path.startsWith('/dashboard/calendar') ||
      currentRoute.path.startsWith('/dashboard/radio') ||
      currentRoute.path.startsWith('/dashboard/contacts') ||
      currentRoute.path.startsWith('/dashboard/businesses') ||
      false,
    Servicios:
      currentRoute.path.startsWith('/dashboard/cameras') ||
      currentRoute.path.startsWith('/dashboard/emergencies') ||
      currentRoute.path.startsWith('/dashboard/maintenance') ||
      currentRoute.path.startsWith('/dashboard/weather') ||
      currentRoute.path.startsWith('/dashboard/maps') ||
      currentRoute.path.startsWith('/dashboard/documents') ||
      currentRoute.path.startsWith('/dashboard/photos') ||
      currentRoute.path.startsWith('/dashboard/emergency-info') ||
      false,
    Finanzas:
      currentRoute.path.startsWith('/dashboard/payments') ||
      currentRoute.path.startsWith('/dashboard/revenue') ||
      currentRoute.path.startsWith('/dashboard/payment-gated') ||
      currentRoute.path.startsWith('/dashboard/ranking') ||
      false,
    Administración:
      currentRoute.path.startsWith('/dashboard/admin') ||
      currentRoute.path.startsWith('/dashboard/customers') ||
      false,
    Herramientas:
      currentRoute.path === '/dashboard/search' ||
      currentRoute.path === '/dashboard/notifications' ||
      currentRoute.path === '/dashboard/settings' ||
      currentRoute.path === '/dashboard/help' ||
      false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isItemActive = (url: string) => currentRoute.path === url;

  const data = {
    navMain: [
      {
        title: 'Vista General',
        url: ROUTES.DASHBOARD,
        icon: IconDashboard,
        items: [
          {
            title: 'Panel Principal',
            url: ROUTES.DASHBOARD,
            icon: IconHome,
          },
          {
            title: 'Gráficos del Dashboard',
            url: ROUTES.DASHBOARD_CHARTS,
            icon: IconChartLine,
          },
        ],
      },
      {
        title: 'Comunidad',
        url: '#',
        icon: IconUsers,
        items: [
          {
            title: 'Anuncios',
            url: ROUTES.DASHBOARD_ANNOUNCEMENTS,
            icon: IconMessageCircle,
          },
          {
            title: 'Calendario',
            url: ROUTES.DASHBOARD_CALENDAR,
            icon: IconCalendar,
          },
          {
            title: 'Eventos',
            url: ROUTES.DASHBOARD_EVENTS,
            icon: IconCalendarEvent,
          },
          {
            title: 'Contactos',
            url: ROUTES.DASHBOARD_CONTACTS,
            icon: IconPhone,
          },
          {
            title: 'Radio Comunitaria',
            url: ROUTES.DASHBOARD_RADIO,
            icon: IconRadio,
          },
          {
            title: 'Favoritos de Radio',
            url: ROUTES.DASHBOARD_RADIO_FAVORITES,
            icon: IconRadio,
          },
          {
            title: 'Comunidad',
            url: ROUTES.DASHBOARD_COMMUNITY,
            icon: IconUsersGroup,
          },
          {
            title: 'Negocios Locales',
            url: ROUTES.DASHBOARD_BUSINESSES,
            icon: IconBuilding,
          },
        ],
      },
      {
        title: 'Servicios',
        url: '#',
        icon: IconTool,
        items: [
          {
            title: 'Cámaras de Seguridad',
            url: ROUTES.DASHBOARD_CAMERAS,
            icon: IconCamera,
          },
          {
            title: 'Agregar Cámara',
            url: ROUTES.DASHBOARD_CAMERAS_ADD,
            icon: IconCamera,
          },
          {
            title: 'Eventos de Cámaras',
            url: ROUTES.DASHBOARD_CAMERAS_EVENTS,
            icon: IconEye,
          },
          {
            title: 'Monitoreo LS Vision',
            url: ROUTES.DASHBOARD_CAMERAS_LSVISION,
            icon: IconShield,
          },
          {
            title: 'Mantenimiento',
            url: ROUTES.DASHBOARD_MAINTENANCE,
            icon: IconTool,
          },
          {
            title: 'Emergencias',
            url: ROUTES.DASHBOARD_EMERGENCIES,
            icon: IconAlertTriangle,
          },
          {
            title: 'Información de Emergencia',
            url: ROUTES.DASHBOARD_EMERGENCY_INFO,
            icon: IconAlertTriangle,
          },
          {
            title: 'Clima',
            url: ROUTES.DASHBOARD_WEATHER,
            icon: IconCloud,
          },
          {
            title: 'Mapas',
            url: ROUTES.DASHBOARD_MAPS,
            icon: IconMap,
          },
          {
            title: 'Documentos',
            url: ROUTES.DASHBOARD_DOCUMENTS,
            icon: IconFileText,
          },
          {
            title: 'Fotos',
            url: ROUTES.DASHBOARD_PHOTOS,
            icon: IconFileTypography,
          },
        ],
      },
      {
        title: 'Finanzas',
        url: '#',
        icon: IconCreditCard,
        items: [
          {
            title: 'Ingresos',
            url: ROUTES.DASHBOARD_REVENUE,
            icon: IconTrendingUp,
          },
          {
            title: 'Análisis de Ingresos',
            url: ROUTES.DASHBOARD_ANALYTICS,
            icon: IconChartBar,
          },
          {
            title: 'Métodos de Pago',
            url: ROUTES.DASHBOARD_REVENUE_PAYMENT_METHODS,
            icon: IconCreditCard,
          },
          {
            title: 'Pagos',
            url: ROUTES.DASHBOARD_PAYMENTS,
            icon: IconReceipt,
          },
          {
            title: 'Contribuciones',
            url: ROUTES.DASHBOARD_CONTRIBUTIONS,
            icon: IconShield,
          },
          {
            title: 'Ranking',
            url: ROUTES.DASHBOARD_RANKING,
            icon: IconTrophy,
          },
        ],
      },
      {
        title: 'Administración',
        url: ROUTES.DASHBOARD_ADMIN,
        icon: IconSettings,
        items: [
          {
            title: 'Panel Admin',
            url: ROUTES.DASHBOARD_ADMIN,
            icon: IconSettings,
          },
          {
            title: 'Clientes',
            url: ROUTES.DASHBOARD_CUSTOMERS,
            icon: IconUsers,
          },
          {
            title: 'Anuncios Admin',
            url: ROUTES.DASHBOARD_ADMIN_ANNOUNCEMENTS,
            icon: IconMessageCircle,
          },
          {
            title: 'Comercios Admin',
            url: ROUTES.DASHBOARD_ADMIN_BUSINESSES,
            icon: IconShoppingCart,
          },
          {
            title: 'Calendario Admin',
            url: ROUTES.DASHBOARD_ADMIN_CALENDAR,
            icon: IconCalendar,
          },
          {
            title: 'Cámaras Admin',
            url: ROUTES.DASHBOARD_ADMIN_CAMERAS,
            icon: IconCamera,
          },
          {
            title: 'Contactos Admin',
            url: ROUTES.DASHBOARD_ADMIN_CONTACTS,
            icon: IconPhone,
          },
          {
            title: 'Protocolos de Emergencia',
            url: ROUTES.DASHBOARD_ADMIN_EMERGENCY_PROTOCOLS,
            icon: IconAlertTriangle,
          },
          {
            title: 'Mantenimiento Admin',
            url: ROUTES.DASHBOARD_ADMIN_MAINTENANCE,
            icon: IconTool,
          },
          {
            title: 'Proyectos Admin',
            url: ROUTES.DASHBOARD_ADMIN_PROJECTS,
            icon: IconSparkles,
          },
          {
            title: 'Radio Admin',
            url: ROUTES.DASHBOARD_ADMIN_RADIO,
            icon: IconRadio,
          },
          {
            title: 'RSS Admin',
            url: ROUTES.DASHBOARD_ADMIN_RSS,
            icon: IconActivity,
          },
          {
            title: 'Clima Admin',
            url: ROUTES.DASHBOARD_ADMIN_WEATHER,
            icon: IconCloud,
          },
        ],
      },
      {
        title: 'Herramientas',
        url: '#',
        icon: IconHelp,
        items: [
          {
            title: 'Buscar',
            url: ROUTES.DASHBOARD_SEARCH,
            icon: IconSearch,
          },
          {
            title: 'Notificaciones',
            url: ROUTES.DASHBOARD_NOTIFICATIONS,
            icon: IconBell,
          },
          {
            title: 'Configuración',
            url: ROUTES.DASHBOARD_SETTINGS,
            icon: IconSettings,
          },
          {
            title: 'Ayuda',
            url: ROUTES.DASHBOARD_HELP,
            icon: IconHelp,
          },
        ],
      },
    ],
    user: {
      name: clerkUser?.fullName || 'Usuario',
      email: clerkUser?.primaryEmailAddress?.emailAddress || '',
      avatar: clerkUser?.imageUrl || '',
    },
  };

  return (
    <Sidebar>
      <SidebarBody>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-4 border-b border-border">
            <Link
              href={ROUTES.DASHBOARD}
              className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <IconDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold">Los Pellines</div>
                <div className="text-xs text-muted-foreground">Panel de Control</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {data.navMain.map(section => (
              <Collapsible
                key={section.title}
                open={openSections[section.title]}
                onOpenChange={() => toggleSection(section.title)}
              >
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <section.icon className="w-5 h-5" />
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${openSections[section.title] ? 'rotate-90' : ''}`}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-4 mt-1 space-y-1">
                    {section.items?.map(item => (
                      <Link
                        key={item.url}
                        href={item.url}
                        className={`flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors w-full text-left ${
                          isItemActive(item.url)
                            ? 'bg-accent text-accent-foreground'
                            : ''
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => openUserProfile()}
              className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={data.user.avatar} alt={data.user.name} />
                <AvatarFallback>
                  {data.user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium truncate">
                  {data.user.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {data.user.email}
                </div>
              </div>
            </button>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

// Dashboard navigation utilities and spacing constants
import {
  IconActivity,
  IconAlertTriangle,
  IconBell,
  IconBuilding,
  IconCalendar,
  IconCamera,
  IconChartBar,
  IconCloud,
  IconFileText,
  IconHome,
  IconMail,
  IconMap,
  IconMapPin,
  IconMessage,
  IconPhone,
  IconPlus,
  IconRadio,
  IconSearch,
  IconSettings,
  IconShield,
  IconSparkles,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from '@tabler/icons-react';

// Spacing constants for consistent dashboard layout
export const SPACING = {
  // Page level spacing
  page: {
    header: 'px-4 lg:px-6',
    container: 'space-y-8',
    section: 'space-y-6',
  },

  // Grid spacing
  grid: {
    gap: 'gap-6',
    cols: {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
  },

  // Card spacing
  card: {
    padding: 'p-6',
    header: 'pb-4',
    content: 'space-y-4',
    footer: 'pt-4',
  },

  // Element spacing
  element: {
    tight: 'space-y-2',
    normal: 'space-y-3',
    loose: 'space-y-4',
  },

  // Component spacing
  component: {
    icon: 'p-3',
    badge: 'gap-2',
    button: 'gap-2',
  },
} as const;

// Dashboard navigation structure
export interface DashboardNavItem {
  title: string;
  url: string;
  icon: any;
  description?: string;
  badge?: string;
  children?: DashboardNavItem[];
}

export const dashboardNavigation: DashboardNavItem[] = [
  {
    title: 'Resumen',
    url: '/dashboard',
    icon: IconHome,
    description: 'Resumen del panel y analítica',
  },
  {
    title: 'Comunidad',
    url: '/dashboard/community',
    icon: IconUsers,
    description: 'Gestión y comunicación de la comunidad',
    children: [
      {
        title: 'Anuncios',
        url: '/dashboard/announcements',
        icon: IconMessage,
        description: 'Anuncios y noticias de la comunidad',
      },
      {
        title: 'Comunidad',
        url: '/dashboard/community',
        icon: IconUsers,
        description: 'Directorio y gestión de miembros',
      },
      {
        title: 'Eventos',
        url: '/dashboard/events',
        icon: IconCalendar,
        description: 'Eventos y calendario de la comunidad',
      },
      {
        title: 'Radio',
        url: '/dashboard/radio',
        icon: IconRadio,
        description: 'Emisoras de radio de la comunidad',
      },
    ],
  },
  {
    title: 'Servicios',
    url: '/dashboard/cameras',
    icon: IconShield,
    description: 'Servicios y utilidades comunitarias',
    children: [
      {
        title: 'Cámaras',
        url: '/dashboard/cameras',
        icon: IconCamera,
        description: 'Cámaras de seguridad y monitoreo',
      },
      {
        title: 'Emergencias',
        url: '/dashboard/emergencies',
        icon: IconAlertTriangle,
        description: 'Alertas y protocolos de emergencia',
      },
      {
        title: 'Mantenimiento',
        url: '/dashboard/maintenance',
        icon: IconBuilding,
        description: 'Solicitudes de mantenimiento y seguimiento',
      },
      {
        title: 'Clima',
        url: '/dashboard/weather',
        icon: IconCloud,
        description: 'Información meteorológica y alertas',
      },
      {
        title: 'Mapas',
        url: '/dashboard/maps',
        icon: IconMap,
        description: 'Mapas y ubicaciones de la comunidad',
      },
      {
        title: 'Documentos',
        url: '/dashboard/documents',
        icon: IconFileText,
        description: 'Documentos y archivos oficiales',
      },
    ],
  },
  {
    title: 'Finanzas',
    url: '/dashboard/payments',
    icon: IconTrendingUp,
    description: 'Gestión financiera y pagos',
    children: [
      {
        title: 'Pagos',
        url: '/dashboard/payments',
        icon: IconTrendingUp,
        description: 'Resumen e historial de pagos',
      },
      {
        title: 'Ingresos',
        url: '/dashboard/revenue',
        icon: IconTrendingUp,
        description: 'Analítica y seguimiento de ingresos',
      },
      {
        title: 'Contribuciones',
        url: '/dashboard/payment-gated',
        icon: IconSparkles,
        description: 'Contribuciones de la comunidad',
      },
      {
        title: 'Clasificación',
        url: '/dashboard/ranking',
        icon: IconTrophy,
        description: 'Clasificación de contribuciones',
      },
    ],
  },
  {
    title: 'Administración',
    url: '/dashboard/admin',
    icon: IconSettings,
    description: 'Funciones y ajustes administrativos',
    children: [
      {
        title: 'Panel de Administración',
        url: '/dashboard/admin',
        icon: IconSettings,
        description: 'Resumen administrativo',
      },
      {
        title: 'Protocolos de Emergencia',
        url: '/dashboard/admin/emergency-protocols',
        icon: IconShield,
        description: 'Gestionar protocolos de emergencia',
      },
      {
        title: 'Mantenimiento',
        url: '/dashboard/admin/maintenance',
        icon: IconBuilding,
        description: 'Gestionar solicitudes de mantenimiento',
      },
      {
        title: 'Proyectos',
        url: '/dashboard/admin/projects',
        icon: IconSparkles,
        description: 'Proyectos comunitarios',
      },
      {
        title: 'Cámaras',
        url: '/dashboard/admin/cameras',
        icon: IconCamera,
        description: 'Administración de cámaras',
      },
      {
        title: 'Calendario',
        url: '/dashboard/admin/calendar',
        icon: IconCalendar,
        description: 'Gestión de calendario',
      },
      {
        title: 'Contactos',
        url: '/dashboard/admin/contacts',
        icon: IconPhone,
        description: 'Gestión de contactos',
      },
      {
        title: 'Radio',
        url: '/dashboard/admin/radio',
        icon: IconRadio,
        description: 'Gestión de estaciones de radio',
      },
      {
        title: 'Clima',
        url: '/dashboard/admin/weather',
        icon: IconCloud,
        description: 'Administración del clima',
      },
      {
        title: 'Clientes',
        url: '/dashboard/customers',
        icon: IconUsers,
        description: 'Gestión de clientes',
      },
      {
        title: 'Configuración',
        url: '/dashboard/settings',
        icon: IconSettings,
        description: 'Ajustes y preferencias del sistema',
      },
    ],
  },
];

// Utility functions for navigation
export function getBreadcrumbs(
  pathname: string = ''
): Array<{ label: string; url: string }> {
  const breadcrumbs: Array<{ label: string; url: string }> = [
    { label: 'Panel', url: '/dashboard' },
  ];

  const pathSegments = pathname.split('/').filter(Boolean);
  let currentPath = '';

  // Fallback labels for known subsections not present in dashboardNavigation
  const fallbackLabels: Record<string, string> = {
    analytics: 'Analítica',
    'payment-methods': 'Métodos de Pago',
    add: 'Agregar',
    events: 'Eventos',
    lsvision: 'Monitoreo LS Vision',
    favorites: 'Favoritos',
  };

  const toTitle = (slug: string) =>
    slug
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;
    const navItem = findNavItemByUrl(currentPath);

    if (navItem) {
      breadcrumbs.push({
        label: navItem.title,
        url: currentPath,
      });
    } else {
      // Add graceful fallbacks only for deeper dashboard paths
      // e.g. /dashboard/cameras/lsvision -> "Monitoreo LS Vision"
      const isUnderDashboard = currentPath.startsWith('/dashboard/');
      if (isUnderDashboard) {
        const label = fallbackLabels[segment] ?? toTitle(segment);
        breadcrumbs.push({ label, url: currentPath });
      }
    }
  }

  return breadcrumbs;
}

export function findNavItemByUrl(url: string): DashboardNavItem | null {
  for (const item of dashboardNavigation) {
    if (item.url === url) {
      return item;
    }

    if (item.children) {
      for (const child of item.children) {
        if (child.url === url) {
          return child;
        }
      }
    }
  }

  return null;
}

export function getParentNavItem(url: string): DashboardNavItem | null {
  for (const item of dashboardNavigation) {
    if (item.children) {
      for (const child of item.children) {
        if (child.url === url) {
          return item;
        }
      }
    }
  }

  return null;
}

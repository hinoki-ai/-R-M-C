// Dashboard navigation utilities and spacing constants
import { IconHome, IconUsers, IconFileText, IconSettings, IconCamera, IconCalendar, IconMessage, IconAlertTriangle, IconPhone, IconBuilding, IconMapPin, IconShield, IconActivity, IconTrendingUp, IconChartBar, IconMail, IconBell, IconSearch, IconPlus } from "@tabler/icons-react";

// Spacing constants for consistent dashboard layout
export const SPACING = {
  // Page level spacing
  page: {
    header: 'px-4 lg:px-6',
    container: 'space-y-8',
    section: 'space-y-6'
  },

  // Grid spacing
  grid: {
    gap: 'gap-6',
    cols: {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
  },

  // Card spacing
  card: {
    padding: 'p-6',
    header: 'pb-4',
    content: 'space-y-4',
    footer: 'pt-4'
  },

  // Element spacing
  element: {
    tight: 'space-y-2',
    normal: 'space-y-3',
    loose: 'space-y-4'
  },

  // Component spacing
  component: {
    icon: 'p-3',
    badge: 'gap-2',
    button: 'gap-2'
  }
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
    title: "Inicio",
    url: "/dashboard",
    icon: IconHome,
    description: "Panel principal y resumen general"
  },
  {
    title: "Comunidad",
    url: "/dashboard/community",
    icon: IconUsers,
    description: "Gestión de miembros y directorio",
    children: [
      {
        title: "Directorio",
        url: "/dashboard/community",
        icon: IconUsers,
        description: "Lista de miembros activos"
      },
      {
        title: "Nuevos Miembros",
        url: "/dashboard/community/new",
        icon: IconPlus,
        description: "Registro de nuevos vecinos"
      }
    ]
  },
  {
    title: "Documentos",
    url: "/dashboard/documents",
    icon: IconFileText,
    description: "Documentos oficiales y archivos",
    children: [
      {
        title: "Estatutos",
        url: "/dashboard/documents/statutes",
        icon: IconFileText,
        description: "Estatutos y reglamentos"
      },
      {
        title: "Actas",
        url: "/dashboard/documents/meetings",
        icon: IconFileText,
        description: "Actas de reuniones"
      },
      {
        title: "Proyectos",
        url: "/dashboard/documents/projects",
        icon: IconFileText,
        description: "Documentos de proyectos"
      }
    ]
  },
  {
    title: "Eventos",
    url: "/dashboard/events",
    icon: IconCalendar,
    description: "Calendario y eventos comunitarios",
    children: [
      {
        title: "Calendario",
        url: "/dashboard/events",
        icon: IconCalendar,
        description: "Vista mensual del calendario"
      },
      {
        title: "Crear Evento",
        url: "/dashboard/events/create",
        icon: IconPlus,
        description: "Programar nuevo evento"
      }
    ]
  },
  {
    title: "Anuncios",
    url: "/dashboard/announcements",
    icon: IconMessage,
    description: "Comunicados y noticias",
    children: [
      {
        title: "Todos los Anuncios",
        url: "/dashboard/announcements",
        icon: IconMessage,
        description: "Lista completa de anuncios"
      },
      {
        title: "Nuevo Anuncio",
        url: "/dashboard/announcements/create",
        icon: IconPlus,
        description: "Crear nuevo comunicado"
      }
    ]
  },
  {
    title: "Emergencias",
    url: "/dashboard/emergencies",
    icon: IconAlertTriangle,
    description: "Sistema de emergencias y alertas",
    children: [
      {
        title: "Alertas Activas",
        url: "/dashboard/emergencies",
        icon: IconAlertTriangle,
        description: "Emergencias actuales"
      },
      {
        title: "Contactos",
        url: "/dashboard/emergencies/contacts",
        icon: IconPhone,
        description: "Números de emergencia"
      },
      {
        title: "Protocolos",
        url: "/dashboard/emergencies/protocols",
        icon: IconShield,
        description: "Guías de procedimiento"
      }
    ]
  },
  {
    title: "Cámaras",
    url: "/dashboard/cameras",
    icon: IconCamera,
    description: "Sistema de videovigilancia",
    children: [
      {
        title: "Vista General",
        url: "/dashboard/cameras",
        icon: IconCamera,
        description: "Todas las cámaras activas"
      },
      {
        title: "Agregar Cámara",
        url: "/dashboard/cameras/add",
        icon: IconPlus,
        description: "Instalar nueva cámara"
      },
      {
        title: "Eventos",
        url: "/dashboard/cameras/events",
        icon: IconActivity,
        description: "Registro de movimientos"
      }
    ]
  },
  {
    title: "Mantenimiento",
    url: "/dashboard/maintenance",
    icon: IconBuilding,
    description: "Solicitudes y seguimiento",
    children: [
      {
        title: "Solicitudes",
        url: "/dashboard/maintenance",
        icon: IconBuilding,
        description: "Trabajos pendientes"
      },
      {
        title: "Historial",
        url: "/dashboard/maintenance/history",
        icon: IconChartBar,
        description: "Trabajos completados"
      },
      {
        title: "Nueva Solicitud",
        url: "/dashboard/maintenance/create",
        icon: IconPlus,
        description: "Reportar problema"
      }
    ]
  },
  {
    title: "Pagos",
    url: "/dashboard/payments",
    icon: IconTrendingUp,
    description: "Finanzas y contribuciones",
    children: [
      {
        title: "Resumen",
        url: "/dashboard/payments",
        icon: IconTrendingUp,
        description: "Estado de pagos"
      },
      {
        title: "Historial",
        url: "/dashboard/payments/history",
        icon: IconChartBar,
        description: "Pagos realizados"
      },
      {
        title: "Métodos",
        url: "/dashboard/payments/methods",
        icon: IconSettings,
        description: "Configurar pagos"
      }
    ]
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: IconSettings,
    description: "Preferencias y configuración",
    children: [
      {
        title: "General",
        url: "/dashboard/settings",
        icon: IconSettings,
        description: "Configuración básica"
      },
      {
        title: "Notificaciones",
        url: "/dashboard/settings/notifications",
        icon: IconBell,
        description: "Preferencias de alertas"
      },
      {
        title: "Privacidad",
        url: "/dashboard/settings/privacy",
        icon: IconShield,
        description: "Configuración de privacidad"
      }
    ]
  }
];

// Utility functions for navigation
export function getBreadcrumbs(pathname: string = ''): Array<{ label: string; url: string }> {
  const breadcrumbs: Array<{ label: string; url: string }> = [
    { label: 'Dashboard', url: '/dashboard' }
  ];

  const pathSegments = pathname.split('/').filter(Boolean);
  let currentPath = '';

  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    const navItem = findNavItemByUrl(currentPath);

    if (navItem) {
      breadcrumbs.push({
        label: navItem.title,
        url: currentPath
      });
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
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter as useNextRouter, usePathname } from 'next/navigation';

// Define route structure
export interface Route {
  path: string;
  title: string;
  component: string; // Component name to dynamically load
  params?: Record<string, string>;
}

// Router state
interface RouterState {
  currentRoute: Route;
  history: Route[];
  historyIndex: number;
}

// Router actions
interface RouterActions {
  navigate: (path: string, params?: Record<string, string>) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

// Define all available routes
export const ROUTES = {
  // Landing pages
  HOME: '/',
  ANUNCIOS: '/anuncios',
  COMERCIOS: '/comercios',
  CONTRIBUCIONES: '/contribuciones',
  RADIO: '/radio',
  DONATE: '/donate',
  DOWNLOAD: '/download',
  MOBILE_DEMO: '/mobile-demo',

  // Public pages (redirect to dashboard for authenticated users)
  CONTACTOS: '/dashboard/contacts',
  CALENDARIO: '/dashboard/calendar',
  DOCUMENTOS: '/dashboard/documents',
  EMERGENCIAS: '/dashboard/emergencies',
  EVENTOS: '/dashboard/events',
  FOTOS: '/dashboard/photos',
  MAPA: '/dashboard/maps',
  WEATHER: '/dashboard/weather',

  // Auth pages
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',

  // Dashboard pages
  DASHBOARD: '/dashboard',
  DASHBOARD_CHARTS: '/dashboard/dashboard-charts',
  DASHBOARD_ANNOUNCEMENTS: '/dashboard/announcements',
  DASHBOARD_COMMUNITY: '/dashboard/community',
  DASHBOARD_EVENTS: '/dashboard/events',
  DASHBOARD_CALENDAR: '/dashboard/calendar',
  DASHBOARD_RADIO: '/dashboard/radio',
  DASHBOARD_RADIO_FAVORITES: '/dashboard/radio/favorites',
  DASHBOARD_CAMERAS: '/dashboard/cameras',
  DASHBOARD_CAMERAS_ADD: '/dashboard/cameras/add',
  DASHBOARD_CAMERAS_EVENTS: '/dashboard/cameras/events',
  DASHBOARD_CAMERAS_LSVISION: '/dashboard/cameras/lsvision',
  DASHBOARD_EMERGENCIES: '/dashboard/emergencies',
  DASHBOARD_MAINTENANCE: '/dashboard/maintenance',
  DASHBOARD_WEATHER: '/dashboard/weather',
  DASHBOARD_MAPS: '/dashboard/maps',
  DASHBOARD_DOCUMENTS: '/dashboard/documents',
  DASHBOARD_PAYMENTS: '/dashboard/payments',
  DASHBOARD_REVENUE: '/dashboard/revenue',
  DASHBOARD_ANALYTICS: '/dashboard/revenue/analytics',
  DASHBOARD_REVENUE_PAYMENT_METHODS: '/dashboard/revenue/payment-methods',
  DASHBOARD_CONTRIBUTIONS: '/dashboard/payment-gated',
  DASHBOARD_RANKING: '/dashboard/ranking',
  DASHBOARD_NOTIFICATIONS: '/dashboard/notifications',
  DASHBOARD_ADMIN: '/dashboard/admin',
  DASHBOARD_ADMIN_ANNOUNCEMENTS: '/dashboard/admin/announcements',
  DASHBOARD_ADMIN_EMERGENCY_PROTOCOLS: '/dashboard/admin/emergency-protocols',
  DASHBOARD_ADMIN_MAINTENANCE: '/dashboard/admin/maintenance',
  DASHBOARD_ADMIN_PROJECTS: '/dashboard/admin/projects',
  DASHBOARD_ADMIN_CAMERAS: '/dashboard/admin/cameras',
  DASHBOARD_ADMIN_CALENDAR: '/dashboard/admin/calendar',
  DASHBOARD_ADMIN_CONTACTS: '/dashboard/admin/contacts',
  DASHBOARD_ADMIN_BUSINESSES: '/dashboard/admin/businesses',
  DASHBOARD_ADMIN_RADIO: '/dashboard/admin/radio',
  DASHBOARD_ADMIN_RSS: '/dashboard/admin/rss',
  DASHBOARD_ADMIN_WEATHER: '/dashboard/admin/weather',
  DASHBOARD_CUSTOMERS: '/dashboard/customers',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_HELP: '/dashboard/help',
  DASHBOARD_EMERGENCY_INFO: '/dashboard/emergency-info',
  DASHBOARD_PHOTOS: '/dashboard/photos',
  DASHBOARD_BUSINESSES: '/dashboard/businesses',
  DASHBOARD_CONTACTS: '/dashboard/contacts',
  DASHBOARD_SEARCH: '/dashboard/search',
  DASHBOARD_CAMERA_DETAIL: '/dashboard/cameras/[id]',
} as const;

// Route metadata
export const ROUTE_METADATA: Record<string, Omit<Route, 'path' | 'params'>> = {
  [ROUTES.HOME]: { title: 'Inicio', component: 'HomePage' },
  [ROUTES.ANUNCIOS]: { title: 'Anuncios', component: 'AnunciosPage' },
  [ROUTES.COMERCIOS]: { title: 'Comercios', component: 'ComerciosPage' },
  [ROUTES.CONTRIBUCIONES]: {
    title: 'Contribuciones',
    component: 'ContribucionesPage',
  },
  [ROUTES.RADIO]: { title: 'Radio', component: 'RadioPage' },
  [ROUTES.DONATE]: { title: 'Donar', component: 'DonatePage' },
  [ROUTES.DOWNLOAD]: { title: 'Descargar App', component: 'DownloadPage' },
  [ROUTES.MOBILE_DEMO]: { title: 'Demo Móvil', component: 'MobileDemoPage' },

  // Dashboard pages
  [ROUTES.SIGN_IN]: { title: 'Iniciar Sesión', component: 'SignInPage' },
  [ROUTES.SIGN_UP]: { title: 'Registrarse', component: 'SignUpPage' },
  [ROUTES.DASHBOARD]: { title: 'Panel', component: 'DashboardPage' },
  [ROUTES.DASHBOARD_CHARTS]: {
    title: 'Gráficos',
    component: 'DashboardChartsPage',
  },
  [ROUTES.DASHBOARD_ANNOUNCEMENTS]: {
    title: 'Anuncios',
    component: 'DashboardAnnouncementsPage',
  },
  [ROUTES.DASHBOARD_COMMUNITY]: {
    title: 'Comunidad',
    component: 'DashboardCommunityPage',
  },
  [ROUTES.DASHBOARD_EVENTS]: {
    title: 'Eventos',
    component: 'DashboardEventsPage',
  },
  [ROUTES.DASHBOARD_CALENDAR]: {
    title: 'Calendario',
    component: 'DashboardCalendarPage',
  },
  [ROUTES.DASHBOARD_RADIO]: { title: 'Radio', component: 'DashboardRadioPage' },
  [ROUTES.DASHBOARD_RADIO_FAVORITES]: {
    title: 'Favoritos de Radio',
    component: 'DashboardRadioFavoritesPage',
  },
  [ROUTES.DASHBOARD_CAMERAS]: {
    title: 'Cámaras',
    component: 'DashboardCamerasPage',
  },
  [ROUTES.DASHBOARD_CAMERAS_ADD]: {
    title: 'Agregar Cámara',
    component: 'DashboardCamerasAddPage',
  },
  [ROUTES.DASHBOARD_CAMERAS_EVENTS]: {
    title: 'Eventos de Cámaras',
    component: 'DashboardCamerasEventsPage',
  },
  [ROUTES.DASHBOARD_CAMERAS_LSVISION]: {
    title: 'Monitoreo LS Vision',
    component: 'DashboardCamerasLSVisionPage',
  },
  [ROUTES.DASHBOARD_EMERGENCIES]: {
    title: 'Emergencias',
    component: 'DashboardEmergenciesPage',
  },
  [ROUTES.DASHBOARD_MAINTENANCE]: {
    title: 'Mantenimiento',
    component: 'DashboardMaintenancePage',
  },
  [ROUTES.DASHBOARD_WEATHER]: {
    title: 'Clima',
    component: 'DashboardWeatherPage',
  },
  [ROUTES.DASHBOARD_MAPS]: { title: 'Mapas', component: 'DashboardMapsPage' },
  [ROUTES.DASHBOARD_DOCUMENTS]: {
    title: 'Documentos',
    component: 'DashboardDocumentsPage',
  },
  [ROUTES.DASHBOARD_PAYMENTS]: {
    title: 'Pagos',
    component: 'DashboardPaymentsPage',
  },
  [ROUTES.DASHBOARD_REVENUE]: {
    title: 'Ingresos',
    component: 'DashboardRevenuePage',
  },
  // [ROUTES.DASHBOARD_ANALYTICS] is defined once above
  [ROUTES.DASHBOARD_REVENUE_PAYMENT_METHODS]: {
    title: 'Métodos de Pago',
    component: 'DashboardRevenuePaymentMethodsPage',
  },
  [ROUTES.DASHBOARD_CONTRIBUTIONS]: {
    title: 'Contribuciones',
    component: 'DashboardContributionsPage',
  },
  [ROUTES.DASHBOARD_RANKING]: {
    title: 'Clasificación',
    component: 'DashboardRankingPage',
  },
  [ROUTES.DASHBOARD_NOTIFICATIONS]: {
    title: 'Notificaciones',
    component: 'DashboardNotificationsPage',
  },
  [ROUTES.DASHBOARD_ADMIN]: { title: 'Administración', component: 'DashboardAdminPage' },
  [ROUTES.DASHBOARD_ADMIN_ANNOUNCEMENTS]: {
    title: 'Administración Anuncios',
    component: 'DashboardAdminAnnouncementsPage',
  },
  [ROUTES.DASHBOARD_ADMIN_EMERGENCY_PROTOCOLS]: {
    title: 'Protocolos de Emergencia',
    component: 'DashboardAdminEmergencyProtocolsPage',
  },
  [ROUTES.DASHBOARD_ADMIN_MAINTENANCE]: {
    title: 'Administración Mantenimiento',
    component: 'DashboardAdminMaintenancePage',
  },
  [ROUTES.DASHBOARD_ADMIN_PROJECTS]: {
    title: 'Proyectos',
    component: 'DashboardAdminProjectsPage',
  },
  [ROUTES.DASHBOARD_ADMIN_CAMERAS]: {
    title: 'Administración Cámaras',
    component: 'DashboardAdminCamerasPage',
  },
  [ROUTES.DASHBOARD_ADMIN_CALENDAR]: {
    title: 'Administración Calendario',
    component: 'DashboardAdminCalendarPage',
  },
  [ROUTES.DASHBOARD_ADMIN_CONTACTS]: {
    title: 'Administración Contactos',
    component: 'DashboardAdminContactsPage',
  },
  [ROUTES.DASHBOARD_ADMIN_BUSINESSES]: {
    title: 'Administración Comercios',
    component: 'DashboardAdminBusinessesPage',
  },
  [ROUTES.DASHBOARD_ADMIN_RADIO]: {
    title: 'Administración Radio',
    component: 'DashboardAdminRadioPage',
  },
  [ROUTES.DASHBOARD_ADMIN_RSS]: {
    title: 'Administración RSS',
    component: 'DashboardAdminRssPage',
  },
  [ROUTES.DASHBOARD_ADMIN_WEATHER]: {
    title: 'Administración Clima',
    component: 'DashboardAdminWeatherPage',
  },
  [ROUTES.DASHBOARD_CUSTOMERS]: {
    title: 'Clientes',
    component: 'DashboardCustomersPage',
  },
  [ROUTES.DASHBOARD_SETTINGS]: {
    title: 'Configuración',
    component: 'DashboardSettingsPage',
  },
  [ROUTES.DASHBOARD_HELP]: { title: 'Ayuda', component: 'DashboardHelpPage' },
  [ROUTES.DASHBOARD_EMERGENCY_INFO]: {
    title: 'Info de Emergencia',
    component: 'DashboardEmergencyInfoPage',
  },
  [ROUTES.DASHBOARD_PHOTOS]: {
    title: 'Fotos',
    component: 'DashboardPhotosPage',
  },
  [ROUTES.DASHBOARD_BUSINESSES]: {
    title: 'Negocios',
    component: 'DashboardBusinessesPage',
  },
  [ROUTES.DASHBOARD_CONTACTS]: {
    title: 'Contactos',
    component: 'DashboardContactsPage',
  },
  [ROUTES.DASHBOARD_SEARCH]: {
    title: 'Buscar',
    component: 'DashboardSearchPage',
  },
  [ROUTES.DASHBOARD_CAMERA_DETAIL]: {
    title: 'Detalle de Cámara',
    component: 'DashboardCameraDetailPage',
  },
};

// Create router context
const RouterContext = createContext<(RouterState & RouterActions) | null>(null);

// Router provider component
export function RouterProvider({ children }: { children: ReactNode }) {
  const nextRouter = useNextRouter();
  const pathname = usePathname();

  const [currentRoute, setCurrentRoute] = useState<Route>({
    path: ROUTES.HOME,
    title: 'Inicio',
    component: 'HomePage',
  });

  const deriveTitleFromPath = (path: string) => {
    const segs = path.split('/').filter(Boolean);
    if (segs.length === 0) return 'Inicio';
    const last = segs[segs.length - 1];
    return last.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  // Simple navigation function that uses Next.js router
  const navigate = (path: string, params?: Record<string, string>) => {
    const metadata = ROUTE_METADATA[path];
    if (!metadata) {
      // Push anyway to avoid broken navigation; set a best-effort title
      setCurrentRoute({
        path,
        title: deriveTitleFromPath(path),
        component: 'Unknown',
        params,
      });
      nextRouter.push(path);
      return;
    }

    const newRoute: Route = {
      path,
      title: metadata.title,
      component: metadata.component,
      params,
    };

    setCurrentRoute(newRoute);

    // Use Next.js router for navigation
    nextRouter.push(path);
  };

  // Go back using browser history
  const goBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  // Go forward using browser history
  const goForward = () => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  };

  // Initialize from current URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const metadata = ROUTE_METADATA[currentPath];
      if (metadata) {
        const route: Route = {
          path: currentPath,
          title: metadata.title,
          component: metadata.component,
        };
        setCurrentRoute(route);
      } else {
        setCurrentRoute({
          path: currentPath,
          title: deriveTitleFromPath(currentPath),
          component: 'Unknown',
        });
      }
    }
  }, []);

  // Listen for route changes from Next.js
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const metadata = ROUTE_METADATA[url];
      if (metadata) {
        const route: Route = {
          path: url,
          title: metadata.title,
          component: metadata.component,
        };
        setCurrentRoute(route);
      } else {
        setCurrentRoute({
          path: url,
          title: deriveTitleFromPath(url),
          component: 'Unknown',
        });
      }
    };

    // Update current route when pathname changes
    if (pathname) {
      handleRouteChange(pathname);
    }
  }, [pathname]);

  const value: RouterState & RouterActions = {
    currentRoute,
    history: [], // Not maintaining separate history
    historyIndex: 0,
    navigate,
    goBack,
    goForward,
    canGoBack: typeof window !== 'undefined' ? window.history.length > 1 : false,
    canGoForward: false, // Can't reliably determine if forward is available
  };

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

// Hook to use router
export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

// Hook to get current route
export function useCurrentRoute() {
  try {
    const { currentRoute } = useRouter();
    return currentRoute;
  } catch {
    // Fallback for SSR/prerendering
    return {
      path: '/',
      title: 'Inicio',
      component: 'HomePage',
    };
  }
}

// Hook for navigation
export function useNavigation() {
  const { navigate, goBack, goForward, canGoBack, canGoForward } = useRouter();
  return { navigate, goBack, goForward, canGoBack, canGoForward };
}

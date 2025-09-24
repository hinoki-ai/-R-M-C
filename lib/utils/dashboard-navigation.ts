import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  DASHBOARD_SECTIONS,
  type DashboardSection,
  NAVIGATION_GROUPS,
  type User,
} from '@/types/dashboard';

// Navigation Configuration
export const getNavigationConfig = (user: User) => {
  const allSections = DASHBOARD_SECTIONS;

  // Filter sections based on user role
  const filteredSections = allSections.filter(section => {
    if (section.adminOnly && !user.isAdmin) return false;
    if (section.userOnly && user.isAdmin) return false;
    return true;
  });

  return {
    primary: filteredSections.filter(section =>
      (NAVIGATION_GROUPS.primary as readonly string[]).includes(section.id)
    ),
    secondary: filteredSections.filter(section =>
      (NAVIGATION_GROUPS.secondary as readonly string[]).includes(section.id)
    ),
    system: filteredSections.filter(section =>
      (NAVIGATION_GROUPS.system as readonly string[]).includes(section.id)
    ),
    all: filteredSections,
  };
};

// Navigation Hook
export const useDashboardNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getCurrentSection = (): string => {
    // Only run on client side
    if (!isClient || !pathname) return 'overview';

    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Handle nested routes
    if (pathname.includes('/cameras/lsvision')) return 'lsvision';
    if (pathname.includes('/cameras/add')) return 'cameras';
    if (pathname.includes('/cameras/')) return 'cameras';

    return lastSegment === 'dashboard' ? 'overview' : lastSegment;
  };

  const navigateTo = (sectionId: string) => {
    const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
    if (section) {
      router.push(section.url);
    }
  };

  const isActive = (sectionId: string): boolean => {
    const currentSection = getCurrentSection();

    // Special handling for cameras sub-routes
    if (
      sectionId === 'cameras' &&
      isClient &&
      pathname &&
      (pathname.includes('/cameras') || currentSection === 'lsvision')
    ) {
      return true;
    }

    return currentSection === sectionId;
  };

  const getSectionInfo = (sectionId: string): DashboardSection | undefined => {
    return DASHBOARD_SECTIONS.find(s => s.id === sectionId);
  };

  const getBreadcrumbs = (): Array<{ label: string; url: string }> => {
    const currentSection = getCurrentSection();
    const section = getSectionInfo(currentSection);

    const breadcrumbs = [{ label: 'Dashboard', url: '/dashboard' }];

    if (section && section.id !== 'overview') {
      breadcrumbs.push({
        label: section.label,
        url: section.url,
      });
    }

    return breadcrumbs;
  };

  return {
    currentSection: getCurrentSection(),
    navigateTo,
    isActive,
    getSectionInfo,
    getBreadcrumbs,
    pathname: isClient ? pathname : '',
    keyboardShortcuts: getNavigationKeyboardShortcuts(navigateTo),
  };
};

// Navigation Utilities
export const getSectionPriority = (
  sectionId: string
): 'high' | 'medium' | 'low' => {
  const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
  return section?.priority || 'low';
};

export const getSectionIcon = (sectionId: string): string => {
  const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
  return section?.icon || 'IconHelp';
};

export const isSectionAdminOnly = (sectionId: string): boolean => {
  const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
  return section?.adminOnly || false;
};

export const isSectionUserOnly = (sectionId: string): boolean => {
  const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
  return section?.userOnly || false;
};

// URL Mapping
export const getUrlForSection = (sectionId: string): string => {
  const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
  return section?.url || '/dashboard';
};

export const getSectionForUrl = (url: string): string => {
  const section = DASHBOARD_SECTIONS.find(s => s.url === url);
  return section?.id || 'overview';
};

// Search and Filter Utilities
export const searchSections = (
  query: string,
  user: User
): DashboardSection[] => {
  const config = getNavigationConfig(user);
  const allSections = config.all;

  if (!query.trim()) return allSections;

  const lowercaseQuery = query.toLowerCase();
  return allSections.filter(
    section =>
      section.label.toLowerCase().includes(lowercaseQuery) ||
      section.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterSectionsByPriority = (
  sections: DashboardSection[],
  priority: 'high' | 'medium' | 'low'
): DashboardSection[] => {
  return sections.filter(section => section.priority === priority);
};

export const sortSectionsByPriority = (
  sections: DashboardSection[]
): DashboardSection[] => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return sections.sort(
    (a, b) =>
      priorityOrder[b.priority || 'low'] - priorityOrder[a.priority || 'low']
  );
};

// Accessibility Helpers
export const getSectionAriaLabel = (sectionId: string): string => {
  const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
  return section
    ? `${section.label} - ${section.description}`
    : 'Dashboard Section';
};

export const getNavigationKeyboardShortcuts = (navigateTo: (sectionId: string) => void) => {
  return {
    'g o': () => navigateTo('overview'),
    'g c': () => navigateTo('cameras'),
    'g a': () => navigateTo('announcements'),
    'g d': () => navigateTo('documents'),
    'g e': () => navigateTo('events'),
    'g m': () => navigateTo('maintenance'),
    'g p': () => navigateTo('payments'),
    'g s': () => navigateTo('settings'),
  };
};

// Quick Actions Configuration
export const getQuickActions = (user: User, navigateTo: (sectionId: string) => void) => {
  const baseActions = [
    {
      id: 'report-emergency',
      title: 'Reportar Emergencia',
      description: 'Situaciones de riesgo o emergencias',
      icon: 'IconAlertTriangle',
      action: () => navigateTo('maintenance'),
      color: 'bg-red-500',
      priority: 'high',
    },
    {
      id: 'view-announcements',
      title: 'Ver Anuncios',
      description: 'Últimas noticias de la comunidad',
      icon: 'IconBell',
      action: () => navigateTo('announcements'),
      color: 'bg-blue-500',
      priority: 'medium',
    },
  ];

  const adminActions = user.isAdmin
    ? [
        {
          id: 'register-member',
          title: 'Registrar Vecino',
          description: 'Agregar nueva familia a la comunidad',
          icon: 'IconUserPlus',
          action: () => navigateTo('community'),
          color: 'bg-green-500',
          priority: 'high',
        },
        {
          id: 'system-settings',
          title: 'Configuración Sistema',
          description: 'Administrar configuración general',
          icon: 'IconSettings',
          action: () => navigateTo('settings'),
          color: 'bg-purple-500',
          priority: 'low',
        },
      ]
    : [];

  const userActions = !user.isAdmin
    ? [
        {
          id: 'make-payment',
          title: 'Hacer Aporte',
          description: 'Contribuciones voluntarias',
          icon: 'IconCreditCard',
          action: () => navigateTo('payments'),
          color: 'bg-green-500',
          priority: 'medium',
        },
      ]
    : [];

  return [...baseActions, ...adminActions, ...userActions];
};

// Navigation helper functions that should be used within hook context
export const createNavigateTo = (router: any) => (sectionId: string) => {
  const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
  if (section) {
    router.push(section.url);
  }
};

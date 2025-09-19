// Standardized spacing system for dashboard components
// This ensures consistent spacing across all dashboard elements

export const DASHBOARD_SPACING = {
  // Page-level spacing
  page: {
    container: 'space-y-8',           // Main page container spacing
    header: 'px-4 lg:px-6',          // Page header padding
    section: 'space-y-6',            // Section spacing within pages
  },

  // Grid and layout spacing
  grid: {
    gap: 'gap-6',                    // Standard grid gap
    cols: {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
  },

  // Card spacing
  card: {
    padding: 'p-6',                  // Standard card padding
    header: 'pb-4',                  // Card header bottom padding
    content: 'space-y-4',            // Card content vertical spacing
    footer: 'pt-4',                  // Card footer top padding
  },

  // Element spacing within components
  element: {
    tight: 'space-y-2',              // Tight spacing (8px)
    normal: 'space-y-3',             // Normal spacing (12px)
    loose: 'space-y-4',              // Loose spacing (16px)
    extraLoose: 'space-y-6',         // Extra loose spacing (24px)
  },

  // Component-specific spacing
  component: {
    icon: 'p-3',                     // Icon container padding
    badge: 'gap-2',                  // Badge gap spacing
    button: 'gap-2',                 // Button gap spacing
    form: 'space-y-4',               // Form element spacing
    list: 'space-y-3',               // List item spacing
  },

  // Responsive padding patterns
  responsive: {
    page: 'px-4 lg:px-6',            // Page-level responsive padding
    card: 'p-4 sm:p-6',              // Card responsive padding
    container: 'px-4 sm:px-6 lg:px-8', // Container responsive padding
  },
} as const;

// Spacing scale for consistent measurements
export const SPACING_SCALE = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
} as const;

// Quick access spacing utilities
export const SPACE = {
  page: DASHBOARD_SPACING.page,
  grid: DASHBOARD_SPACING.grid,
  card: DASHBOARD_SPACING.card,
  element: DASHBOARD_SPACING.element,
  component: DASHBOARD_SPACING.component,
  responsive: DASHBOARD_SPACING.responsive,
} as const;
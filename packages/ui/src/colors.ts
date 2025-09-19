// Chilean-inspired color palette for JuntaDeVecinos
export const colors = {
  // Primary colors (Chilean flag inspired)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49'
  },
  // Secondary colors (Earth tones for Ñuble region)
  secondary: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09'
  },
  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },
  // Error colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  }
} as const

// Chilean cultural colors
export const culturalColors = {
  // Chilean flag colors
  rojo: '#D52B1E',      // Red from Chilean flag
  azul: '#0033A0',      // Blue from Chilean flag
  blanco: '#FFFFFF',    // White from Chilean flag

  // Ñuble region colors (agricultural theme)
  trigo: '#F4E4BC',     // Wheat color
  tierra: '#8B4513',    // Earth brown
  cielo: '#87CEEB',     // Sky blue
  oliva: '#556B2F',     // Olive green
  uva: '#722F37',       // Grape color
  sol: '#FFD700'        // Golden sun
} as const

// Theme color mappings
export const themeColors = {
  light: {
    background: colors.secondary[50],
    foreground: colors.secondary[900],
    card: colors.secondary[50],
    'card-foreground': colors.secondary[900],
    primary: colors.primary[600],
    'primary-foreground': colors.primary[50],
    secondary: colors.secondary[200],
    'secondary-foreground': colors.secondary[800],
    muted: colors.secondary[100],
    'muted-foreground': colors.secondary[600],
    accent: colors.secondary[200],
    'accent-foreground': colors.secondary[800],
    destructive: colors.error[600],
    'destructive-foreground': colors.error[50],
    border: colors.secondary[200],
    input: colors.secondary[200],
    ring: colors.primary[600]
  },
  dark: {
    background: colors.secondary[950],
    foreground: colors.secondary[50],
    card: colors.secondary[900],
    'card-foreground': colors.secondary[50],
    primary: colors.primary[400],
    'primary-foreground': colors.primary[900],
    secondary: colors.secondary[800],
    'secondary-foreground': colors.secondary[100],
    muted: colors.secondary[800],
    'muted-foreground': colors.secondary[400],
    accent: colors.secondary[800],
    'accent-foreground': colors.secondary[100],
    destructive: colors.error[400],
    'destructive-foreground': colors.error[900],
    border: colors.secondary[700],
    input: colors.secondary[700],
    ring: colors.primary[400]
  }
} as const
// Typography system for JuntaDeVecinos
export const typography = {
  // Font families
  fonts: {
    sans: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ],
    mono: [
      '"JetBrains Mono"',
      'Monaco',
      '"Cascadia Code"',
      '"Roboto Mono"',
      'Consolas',
      '"Courier New"',
      'monospace'
    ]
  },

  // Font sizes
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem'     // 128px
  },

  // Font weights
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },

  // Line heights
  leading: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // Letter spacing
  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
} as const

// Text style presets
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.leading.tight,
    letterSpacing: typography.tracking.tight
  },
  h2: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.leading.tight,
    letterSpacing: typography.tracking.tight
  },
  h3: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.leading.tight,
    letterSpacing: typography.tracking.tight
  },
  h4: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.leading.tight,
    letterSpacing: typography.tracking.tight
  },

  // Body text
  body: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.leading.normal
  },
  bodyLarge: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.normal,
    lineHeight: typography.leading.relaxed
  },
  bodySmall: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.leading.normal
  },

  // Special text
  caption: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    lineHeight: typography.leading.normal,
    letterSpacing: typography.tracking.wide
  },
  overline: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.leading.normal,
    letterSpacing: typography.tracking.widest,
    textTransform: 'uppercase' as const
  },

  // Code
  code: {
    fontFamily: typography.fonts.mono.join(', '),
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.leading.normal
  }
} as const

// Chilean cultural text styles
export const culturalTextStyles = {
  // Traditional Chilean typography
  tituloPrincipal: {
    ...textStyles.h1,
    fontFamily: '"Times New Roman", serif',
    color: '#0033A0' // Chilean blue
  },

  subtitulo: {
    ...textStyles.h2,
    fontFamily: '"Times New Roman", serif',
    color: '#D52B1E' // Chilean red
  },

  // Rural/agricultural theme
  textoCampo: {
    ...textStyles.body,
    fontFamily: 'Georgia, serif',
    color: '#8B4513' // Earth brown
  },

  // Modern digital theme
  textoDigital: {
    ...textStyles.body,
    fontFamily: typography.fonts.sans.join(', '),
    color: '#0c4a6e' // Deep blue
  }
} as const
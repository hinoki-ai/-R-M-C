import { type ClassValue, clsx } from 'clsx'
import * as React from 'react'
import { twMerge } from 'tailwind-merge'

// Enhanced cn function with theme-aware merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Theme utility functions
export const themeUtils = {
  // Get current theme from localStorage
  getStoredTheme: (): 'light' | 'dark' | 'system' => {
    if (typeof window === 'undefined') return 'system'
    return (localStorage.getItem('junta-theme') as 'light' | 'dark' | 'system') || 'system'
  },

  // Set theme with validation
  setStoredTheme: (theme: 'light' | 'dark' | 'system'): void => {
    if (typeof window === 'undefined') return
    if (['light', 'dark', 'system'].includes(theme)) {
      localStorage.setItem('junta-theme', theme)
    }
  },

  // Check if system prefers dark mode
  getSystemTheme: (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  // Check if user prefers high contrast
  prefersHighContrast: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches
  },

  // Apply theme class to document
  applyThemeClass: (theme: 'light' | 'dark' | 'system'): void => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const currentClasses = root.className.split(' ').filter(cls => !cls.includes('dark') && !cls.includes('light'))

    if (theme === 'dark') {
      root.className = [...currentClasses, 'dark'].join(' ')
    } else if (theme === 'light') {
      root.className = currentClasses.join(' ')
    } else {
      // System theme
      const systemTheme = themeUtils.getSystemTheme()
      if (systemTheme === 'dark') {
        root.className = [...currentClasses, 'dark'].join(' ')
      } else {
        root.className = currentClasses.join(' ')
      }
    }
  },

  // Get effective theme (resolves system to actual light/dark)
  getEffectiveTheme: (theme: 'light' | 'dark' | 'system' = 'system'): 'light' | 'dark' => {
    if (theme === 'system') {
      return themeUtils.getSystemTheme()
    }
    return theme
  },

  // Generate theme-aware CSS custom properties
  generateThemeCSS: (theme: 'light' | 'dark'): string => {
    const colors = {
      light: {
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.145 0 0)',
        primary: 'oklch(0.205 0 0)',
        'primary-foreground': 'oklch(0.985 0 0)',
        // ... other light colors
      },
      dark: {
        background: 'oklch(0.145 0 0)',
        foreground: 'oklch(0.985 0 0)',
        primary: 'oklch(0.922 0 0)',
        'primary-foreground': 'oklch(0.205 0 0)',
        // ... other dark colors
      }
    }

    const themeColors = colors[theme]
    return Object.entries(themeColors)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n')
  },

  // Theme transition utilities
  createTransition: (properties: string[] = ['all'], duration = '0.3s', easing = 'ease'): string => {
    return properties.map(prop => `${prop} ${duration} ${easing}`).join(', ')
  },

  // Validate theme value
  isValidTheme: (theme: string): theme is 'light' | 'dark' | 'system' => {
    return ['light', 'dark', 'system'].includes(theme)
  },

  // Get theme from URL params (useful for previews)
  getThemeFromURL: (): 'light' | 'dark' | 'system' | null => {
    if (typeof window === 'undefined') return null

    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')

    if (theme && themeUtils.isValidTheme(theme)) {
      return theme
    }

    return null
  },

  // Theme analytics helpers
  trackThemeChange: (from: string, to: string, source: 'ui' | 'keyboard' | 'system' | 'url'): void => {
    if (typeof window === 'undefined') return

    // Could integrate with analytics service
    console.log(`Theme changed from ${from} to ${to} via ${source}`)

    // Example: Send to analytics
    if (window.gtag) {
      window.gtag('event', 'theme_change', {
        from_theme: from,
        to_theme: to,
        source: source,
        timestamp: new Date().toISOString()
      })
    }
  },

  // Generate theme export data
  exportThemeData: (currentTheme: string) => {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      currentTheme,
      systemTheme: themeUtils.getSystemTheme(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      viewport: typeof window !== 'undefined' ? {
        width: window.innerWidth,
        height: window.innerHeight
      } : null,
      preferences: {
        reducedMotion: themeUtils.prefersReducedMotion(),
        highContrast: themeUtils.prefersHighContrast(),
        colorScheme: themeUtils.getSystemTheme()
      }
    }
  },

  // Import and validate theme data
  importThemeData: (data: any): { valid: boolean; theme?: string; errors?: string[] } => {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      errors.push('Invalid data format')
      return { valid: false, errors }
    }

    if (!data.currentTheme) {
      errors.push('Missing currentTheme')
    } else if (!themeUtils.isValidTheme(data.currentTheme)) {
      errors.push('Invalid theme value')
    }

    if (errors.length > 0) {
      return { valid: false, errors }
    }

    return { valid: true, theme: data.currentTheme }
  }
}

// Enhanced theme hook with additional utilities
export function useThemeUtils() {
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  return {
    isHydrated,
    ...themeUtils,
    // Computed values
    currentTheme: themeUtils.getStoredTheme(),
    effectiveTheme: themeUtils.getEffectiveTheme(themeUtils.getStoredTheme()),
    systemTheme: themeUtils.getSystemTheme(),
    prefersReducedMotion: themeUtils.prefersReducedMotion(),
    prefersHighContrast: themeUtils.prefersHighContrast(),
  }
}

// Theme-aware media query hook
export function useThemeMediaQuery() {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setMatches(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return matches
}

// Theme transition hook
export function useThemeTransition(duration = 300) {
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const startTransition = React.useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), duration)
  }, [duration])

  return { isTransitioning, startTransition }
}

// Theme preference detection hook
export function useThemePreferences() {
  const [preferences, setPreferences] = React.useState({
    reducedMotion: false,
    highContrast: false,
    colorScheme: 'light' as 'light' | 'dark'
  })

  React.useEffect(() => {
    const updatePreferences = () => {
      setPreferences({
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      })
    }

    updatePreferences()

    // Listen for changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const colorQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => updatePreferences()

    motionQuery.addEventListener('change', handleChange)
    contrastQuery.addEventListener('change', handleChange)
    colorQuery.addEventListener('change', handleChange)

    return () => {
      motionQuery.removeEventListener('change', handleChange)
      contrastQuery.removeEventListener('change', handleChange)
      colorQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return preferences
}
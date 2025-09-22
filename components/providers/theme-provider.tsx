'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

import { UnifiedTheme } from '@/lib/mobile'

type NextThemesProviderProps = Omit<
  React.ComponentProps<typeof NextThemesProvider>,
  'onThemeChange'
>

interface EnhancedThemeProviderProps extends NextThemesProviderProps {
  enableKeyboardShortcuts?: boolean
  enableAnalytics?: boolean
  enableReducedMotion?: boolean
  enableHighContrast?: boolean
  themeTransitionDuration?: number
}

export function ThemeProvider({
  children,
  enableKeyboardShortcuts = true,
  enableAnalytics = false,
  enableReducedMotion = true,
  enableHighContrast = true,
  themeTransitionDuration = 0.3,
  ...props
}: EnhancedThemeProviderProps) {
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>('light')
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [highContrast, setHighContrast] = React.useState(false)
  const [themeAnalytics, setThemeAnalytics] = React.useState<{
    switches: number
    preference: 'light' | 'dark' | 'system'
    lastChanged: Date | null
  }>({
    switches: 0,
    preference: 'system',
    lastChanged: null
  })

  // Enhanced system preference detection
  React.useEffect(() => {
    const updateSystemTheme = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setSystemTheme(prefersDark ? 'dark' : 'light')
    }

    updateSystemTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateSystemTheme)

    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  // Reduced motion detection
  React.useEffect(() => {
    if (!enableReducedMotion) return

    const updateReducedMotion = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setReducedMotion(prefersReduced)
    }

    updateReducedMotion()

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', updateReducedMotion)

    return () => mediaQuery.removeEventListener('change', updateReducedMotion)
  }, [enableReducedMotion])

  // High contrast detection
  React.useEffect(() => {
    if (!enableHighContrast) return

    const updateHighContrast = () => {
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
      setHighContrast(prefersHighContrast)
    }

    updateHighContrast()

    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    mediaQuery.addEventListener('change', updateHighContrast)

    return () => mediaQuery.removeEventListener('change', updateHighContrast)
  }, [enableHighContrast])

  // Keyboard shortcuts - will be handled by the component that uses useTheme
  // This logic is moved to the ModeToggle component

  // Apply theme transition duration
  React.useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.setProperty('--theme-transition', '0s')
    } else {
      document.documentElement.style.setProperty('--theme-transition', `${themeTransitionDuration}s`)
    }
  }, [themeTransitionDuration, reducedMotion])

  // Apply high contrast adjustments
  React.useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  // Initialize UnifiedTheme on mount with stored theme
  React.useEffect(() => {
    // Get stored theme from localStorage (next-themes uses 'theme' key)
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null

    // Use stored theme or default to 'light'
    const initialTheme = storedTheme || 'light'

    // Set initial theme in UnifiedTheme
    UnifiedTheme.setTheme(initialTheme)
  }, [])

  // Handle theme changes and sync with UnifiedTheme
  const handleThemeChange = React.useCallback((theme: string | undefined) => {
    if (theme) {
      UnifiedTheme.setTheme(theme as 'light' | 'dark' | 'system')

      // Update analytics
      if (enableAnalytics) {
        setThemeAnalytics(prev => ({
          ...prev,
          switches: prev.switches + 1,
          preference: theme as 'light' | 'dark' | 'system',
          lastChanged: new Date()
        }))
      }
    }
  }, [enableAnalytics])

  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange={reducedMotion}
      onThemeChange={handleThemeChange}
      {...props}
    >
      {/* Theme Context for advanced features */}
      <ThemeContext.Provider
        value={{
          systemTheme,
          reducedMotion,
          highContrast,
          themeAnalytics,
          setThemeAnalytics,
          themeTransitionDuration
        }}
      >
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  )
}

// Enhanced Theme Context
interface ThemeContextType {
  systemTheme: 'light' | 'dark'
  reducedMotion: boolean
  highContrast: boolean
  themeAnalytics: {
    switches: number
    preference: 'light' | 'dark' | 'system'
    lastChanged: Date | null
  }
  setThemeAnalytics: React.Dispatch<React.SetStateAction<{
    switches: number
    preference: 'light' | 'dark' | 'system'
    lastChanged: Date | null
  }>>
  themeTransitionDuration: number
}

export const ThemeContext = React.createContext<ThemeContextType | null>(null)

export function useThemeContext() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider')
  }
  return context
}

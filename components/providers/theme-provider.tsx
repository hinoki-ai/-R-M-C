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

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!enableKeyboardShortcuts) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + T for theme toggle
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault()

        // Get current theme and cycle through options
        const currentTheme = localStorage.getItem('theme') || 'light'
        const nextTheme = currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'system' : 'light'

        // Update analytics
        if (enableAnalytics) {
          setThemeAnalytics(prev => ({
            ...prev,
            switches: prev.switches + 1,
            preference: nextTheme,
            lastChanged: new Date()
          }))
        }

        // Trigger theme change (this will be handled by next-themes)
        const themeChangeEvent = new CustomEvent('themeChange', {
          detail: { theme: nextTheme }
        })
        window.dispatchEvent(themeChangeEvent)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboardShortcuts, enableAnalytics])

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

  // Mobile theme integration
  React.useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'light'
    UnifiedTheme.setTheme(currentTheme as 'light' | 'dark' | 'system')
  }, [])

  React.useEffect(() => {
    const handleUnifiedThemeSync = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: string }>).detail
      const nextTheme = detail?.theme || localStorage.getItem('theme') || 'light'
      UnifiedTheme.setTheme(nextTheme as 'light' | 'dark' | 'system')
    }

    window.addEventListener('themeChange', handleUnifiedThemeSync as EventListener)
    return () => window.removeEventListener('themeChange', handleUnifiedThemeSync as EventListener)
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={reducedMotion}
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

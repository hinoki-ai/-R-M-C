'use client'

/**
 * Theme System Overview:
 * - Light: Pastel gradient theme with soft colors (purple→blue→cyan→green)
 * - Dark: Midnight starry moonlight theme with deep blues and subtle star effects
 * - System: Follows OS preference (light/dark)
 * - Custom: Vineyard, Ocean, Mountain, Patagonia themes (Chilean countryside inspired)
 */

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
    preference: 'light' | 'dark' | 'system' | 'vineyard' | 'ocean' | 'mountain' | 'patagonia' | 'pastel'
    lastChanged: Date | null
  }>({
    switches: 0,
    preference: 'light', // Default to pastel light theme
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
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | 'vineyard' | 'ocean' | 'mountain' | 'patagonia' | 'pastel' | null

    // Use stored theme or default to 'light'
    const initialTheme = storedTheme || 'light'

    // Apply custom theme class if it's a custom theme
    const customThemes = ['vineyard', 'ocean', 'mountain', 'patagonia', 'pastel']
    if (customThemes.includes(initialTheme)) {
      document.documentElement.classList.add(initialTheme)
      UnifiedTheme.setTheme('light') // Custom themes handle their own dark variants
    } else {
      UnifiedTheme.setTheme(initialTheme as 'light' | 'dark' | 'system')
    }
  }, [])

  // Handle theme changes and sync with UnifiedTheme (for mobile features only)
  const handleThemeChange = React.useCallback((theme: string | undefined) => {
    if (theme) {
      // Remove all custom theme classes first
      const customThemes = ['vineyard', 'ocean', 'mountain', 'patagonia', 'pastel']
      customThemes.forEach(themeClass => {
        document.documentElement.classList.remove(themeClass)
      })

      // Apply custom theme class if it's a custom theme
      if (customThemes.includes(theme)) {
        document.documentElement.classList.add(theme)
        // For custom themes, we still use light/dark from next-themes for dark mode
        UnifiedTheme.setTheme('light') // Custom themes handle their own dark variants
      } else {
        UnifiedTheme.setTheme(theme as 'light' | 'dark' | 'system')
      }

      // Update analytics
      if (enableAnalytics) {
        setThemeAnalytics(prev => ({
          ...prev,
          switches: prev.switches + 1,
          preference: theme as 'light' | 'dark' | 'system' | 'vineyard' | 'ocean' | 'mountain' | 'patagonia' | 'pastel',
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
    preference: 'light' | 'dark' | 'system' | 'vineyard' | 'ocean' | 'mountain' | 'patagonia' | 'pastel'
    lastChanged: Date | null
  }
  setThemeAnalytics: React.Dispatch<React.SetStateAction<{
    switches: number
    preference: 'light' | 'dark' | 'system' | 'vineyard' | 'ocean' | 'mountain' | 'patagonia' | 'pastel'
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

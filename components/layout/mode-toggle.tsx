'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { Button } from '@/components/ui/button'

import { useThemeContext } from '../providers/theme-provider'


export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { highContrast, reducedMotion } = useThemeContext()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + T for theme toggle
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault()
        toggleTheme()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    return (
      <Button variant='outline' size='icon' disabled>
        <div className='h-[1.2rem] w-[1.2rem] bg-muted animate-pulse rounded' />
        <span className='sr-only'>Loading theme toggle</span>
      </Button>
    )
  }

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={toggleTheme}
      className='relative group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95'
      title={`Current theme: ${theme}${highContrast ? ' (High Contrast)' : ''}${reducedMotion ? ' (Reduced Motion)' : ''}`}
    >
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12 dark:rotate-0 dark:scale-100' />
      {highContrast && (
        <div className='absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse' />
      )}
      {/* Subtle glow effect */}
      <div className='absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300' />
      <span className='sr-only'>
        Toggle theme - Current: {theme}
        {highContrast && ' (High Contrast)'}
        {reducedMotion && ' (Reduced Motion)'}
        - Press Ctrl+Shift+T for quick toggle
      </span>
    </Button>
  )
}

'use client'

import { BarChart3, Download, Monitor, Moon, Settings, Sun, Upload } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useThemeContext } from '../providers/theme-provider'


export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { themeAnalytics, highContrast, reducedMotion } = useThemeContext()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Handle keyboard shortcut events
  React.useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setTheme(event.detail.theme)
    }

    window.addEventListener('themeChange', handleThemeChange as EventListener)
    return () => window.removeEventListener('themeChange', handleThemeChange as EventListener)
  }, [setTheme])

  // Theme export functionality
  const exportTheme = () => {
    const themeData = {
      currentTheme: theme,
      analytics: themeAnalytics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `junta-theme-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Theme import functionality
  const importTheme = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const themeData = JSON.parse(e.target?.result as string)
            if (themeData.currentTheme) {
              setTheme(themeData.currentTheme)
            }
          } catch (error) {
            console.error('Invalid theme file:', error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
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
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-56 shadow-xl border-0 bg-background/95 backdrop-blur-xl'>
        {/* Theme Options */}
        <div className='px-2 py-1.5 text-sm font-medium text-muted-foreground bg-gradient-to-r from-transparent via-muted/50 to-transparent'>
          Theme Options
        </div>

        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`${theme === 'light' ? 'bg-accent' : ''} cursor-pointer hover:bg-accent/80 transition-colors duration-200 group`}
        >
          <Sun className='mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-200' />
          <span>Light</span>
          {theme === 'light' && <Badge variant='secondary' className='ml-auto animate-pulse'>Active</Badge>}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`${theme === 'dark' ? 'bg-accent' : ''} cursor-pointer hover:bg-accent/80 transition-colors duration-200 group`}
        >
          <Moon className='mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-200' />
          <span>Dark</span>
          {theme === 'dark' && <Badge variant='secondary' className='ml-auto animate-pulse'>Active</Badge>}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`${theme === 'system' ? 'bg-accent' : ''} cursor-pointer hover:bg-accent/80 transition-colors duration-200 group`}
        >
          <Monitor className='mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200' />
          <span>System</span>
          {theme === 'system' && <Badge variant='secondary' className='ml-auto animate-pulse'>Active</Badge>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Advanced Options */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <Settings className='mr-2 h-4 w-4' />
            <span>Advanced</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className='w-48'>
            <DropdownMenuItem onClick={exportTheme} className='cursor-pointer'>
              <Download className='mr-2 h-4 w-4' />
              <span>Export Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={importTheme} className='cursor-pointer'>
              <Upload className='mr-2 h-4 w-4' />
              <span>Import Theme</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Analytics */}
        {themeAnalytics.switches > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className='px-2 py-1.5 text-sm font-medium text-muted-foreground'>
              Analytics
            </div>
            <DropdownMenuItem disabled className='opacity-75'>
              <BarChart3 className='mr-2 h-4 w-4' />
              <div className='flex flex-col'>
                <span>Theme Switches: {themeAnalytics.switches}</span>
                {themeAnalytics.lastChanged && (
                  <span className='text-xs text-muted-foreground'>
                    Last: {new Date(themeAnalytics.lastChanged).toLocaleDateString()}
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          </>
        )}

        {/* Status Indicators */}
        <DropdownMenuSeparator />
        <div className='px-2 py-1 space-y-1'>
          {highContrast && (
            <div className='flex items-center text-xs text-muted-foreground'>
              <div className='w-2 h-2 bg-primary rounded-full mr-2' />
              High Contrast Mode
            </div>
          )}
          {reducedMotion && (
            <div className='flex items-center text-xs text-muted-foreground'>
              <div className='w-2 h-2 bg-orange-500 rounded-full mr-2' />
              Reduced Motion
            </div>
          )}
          <div className='flex items-center text-xs text-muted-foreground'>
            <div className='w-2 h-2 bg-blue-500 rounded-full mr-2' />
            Keyboard: Ctrl+Shift+T
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

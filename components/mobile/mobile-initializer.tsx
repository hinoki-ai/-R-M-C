'use client'

import { Style } from '@capacitor/status-bar'
import { useEffect } from 'react'

import { MobileAPI } from '@/lib/mobile'

export function MobileInitializer() {
  useEffect(() => {
    // Only initialize on client-side
    if (typeof window === 'undefined') return

    const initializeMobile = async () => {
      try {
        // Initialize unified mobile features
        MobileAPI.initializeMobileFeatures()

        // Platform-specific initialization
        if (MobileAPI.Platform.isNative()) {
          console.log('🎯 Initializing native platform features...')

          // Initialize Capacitor plugins
          await initializeCapacitorPlugins()

          // Set up app state listeners
          await setupAppStateListeners()

          // Configure status bar and navigation
          await configureNativeUI()

          console.log('✅ Native platform features initialized')
        } else {
          console.log('🌐 Running in web environment')

          // Web-specific initialization
          setupWebOptimizations()
        }

        // Common initialization for both platforms
        setupCommonFeatures()

      } catch (error) {
        console.error('❌ Failed to initialize mobile features:', error)
      }
    }

    initializeMobile()
  }, [])

  return null // This component doesn't render anything
}

async function initializeCapacitorPlugins() {
  try {
    // Initialize Splash Screen
    const { SplashScreen } = await import('@capacitor/splash-screen')
    await SplashScreen.hide()

    // Initialize Status Bar
    const { StatusBar } = await import('@capacitor/status-bar')
    await StatusBar.setOverlaysWebView({ overlay: false })

    // Initialize Keyboard
    const { Keyboard, KeyboardResize } = await import('@capacitor/keyboard')
    await Keyboard.setResizeMode({ mode: KeyboardResize.Native })

  } catch (error) {
    console.warn('Some Capacitor plugins failed to initialize:', error)
  }
}

async function setupAppStateListeners() {
  try {
    const { App } = await import('@capacitor/app')

    // Listen for app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive)

      if (isActive) {
        // App came to foreground
        handleAppForeground()
      } else {
        // App went to background
        handleAppBackground()
      }
    })

    // Listen for app URL open (deep linking)
    App.addListener('appUrlOpen', (data) => {
      console.log('App opened with URL:', data.url)
      handleDeepLink(data.url)
    })

    // Listen for back button (Android)
    if (MobileAPI.Platform.isAndroid()) {
      App.addListener('backButton', () => {
        handleBackButton()
      })
    }

  } catch (error) {
    console.warn('Failed to set up app state listeners:', error)
  }
}

async function configureNativeUI() {
  try {
    const { StatusBar } = await import('@capacitor/status-bar')

    // Configure status bar based on current theme
    const isDark = document.documentElement.classList.contains('dark')

    await StatusBar.setStyle({
      style: isDark ? Style.Dark : Style.Light
    })

    if (MobileAPI.Platform.isAndroid()) {
      await StatusBar.setBackgroundColor({
        color: isDark ? '#000000' : '#ffffff'
      })
    }

  } catch (error) {
    console.warn('Failed to configure native UI:', error)
  }
}

function setupWebOptimizations() {
  // Add mobile-specific CSS classes
  document.documentElement.classList.add('mobile-web')

  // Set up PWA install prompt
  setupPWAInstallPrompt()
}

function setupPWAInstallPrompt() {
  let deferredPrompt: any

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    console.log('PWA install prompt available')

    // You can dispatch a custom event to show install button
    window.dispatchEvent(new CustomEvent('pwa-install-available', { detail: deferredPrompt }))
  })

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed')
    deferredPrompt = null
  })
}

function setupCommonFeatures() {
  // Set up global error handlers
  setupGlobalErrorHandling()


  // Set up accessibility features
  setupAccessibility()

  // Initialize analytics
  initializeAnalytics()
}

function setupGlobalErrorHandling() {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // Report to error tracking service
  })

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // Report to error tracking service
  })
}


function setupAccessibility() {
  // Add reduced motion support
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (prefersReducedMotion.matches) {
    document.documentElement.classList.add('reduced-motion')
  }

  prefersReducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
  })

  // Add high contrast support
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
  if (prefersHighContrast.matches) {
    document.documentElement.classList.add('high-contrast')
  }

  prefersHighContrast.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  })
}

function initializeAnalytics() {
  // Initialize analytics with platform-specific tracking
  const platform = MobileAPI.Platform.getPlatform()
  console.log(`Analytics initialized for platform: ${platform}`)
  // Add your analytics initialization here
}

function handleAppForeground() {
  // Refresh data, check for updates, etc.
  console.log('App came to foreground - refreshing data...')

  // Emit custom event for components to listen to
  window.dispatchEvent(new CustomEvent('app-foreground'))
}

function handleAppBackground() {
  // Save state, pause operations, etc.
  console.log('App went to background - saving state...')

  // Emit custom event for components to listen to
  window.dispatchEvent(new CustomEvent('app-background'))
}

function handleDeepLink(url: string) {
  console.log('Handling deep link:', url)

  // Parse URL and navigate to appropriate screen
  // Emit custom event with parsed route
  window.dispatchEvent(new CustomEvent('deep-link', { detail: { url } }))
}

function handleBackButton() {
  console.log('Back button pressed')

  // Handle navigation or show exit confirmation
  // Emit custom event for navigation handling
  window.dispatchEvent(new CustomEvent('back-button'))
}
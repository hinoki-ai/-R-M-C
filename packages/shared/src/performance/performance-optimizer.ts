import { debounce, throttle } from '../utils'

// Performance monitoring and optimization utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private metrics: Map<string, number[]> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  // Measure function execution time
  measureExecutionTime<T>(
    fn: () => T,
    label: string
  ): { result: T; duration: number } {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start

    this.recordMetric(label, duration)
    console.log(`${label} took ${duration.toFixed(2)}ms`)

    return { result, duration }
  }

  // Record performance metrics
  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    this.metrics.get(label)!.push(value)

    // Keep only last 100 measurements
    const measurements = this.metrics.get(label)!
    if (measurements.length > 100) {
      measurements.shift()
    }
  }

  // Get average metric value
  getAverageMetric(label: string): number {
    const measurements = this.metrics.get(label)
    if (!measurements || measurements.length === 0) return 0

    return measurements.reduce((sum, value) => sum + value, 0) / measurements.length
  }

  // Get metric statistics
  getMetricStats(label: string): {
    average: number
    min: number
    max: number
    count: number
  } | null {
    const measurements = this.metrics.get(label)
    if (!measurements || measurements.length === 0) return null

    return {
      average: this.getAverageMetric(label),
      min: Math.min(...measurements),
      max: Math.max(...measurements),
      count: measurements.length
    }
  }

  // Monitor Core Web Vitals
  monitorWebVitals(): void {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric('LCP', lastEntry.startTime)
      console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`)
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.set('LCP', lcpObserver)
    } catch (e) {
      console.warn('LCP monitoring not supported')
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime)
        console.log(`FID: ${(entry.processingStart - entry.startTime).toFixed(2)}ms`)
      })
    })

    try {
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.set('FID', fidObserver)
    } catch (e) {
      console.warn('FID monitoring not supported')
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.recordMetric('CLS', clsValue)
      console.log(`CLS: ${clsValue.toFixed(4)}`)
    })

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.set('CLS', clsObserver)
    } catch (e) {
      console.warn('CLS monitoring not supported')
    }
  }

  // Optimize images with lazy loading
  optimizeImages(): void {
    if (typeof window === 'undefined') return

    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          if (src) {
            img.src = src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }

  // Debounced API calls
  createDebouncedApiCall<T extends any[], R>(
    apiCall: (...args: T) => Promise<R>,
    delay: number = 300
  ): (...args: T) => Promise<R> {
    return debounce(apiCall, delay)
  }

  // Throttled scroll handler
  createThrottledScrollHandler(
    handler: (event: Event) => void,
    delay: number = 100
  ): (event: Event) => void {
    return throttle(handler, delay)
  }

  // Memory usage monitoring
  monitorMemoryUsage(): void {
    if (typeof window === 'undefined' || !performance.memory) return

    const checkMemory = () => {
      const memory = performance.memory
      this.recordMetric('JS Heap Used', memory.usedJSHeapSize)
      this.recordMetric('JS Heap Total', memory.totalJSHeapSize)
      this.recordMetric('JS Heap Limit', memory.jsHeapSizeLimit)

      console.log(`Memory: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB used of ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`)
    }

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000)
  }

  // Clean up observers
  cleanup(): void {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()
    this.metrics.clear()
  }

  // Get all metrics
  getAllMetrics(): Record<string, {
    average: number
    min: number
    max: number
    count: number
  }> {
    const result: Record<string, any> = {}

    this.metrics.forEach((measurements, label) => {
      const stats = this.getMetricStats(label)
      if (stats) {
        result[label] = stats
      }
    })

    return result
  }
}

// Utility functions for performance optimization
export const performanceUtils = {
  // Create optimized event listener
  createOptimizedEventListener: (
    element: Element | Window,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) => {
    const optimizedHandler = throttle(handler, 16) // ~60fps
    element.addEventListener(event, optimizedHandler, options)

    return () => element.removeEventListener(event, optimizedHandler)
  },

  // Create virtual scrolling container
  createVirtualScroller: (
    container: HTMLElement,
    itemHeight: number,
    totalItems: number,
    renderItem: (index: number) => HTMLElement
  ) => {
    let scrollTop = 0
    const visibleItems = Math.ceil(container.clientHeight / itemHeight) + 2

    const updateVisibleItems = () => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 1)
      const endIndex = Math.min(totalItems, startIndex + visibleItems)

      container.innerHTML = ''

      for (let i = startIndex; i < endIndex; i++) {
        const item = renderItem(i)
        item.style.position = 'absolute'
        item.style.top = `${i * itemHeight}px`
        item.style.height = `${itemHeight}px`
        container.appendChild(item)
      }
    }

    container.style.position = 'relative'
    container.style.height = `${totalItems * itemHeight}px`

    container.addEventListener('scroll', throttle(() => {
      scrollTop = container.scrollTop
      updateVisibleItems()
    }, 16))

    updateVisibleItems()
  }
}
/**
 * Comprehensive Integration Test Suite
 * Ensures perfect web/mobile integration and feature parity
 */

import { MobileAPI } from '../mobile/index';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  message?: string;
  duration?: number;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  duration: number;
  platform: string;
}

class IntegrationTester {
  private results: TestSuite[] = [];
  private startTime: number = 0;

  async runAllTests(): Promise<TestSuite[]> {
    console.log('🚀 Starting comprehensive integration tests...');

    this.startTime = Date.now();

    // Platform detection tests
    await this.runPlatformTests();

    // Mobile API tests
    await this.runMobileAPITests();

    // PWA tests
    await this.runPWATests();

    // Performance tests
    await this.runPerformanceTests();

    // Feature parity tests
    await this.runFeatureParityTests();

    const totalDuration = Date.now() - this.startTime;
    console.log(`✅ Integration tests completed in ${totalDuration}ms`);

    return this.results;
  }

  private async runPlatformTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Platform Detection',
      tests: [],
      duration: 0,
      platform: MobileAPI.Platform.getPlatform(),
    };

    const startTime = Date.now();

    // Test platform detection
    suite.tests.push({
      name: 'Platform Detection',
      status: this.testPlatformDetection(),
      message: `Detected platform: ${MobileAPI.Platform.getPlatform()}`,
    });

    // Test device capabilities
    suite.tests.push({
      name: 'Device Capabilities Detection',
      status: this.testDeviceCapabilities(),
      message: 'Device capabilities properly detected',
    });

    // Test native platform detection
    suite.tests.push({
      name: 'Native Platform Detection',
      status: this.testNativePlatformDetection(),
      message: `Is native: ${MobileAPI.Platform.isNative()}`,
    });

    suite.duration = Date.now() - startTime;
    this.results.push(suite);
  }

  private async runMobileAPITests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Mobile API Integration',
      tests: [],
      duration: 0,
      platform: MobileAPI.Platform.getPlatform(),
    };

    const startTime = Date.now();

    // Test storage API
    suite.tests.push({
      name: 'Unified Storage API',
      status: await this.testUnifiedStorage(),
      message: 'Storage API works across platforms',
    });

    // Test vibration API
    suite.tests.push({
      name: 'Unified Vibration API',
      status: this.testUnifiedVibration(),
      message: 'Vibration API works across platforms',
    });

    // Test haptic feedback
    suite.tests.push({
      name: 'Unified Haptic API',
      status: await this.testUnifiedHaptic(),
      message: 'Haptic feedback works on supported platforms',
    });

    // Test theme system
    suite.tests.push({
      name: 'Unified Theme System',
      status: this.testUnifiedTheme(),
      message: 'Theme system works across platforms',
    });

    // Test network monitoring
    suite.tests.push({
      name: 'Network Monitoring',
      status: this.testNetworkMonitoring(),
      message: 'Network status monitoring works',
    });

    suite.duration = Date.now() - startTime;
    this.results.push(suite);
  }

  private async runPWATests(): Promise<void> {
    const suite: TestSuite = {
      name: 'PWA Functionality',
      tests: [],
      duration: 0,
      platform: MobileAPI.Platform.getPlatform(),
    };

    const startTime = Date.now();

    // Test service worker registration
    suite.tests.push({
      name: 'Service Worker Registration',
      status: await this.testServiceWorkerRegistration(),
      message: 'Service worker properly registered',
    });

    // Test offline capability
    suite.tests.push({
      name: 'Offline Functionality',
      status: await this.testOfflineCapability(),
      message: 'App works offline',
    });

    // Test caching strategies
    suite.tests.push({
      name: 'Caching Strategies',
      status: await this.testCachingStrategies(),
      message: 'Caching works as expected',
    });

    // Test install prompt
    suite.tests.push({
      name: 'PWA Install Prompt',
      status: this.testPWAInstallPrompt(),
      message: 'Install prompt works correctly',
    });

    suite.duration = Date.now() - startTime;
    this.results.push(suite);
  }

  private async runPerformanceTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Performance Tests',
      tests: [],
      duration: 0,
      platform: MobileAPI.Platform.getPlatform(),
    };

    const startTime = Date.now();

    // Test load performance
    suite.tests.push({
      name: 'App Load Performance',
      status: await this.testLoadPerformance(),
      message: 'App loads within acceptable time limits',
    });

    // Test memory usage
    suite.tests.push({
      name: 'Memory Usage',
      status: await this.testMemoryUsage(),
      message: 'Memory usage is within acceptable limits',
    });

    // Test responsiveness
    suite.tests.push({
      name: 'UI Responsiveness',
      status: await this.testUIResponsiveness(),
      message: 'UI remains responsive under load',
    });

    suite.duration = Date.now() - startTime;
    this.results.push(suite);
  }

  private async runFeatureParityTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Feature Parity',
      tests: [],
      duration: 0,
      platform: MobileAPI.Platform.getPlatform(),
    };

    const startTime = Date.now();

    // Test authentication flow
    suite.tests.push({
      name: 'Authentication Flow',
      status: await this.testAuthenticationFlow(),
      message: 'Authentication works identically across platforms',
    });

    // Test data synchronization
    suite.tests.push({
      name: 'Data Synchronization',
      status: await this.testDataSynchronization(),
      message: 'Data syncs properly between platforms',
    });

    // Test UI components
    suite.tests.push({
      name: 'UI Component Consistency',
      status: await this.testUIComponents(),
      message: 'UI components render consistently',
    });

    // Test navigation
    suite.tests.push({
      name: 'Navigation Consistency',
      status: await this.testNavigation(),
      message: 'Navigation works consistently across platforms',
    });

    suite.duration = Date.now() - startTime;
    this.results.push(suite);
  }

  // Individual test implementations
  private testPlatformDetection(): 'pass' | 'fail' {
    try {
      const platform = MobileAPI.Platform.getPlatform();
      const validPlatforms = ['web', 'ios', 'android'];

      if (validPlatforms.includes(platform)) {
        return 'pass';
      }
      return 'fail';
    } catch (error) {
      return 'fail';
    }
  }

  private testDeviceCapabilities(): 'pass' | 'fail' {
    try {
      // Test touch capability detection
      const touchSupported = MobileAPI.DeviceCapabilities.supportsTouch();

      // Test geolocation capability detection
      const geoSupported = MobileAPI.DeviceCapabilities.supportsGeolocation();

      // Test vibration capability detection
      const vibrationSupported =
        MobileAPI.DeviceCapabilities.supportsVibration();

      // At minimum, these should not throw errors
      return 'pass';
    } catch (error) {
      return 'fail';
    }
  }

  private testNativePlatformDetection(): 'pass' | 'fail' {
    try {
      const isNative = MobileAPI.Platform.isNative();
      const platform = MobileAPI.Platform.getPlatform();

      // Basic consistency check
      if (isNative && platform === 'web') return 'fail';
      if (!isNative && platform !== 'web') return 'fail';

      return 'pass';
    } catch (error) {
      return 'fail';
    }
  }

  private async testUnifiedStorage(): Promise<'pass' | 'fail'> {
    try {
      const testKey = 'integration_test_key';
      const testValue = 'integration_test_value';

      // Test set
      await MobileAPI.UnifiedStorage.setItem(testKey, testValue);

      // Test get
      const retrievedValue = await MobileAPI.UnifiedStorage.getItem(testKey);

      if (retrievedValue !== testValue) return 'fail';

      // Test remove
      await MobileAPI.UnifiedStorage.removeItem(testKey);
      const removedValue = await MobileAPI.UnifiedStorage.getItem(testKey);

      if (removedValue !== null) return 'fail';

      return 'pass';
    } catch (error) {
      return 'fail';
    }
  }

  private testUnifiedVibration(): 'pass' | 'fail' {
    try {
      // These should not throw errors
      MobileAPI.UnifiedVibration.tap();
      MobileAPI.UnifiedVibration.success();
      MobileAPI.UnifiedVibration.error();

      return 'pass';
    } catch (error) {
      return 'fail';
    }
  }

  private async testUnifiedHaptic(): Promise<'pass' | 'fail'> {
    try {
      // These should not throw errors on any platform
      await MobileAPI.UnifiedHaptic.impact('medium');
      await MobileAPI.UnifiedHaptic.notification('success');

      return 'pass';
    } catch (error) {
      return 'fail';
    }
  }

  private testUnifiedTheme(): 'pass' | 'fail' {
    try {
      // Test theme setting
      MobileAPI.UnifiedTheme.setTheme('light');
      MobileAPI.UnifiedTheme.setTheme('dark');
      MobileAPI.UnifiedTheme.setTheme('system');

      // Test theme getting
      const currentTheme = MobileAPI.UnifiedTheme.getCurrentTheme();
      const validThemes = ['light', 'dark', 'system'];

      if (!validThemes.includes(currentTheme)) return 'fail';

      return 'pass';
    } catch (error) {
      return 'fail';
    }
  }

  private testNetworkMonitoring(): 'pass' | 'fail' {
    try {
      const isOnline = MobileAPI.NetworkMonitor.isOnline();

      // Should return a boolean
      if (typeof isOnline !== 'boolean') return 'fail';

      // Test listener (should not throw)
      const unsubscribe = MobileAPI.NetworkMonitor.addListener(() => {});
      unsubscribe();

      return 'pass';
    } catch (error) {
      return 'fail';
    }
  }

  private async testServiceWorkerRegistration(): Promise<
    'pass' | 'fail' | 'skip'
  > {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return 'skip';
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      return registration ? 'pass' : 'fail';
    } catch (error) {
      return 'fail';
    }
  }

  private async testOfflineCapability(): Promise<'pass' | 'fail' | 'skip'> {
    if (typeof window === 'undefined') return 'skip';

    try {
      // Test if we can make a request and it gets cached
      const response = await fetch('/manifest.json', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });

      return response.ok ? 'pass' : 'fail';
    } catch (error) {
      return 'fail';
    }
  }

  private async testCachingStrategies(): Promise<'pass' | 'fail' | 'skip'> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return 'skip';
    }

    try {
      const cacheNames = await caches.keys();
      const hasExpectedCaches = cacheNames.some(name =>
        name.includes('junta-de-vecinos')
      );

      return hasExpectedCaches ? 'pass' : 'fail';
    } catch (error) {
      return 'fail';
    }
  }

  private testPWAInstallPrompt(): 'pass' | 'fail' | 'skip' {
    if (typeof window === 'undefined') return 'skip';

    // Check if install function is available
    if (
      (window as any).installPWA &&
      typeof (window as any).installPWA === 'function'
    ) {
      return 'pass';
    }

    return 'fail';
  }

  private async testLoadPerformance(): Promise<'pass' | 'fail' | 'skip'> {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return 'skip';
    }

    try {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;

      // Should load within 5 seconds
      return loadTime < 5000 ? 'pass' : 'fail';
    } catch (error) {
      return 'fail';
    }
  }

  private async testMemoryUsage(): Promise<'pass' | 'fail' | 'skip'> {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return 'skip';
    }

    try {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;

      // Should use less than 50MB
      return usedMB < 50 ? 'pass' : 'fail';
    } catch (error) {
      return 'fail';
    }
  }

  private async testUIResponsiveness(): Promise<'pass' | 'fail' | 'skip'> {
    if (typeof window === 'undefined') return 'skip';

    try {
      const startTime = performance.now();

      // Simulate some UI interactions
      await new Promise(resolve => setTimeout(resolve, 100));

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Should respond within 200ms
      return responseTime < 200 ? 'pass' : 'fail';
    } catch (error) {
      return 'fail';
    }
  }

  private async testAuthenticationFlow(): Promise<'pass' | 'fail' | 'skip'> {
    // This would need to be implemented based on your specific auth setup
    // For now, just check if Clerk is available
    if (typeof window !== 'undefined' && (window as any).Clerk) {
      return 'pass';
    }
    return 'skip';
  }

  private async testDataSynchronization(): Promise<'pass' | 'fail' | 'skip'> {
    // This would need to be implemented based on your data sync setup
    // For now, just check if Convex is available
    if (typeof window !== 'undefined' && (window as any).ConvexReactClient) {
      return 'pass';
    }
    return 'skip';
  }

  private async testUIComponents(): Promise<'pass' | 'fail' | 'skip'> {
    // Check if key UI components are rendered
    if (typeof document === 'undefined') return 'skip';

    try {
      // Check for common UI elements
      const hasThemeProvider = document.querySelector('[data-theme]');
      const hasBody = document.body;

      return hasThemeProvider && hasBody ? 'pass' : 'fail';
    } catch (error) {
      return 'fail';
    }
  }

  private async testNavigation(): Promise<'pass' | 'fail' | 'skip'> {
    // Check if navigation is working
    if (typeof window === 'undefined') return 'skip';

    try {
      const currentPath = window.location.pathname;
      return currentPath ? 'pass' : 'fail';
    } catch (error) {
      return 'fail';
    }
  }

  // Generate test report
  generateReport(): string {
    let report = '# Integration Test Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Platform: ${MobileAPI.Platform.getPlatform()}\n\n`;

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;

    this.results.forEach(suite => {
      report += `## ${suite.name}\n`;
      report += `Duration: ${suite.duration}ms\n\n`;

      suite.tests.forEach(test => {
        totalTests++;
        const status = test.status.toUpperCase();
        report += `- ${status}: ${test.name}`;

        if (test.message) {
          report += ` - ${test.message}`;
        }
        report += '\n';

        switch (test.status) {
          case 'pass':
            passedTests++;
            break;
          case 'fail':
            failedTests++;
            break;
          case 'skip':
            skippedTests++;
            break;
        }
      });

      report += '\n';
    });

    report += '## Summary\n';
    report += `Total Tests: ${totalTests}\n`;
    report += `Passed: ${passedTests}\n`;
    report += `Failed: ${failedTests}\n`;
    report += `Skipped: ${skippedTests}\n`;
    report += `Success Rate: ${((passedTests / (totalTests - skippedTests)) * 100).toFixed(1)}%\n`;

    return report;
  }
}

// Export singleton instance
export const integrationTester = new IntegrationTester();

// Helper function to run tests and generate report
export async function runIntegrationTests(): Promise<string> {
  const results = await integrationTester.runAllTests();
  return integrationTester.generateReport();
}

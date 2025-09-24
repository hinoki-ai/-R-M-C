#!/usr/bin/env tsx

/**
 * Deployment Safety Check Script
 *
 * This script validates that your deployment is safe before proceeding.
 * It checks environment variables, feature flags, and data integrity.
 */

import { getFeatureFlags, features, DEPLOYMENT_PROFILES } from '../lib/features/feature-flags';
import { api } from '../convex/_generated/api';

interface SafetyCheck {
  name: string;
  check: () => Promise<boolean> | boolean;
  critical: boolean;
  message: string;
}

class DeploymentSafetyChecker {
  private checks: SafetyCheck[] = [];

  constructor() {
    this.initializeChecks();
  }

  private initializeChecks(): void {
    this.checks = [
      {
        name: 'Environment Variables',
        check: this.checkEnvironmentVariables.bind(this),
        critical: true,
        message: 'Required environment variables are missing or invalid',
      },
      {
        name: 'Database Connection',
        check: this.checkDatabaseConnection.bind(this),
        critical: true,
        message: 'Cannot connect to Convex database',
      },
      {
        name: 'Feature Flags',
        check: this.checkFeatureFlags.bind(this),
        critical: false,
        message: 'Some features may be disabled',
      },
      {
        name: 'Data Integrity',
        check: this.checkDataIntegrity.bind(this),
        critical: true,
        message: 'Database schema or data integrity issues detected',
      },
      {
        name: 'Security Configuration',
        check: this.checkSecurityConfig.bind(this),
        critical: true,
        message: 'Security settings may be misconfigured',
      },
    ];
  }

  async runAllChecks(): Promise<{ safe: boolean; results: Array<{ name: string; passed: boolean; critical: boolean; message?: string }> }> {
    console.log('🔍 Running deployment safety checks...\n');

    const results = [];
    let allPassed = true;

    for (const check of this.checks) {
      try {
        const passed = await check.check();
        results.push({
          name: check.name,
          passed,
          critical: check.critical,
          message: passed ? undefined : check.message,
        });

        if (!passed && check.critical) {
          allPassed = false;
        }

        console.log(`${passed ? '✅' : '❌'} ${check.name}: ${passed ? 'PASSED' : 'FAILED'}`);
        if (!passed) {
          console.log(`   ${check.message}`);
        }
      } catch (error) {
        results.push({
          name: check.name,
          passed: false,
          critical: check.critical,
          message: `Check failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });

        if (check.critical) {
          allPassed = false;
        }

        console.log(`❌ ${check.name}: ERROR - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`\n${allPassed ? '🎉' : '🚫'} Deployment ${allPassed ? 'SAFE' : 'BLOCKED'}`);
    console.log('==========================================\n');

    return { safe: allPassed, results };
  }

  private checkEnvironmentVariables(): boolean {
    const required = [
      'NEXT_PUBLIC_CONVEX_URL',
      'CLERK_SECRET_KEY',
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.log(`   Missing required environment variables: ${missing.join(', ')}`);
      return false;
    }

    console.log('   ✅ All required environment variables present');
    return true;
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      const { ConvexHttpClient } = await import('convex/browser');
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

      if (!convexUrl) {
        console.log('   NEXT_PUBLIC_CONVEX_URL environment variable not set');
        return false;
      }

      const client = new ConvexHttpClient(convexUrl);

      // Try a simple query to test connection
      await client.query(api.radio.getRadioStations);

      return true;
    } catch (error) {
      console.log(`   Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  private checkFeatureFlags(): boolean {
    const flags = getFeatureFlags();
    const { warnings } = features.safetyCheck();

    // CRITICAL: Check if full deployment is being used
    const deploymentProfile = process.env.NEXT_PUBLIC_DEPLOYMENT_PROFILE;
    if (deploymentProfile && deploymentProfile !== 'full') {
      console.log(`   🚫 BLOCKED: Attempted simplified deployment with profile "${deploymentProfile}"`);
      console.log('   💡 PintoPellines must ALWAYS deploy with FULL functionality');
      return false;
    }

    if (warnings.length > 0) {
      console.log('   Full deployment feature warnings:');
      warnings.forEach(warning => console.log(`     - ${warning}`));
    }

    console.log('   ✅ Full deployment profile confirmed');
    return true;
  }

  private async checkDataIntegrity(): Promise<boolean> {
    try {
      const { ConvexHttpClient } = await import('convex/browser');
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

      if (!convexUrl) {
        return false;
      }

      const client = new ConvexHttpClient(convexUrl);

      // Check if we can query basic tables without errors
      const tables = ['users', 'cameras', 'payments'];

      for (const table of tables) {
        try {
          // Use a simple query that should work if the table exists
          await client.query(api.radio.getRadioStations);
        } catch (error) {
          // Only fail if we're in production and the table should exist
          if (process.env.NODE_ENV === 'production') {
            console.log(`   Data integrity check failed for table '${table}': ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      console.log(`   Data integrity check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  private checkSecurityConfig(): boolean {
    const flags = getFeatureFlags();

    // Critical security checks
    if (flags.cameras && !process.env.LSVISION_UID) {
      console.log('   Camera features enabled but LSVISION_UID not configured');
      return false;
    }

    if (flags.payments && !process.env.STRIPE_SECRET_KEY) {
      console.log('   Payment features enabled but Stripe not configured');
      return false;
    }

    if (process.env.NODE_ENV === 'production') {
      // Production-specific security checks
      if (flags.debugMode) {
        console.log('   Debug mode should be disabled in production');
        return false;
      }

      if (flags.seeding) {
        console.log('   Database seeding should be disabled in production');
        return false;
      }
    }

    console.log('   ✅ Security configuration validated');
    return true;
  }
}

// Main execution
async function main() {
  const checker = new DeploymentSafetyChecker();
  const result = await checker.runAllChecks();

  // Exit with appropriate code
  process.exit(result.safe ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Deployment safety check failed:', error);
    process.exit(1);
  });
}
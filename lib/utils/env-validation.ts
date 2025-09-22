/**
 * Environment Variables Validation
 *
 * This module validates that all required environment variables are present
 * and have valid values before the application starts.
 */

export interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  invalidVars: string[];
  warnings: string[];
}

/**
 * Required environment variables for the application
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_CONVEX_URL',
  'NEXT_PUBLIC_CLERK_FRONTEND_API_URL',
  'CLERK_WEBHOOK_SECRET',
] as const;

/**
 * Optional but recommended environment variables
 */
const RECOMMENDED_ENV_VARS = [
  'NEXT_PUBLIC_OPENWEATHER_API_KEY',
  'CONVEX_ADMIN_KEY',
  'LSVISION_UID',
] as const;

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Convex URL format
 */
function isValidConvexUrl(url: string): boolean {
  return url.startsWith('https://') && url.includes('.convex.cloud');
}

/**
 * Validate Clerk frontend API URL
 */
function isValidClerkUrl(url: string): boolean {
  return url.startsWith('https://') && (
    url.includes('clerk.accounts') ||
    url.includes('clerk.com')
  );
}


/**
 * Validate environment variables
 */
export function validateEnvironment(): EnvValidationResult {
  const result: EnvValidationResult = {
    isValid: true,
    missingVars: [],
    invalidVars: [],
    warnings: [],
  };

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar];

    if (!value || value.trim() === '') {
      result.missingVars.push(envVar);
      result.isValid = false;
    } else {
      // Validate format for specific variables
      switch (envVar) {
        case 'NEXT_PUBLIC_CONVEX_URL':
          if (!isValidConvexUrl(value)) {
            result.invalidVars.push(`${envVar} (must be a valid Convex URL)`);
            result.isValid = false;
          }
          break;
        case 'NEXT_PUBLIC_CLERK_FRONTEND_API_URL':
          if (!isValidClerkUrl(value)) {
            result.invalidVars.push(`${envVar} (must be a valid Clerk URL)`);
            result.isValid = false;
          }
          break;
        case 'CLERK_WEBHOOK_SECRET':
          if (value.length < 20) {
            result.invalidVars.push(`${envVar} (must be at least 20 characters)`);
            result.isValid = false;
          }
          break;
      }
    }
  }

  // Check recommended variables
  for (const envVar of RECOMMENDED_ENV_VARS) {
    const value = process.env[envVar];

    if (!value || value.trim() === '') {
      result.warnings.push(`${envVar} is not set (optional but recommended)`);
    } else {
      // Validate format for specific recommended variables
      switch (envVar) {
        case 'NEXT_PUBLIC_OPENWEATHER_API_KEY':
          if (value.length < 20) {
            result.warnings.push(`${envVar} appears to be invalid (too short)`);
          }
          break;
        case 'CONVEX_ADMIN_KEY':
          if (value.length < 20) {
            result.warnings.push(`${envVar} appears to be invalid (too short)`);
          }
          break;
      }
    }
  }

  // Check for development vs production environment
  const nodeEnv = process.env.NODE_ENV;
  if (!nodeEnv) {
    result.warnings.push('NODE_ENV is not set (defaults to development)');
  } else if (!['development', 'production', 'test'].includes(nodeEnv)) {
    result.warnings.push(`NODE_ENV has invalid value: ${nodeEnv} (should be development, production, or test)`);
  }

  return result;
}

/**
 * Validate environment and throw error if invalid
 */
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();

  if (!result.isValid) {
    console.error('❌ Environment validation failed:');
    console.error('');

    if (result.missingVars.length > 0) {
      console.error('Missing required environment variables:');
      result.missingVars.forEach(envVar => {
        console.error(`  - ${envVar}`);
      });
      console.error('');
    }

    if (result.invalidVars.length > 0) {
      console.error('Invalid environment variables:');
      result.invalidVars.forEach(envVar => {
        console.error(`  - ${envVar}`);
      });
      console.error('');
    }

    console.error('Please set the required environment variables and try again.');
    console.error('You can create a .env.local file in the project root with the required values.');
    console.error('');

    if (result.warnings.length > 0) {
      console.error('Warnings:');
      result.warnings.forEach(warning => {
        console.error(`  ⚠️  ${warning}`);
      });
      console.error('');
    }

    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️  Environment validation warnings:');
    result.warnings.forEach(warning => {
      console.warn(`  - ${warning}`);
    });
    console.warn('');
  }

  console.log('✅ Environment validation passed');
}

/**
 * Get environment info for debugging
 */
export function getEnvironmentInfo(): Record<string, string | undefined> {
  return {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL ? '[SET]' : undefined,
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL ? '[SET]' : undefined,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET ? '[SET]' : undefined,
    NEXT_PUBLIC_OPENWEATHER_API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ? '[SET]' : undefined,
    CONVEX_ADMIN_KEY: process.env.CONVEX_ADMIN_KEY ? '[SET]' : undefined,
    MOBILE_BUILD: process.env.MOBILE_BUILD,
  };
}

/**
 * Create a sample .env.local file content
 */
export function generateSampleEnvFile(): string {
  return `# Environment Variables for Pinto Los Pellines
# Copy this to .env.local and fill in your actual values

# Required Variables
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-clerk-app.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional but Recommended Variables
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
CONVEX_ADMIN_KEY=your_convex_admin_key_here

# LS Vision Camera Configuration (O-Kamm only - view access)
LSVISION_UID=VE4386930MLXU

# Development Variables
NODE_ENV=development
MOBILE_BUILD=false
`;
}
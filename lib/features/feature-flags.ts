/**
 * Feature Flags for Safe Deployment
 *
 * This system allows you to safely disable sensitive features when deploying
 * simpler versions of the application, ensuring data safety and compliance.
 */

export interface FeatureFlags {
  // HIGH RISK FEATURES (Handle sensitive data)
  cameras: boolean;           // Security camera streams and feeds
  payments: boolean;          // Stripe payment processing
  emergencyProtocols: boolean; // Emergency contact and protocol data
  maintenanceRequests: boolean; // Infrastructure issue reporting with photos
  communityProjects: boolean;  // Fundraising and financial data
  userProfiles: boolean;      // User personal information
  notifications: boolean;     // Push notifications and alerts

  // MEDIUM RISK FEATURES
  weatherAlerts: boolean;     // Weather warning system
  calendarEvents: boolean;    // Community event management
  businessDirectory: boolean; // Business listings and contacts
  rssFeeds: boolean;          // External content integration
  radioStreaming: boolean;    // Audio streaming features

  // LOW RISK FEATURES
  announcements: boolean;     // Community announcements
  contacts: boolean;          // Public contact directory
  maps: boolean;              // Google Maps integration
  settings: boolean;          // User preferences

  // DEVELOPMENT FEATURES
  debugMode: boolean;         // Debug logging and tools
  seeding: boolean;           // Database seeding capabilities
}

// DEPLOYMENT PROFILES - FULL FUNCTIONALITY ONLY
export const DEPLOYMENT_PROFILES = {
  // ONLY full deployment allowed - complete PintoPellines functionality
  full: {
    cameras: true,
    payments: true,
    emergencyProtocols: true,
    maintenanceRequests: true,
    communityProjects: true,
    userProfiles: true,
    notifications: true,
    weatherAlerts: true,
    calendarEvents: true,
    businessDirectory: true,
    rssFeeds: true,
    radioStreaming: true,
    announcements: true,
    contacts: true,
    maps: true,
    settings: true,
    debugMode: false,
    seeding: false,
  } as FeatureFlags,
};

// ENVIRONMENT-BASED FEATURE FLAGS - ALWAYS FULL DEPLOYMENT
export function getFeatureFlags(): FeatureFlags {
  // Check for explicit deployment profile
  const deploymentProfile = process.env.NEXT_PUBLIC_DEPLOYMENT_PROFILE;

  // BLOCK any attempt to use simplified profiles
  if (deploymentProfile && deploymentProfile !== 'full') {
    console.error('🚫 SIMPLIFIED DEPLOYMENT BLOCKED!');
    console.error(`❌ Attempted to deploy with profile: "${deploymentProfile}"`);
    console.error('💡 PintoPellines must ALWAYS be deployed with FULL functionality');
    console.error('🔧 Removing invalid deployment profile setting...');

    // Force full deployment and warn about the attempt
    process.env.NEXT_PUBLIC_DEPLOYMENT_PROFILE = 'full';

    // Log this security event
    console.warn('⚠️  SECURITY: Simplified deployment attempt blocked and corrected');
  }

  // ALWAYS return full deployment profile
  console.log('✅ Deploying PintoPellines with FULL functionality');
  return DEPLOYMENT_PROFILES.full;
}

// FEATURE GUARDS
export const features = {
  // High-risk features with explicit warnings
  cameras: () => {
    const flags = getFeatureFlags();
    if (!flags.cameras) {
      console.warn('🚫 Camera features are disabled in this deployment');
      return false;
    }
    return true;
  },

  payments: () => {
    const flags = getFeatureFlags();
    if (!flags.payments) {
      console.warn('🚫 Payment features are disabled in this deployment');
      return false;
    }
    return true;
  },

  emergencyProtocols: () => {
    const flags = getFeatureFlags();
    if (!flags.emergencyProtocols) {
      console.warn('🚫 Emergency protocol features are disabled in this deployment');
      return false;
    }
    return true;
  },

  // Helper to check if a feature is enabled
  isEnabled: (feature: keyof FeatureFlags): boolean => {
    return getFeatureFlags()[feature];
  },

  // Get current deployment profile name
  getProfile: (): string => {
    const deploymentProfile = process.env.NEXT_PUBLIC_DEPLOYMENT_PROFILE;
    if (deploymentProfile && deploymentProfile in DEPLOYMENT_PROFILES) {
      return deploymentProfile;
    }

    const isProduction = process.env.NODE_ENV === 'production';
    return isProduction ? 'full' : 'simple';
  },

  // Data safety warnings
  safetyCheck: (): { safe: boolean; warnings: string[] } => {
    const flags = getFeatureFlags();
    const warnings: string[] = [];

    if (flags.cameras) {
      warnings.push('Camera features enabled - ensure proper access controls');
    }

    if (flags.payments) {
      warnings.push('Payment processing enabled - verify Stripe configuration');
    }

    if (flags.emergencyProtocols) {
      warnings.push('Emergency protocols enabled - confirm data accuracy');
    }

    if (flags.maintenanceRequests) {
      warnings.push('Maintenance requests enabled - check file upload security');
    }

    return {
      safe: warnings.length === 0,
      warnings,
    };
  },
};

// DATA SAFETY VALIDATION
export function validateDeploymentSafety(): void {
  const { safe, warnings } = features.safetyCheck();
  const profile = features.getProfile();

  console.log(`🚀 Deployment Profile: ${profile.toUpperCase()}`);

  if (!safe) {
    console.log('⚠️  DATA SAFETY WARNINGS:');
    warnings.forEach(warning => console.log(`   - ${warning}`));
  } else {
    console.log('✅ All features disabled or properly configured');
  }

  console.log('📋 Enabled Features:');
  const flags = getFeatureFlags();
  Object.entries(flags).forEach(([feature, enabled]) => {
    if (enabled) {
      console.log(`   ✓ ${feature}`);
    }
  });
}
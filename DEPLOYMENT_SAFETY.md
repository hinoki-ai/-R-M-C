# Full Deployment Guide for PintoPellines

## Overview

This guide explains how to deploy the complete, full-featured version of PintoPellines with all community functionality enabled.

## ⚠️ IMPORTANT: Always Deploy Full Versions

**PintoPellines should ALWAYS be deployed with ALL features enabled.** The simplified deployment options exist only for emergency situations or initial testing, but the community platform requires complete functionality to serve its purpose.

## Full Deployment Profile (Recommended)

### Default Configuration

```bash
NEXT_PUBLIC_DEPLOYMENT_PROFILE=full
```

### What Gets Enabled in Full Deployment

✅ **Security Cameras**: Live video streams and camera management
✅ **Payment Processing**: Stripe integration for community contributions
✅ **Emergency Protocols**: Critical emergency contact information
✅ **Maintenance Requests**: Infrastructure issues with photo uploads
✅ **Community Projects**: Fundraising and financial contribution data
✅ **Weather Alerts**: Community safety notifications
✅ **User Notifications**: Push notification systems
✅ **Calendar Events**: Community event management
✅ **All Business Features**: Directory, announcements, contacts

### Environment Requirements for Full Deployment

```env
# Required for full functionality
NEXT_PUBLIC_CONVEX_URL=https://your-convex-app-id.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
LSVISION_UID=your_camera_system_uid
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## ⚠️ CRITICAL SECURITY: Simplified Deployments BLOCKED

**PintoPellines deployment system is configured to BLOCK any simplified deployments.**

### 🚫 Attempting Simplified Deployment Will

1. **Block deployment immediately** with error message
2. **Log security violation** in deployment logs
3. **Force full deployment** regardless of configuration
4. **Display warnings** about the security violation

### Why This Protection Exists

- Community platform requires ALL features for safety
- Simplified versions risk community security
- Data safety violations are blocked at deployment level
- Historical incidents with simplified deployments

**Result: PintoPellines will ALWAYS deploy with complete functionality.**

## Safe Deployment Process

### 1. Pre-Deployment Safety Check

```bash
npm run safety-check
```

This validates:

- Environment variables are properly configured
- Database connectivity
- Feature flags are appropriate for the environment
- Security settings are correct

### 2. Safe Deployment

```bash
npm run deploy
```

This process:

- Runs automatic safety checks
- Creates backup snapshots
- Deploys with validation
- Provides rollback capabilities

### 3. Emergency Rollback
If deployment fails or issues arise:

```bash
# Check available backups
ls backups/

# Manual rollback (restores from backup)
# 1. Restore environment files
# 2. Revert code changes
# 3. Redeploy previous version
```

## Environment Configuration

### Required for All Deployments

```env
NEXT_PUBLIC_CONVEX_URL=https://your-convex-app-id.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
```

### Required for Full Deployment Only

```env
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
LSVISION_UID=your_camera_system_uid
```

### Deployment Profile Setting

```env
# Choose based on your needs:
NEXT_PUBLIC_DEPLOYMENT_PROFILE=simple  # Safe default
```

## Feature Flag Usage in Code

```typescript
import { features } from '@/lib/features/feature-flags';

// Check if a feature is enabled
if (features.isEnabled('cameras')) {
  // Show camera interface
}

// Guard sensitive operations
if (!features.cameras()) {
  return <div>Camera features are disabled in this deployment</div>;
}
```

## Data Migration Safety

### Automatic Protections

- Database seeding is **disabled in production**
- Schema changes require explicit confirmation
- Rollback snapshots are created before deployment

### Manual Migration Process

```bash
# Never run in production
npm run seed:safe-data-only

# For development testing only
npm run seed:all
```

## Security Best Practices

### 1. Environment Separation

- Use different Convex deployments for dev/staging/prod
- Separate Stripe accounts for testing vs production
- Unique API keys per environment

### 2. Feature Gradual Rollout
```bash
# Start with minimal features
NEXT_PUBLIC_DEPLOYMENT_PROFILE=minimal

# Gradually enable features
NEXT_PUBLIC_DEPLOYMENT_PROFILE=simple

# Full production deployment
NEXT_PUBLIC_DEPLOYMENT_PROFILE=full
```

### 3. Access Control
- Admin features require explicit authentication
- Camera access needs additional permissions
- Payment features validate user roles

## Troubleshooting

### Safety Check Failures
```bash
npm run safety-check
# Review error messages and fix configuration
```

### Deployment Issues
```bash
# Check deployment logs
npm run deploy 2>&1 | tee deployment.log

# Validate current state
curl -I https://your-deployment-url.com
```

### Data Concerns
```bash
# Check what features are enabled
npm run safety-check

# View current deployment profile
node -e "console.log(require('./lib/features/feature-flags').features.getProfile())"
```

## Emergency Contacts

If you encounter data safety issues:
1. Immediately disable the problematic deployment
2. Use rollback procedures to restore safe state
3. Contact development team for security review
4. Document the incident for compliance

## Compliance Checklist

- [ ] Environment variables properly configured
- [ ] Feature flags appropriate for deployment type
- [ ] Database backups current
- [ ] Security settings validated
- [ ] Access controls verified
- [ ] Rollback procedures documented
- [ ] Emergency contacts updated

---

**Remember**: When in doubt, deploy with `NEXT_PUBLIC_DEPLOYMENT_PROFILE=simple` for maximum safety.
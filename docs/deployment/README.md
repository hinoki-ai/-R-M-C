# Deployment Guide

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/hinoki-ai/-R-M-C)
[![Web](https://img.shields.io/badge/web-vercel-blue.svg)](#web-deployment)
[![Android](https://img.shields.io/badge/android-google--play-green.svg)](#mobile-deployment)
[![iOS](https://img.shields.io/badge/iOS-app--store-blue.svg)](#mobile-deployment)

> Complete deployment guide for PintoPellines - web and mobile platforms

This guide covers the deployment process for both web and mobile platforms of the PintoPellines application.

## 📋 Table of Contents

1. [Web Deployment](#web-deployment)
2. [Mobile Deployment](#mobile-deployment)
3. [Environment Management](#environment-management)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Monitoring & Analytics](#monitoring--analytics)

## 🌐 Web Deployment

### Vercel Deployment (Recommended)

#### Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- Project connected to GitHub

#### Automatic Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment**: Set environment variables in Vercel dashboard:

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-clerk-app.clerk.accounts.dev
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

1. **Deploy**: Push to main branch or use Vercel CLI:

```bash
npm i -g vercel
vercel --prod
```

#### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment-Specific Deployments

For staging and production deployments, use environment variables to configure the target environment:

```bash
# Staging deployment
NODE_ENV=staging npm run build
NODE_ENV=production npm run start

# Production deployment
NODE_ENV=production npm run build
NODE_ENV=production npm run start
```

## 📱 Mobile Deployment

For comprehensive mobile deployment instructions, see our detailed [Mobile Deployment Guide](mobile-deployment.md).

### Quick Mobile Deployment

#### Mobile Prerequisites

- Capacitor CLI installed: `npm install -g @capacitor/cli`
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

#### Build Preparation

```bash
# Build web assets for mobile
npm run build:mobile

# Add platforms (if not already added)
npx cap add android
npx cap add ios

# Sync web assets to native projects
npx cap sync
```

#### Platform-Specific Deployment

- **Android**: Follow [Google Play Store guide](mobile-deployment.md#android-deployment)
- **iOS**: Follow [App Store guide](mobile-deployment.md#ios-deployment)
- **PWA**: Automatic with web deployment

## Environment Configuration

### Environment Variables by Platform

#### Web Platform

```bash
# Required
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-clerk-app.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
NEXT_PUBLIC_GA_TRACKING_ID=GA_MEASUREMENT_ID
```

#### Mobile Platform (Capacitor)

```bash
# Android
CAPACITOR_APP_ID=com.juntadevecinos.app
CAPACITOR_APP_NAME=JuntaDeVecinos

# iOS
CAPACITOR_APP_ID=com.juntadevecinos.app
CAPACITOR_APP_NAME=JuntaDeVecinos

# Push Notifications (Optional)
ONESIGNAL_APP_ID=your_onesignal_app_id
```

### Platform-Specific Variables

#### Development

```bash
NODE_ENV=development
MOBILE_BUILD=false
VITE_DEBUG=true
```

#### Staging

```bash
NODE_ENV=staging
MOBILE_BUILD=false
NEXT_PUBLIC_API_BASE_URL=https://api-staging.juntadevecinos.com
```

#### Production

```bash
NODE_ENV=production
MOBILE_BUILD=false
NEXT_PUBLIC_API_BASE_URL=https://api.juntadevecinos.com
```

## CI/CD Pipeline

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm test

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-mobile:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:mobile
      - run: npx cap sync
      # Add mobile deployment steps here
```

## Database Deployment

### Convex Deployment

#### Development Environment

```bash
npx convex dev
```

#### Production Environment

```bash
npx convex deploy
```

#### Environment Management

```bash
# Switch between environments
npx convex env switch production

# View current environment
npx convex env list
```

## Monitoring & Analytics

### Performance Monitoring

#### Web Vitals

- Core Web Vitals are automatically tracked
- Configure alerting in your monitoring platform
- Set up dashboards for performance metrics

#### Mobile Performance

- Use platform-specific monitoring tools
- Track app startup time, memory usage, battery impact
- Monitor API response times

## Rollback Strategy

### Web Rollback

```bash
# Using Vercel CLI
vercel rollback

# Or via Vercel dashboard
# 1. Go to deployment history
# 2. Select previous deployment
# 3. Click "Promote to Production"
```

### Mobile Rollback

```bash
# iOS - via App Store Connect
# 1. Go to app version history
# 2. Select previous version
# 3. Submit for review

# Android - via Play Console
# 1. Go to release history
# 2. Select previous release
# 3. Roll back to that version
```

## Post-Deployment Checklist

### Web Deployment

- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Database connections established
- [ ] Environment variables loaded
- [ ] External APIs responding
- [ ] Performance metrics collected

### Mobile Deployment

- [ ] App installs on test devices
- [ ] Authentication flows work
- [ ] Push notifications enabled
- [ ] Offline functionality tested
- [ ] Device APIs accessible
- [ ] App Store/Play Store listing updated

### General

- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Monitoring alerts configured
- [ ] Backup procedures verified
- [ ] Rollback plan documented

## Troubleshooting Deployment Issues

### Common Web Deployment Issues

#### Build Failures

```bash
# Clear build cache
rm -rf .next

# Check environment variables
vercel env ls

# Validate build locally
npm run build
```

#### Runtime Errors

- Check server logs in Vercel dashboard
- Verify environment variables
- Test API endpoints
- Check database connectivity

### Common Mobile Deployment Issues

#### Capacitor Sync Issues

```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build:mobile
npx cap sync
```

#### Platform-Specific Build Errors

- **Android**: Check Android Studio logs, verify SDK versions
- **iOS**: Check Xcode logs, verify code signing certificates

#### App Store Submission Issues

- Verify app icons and screenshots
- Check privacy policy URL
- Ensure test flight beta testing if required
- Validate app description and keywords

Remember to always test thoroughly in staging before deploying to production!

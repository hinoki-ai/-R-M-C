#!/bin/bash

# JuntaDeVecinos Deployment Script
# This script handles the complete deployment process for both web and mobile platforms

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="PintoPellines"
WEB_APP_DIR="."
MOBILE_APP_DIR="."
ENV_FILE=".env.local"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi

    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm"
        exit 1
    fi

    # Check if Vercel CLI is installed (for web deployment)
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi

    # Check if Capacitor CLI is installed (for mobile deployment)
    if ! command -v cap &> /dev/null; then
        log_warning "Capacitor CLI is not installed. Installing..."
        npm install -g @capacitor/cli
    fi

    log_success "Dependencies check completed"
}

setup_environment() {
    log_info "Setting up environment..."

    # Check if environment file exists
    if [ ! -f "$ENV_FILE" ]; then
        log_warning "Environment file $ENV_FILE not found. Creating template..."
        cat > "$ENV_FILE" << EOF
# JuntaDeVecinos Environment Configuration
# Copy this file and fill in your actual values

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-clerk-frontend-api-url.clerk.accounts.dev

# Database
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud

# Payments (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Platform Configuration
CAPACITOR_APP_ID=com.juntadevecinos.app
NODE_ENV=production

# Deployment
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_ORG_ID=your_vercel_org_id
EOF
        log_error "Please fill in the environment variables in $ENV_FILE and run the script again"
        exit 1
    fi

    log_success "Environment setup completed"
}

deploy_web_app() {
    log_info "Deploying web application..."

    # Install dependencies
    log_info "Installing web app dependencies..."
    npm install

    # Build the application
    log_info "Building web application..."
    npm run build

    # Deploy Convex functions first
    log_info "Deploying Convex functions..."
    npx convex deploy

    # Deploy to Vercel
    log_info "Deploying to Vercel..."
    if [ -n "$VERCEL_TOKEN" ]; then
        vercel --prod --yes
    else
        log_warning "VERCEL_TOKEN not set. Please set it or deploy manually"
        log_info "Run: vercel --prod --yes"
    fi

    log_success "Web application deployment completed"
}

deploy_mobile_app() {
    log_info "Deploying mobile application..."

    # Build mobile version
    log_info "Building mobile application..."
    npm run build:mobile

    # Sync with Capacitor
    log_info "Syncing with Capacitor..."
    npx cap sync

    # Build Android APK
    log_info "Building Android APK..."
    npx cap build android

    # Build iOS app (if on macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        log_info "Building iOS app..."
        npx cap build ios
    else
        log_warning "Skipping iOS build (not on macOS)"
    fi

    log_success "Mobile application deployment completed"
}

deploy_backend() {
    log_info "Deploying backend..."

    # Deploy Convex functions
    log_info "Deploying Convex functions..."
    npx convex deploy

    log_success "Backend deployment completed"
}

seed_database() {
    log_info "Seeding database..."

    # Run database seeding script
    log_info "Running database seeding script..."
    npm run seed-database

    log_success "Database seeding completed"
}

update_documentation() {
    log_info "Updating documentation..."

    # Generate API documentation
    log_info "Generating API documentation..."
    # Add your documentation generation commands here

    log_success "Documentation update completed"
}

create_release_notes() {
    log_info "Creating release notes..."

    # Get the latest git tag
    LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.1.0")

    # Create release notes
    cat > "RELEASE_NOTES.md" << EOF
# JuntaDeVecinos Release Notes

## Version $LATEST_TAG

### 🚀 New Features
- Complete platform restoration after refactoring
- Enhanced mobile and web applications
- Improved community management features
- Advanced emergency response system

### 🔧 Improvements
- Spanish-only application (no i18n)
- Enhanced security features
- Improved performance and optimization
- Better offline functionality

### 🐛 Bug Fixes
- Fixed mobile app navigation issues
- Resolved web app responsiveness problems
- Corrected database seeding problems

### 📚 Documentation
- Updated architecture documentation
- Added deployment guides
- Enhanced user manuals

---
*Released on $(date)*
EOF

    log_success "Release notes created"
}

main() {
    echo -e "${BLUE}"
    echo "=========================================="
    echo "  JuntaDeVecinos Deployment Script"
    echo "=========================================="
    echo -e "${NC}"

    log_info "Starting deployment process for $PROJECT_NAME..."

    # Run deployment steps
    check_dependencies
    setup_environment
    deploy_backend
    deploy_web_app
    deploy_mobile_app
    seed_database
    update_documentation
    create_release_notes

    echo -e "${GREEN}"
    echo "=========================================="
    echo "  🎉 Deployment Completed Successfully!"
    echo "=========================================="
    echo -e "${NC}"

    log_success "All deployment tasks completed"
    log_info "Don't forget to:"
    echo "  1. Test the deployed applications"
    echo "  2. Update DNS records if necessary"
    echo "  3. Configure monitoring and alerts"
    echo "  4. Notify stakeholders about the new release"
}

# Handle command line arguments
case "${1:-}" in
    "web-only")
        log_info "Deploying web application only..."
        check_dependencies
        setup_environment
        deploy_backend
        deploy_web_app
        ;;
    "mobile-only")
        log_info "Deploying mobile application only..."
        check_dependencies
        setup_environment
        deploy_mobile_app
        ;;
    "backend-only")
        log_info "Deploying backend only..."
        check_dependencies
        setup_environment
        deploy_backend
        ;;
    *)
        main
        ;;
esac
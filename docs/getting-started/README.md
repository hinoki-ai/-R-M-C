# Getting Started

Welcome to JuntaDeVecinos! This guide will help you get the project up and running on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **npm or yarn** - Package manager (comes with Node.js)
- **Git** - Version control system

### Platform-Specific Prerequisites

#### Web Development

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code, WebStorm, etc.)

#### Mobile Development

- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Capacitor CLI**: `npm install -g @capacitor/cli`

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/hinoki-ai/-R-M-C.git
cd ΛRΛMΛC
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment variables template and configure your services:

```bash
cp .env.example .env.local
```

#### Required Environment Variables

Edit `.env.local` with your actual service credentials:

```bash
# Convex Database - Get from your Convex dashboard
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk Authentication - Get from your Clerk dashboard
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-clerk-app.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional: Weather API - Get free API key from OpenWeatherMap
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Optional: Admin operations - For database seeding
CONVEX_ADMIN_KEY=your_convex_admin_key_here
```

### 4. Setup Services

#### Convex Database Setup

1. Sign up at [convex.dev](https://convex.dev)
2. Create a new project
3. Copy your deployment URL to `.env.local`
4. Run the initial database setup:

   ```bash
   npx convex dev --once
   ```

#### Clerk Authentication Setup

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your API keys to `.env.local`
4. Configure your webhook endpoint in Clerk dashboard

#### Optional: Weather Integration

1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Get a free API key
3. Add it to `.env.local`

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Run the production server locally |
| `npm run lint` | Execute ESLint checks |
| `npm run type-check` | Run TypeScript in no-emit mode |
| `npm test` | Execute Jest test suite |
| `npm run quality-check` | Run all quality gates sequentially |

### Quality Gates

Before committing your changes, ensure all quality checks pass:

```bash
npm run quality-check
```

This command runs:

- TypeScript type checking
- ESLint linting
- Jest tests
- Structure validation
- Configuration validation

## Mobile App Development

### Capacitor Setup

After setting up the web application:

```bash
# Build the web app for mobile
npm run build:mobile

# Add platforms
npx cap add android
npx cap add ios

# Sync web assets to native projects
npx cap sync
```

### Android Development

```bash
# Open Android Studio
npx cap open android

# Build and run on device/emulator via Android Studio
```

### iOS Development (macOS only)

```bash
# Open Xcode
npx cap open ios

# Build and run on device/simulator via Xcode
```

## Project Structure

```bash
juntadevecinos/
├── app/                    # Next.js app directory
│   ├── (landing)/         # Landing page components
│   ├── dashboard/         # Protected dashboard pages
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   ├── dashboard/        # Dashboard-specific components
│   └── ...               # Other component directories
├── convex/               # Backend functions and schema
│   ├── schema.ts         # Database schema
│   ├── users.ts          # User management functions
│   └── ...               # Other backend modules
├── lib/                  # Utility libraries
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── docs/                 # Documentation
```

## Environment-Specific Configurations

### Development Environment

- Hot reload enabled
- Detailed error messages
- Development database
- Mock data where applicable

### Production Environment

- Optimized builds
- Minified assets
- Production database
- Error monitoring enabled

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

#### Database Connection Issues

1. Verify your `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
2. Ensure Convex CLI is authenticated: `npx convex login`
3. Check Convex dashboard for connection status

#### Authentication Issues

1. Verify Clerk API keys in `.env.local`
2. Check Clerk dashboard for correct domain settings
3. Ensure webhook URL is correctly configured

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Next Steps

Now that you have the project running:

1. **Explore the Dashboard**: Visit `/dashboard` to see the main application
2. **Review Documentation**: Check `docs/` for detailed guides
3. **Run Tests**: Execute `npm test` to see the test suite
4. **Customize**: Start modifying components and features

## Support

- 📧 **Email**: <support@juntadevecinos.com>
- 💬 **Discord**: [Join our community](https://discord.gg/hinoki-ai)
- 🐛 **Issues**: [GitHub Issues](https://github.com/hinoki-ai/-R-M-C/issues)
- 📚 **Wiki**: [Project Wiki](https://github.com/hinoki-ai/-R-M-C/wiki)

Welcome aboard! 🎉

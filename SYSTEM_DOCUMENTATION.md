# JuntaDeVecinos System Documentation

## System Overview

JuntaDeVecinos is a comprehensive community management platform designed for Pinto Los Pellines, Chile. The platform provides modern digital tools for neighborhood governance, security monitoring, and community engagement.

## Architecture Overview

### Core Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │     Convex      │    │   External APIs │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Weather,     │
│                 │    │                 │    │    Payments)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Capacitor     │    │   Database      │    │   File Storage  │
│   (Mobile)      │    │   (Real-time)   │    │   (Images)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend Layer

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Tabler Icons
- **State Management**: React hooks + Convex
- **Authentication**: Clerk

#### Backend Layer

- **Database**: Convex (real-time database)
- **Authentication**: Clerk with JWT
- **File Storage**: Convex storage
- **API Integration**: REST APIs for weather, payments

#### Mobile Layer

- **Framework**: Capacitor
- **Platforms**: iOS, Android
- **PWA Support**: Service workers, offline functionality

#### DevOps & Quality

- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, Prettier
- **Build**: Next.js build system
- **Deployment**: Vercel (web), App Store/Play Store (mobile)

## Database Schema

### Core Tables

#### Users (`users`)

```typescript
{
  _id: Id<'users'>;
  name: string;
  externalId: string; // Clerk ID
}
```

#### Cameras (`cameras`)

```typescript
{
  _id: Id<"cameras">
  name: string
  description?: string
  location?: string
  streamUrl: string
  isActive: boolean
  isOnline: boolean
  lastSeen?: number
  resolution?: string
  frameRate?: number
  hasAudio?: boolean
  createdBy: Id<"users">
  createdAt: number
  updatedAt: number
}
```

#### Community Features

- **Announcements**: Community news and notifications
- **Maintenance Requests**: Infrastructure issue reporting
- **Community Projects**: Fundraising and project management
- **Contacts**: Emergency and community contact directory

#### Calendar System

- **Events**: Community events and gatherings
- **Categories**: Event categorization
- **Attendees**: RSVP management
- **Reminders**: Automated notifications

#### Weather Integration

- **Weather Data**: Current conditions and forecasts
- **Alerts**: Weather warnings and notifications
- **Historical Data**: Weather history tracking

#### Payment System

- **Payment Attempts**: Stripe payment processing
- **Contributions**: Community fundraising
- **Project Funding**: Project-specific payments

## Application Workflow

### User Journey

#### 1. Authentication Flow

```text
User visits site → Clerk authentication → User profile creation → Dashboard access
```

#### 2. Camera Management Flow

```text
Login → Navigate to cameras → View camera list → Add/Edit cameras → Monitor streams → Receive alerts
```

#### 3. Community Engagement Flow

```text
Login → View announcements → Submit maintenance requests → Participate in projects → Access emergency contacts
```

#### 4. Administrative Flow

```text
Admin login → Access admin dashboard → Manage users → Configure system → Monitor activity → Generate reports
```

### Data Flow Architecture

#### Real-time Updates

```text
User Action → Convex Mutation → Database Update → Real-time Subscription → UI Update
```

#### File Upload Flow

```text
File Selection → Client Validation → Convex Storage → URL Generation → Database Record → UI Display
```

#### Payment Processing

```text
Payment Intent → Stripe API → Webhook → Payment Record → User Notification → Access Grant
```

## Development Workflow

### Environment Setup

#### Prerequisites

- Node.js 18+
- npm or yarn
- Git

#### Installation

```bash
# Clone repository
git clone https://github.com/hinoki-ai/-R-M-C.git
cd ΛRΛMΛC

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

#### Environment Variables

```bash
# Required
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=your_clerk_url
CLERK_WEBHOOK_SECRET=your_webhook_secret

# Optional but recommended
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_weather_api_key
CONVEX_ADMIN_KEY=your_admin_key
```

### Development Commands

#### Core Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

#### Database Management

```bash
# Seed database with test data
npm run seed:all

# Seed specific data types
npm run seed:cameras
npm run seed:weather
npm run seed:payments
```

#### Mobile Development

```bash
# Build for mobile
npm run build:mobile

# Sync with Capacitor
npm run cap:sync

# Open in Android Studio
npm run cap:open:android

# Open in XCode
npm run cap:open:ios
```

### Code Organization

#### Directory Structure

```text
/
├── app/                    # Next.js app directory
│   ├── (landing)/         # Landing page components
│   ├── dashboard/         # Dashboard pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── camera/           # Camera-related components
│   ├── dashboard/        # Dashboard components
│   └── providers/        # Context providers
├── convex/               # Backend functions
│   ├── schema.ts         # Database schema
│   ├── users.ts          # User management
│   ├── cameras.ts        # Camera functions
│   └── community.ts      # Community features
├── lib/                  # Utility libraries
│   ├── utils/           # Helper functions
│   └── services/        # External service integrations
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── __tests__/           # Test files
```

### Component Architecture

#### Atomic Design Pattern

```text
Atoms (Buttons, Inputs) → Molecules (Forms, Cards) → Organisms (Sections, Navigation) → Templates (Page Layouts) → Pages
```

#### Component Guidelines

- **Single Responsibility**: Each component has one clear purpose
- **TypeScript**: Full type safety with interfaces and types
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-first design approach
- **Performance**: Lazy loading and code splitting

### State Management

#### Local State

```typescript
// Component-level state with hooks
const [cameras, setCameras] = useState<Camera[]>([]);
const [loading, setLoading] = useState(false);
```

#### Server State

```typescript
// Convex queries for server state
const cameras = useQuery(api.cameras.getCameras);
const announcements = useQuery(api.community.getAnnouncements);
```

#### Global State

```typescript
// Context providers for global state
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system');
  // ... theme logic
};
```

## Build and Deployment

### Build Process

#### Development Build

```bash
npm run dev
# Starts Next.js development server with hot reloading
# Includes TypeScript checking and ESLint
```

#### Production Build

```bash
npm run build
# Creates optimized production build
# Generates static pages where possible
# Runs type checking and linting (can be disabled)
```

#### Build Optimization

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **CSS Optimization**: Tailwind purging and minification
- **Bundle Analysis**: Webpack bundle analyzer

### Deployment Strategies

#### Web Deployment (Vercel)

```yaml
# vercel.json
{
  'buildCommand': 'npm run build',
  'devCommand': 'npm run dev',
  'installCommand': 'npm install',
  'framework': 'nextjs',
}
```

#### Mobile Deployment

```bash
# Android
npm run cap:build:android
# Build web app → Sync with Capacitor → Generate APK

# iOS
npm run cap:build:ios
# Build web app → Sync with Capacitor → Generate IPA
```

### Environment Configuration

#### Development

- Hot reloading enabled
- Source maps generated
- Debug logging enabled
- Development API endpoints

#### Production

- Code minification
- Source maps stripped
- Production API endpoints
- Error boundaries enabled

## Quality Assurance

### Code Quality

#### Linting and Formatting

```javascript
// eslint.config.js
export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // Custom rules for the project
    },
  },
];
```

#### Type Checking

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Testing Strategy

#### Test Categories

1. **Unit Tests**: Component and utility function testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: Complete user workflow testing
4. **Performance Tests**: Load and responsiveness testing

#### Test Execution

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test categories
npm run test:unit
npm run test:integration
```

### Performance Optimization

#### Frontend Optimization

- **Lazy Loading**: Route and component lazy loading
- **Image Optimization**: Next.js Image component with WebP
- **Bundle Splitting**: Automatic code splitting
- **Caching**: Service worker caching strategy

#### Backend Optimization

- **Database Indexing**: Optimized Convex indexes
- **Query Optimization**: Efficient data fetching
- **Caching**: Redis caching for frequently accessed data
- **CDN**: Static asset delivery

### Security Measures

#### Authentication

- **Clerk Integration**: Secure authentication with JWT
- **Role-based Access**: Admin, user, and guest roles
- **Session Management**: Secure session handling

#### Data Protection

- **Input Validation**: Server-side input validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Token-based protection

#### API Security

- **Rate Limiting**: Request rate limiting
- **API Keys**: Secure API key management
- **HTTPS Only**: SSL/TLS encryption
- **CORS**: Proper CORS configuration

## Monitoring and Maintenance

### Logging and Monitoring

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Usage pattern analysis
- **System Health**: Database and API monitoring

### Backup and Recovery

- **Database Backups**: Automated daily backups
- **File Storage**: Redundant file storage
- **Disaster Recovery**: Recovery time objectives
- **Data Retention**: Compliance with data retention policies

### Update Strategy

- **Version Control**: Semantic versioning
- **Changelog**: Detailed change documentation
- **Migration Scripts**: Database migration handling
- **Rollback Plan**: Quick rollback procedures

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules
npm install

# Check environment variables
npm run validate-config
```

#### Database Issues

```bash
# Reset Convex database
npx convex dev --reset

# Check database schema
npx convex schema

# View database logs
npx convex logs
```

#### Mobile Build Issues

```bash
# Clean Capacitor
npm run cap:sync -- --clean

# Update Capacitor
npm install @capacitor/core@latest @capacitor/android@latest @capacitor/ios@latest

# Check platform compatibility
npx cap doctor
```

### Debug Tools

#### Development Tools

- **React DevTools**: Component inspection
- **Next.js DevTools**: Server-side debugging
- **Convex Dashboard**: Database inspection
- **Browser DevTools**: Network and performance analysis

#### Logging

```javascript
// Client-side logging
console.log('Debug info:', data);

// Server-side logging
console.error('Error occurred:', error);

// Convex logging
console.log('Database operation:', operation);
```

## Contributing

### Development Guidelines

1. **Branch Strategy**: Feature branches from main
2. **Code Reviews**: Required for all changes
3. **Testing**: All changes must include tests
4. **Documentation**: Update docs for API changes

### Commit Conventions

```bash
# Feature commits
feat: add camera monitoring feature
feat: implement weather alerts

# Bug fixes
fix: resolve camera stream loading issue
fix: correct payment processing error

# Documentation
docs: update API documentation
docs: add deployment guide
```

### Pull Request Process

1. Create feature branch
2. Implement changes with tests
3. Run full test suite
4. Create pull request
5. Code review and approval
6. Merge to main branch

## Future Enhancements

### Planned Features

- **AI-powered Analytics**: Machine learning insights
- **Advanced Camera Features**: Motion detection, facial recognition
- **Mobile App Enhancements**: Offline functionality, push notifications
- **Integration APIs**: Third-party service integrations
- **Advanced Reporting**: Custom dashboard and reports

### Scalability Considerations

- **Microservices Architecture**: Service decomposition
- **Database Sharding**: Horizontal scaling
- **CDN Integration**: Global content delivery
- **Load Balancing**: Traffic distribution

This comprehensive documentation provides the foundation for understanding, maintaining, and extending the JuntaDeVecinos platform. The system is designed for scalability, maintainability, and user satisfaction.

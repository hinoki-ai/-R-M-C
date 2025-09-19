# Development Standards

This document outlines the comprehensive development standards for the JuntaDeVecinos project, covering coding conventions, component patterns, backend practices, and configuration standards.

## Table of Contents

1. [Coding Standards](#coding-standards)
2. [Component Development](#component-development)
3. [Backend Development](#backend-development)
4. [Configuration Standards](#configuration-standards)
5. [Testing Standards](#testing-standards)
6. [Documentation Standards](#documentation-standards)

## Coding Standards

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "removeComments": true,
    "importHelpers": true,
    "downlevelIteration": true,
    "sourceMap": true,
    "incremental": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"],
      "@/utils/*": ["./utils/*"]
    },
    "jsx": "preserve"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "dist",
    "build",
    "out",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
}
```

### Naming Conventions

#### Files and Directories

- **Components**: `PascalCase` (e.g., `UserProfile.tsx`)
- **Hooks**: `camelCase` with `use` prefix (e.g., `useUserProfile.ts`)
- **Utilities**: `camelCase` (e.g., `formatDate.ts`)
- **Types**: `PascalCase` with descriptive names (e.g., `UserProfile.ts`)
- **Directories**: `kebab-case` (e.g., `user-profile/`)


#### Variables and Functions

- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`)
- **Variables**: `camelCase` (e.g., `userProfile`)
- **Functions**: `camelCase` (e.g., `formatUserName`)
- **Components**: `PascalCase` (e.g., `UserProfile`)
- **Enums**: `PascalCase` (e.g., `UserRole`)


#### Database and API

- **Tables**: `snake_case` (e.g., `user_profiles`)
- **Columns**: `snake_case` (e.g., `first_name`)
- **API Endpoints**: `kebab-case` (e.g., `/api/user-profiles`)
- **GraphQL**: `camelCase` for fields, `PascalCase` for types

## Component Development

### Component Structure Pattern

```typescript
// 📄 ComponentName.tsx
'use client';

import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: string;
  onAction?: (data: any) => void;
  className?: string;
}

const defaultProps: Partial<ComponentNameProps> = {
  optionalProp: 'default value',
};

export const ComponentName = memo<ComponentNameProps>((props) => {
  const {
    requiredProp,
    optionalProp,
    onAction,
    className,
    ...restProps
  } = { ...defaultProps, ...props };

  // State hooks
  const [state, setState] = useState(initialState);

  // Effect hooks
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Callback hooks
  const handleAction = useCallback(() => {
    // Handler logic
  }, [dependencies]);

  // Derived values
  const derivedValue = useMemo(() => {
    return computeExpensiveValue(state);
  }, [state]);

  // Render
  return (
    <div className={cn('component-name', className)} {...restProps}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Button onClick={handleAction}>
          {requiredProp}
        </Button>
      </motion.div>
    </div>
  );
});

ComponentName.displayName = 'ComponentName';
```

### Component Patterns

#### Container/Presentational Pattern

```typescript
// 📄 UserProfileContainer.tsx (Container)
export function UserProfileContainer() {
  const { user, isLoading, error, updateUser } = useUserProfile();

  if (isLoading) return <UserProfileSkeleton />;
  if (error) return <UserProfileError error={error} />;
  if (!user) return <UserProfileNotFound />;

  return (
    <UserProfile
      user={user}
      onUpdate={updateUser}
    />
  );
}

// 📄 UserProfile.tsx (Presentational)
interface UserProfileProps {
  user: User;
  onUpdate: (user: Partial<User>) => void;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <Button onClick={() => onUpdate({ name: 'New Name' })}>
        Update Name
      </Button>
    </div>
  );
}
```

#### Compound Component Pattern

```typescript
interface SelectContextValue {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export function Select({ children, value, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onChange, isOpen, setIsOpen }}>
      <div className="select">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children }: { children: React.ReactNode }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');

  return (
    <button
      onClick={() => context.setIsOpen(!context.isOpen)}
      className="select-trigger"
    >
      {children}
    </button>
  );
}
```

## Backend Development

### Database Schema Standards

```typescript
// 📄 convex/schema/users.schema.ts
export const userSchema = defineTable({
  // Identity fields
  externalId: v.string(), // Clerk ID
  email: v.string(),

  // Profile fields
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  displayName: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),

  // Metadata
  role: v.union(v.literal('user'), v.literal('admin'), v.literal('moderator')),
  status: v.union(v.literal('active'), v.literal('suspended'), v.literal('banned')),

  // Platform-specific data
  platformData: v.object({
    web: v.optional(v.object({
      lastLoginAt: v.optional(v.number()),
      preferences: v.optional(v.any()),
    })),
    mobile: v.optional(v.object({
      deviceId: v.optional(v.string()),
      pushToken: v.optional(v.string()),
      lastAppVersion: v.optional(v.string()),
    })),
  }),

  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),

  // Soft delete
  deletedAt: v.optional(v.number()),
})
.index('byExternalId', ['externalId'])
.index('byEmail', ['email'])
.index('byRole', ['role'])
.index('byStatus', ['status'])
.index('byCreatedAt', ['createdAt']);
```

### Function Patterns

#### Query Functions

```typescript
/**
 * Get current user with platform-specific data
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', identity.subject))
      .unique();

    if (!user) return null;

    return {
      id: user._id,
      externalId: user.externalId,
      email: user.email,
      displayName: user.displayName || `${user.firstName} ${user.lastName}`.trim(),
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      platformData: user.platformData,
    };
  },
});
```

#### Mutation Functions

```typescript
/**
 * Update user profile with cross-platform sync
 */
export const updateUserProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    platform: v.union(v.literal('web'), v.literal('mobile')),
    platformData: v.optional(v.object({
      web: v.optional(v.any()),
      mobile: v.optional(v.any()),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.firstName !== undefined) updateData.firstName = args.firstName;
    if (args.lastName !== undefined) updateData.lastName = args.lastName;
    if (args.displayName !== undefined) updateData.displayName = args.displayName;
    if (args.avatarUrl !== undefined) updateData.avatarUrl = args.avatarUrl;

    // Handle platform-specific data
    if (args.platformData) {
      updateData.platformData = {
        ...user.platformData,
        [args.platform]: {
          ...user.platformData?.[args.platform],
          ...args.platformData[args.platform],
        },
      };
    }

    await ctx.db.patch(user._id, updateData);

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  },
});
```

### Error Handling

#### Standardized Error Types

```typescript
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export interface StandardizedError {
  code: ErrorCode;
  message: string;
  details?: any;
  platform?: 'web' | 'mobile';
  timestamp: number;
  requestId?: string;
}
```

## Configuration Standards

### ESLint Configuration

```javascript
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Tailwind CSS Configuration

```typescript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... other color definitions
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

## Testing Standards

### Component Testing

```typescript
// 📄 Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
```

### Backend Testing

```typescript
// 📄 convex/functions/queries/__tests__/users.test.ts
describe('users queries', () => {
  let userId: string;

  beforeEach(async () => {
    userId = await convexTestHelper.createTestUser({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    });
  });

  describe('currentUser', () => {
    it('should return user data for authenticated user', async () => {
      const result = await convexTestHelper.withAuth(userId, () =>
        query(api.users.currentUser, {})
      );

      expect(result).toEqual({
        id: userId,
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user',
        status: 'active',
      });
    });
  });
});
```

## Documentation Standards

### Component Documentation

```typescript
/**
 * Button component for user interactions
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps {
  /**
   * The variant style of the button
   * @default 'default'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * The size of the button
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler function
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Button content
   */
  children: React.ReactNode;
}
```

### Function Documentation

```typescript
/**
 * Get current authenticated user with cross-platform data
 *
 * This query returns the current user's profile information,
 * optimized for the requesting platform.
 *
 * @param platform - The platform making the request ('web' | 'mobile')
 * @returns User profile data or null if not authenticated
 *
 * @example
 * ```typescript
 * const user = await convex.query(api.users.currentUser, {
 *   platform: 'web'
 * });
 * ```
 *
 * @throws {Error} When user is not authenticated
 * @platform web, mobile
 * @since v1.0.0
 */
export const currentUser = query({
  args: {
    platform: v.optional(v.union(v.literal('web'), v.literal('mobile'))),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

These development standards ensure consistency, maintainability, and scalability across the entire JuntaDeVecinos codebase.

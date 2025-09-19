import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Clerk - using minimal test data
jest.mock('@clerk/nextjs', () => ({
  useUser() {
    return {
      user: null, // No default user for testing
      isLoaded: true,
    };
  },
  useAuth() {
    return {
      getToken: jest.fn().mockResolvedValue(null), // No default token
      isLoaded: true,
      userId: null, // No default user ID
    };
  },
  ClerkProvider: ({ children }) => children,
  SignedIn: ({ children }) => null, // Default to signed out
  SignedOut: ({ children }) => children,
}));

// Global test utilities - minimal setup for testing
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    id: 'test_user_id',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@local.test',
    role: 'user',
    ...overrides,
  }),
};
import { ConvexError } from 'convex/values';

// Error types for Convex functions
export enum ConvexFunctionErrorType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  RATE_LIMIT = 'rate_limit',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  DATABASE_ERROR = 'database_error',
}

export interface ConvexFunctionError {
  type: ConvexFunctionErrorType;
  message: string;
  details?: any;
  retryable?: boolean;
  code?: string;
}

// Custom error class for Convex functions
export class ConvexFunctionErrorClass extends Error {
  public readonly type: ConvexFunctionErrorType;
  public readonly details?: any;
  public readonly retryable?: boolean;
  public readonly code?: string;

  constructor(
    type: ConvexFunctionErrorType,
    message: string,
    details?: any,
    retryable = false,
    code?: string
  ) {
    super(message);
    this.name = 'ConvexFunctionError';
    this.type = type;
    this.details = details;
    this.retryable = retryable;
    this.code = code;
  }
}

// Error factory functions
export const createAuthError = (
  message = 'Authentication required',
  details?: any
) =>
  new ConvexFunctionErrorClass(
    ConvexFunctionErrorType.AUTHENTICATION,
    message,
    details,
    false,
    'AUTH_REQUIRED'
  );

export const createAuthzError = (
  message = 'Insufficient permissions',
  details?: any
) =>
  new ConvexFunctionErrorClass(
    ConvexFunctionErrorType.AUTHORIZATION,
    message,
    details,
    false,
    'INSUFFICIENT_PERMISSIONS'
  );

export const createValidationError = (message: string, details?: any) =>
  new ConvexFunctionErrorClass(
    ConvexFunctionErrorType.VALIDATION,
    message,
    details,
    false,
    'VALIDATION_FAILED'
  );

export const createNotFoundError = (resource: string, details?: any) =>
  new ConvexFunctionErrorClass(
    ConvexFunctionErrorType.NOT_FOUND,
    `${resource} not found`,
    details,
    false,
    'RESOURCE_NOT_FOUND'
  );

export const createConflictError = (message: string, details?: any) =>
  new ConvexFunctionErrorClass(
    ConvexFunctionErrorType.CONFLICT,
    message,
    details,
    false,
    'RESOURCE_CONFLICT'
  );

export const createRateLimitError = (
  message = 'Too many requests',
  details?: any
) =>
  new ConvexFunctionErrorClass(
    ConvexFunctionErrorType.RATE_LIMIT,
    message,
    details,
    true,
    'RATE_LIMIT_EXCEEDED'
  );

export const createServerError = (
  message = 'Internal server error',
  details?: any
) =>
  new ConvexFunctionErrorClass(
    ConvexFunctionErrorType.SERVER_ERROR,
    message,
    details,
    true,
    'INTERNAL_ERROR'
  );

export const createDatabaseError = (
  message = 'Database operation failed',
  details?: any
) =>
  new ConvexFunctionErrorClass(
    ConvexFunctionErrorType.DATABASE_ERROR,
    message,
    details,
    true,
    'DATABASE_ERROR'
  );

export const createNetworkError = (
  message = 'Network operation failed',
  details?: any
) =>
  new ConvexFunctionErrorClass(
    ConvexFunctionErrorType.NETWORK_ERROR,
    message,
    details,
    true,
    'NETWORK_ERROR'
  );

// Authentication helper functions
export async function requireAuth(ctx: any): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw createAuthError();
  }
  return identity.subject;
}

export async function requireUser(ctx: any): Promise<any> {
  const userId = await requireAuth(ctx);

  const user = await ctx.db
    .query('users')
    .withIndex('byExternalId', (q: any) => q.eq('externalId', userId))
    .first();

  if (!user) {
    throw createNotFoundError('User');
  }

  return user;
}

export async function getCurrentUserOrThrow(ctx: any): Promise<any> {
  return await requireUser(ctx);
}

export async function requireAdmin(user: any): Promise<void> {
  if (!user || user.role !== 'admin') {
    throw createAuthzError('Admin privileges required');
  }
}

// Validation helpers
export function validateRequired(value: any, fieldName: string): void {
  if (value === null || value === undefined || value === '') {
    throw createValidationError(`${fieldName} is required`);
  }
}

export function validateStringLength(
  value: string,
  fieldName: string,
  minLength?: number,
  maxLength?: number
): void {
  if (typeof value !== 'string') {
    throw createValidationError(`${fieldName} must be a string`);
  }

  if (minLength !== undefined && value.length < minLength) {
    throw createValidationError(
      `${fieldName} must be at least ${minLength} characters long`
    );
  }

  if (maxLength !== undefined && value.length > maxLength) {
    throw createValidationError(
      `${fieldName} must not exceed ${maxLength} characters`
    );
  }
}

export function validateNumberRange(
  value: number,
  fieldName: string,
  min?: number,
  max?: number
): void {
  if (typeof value !== 'number' || isNaN(value)) {
    throw createValidationError(`${fieldName} must be a valid number`);
  }

  if (min !== undefined && value < min) {
    throw createValidationError(`${fieldName} must be at least ${min}`);
  }

  if (max !== undefined && value > max) {
    throw createValidationError(`${fieldName} must not exceed ${max}`);
  }
}

export function validateEnum<T>(
  value: T,
  allowedValues: T[],
  fieldName: string
): void {
  if (!allowedValues.includes(value)) {
    throw createValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }
}

export function validateId(id: any, tableName: string): void {
  if (!id) {
    throw createValidationError(`${tableName} ID is required`);
  }
  // Additional ID validation can be added here if needed
}

// Database operation helpers with error handling
export async function safeDbGet(
  ctx: any,
  id: any,
  tableName: string
): Promise<any> {
  try {
    const result = await ctx.db.get(id);
    if (!result) {
      throw createNotFoundError(tableName);
    }
    return result;
  } catch (error) {
    if (error instanceof ConvexFunctionErrorClass) {
      throw error;
    }
    throw createDatabaseError(`Failed to retrieve ${tableName}`, {
      originalError: error,
    });
  }
}

export async function safeDbInsert(
  ctx: any,
  tableName: string,
  data: any
): Promise<any> {
  try {
    return await ctx.db.insert(tableName, data);
  } catch (error) {
    throw createDatabaseError(`Failed to create ${tableName}`, {
      originalError: error,
    });
  }
}

export async function safeDbPatch(
  ctx: any,
  id: any,
  data: any,
  tableName: string
): Promise<void> {
  try {
    await ctx.db.patch(id, data);
  } catch (error) {
    throw createDatabaseError(`Failed to update ${tableName}`, {
      originalError: error,
    });
  }
}

export async function safeDbDelete(
  ctx: any,
  id: any,
  tableName: string
): Promise<void> {
  try {
    await ctx.db.delete(id);
  } catch (error) {
    throw createDatabaseError(`Failed to delete ${tableName}`, {
      originalError: error,
    });
  }
}

// Query helpers with error handling
export async function safeDbQuery(ctx: any, tableName: string): Promise<any[]> {
  try {
    return await ctx.db.query(tableName).collect();
  } catch (error) {
    throw createDatabaseError(`Failed to query ${tableName}`, {
      originalError: error,
    });
  }
}

// Logging helper
export function logConvexError(
  error: ConvexFunctionErrorClass,
  context?: any
): void {
  console.error('Convex Function Error:', {
    type: error.type,
    message: error.message,
    code: error.code,
    retryable: error.retryable,
    details: error.details,
    context,
    timestamp: new Date().toISOString(),
  });
}

// Wrapper for Convex function handlers with automatic error handling
export function withErrorHandling<TArgs, TResult>(
  handler: (ctx: any, args: TArgs) => Promise<TResult>,
  contextName?: string
) {
  return async (ctx: any, args: TArgs): Promise<TResult> => {
    try {
      return await handler(ctx, args);
    } catch (error) {
      if (error instanceof ConvexFunctionErrorClass) {
        logConvexError(error, { contextName, args });
        throw new ConvexError({
          type: error.type,
          message: error.message,
          details: error.details,
          retryable: error.retryable,
          code: error.code,
        });
      } else if (error instanceof Error) {
        // Handle standard Error objects
        const unexpectedError = createServerError(
          error.message || 'An unexpected error occurred',
          { originalError: error }
        );
        logConvexError(unexpectedError, { contextName, args });
        throw new ConvexError({
          type: unexpectedError.type,
          message: unexpectedError.message,
          details: unexpectedError.details,
          retryable: unexpectedError.retryable,
          code: unexpectedError.code,
        });
      } else {
        // Handle unknown error types
        const unexpectedError = createServerError(
          'An unexpected error occurred',
          { originalError: error }
        );
        logConvexError(unexpectedError, { contextName, args });
        throw new ConvexError({
          type: unexpectedError.type,
          message: unexpectedError.message,
          details: unexpectedError.details,
          retryable: unexpectedError.retryable,
          code: unexpectedError.code,
        });
      }
    }
  };
}

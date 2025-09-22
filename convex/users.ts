import { v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';
import {
  requireAuth,
  requireUser,
  validateRequired,
  validateStringLength,
  safeDbQuery,
  withErrorHandling,
  createValidationError,
  createNotFoundError
} from './utils/error-handler';

// Get all users (for admin purposes)
export const listUsers = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('users'),
    name: v.string(),
    externalId: v.string(),
  })),
  handler: withErrorHandling(async (ctx) => {
    const users = await safeDbQuery(ctx, 'users');

    return users.map(user => ({
      _id: user._id,
      name: user.name,
      externalId: user.externalId,
    }));
  }, 'listUsers'),
});

// Get user by external ID (Clerk ID)
export const getUserByExternalId = query({
  args: {
    externalId: v.string(),
  },
  handler: withErrorHandling(async (ctx, args) => {
    validateRequired(args.externalId, 'externalId');
    validateStringLength(args.externalId, 'externalId', 1, 100);

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q: any) => q.eq('externalId', args.externalId))
      .first();

    if (!user) return null;

    return {
      _id: user._id,
      name: user.name,
      externalId: user.externalId,
    };
  }, 'getUserByExternalId'),
});

// Get current user (authenticated user)
export const current = query({
  args: {},
  handler: withErrorHandling(async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q: any) => q.eq('externalId', userId.subject))
      .first();

    return user;
  }, 'current'),
});

// Get current user or throw error if not authenticated
export const getCurrentUser = async (ctx: any) => {
  const userId = await requireAuth(ctx);
  const user = await requireUser(ctx);
  return user;
};

// Alias for listUsers to match calendar component expectations
export const list = listUsers;

// Internal mutations for Clerk webhooks
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(),
  },
  returns: v.null(),
  handler: withErrorHandling(async (ctx, args) => {
    validateRequired(args.data, 'data');

    const clerkUser = args.data;

    if (!clerkUser || typeof clerkUser !== 'object') {
      throw createValidationError('Invalid Clerk user data provided');
    }

    const externalId = clerkUser.id;
    validateRequired(externalId, 'clerkUser.id');
    validateStringLength(externalId, 'externalId', 1, 100);

    const name = clerkUser.first_name
      ? `${clerkUser.first_name} ${clerkUser.last_name || ''}`.trim()
      : clerkUser.email_addresses?.[0]?.email_address || 'Unknown User';

    validateStringLength(name, 'name', 1, 200);

    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q: any) => q.eq('externalId', externalId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name,
        externalId,
      });
    } else {
      // Create new user
      await ctx.db.insert('users', {
        name,
        externalId,
      });
    }

    return null;
  }, 'upsertFromClerk'),
});

export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  returns: v.null(),
  handler: withErrorHandling(async (ctx, args) => {
    validateRequired(args.clerkUserId, 'clerkUserId');
    validateStringLength(args.clerkUserId, 'clerkUserId', 1, 100);

    // Find user by external ID
    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q: any) => q.eq('externalId', args.clerkUserId))
      .first();

    if (user) {
      // Delete the user
      await ctx.db.delete(user._id);
    }

    return null;
  }, 'deleteFromClerk'),
});

// Update user external ID (for linking Clerk users)
export const updateUserExternalId = mutation({
  args: {
    currentExternalId: v.string(),
    newExternalId: v.string(),
    newName: v.optional(v.string()),
  },
  returns: v.object({
    _id: v.id('users'),
    name: v.string(),
    externalId: v.string(),
    role: v.optional(v.union(v.literal('user'), v.literal('admin'))),
  }),
  handler: withErrorHandling(async (ctx, args) => {
    validateRequired(args.currentExternalId, 'currentExternalId');
    validateRequired(args.newExternalId, 'newExternalId');
    validateStringLength(args.currentExternalId, 'currentExternalId', 1, 100);
    validateStringLength(args.newExternalId, 'newExternalId', 1, 100);

    if (args.newName) {
      validateStringLength(args.newName, 'newName', 1, 200);
    }

    // Find user by current external ID
    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q: any) => q.eq('externalId', args.currentExternalId))
      .first();

    if (!user) {
      throw createNotFoundError(`User with external ID ${args.currentExternalId}`);
    }

    // Check if new external ID is already taken
    if (args.currentExternalId !== args.newExternalId) {
      const existingUser = await ctx.db
        .query('users')
        .withIndex('byExternalId', (q: any) => q.eq('externalId', args.newExternalId))
        .first();

      if (existingUser) {
        throw createConflictError('External ID already exists');
      }
    }

    // Update the user
    await ctx.db.patch(user._id, {
      externalId: args.newExternalId,
      name: args.newName || user.name,
    });

    return {
      _id: user._id,
      name: args.newName || user.name,
      externalId: args.newExternalId,
      role: user.role,
    };
  }, 'updateUserExternalId'),
});

// Create admin user manually (for bootstrapping) - public wrapper
export const createAdminUser = mutation({
  args: {
    name: v.string(),
    externalId: v.string(),
    role: v.optional(v.union(v.literal('user'), v.literal('admin'))),
  },
  returns: v.object({
    _id: v.id('users'),
    name: v.string(),
    externalId: v.string(),
    role: v.optional(v.union(v.literal('user'), v.literal('admin'))),
  }),
  handler: withErrorHandling(async (ctx, args) => {
    validateRequired(args.name, 'name');
    validateRequired(args.externalId, 'externalId');
    validateStringLength(args.name, 'name', 1, 200);
    validateStringLength(args.externalId, 'externalId', 1, 100);

    if (args.role) {
      validateEnum(args.role, ['user', 'admin'], 'role');
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q: any) => q.eq('externalId', args.externalId))
      .first();

    if (existingUser) {
      // Update existing user to admin
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        role: args.role || 'admin',
      });

      return {
        _id: existingUser._id,
        name: args.name,
        externalId: args.externalId,
        role: args.role || 'admin',
      };
    } else {
      // Create new admin user
      const userId = await ctx.db.insert('users', {
        name: args.name,
        externalId: args.externalId,
        role: args.role || 'admin',
      });

      return {
        _id: userId,
        name: args.name,
        externalId: args.externalId,
        role: args.role || 'admin',
      };
    }
  }, 'createAdminUser'),
});
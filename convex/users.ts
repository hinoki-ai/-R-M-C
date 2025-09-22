import { v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';

// Get all users (for admin purposes)
export const listUsers = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('users'),
    name: v.string(),
    externalId: v.string(),
  })),
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();

    return users.map(user => ({
      _id: user._id,
      name: user.name,
      externalId: user.externalId,
    }));
  },
});

// Get user by external ID (Clerk ID)
export const getUserByExternalId = query({
  args: {
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
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
  },
});

// Get current user (authenticated user)
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) return null;

    return await ctx.db
      .query('users')
      .withIndex('byExternalId', (q: any) => q.eq('externalId', userId.subject))
      .first();
  },
});

// Get current user or throw error if not authenticated
export const getCurrentUserOrThrow = async (ctx: any) => {
  const userId = await ctx.auth.getUserIdentity();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const user = await ctx.db
    .query('users')
    .withIndex('byExternalId', (q: any) => q.eq('externalId', userId.subject))
    .first();

  if (!user) {
    throw new Error('User not found');
  }

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
  handler: async (ctx, args) => {
    const clerkUser = args.data;
    const externalId = clerkUser.id;
    const name = clerkUser.first_name
      ? `${clerkUser.first_name} ${clerkUser.last_name || ''}`.trim()
      : clerkUser.email_addresses?.[0]?.email_address || 'Unknown User';

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
  },
});

export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
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
  },
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
  handler: async (ctx, args) => {
    // Find user by current external ID
    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q: any) => q.eq('externalId', args.currentExternalId))
      .first();

    if (!user) {
      throw new Error(`User with external ID ${args.currentExternalId} not found`);
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
  },
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
  handler: async (ctx, args) => {
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
  },
});
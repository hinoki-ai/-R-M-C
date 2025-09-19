import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all users (for admin purposes)
export const listUsers = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("users"),
    name: v.string(),
    externalId: v.string(),
  })),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

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
      .query("users")
      .withIndex("byExternalId", (q: any) => q.eq("externalId", args.externalId))
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
      .query("users")
      .withIndex("byExternalId", (q: any) => q.eq("externalId", userId.subject))
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
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", userId.subject))
    .first();

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Alias for listUsers to match calendar component expectations
export const list = listUsers;
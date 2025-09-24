import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { withErrorHandling, requireAuth, requireUser, safeDbGet, createAuthzError, createNotFoundError } from "./utils/error_handler";

// Get all businesses (admin view)
export const getAllBusinesses = query({
  args: {},
  returns: v.array(v.any()),
  handler: withErrorHandling(async (ctx, args: {}) => {
    return await ctx.db.query('businesses').order('desc').collect();
  }, 'getAllBusinesses')
});

// Get businesses for public view (active and verified only)
export const getBusinesses = query({
  args: {
    category: v.optional(v.union(
      v.literal('supermercado'),
      v.literal('panaderia'),
      v.literal('restaurante'),
      v.literal('farmacia'),
      v.literal('ferreteria'),
      v.literal('otros')
    )),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: withErrorHandling(async (ctx, args: { category?: 'supermercado' | 'panaderia' | 'restaurante' | 'farmacia' | 'ferreteria' | 'otros', featured?: boolean, limit?: number }) => {
    let query = ctx.db.query('businesses')
      .filter((q: any) => q.eq(q.field('isActive'), true))
      .filter((q: any) => q.eq(q.field('verified'), true));

    if (args.category) {
      query = query.filter((q: any) => q.eq(q.field('category'), args.category));
    }

    if (args.featured !== undefined) {
      query = query.filter((q: any) => q.eq(q.field('featured'), args.featured));
    }

    query = query.order('desc');

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  }, 'getBusinesses')
});

// Get business by ID
export const getBusiness = query({
  args: {
    businessId: v.id('businesses'),
  },
  returns: v.any(),
  handler: withErrorHandling(async (ctx, args: { businessId: any }) => {
    const business = await safeDbGet(ctx, args.businessId, 'businesses');
    return business;
  }, 'getBusiness')
});

// Create business
export const createBusiness = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal('supermercado'),
      v.literal('panaderia'),
      v.literal('restaurante'),
      v.literal('farmacia'),
      v.literal('ferreteria'),
      v.literal('otros')
    ),
    address: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    hours: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    socialMedia: v.optional(v.object({
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
    })),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id('businesses'),
  handler: withErrorHandling(async (ctx, args: { name: string, description: string, category: 'supermercado' | 'panaderia' | 'restaurante' | 'farmacia' | 'ferreteria' | 'otros', address: string, phone?: string, email?: string, website?: string, hours: string, latitude?: number, longitude?: number, imageUrl?: string, socialMedia?: { facebook?: string, instagram?: string, twitter?: string }, tags?: string[] }) => {
    const userId = await requireAuth(ctx);
    const user = await requireUser(ctx);

    const now = Date.now();

    return await ctx.db.insert('businesses', {
      name: args.name,
      description: args.description,
      category: args.category,
      address: args.address,
      phone: args.phone,
      email: args.email,
      website: args.website,
      hours: args.hours,
      rating: 0, // New businesses start with 0 rating
      featured: false, // New businesses are not featured by default
      isActive: false, // New businesses need verification
      ownerId: user._id,
      ownerName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username || 'Usuario',
      verified: false, // New businesses need verification
      latitude: args.latitude,
      longitude: args.longitude,
      imageUrl: args.imageUrl,
      socialMedia: args.socialMedia,
      tags: args.tags || [],
      createdAt: now,
      updatedAt: now,
    });
  }, 'createBusiness')
});

// Update business (admin or owner)
export const updateBusiness = mutation({
  args: {
    businessId: v.id('businesses'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal('supermercado'),
      v.literal('panaderia'),
      v.literal('restaurante'),
      v.literal('farmacia'),
      v.literal('ferreteria'),
      v.literal('otros')
    )),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    hours: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    socialMedia: v.optional(v.object({
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
    })),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: withErrorHandling(async (ctx, args: { businessId: any, name?: string, description?: string, category?: 'supermercado' | 'panaderia' | 'restaurante' | 'farmacia' | 'ferreteria' | 'otros', address?: string, phone?: string, email?: string, website?: string, hours?: string, latitude?: number, longitude?: number, imageUrl?: string, socialMedia?: { facebook?: string, instagram?: string, twitter?: string }, tags?: string[] }) => {
    const userId = await requireAuth(ctx);
    const user = await requireUser(ctx);

    const business = await safeDbGet(ctx, args.businessId, 'businesses');

    // Check if user is admin or business owner
    const userRole = user.role || 'user';
    const isAdmin = userRole === 'admin';
    const isOwner = business.ownerId === user._id;

    if (!isAdmin && !isOwner) {
      throw createAuthzError('Only administrators or business owners can update businesses');
    }

    const updateData: Partial<{
      name?: string;
      description?: string;
      category?: 'supermercado' | 'panaderia' | 'restaurante' | 'farmacia' | 'ferreteria' | 'otros';
      address?: string;
      phone?: string;
      email?: string;
      website?: string;
      hours?: string;
      latitude?: number;
      longitude?: number;
      imageUrl?: string;
      socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
      };
      tags?: string[];
      updatedAt: number;
    }> = {
      updatedAt: Date.now(),
    };

    // Only add fields that are provided
    if (args.name !== undefined) updateData.name = args.name;
    if (args.description !== undefined) updateData.description = args.description;
    if (args.category !== undefined) updateData.category = args.category;
    if (args.address !== undefined) updateData.address = args.address;
    if (args.phone !== undefined) updateData.phone = args.phone;
    if (args.email !== undefined) updateData.email = args.email;
    if (args.website !== undefined) updateData.website = args.website;
    if (args.hours !== undefined) updateData.hours = args.hours;
    if (args.latitude !== undefined) updateData.latitude = args.latitude;
    if (args.longitude !== undefined) updateData.longitude = args.longitude;
    if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;
    if (args.socialMedia !== undefined) updateData.socialMedia = args.socialMedia;
    if (args.tags !== undefined) updateData.tags = args.tags;

    await ctx.db.patch(args.businessId, updateData);

    return null;
  }, 'updateBusiness')
});

// Delete business (admin only)
export const deleteBusiness = mutation({
  args: {
    businessId: v.id('businesses'),
  },
  returns: v.null(),
  handler: withErrorHandling(async (ctx, args: { businessId: any }) => {
    const userId = await requireAuth(ctx);
    const user = await requireUser(ctx);

    // Check if user is admin
    const userRole = user.role || 'user';
    if (userRole !== 'admin') {
      throw createAuthzError('Only administrators can delete businesses');
    }

    const business = await safeDbGet(ctx, args.businessId, 'businesses');

    await ctx.db.delete(args.businessId);

    return null;
  }, 'deleteBusiness')
});

// Toggle business featured status (admin only)
export const toggleBusinessFeatured = mutation({
  args: {
    businessId: v.id('businesses'),
  },
  returns: v.null(),
  handler: withErrorHandling(async (ctx, args: { businessId: any }) => {
    const userId = await requireAuth(ctx);
    const user = await requireUser(ctx);

    // Check if user is admin
    const userRole = user.role || 'user';
    if (userRole !== 'admin') {
      throw createAuthzError('Only administrators can toggle featured status');
    }

    const business = await safeDbGet(ctx, args.businessId, 'businesses');

    await ctx.db.patch(args.businessId, {
      featured: !business.featured,
      updatedAt: Date.now(),
    });

    return null;
  }, 'toggleBusinessFeatured')
});

// Toggle business verified status (admin only)
export const toggleBusinessVerified = mutation({
  args: {
    businessId: v.id('businesses'),
  },
  returns: v.null(),
  handler: withErrorHandling(async (ctx, args: { businessId: any }) => {
    const userId = await requireAuth(ctx);
    const user = await requireUser(ctx);

    // Check if user is admin
    const userRole = user.role || 'user';
    if (userRole !== 'admin') {
      throw createAuthzError('Only administrators can toggle verified status');
    }

    const business = await safeDbGet(ctx, args.businessId, 'businesses');

    await ctx.db.patch(args.businessId, {
      verified: !business.verified,
      updatedAt: Date.now(),
    });

    return null;
  }, 'toggleBusinessVerified')
});

// Toggle business active status (admin only)
export const toggleBusinessActive = mutation({
  args: {
    businessId: v.id('businesses'),
  },
  returns: v.null(),
  handler: withErrorHandling(async (ctx, args: { businessId: any }) => {
    const userId = await requireAuth(ctx);
    const user = await requireUser(ctx);

    // Check if user is admin
    const userRole = user.role || 'user';
    if (userRole !== 'admin') {
      throw createAuthzError('Only administrators can toggle active status');
    }

    const business = await safeDbGet(ctx, args.businessId, 'businesses');

    await ctx.db.patch(args.businessId, {
      isActive: !business.isActive,
      updatedAt: Date.now(),
    });

    return null;
  }, 'toggleBusinessActive')
});

// Update business rating
export const updateBusinessRating = mutation({
  args: {
    businessId: v.id('businesses'),
    rating: v.number(), // 1-5
  },
  returns: v.null(),
  handler: withErrorHandling(async (ctx, args: { businessId: any, rating: number }) => {
    const userId = await requireAuth(ctx);

    if (args.rating < 1 || args.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const business = await safeDbGet(ctx, args.businessId, 'businesses');

    // In a real app, you'd want to track individual ratings and calculate average
    // For now, we'll just update the rating directly
    await ctx.db.patch(args.businessId, {
      rating: args.rating,
      updatedAt: Date.now(),
    });

    return null;
  }, 'updateBusinessRating')
});
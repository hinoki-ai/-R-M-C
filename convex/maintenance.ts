import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// Get all maintenance requests for admin management
export const getAllMaintenanceRequests = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('in-progress'),
        v.literal('completed'),
        v.literal('cancelled')
      )
    ),
    priority: v.optional(
      v.union(
        v.literal('low'),
        v.literal('medium'),
        v.literal('high'),
        v.literal('critical')
      )
    ),
    category: v.optional(
      v.union(
        v.literal('roads'),
        v.literal('lighting'),
        v.literal('water'),
        v.literal('sewage'),
        v.literal('buildings'),
        v.literal('other')
      )
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id('maintenanceRequests'),
      title: v.string(),
      description: v.string(),
      location: v.string(),
      priority: v.string(),
      status: v.string(),
      category: v.string(),
      reportedBy: v.id('users'),
      reportedAt: v.number(),
      assignedTo: v.optional(v.id('users')),
      assignedAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      estimatedCost: v.optional(v.number()),
      actualCost: v.optional(v.number()),
      photos: v.array(v.string()),
      notes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db.query('maintenanceRequests');

    if (args.status) {
      query = query.filter(q => q.eq(q.field('status'), args.status));
    }

    if (args.priority) {
      query = query.filter(q => q.eq(q.field('priority'), args.priority));
    }

    if (args.category) {
      query = query.filter(q => q.eq(q.field('category'), args.category));
    }

    const requests = await query.order('desc').collect();

    return requests.map(request => ({
      _id: request._id,
      title: request.title,
      description: request.description,
      location: request.location,
      priority: request.priority,
      status: request.status,
      category: request.category,
      reportedBy: request.reportedBy,
      reportedAt: request.reportedAt,
      assignedTo: request.assignedTo,
      assignedAt: request.assignedAt,
      completedAt: request.completedAt,
      estimatedCost: request.estimatedCost,
      actualCost: request.actualCost,
      photos: request.photos,
      notes: request.notes,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }));
  },
});

// Get maintenance requests by user (for public access)
export const getMaintenanceRequestsByUser = query({
  args: {
    userId: v.id('users'),
  },
  returns: v.array(
    v.object({
      _id: v.id('maintenanceRequests'),
      title: v.string(),
      description: v.string(),
      location: v.string(),
      priority: v.string(),
      status: v.string(),
      category: v.string(),
      reportedAt: v.number(),
      assignedTo: v.optional(v.id('users')),
      assignedAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      estimatedCost: v.optional(v.number()),
      actualCost: v.optional(v.number()),
      photos: v.array(v.string()),
      notes: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query('maintenanceRequests')
      .filter(q => q.eq(q.field('reportedBy'), args.userId))
      .order('desc')
      .collect();

    return requests.map(request => ({
      _id: request._id,
      title: request.title,
      description: request.description,
      location: request.location,
      priority: request.priority,
      status: request.status,
      category: request.category,
      reportedAt: request.reportedAt,
      assignedTo: request.assignedTo,
      assignedAt: request.assignedAt,
      completedAt: request.completedAt,
      estimatedCost: request.estimatedCost,
      actualCost: request.actualCost,
      photos: request.photos,
      notes: request.notes,
    }));
  },
});

// Create a new maintenance request
export const createMaintenanceRequest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('critical')
    ),
    category: v.union(
      v.literal('roads'),
      v.literal('lighting'),
      v.literal('water'),
      v.literal('sewage'),
      v.literal('buildings'),
      v.literal('other')
    ),
    reportedBy: v.id('users'),
    photos: v.optional(v.array(v.string())),
    estimatedCost: v.optional(v.number()),
  },
  returns: v.id('maintenanceRequests'),
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert('maintenanceRequests', {
      title: args.title,
      description: args.description,
      location: args.location,
      priority: args.priority,
      status: 'pending',
      category: args.category,
      reportedBy: args.reportedBy,
      reportedAt: now,
      photos: args.photos || [],
      estimatedCost: args.estimatedCost,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a maintenance request (admin only)
export const updateMaintenanceRequest = mutation({
  args: {
    requestId: v.id('maintenanceRequests'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal('low'),
        v.literal('medium'),
        v.literal('high'),
        v.literal('critical')
      )
    ),
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('in-progress'),
        v.literal('completed'),
        v.literal('cancelled')
      )
    ),
    category: v.optional(
      v.union(
        v.literal('roads'),
        v.literal('lighting'),
        v.literal('water'),
        v.literal('sewage'),
        v.literal('buildings'),
        v.literal('other')
      )
    ),
    assignedTo: v.optional(v.id('users')),
    estimatedCost: v.optional(v.number()),
    actualCost: v.optional(v.number()),
    photos: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Maintenance request not found');
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.location !== undefined) updates.location = args.location;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.status !== undefined) {
      updates.status = args.status;
      if (args.status === 'in-progress' && !request.assignedAt) {
        updates.assignedAt = Date.now();
      } else if (args.status === 'completed' && !request.completedAt) {
        updates.completedAt = Date.now();
      }
    }
    if (args.category !== undefined) updates.category = args.category;
    if (args.assignedTo !== undefined) {
      updates.assignedTo = args.assignedTo;
      if (!request.assignedAt) {
        updates.assignedAt = Date.now();
      }
    }
    if (args.estimatedCost !== undefined)
      updates.estimatedCost = args.estimatedCost;
    if (args.actualCost !== undefined) updates.actualCost = args.actualCost;
    if (args.photos !== undefined) updates.photos = args.photos;
    if (args.notes !== undefined) updates.notes = args.notes;

    await ctx.db.patch(args.requestId, updates);

    return null;
  },
});

// Delete a maintenance request (admin only)
export const deleteMaintenanceRequest = mutation({
  args: {
    requestId: v.id('maintenanceRequests'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Maintenance request not found');
    }

    await ctx.db.delete(args.requestId);

    return null;
  },
});

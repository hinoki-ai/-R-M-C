import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// Get all active emergency protocols
export const getEmergencyProtocols = query({
  args: {
    category: v.optional(v.union(v.literal('fire'), v.literal('medical'), v.literal('police'), v.literal('natural_disaster'), v.literal('security'), v.literal('evacuation'), v.literal('general'))),
  },
  returns: v.array(v.object({
    _id: v.id('emergencyProtocols'),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    priority: v.string(),
    pdfUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    emergencyContacts: v.array(v.object({
      name: v.string(),
      phone: v.string(),
      role: v.string(),
    })),
    steps: v.array(v.string()),
    isActive: v.boolean(),
    offlineAvailable: v.boolean(),
    downloadCount: v.number(),
    lastDownloaded: v.optional(v.number()),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    let query = ctx.db.query('emergencyProtocols').filter(q => q.eq(q.field('isActive'), true));

    if (args.category) {
      query = query.filter(q => q.eq(q.field('category'), args.category));
    }

    const protocols = await query.order('desc').collect();

    return protocols.map(protocol => ({
      _id: protocol._id,
      title: protocol.title,
      description: protocol.description,
      category: protocol.category,
      priority: protocol.priority,
      pdfUrl: protocol.pdfUrl,
      thumbnailUrl: protocol.thumbnailUrl,
      emergencyContacts: protocol.emergencyContacts,
      steps: protocol.steps,
      isActive: protocol.isActive,
      offlineAvailable: protocol.offlineAvailable,
      downloadCount: protocol.downloadCount,
      lastDownloaded: protocol.lastDownloaded,
      createdAt: protocol.createdAt,
    }));
  },
});

// Get protocols by priority (for quick access in emergencies)
export const getProtocolsByPriority = query({
  args: {
    priority: v.union(v.literal('critical'), v.literal('high'), v.literal('medium'), v.literal('low')),
  },
  returns: v.array(v.object({
    _id: v.id('emergencyProtocols'),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    priority: v.string(),
    pdfUrl: v.string(),
    emergencyContacts: v.array(v.object({
      name: v.string(),
      phone: v.string(),
      role: v.string(),
    })),
    steps: v.array(v.string()),
  })),
  handler: async (ctx, args) => {
    const protocols = await ctx.db
      .query('emergencyProtocols')
      .filter(q =>
        q.and(
          q.eq(q.field('priority'), args.priority),
          q.eq(q.field('isActive'), true)
        )
      )
      .order('desc')
      .collect();

    return protocols.map(protocol => ({
      _id: protocol._id,
      title: protocol.title,
      description: protocol.description,
      category: protocol.category,
      priority: protocol.priority,
      pdfUrl: protocol.pdfUrl,
      emergencyContacts: protocol.emergencyContacts,
      steps: protocol.steps,
    }));
  },
});

// Record protocol download/view event
export const recordProtocolAccess = mutation({
  args: {
    protocolId: v.id('emergencyProtocols'),
    accessType: v.union(v.literal('view'), v.literal('download')),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const protocol = await ctx.db.get(args.protocolId);
    if (!protocol) return null;

    await ctx.db.patch(args.protocolId, {
      downloadCount: protocol.downloadCount + 1,
      lastDownloaded: Date.now(),
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Create a new emergency protocol (admin only)
export const createEmergencyProtocol = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.union(v.literal('fire'), v.literal('medical'), v.literal('police'), v.literal('natural_disaster'), v.literal('security'), v.literal('evacuation'), v.literal('general')),
    priority: v.union(v.literal('critical'), v.literal('high'), v.literal('medium'), v.literal('low')),
    pdfUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    emergencyContacts: v.array(v.object({
      name: v.string(),
      phone: v.string(),
      role: v.string(),
    })),
    steps: v.array(v.string()),
    offlineAvailable: v.optional(v.boolean()),
    createdBy: v.id('users'),
  },
  returns: v.id('emergencyProtocols'),
  handler: async (ctx, args) => {
    const protocolId = await ctx.db.insert('emergencyProtocols', {
      title: args.title,
      description: args.description,
      category: args.category,
      priority: args.priority,
      pdfUrl: args.pdfUrl,
      thumbnailUrl: args.thumbnailUrl,
      emergencyContacts: args.emergencyContacts,
      steps: args.steps,
      isActive: true,
      offlineAvailable: args.offlineAvailable || true,
      downloadCount: 0,
      createdBy: args.createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return protocolId;
  },
});
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// Get all community projects for admin management
export const getAllCommunityProjects = query({
  args: {
    status: v.optional(v.union(v.literal('planning'), v.literal('active'), v.literal('completed'), v.literal('cancelled'))),
    category: v.optional(v.union(v.literal('agricultural'), v.literal('infrastructure'), v.literal('education'), v.literal('health'), v.literal('cultural'), v.literal('other'))),
  },
  returns: v.array(v.object({
    _id: v.id('communityProjects'),
    title: v.string(),
    description: v.string(),
    goal: v.number(),
    raised: v.number(),
    deadline: v.string(),
    category: v.string(),
    status: v.string(),
    organizerId: v.id('users'),
    isPublic: v.boolean(),
    images: v.array(v.string()),
    documents: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    let query = ctx.db.query('communityProjects');

    if (args.status) {
      query = query.filter(q => q.eq(q.field('status'), args.status));
    }

    if (args.category) {
      query = query.filter(q => q.eq(q.field('category'), args.category));
    }

    const projects = await query.order('desc').collect();

    return projects.map(project => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      goal: project.goal,
      raised: project.raised,
      deadline: project.deadline,
      category: project.category,
      status: project.status,
      organizerId: project.organizerId,
      isPublic: project.isPublic,
      images: project.images,
      documents: project.documents,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  },
});

// Get public community projects for public access
export const getPublicCommunityProjects = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('communityProjects'),
    title: v.string(),
    description: v.string(),
    goal: v.number(),
    raised: v.number(),
    deadline: v.string(),
    category: v.string(),
    status: v.string(),
    organizerId: v.id('users'),
    images: v.array(v.string()),
  })),
  handler: async (ctx) => {
    const projects = await ctx.db
      .query('communityProjects')
      .filter(q => q.eq(q.field('isPublic'), true))
      .filter(q => q.neq(q.field('status'), 'cancelled'))
      .order('desc')
      .collect();

    return projects.map(project => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      goal: project.goal,
      raised: project.raised,
      deadline: project.deadline,
      category: project.category,
      status: project.status,
      organizerId: project.organizerId,
      images: project.images,
    }));
  },
});

// Create a new community project
export const createCommunityProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    goal: v.number(),
    deadline: v.string(),
    category: v.union(v.literal('agricultural'), v.literal('infrastructure'), v.literal('education'), v.literal('health'), v.literal('cultural'), v.literal('other')),
    organizerId: v.id('users'),
    isPublic: v.boolean(),
    images: v.optional(v.array(v.string())),
    documents: v.optional(v.array(v.string())),
  },
  returns: v.id('communityProjects'),
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert('communityProjects', {
      title: args.title,
      description: args.description,
      goal: args.goal,
      raised: 0,
      deadline: args.deadline,
      category: args.category,
      status: 'planning',
      organizerId: args.organizerId,
      isPublic: args.isPublic,
      images: args.images || [],
      documents: args.documents || [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a community project (admin only)
export const updateCommunityProject = mutation({
  args: {
    projectId: v.id('communityProjects'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    goal: v.optional(v.number()),
    deadline: v.optional(v.string()),
    category: v.optional(v.union(v.literal('agricultural'), v.literal('infrastructure'), v.literal('education'), v.literal('health'), v.literal('cultural'), v.literal('other'))),
    status: v.optional(v.union(v.literal('planning'), v.literal('active'), v.literal('completed'), v.literal('cancelled'))),
    isPublic: v.optional(v.boolean()),
    images: v.optional(v.array(v.string())),
    documents: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error('Community project not found');
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.goal !== undefined) updates.goal = args.goal;
    if (args.deadline !== undefined) updates.deadline = args.deadline;
    if (args.category !== undefined) updates.category = args.category;
    if (args.status !== undefined) updates.status = args.status;
    if (args.isPublic !== undefined) updates.isPublic = args.isPublic;
    if (args.images !== undefined) updates.images = args.images;
    if (args.documents !== undefined) updates.documents = args.documents;

    await ctx.db.patch(args.projectId, updates);

    return null;
  },
});

// Delete a community project (admin only)
export const deleteCommunityProject = mutation({
  args: {
    projectId: v.id('communityProjects'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error('Community project not found');
    }

    // Delete associated project contributions first
    const contributions = await ctx.db
      .query('projectContributions')
      .filter(q => q.eq(q.field('projectId'), args.projectId))
      .collect();

    for (const contribution of contributions) {
      await ctx.db.delete(contribution._id);
    }

    // Delete the project
    await ctx.db.delete(args.projectId);

    return null;
  },
});

// Add contribution to a project
export const addProjectContribution = mutation({
  args: {
    projectId: v.id('communityProjects'),
    userId: v.id('users'),
    amount: v.number(),
    paymentMethod: v.union(v.literal('stripe'), v.literal('bank_transfer'), v.literal('cash'), v.literal('other')),
    referenceId: v.optional(v.string()),
    isAnonymous: v.boolean(),
    message: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.status !== 'active') {
      throw new Error('Project is not accepting contributions');
    }

    const now = Date.now();

    // Insert contribution
    await ctx.db.insert('projectContributions', {
      projectId: args.projectId,
      userId: args.userId,
      amount: args.amount,
      paymentMethod: args.paymentMethod,
      referenceId: args.referenceId,
      contributedAt: now,
      isAnonymous: args.isAnonymous,
      message: args.message,
      createdAt: now,
    });

    // Update project raised amount
    await ctx.db.patch(args.projectId, {
      raised: project.raised + args.amount,
      updatedAt: now,
    });

    return null;
  },
});
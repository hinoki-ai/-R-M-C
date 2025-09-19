import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Announcements
export const getAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('announcements')
      .withIndex('byActive', (q) => q.eq('isActive', true))
      .order('desc')
      .take(10)
  },
})

export const createAnnouncement = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
    category: v.union(v.literal('general'), v.literal('emergency'), v.literal('maintenance'), v.literal('event'), v.literal('news')),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    const now = Date.now()

    return await ctx.db.insert('announcements', {
      title: args.title,
      content: args.content,
      authorId: user._id,
      publishedAt: now,
      priority: args.priority,
      category: args.category,
      isActive: true,
      expiresAt: args.expiresAt,
      readBy: [],
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const markAnnouncementAsRead = mutation({
  args: {
    announcementId: v.id('announcements'),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    const announcement = await ctx.db.get(args.announcementId)
    if (!announcement) throw new Error('Announcement not found')

    const readBy = announcement.readBy || []
    if (!readBy.includes(user._id)) {
      readBy.push(user._id)
      await ctx.db.patch(args.announcementId, {
        readBy,
        updatedAt: Date.now(),
      })
    }
  },
})

// Maintenance Requests
export const getMaintenanceRequests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('maintenanceRequests')
      .order('desc')
      .take(10)
  },
})

export const createMaintenanceRequest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
    category: v.union(v.literal('roads'), v.literal('lighting'), v.literal('water'), v.literal('sewage'), v.literal('buildings'), v.literal('other')),
    photos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    const now = Date.now()

    return await ctx.db.insert('maintenanceRequests', {
      title: args.title,
      description: args.description,
      location: args.location,
      priority: args.priority,
      status: 'pending',
      category: args.category,
      reportedBy: user._id,
      reportedAt: now,
      photos: args.photos || [],
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Payments
export const getPayments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    return await ctx.db
      .query('payments')
      .withIndex('byUser', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(10)
  },
})

export const createPayment = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    type: v.union(v.literal('contribution'), v.literal('project'), v.literal('maintenance'), v.literal('event'), v.literal('other')),
    paymentMethod: v.optional(v.union(v.literal('stripe'), v.literal('bank_transfer'), v.literal('cash'), v.literal('other'))),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    const now = Date.now()

    return await ctx.db.insert('payments', {
      userId: user._id,
      amount: args.amount,
      description: args.description,
      type: args.type,
      status: 'pending',
      paymentMethod: args.paymentMethod,
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Community Projects
export const getCommunityProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('communityProjects')
      .withIndex('byPublic', (q) => q.eq('isPublic', true))
      .withIndex('byStatus', (q) => q.eq('status', 'active'))
      .order('desc')
      .take(10)
  },
})

export const createCommunityProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    goal: v.number(),
    deadline: v.string(),
    category: v.union(v.literal('agricultural'), v.literal('infrastructure'), v.literal('education'), v.literal('health'), v.literal('cultural'), v.literal('other')),
    isPublic: v.boolean(),
    images: v.optional(v.array(v.string())),
    documents: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    const now = Date.now()

    return await ctx.db.insert('communityProjects', {
      title: args.title,
      description: args.description,
      goal: args.goal,
      raised: 0,
      deadline: args.deadline,
      category: args.category,
      status: 'active',
      organizerId: user._id,
      isPublic: args.isPublic,
      images: args.images || [],
      documents: args.documents || [],
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Dashboard Stats
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    // Get stats
    const totalUsers = await ctx.db.query('users').collect()
    const activeProjects = await ctx.db
      .query('communityProjects')
      .withIndex('byStatus', (q) => q.eq('status', 'active'))
      .collect()

    const pendingMaintenance = await ctx.db
      .query('maintenanceRequests')
      .withIndex('byStatus', (q) => q.eq('status', 'pending'))
      .collect()

    const totalContributions = await ctx.db
      .query('payments')
      .withIndex('byStatus', (q) => q.eq('status', 'completed'))
      .collect()

    const contributionAmount = totalContributions.reduce((sum, payment) => sum + payment.amount, 0)

    return {
      totalUsers: totalUsers.length,
      activeProjects: activeProjects.length,
      pendingMaintenance: pendingMaintenance.length,
      totalContributions: contributionAmount,
    }
  },
})

// Additional mutations for payment processing
export const updatePaymentStatus = mutation({
  args: {
    paymentIntentId: v.string(),
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('failed'), v.literal('cancelled')),
    paidAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find payment by reference ID
    const payment = await ctx.db
      .query('payments')
      .withIndex('byReferenceId', (q) => q.eq('referenceId', args.paymentIntentId))
      .first()

    if (!payment) {
      throw new Error('Payment not found')
    }

    const updateData: any = {
      status: args.status,
      updatedAt: Date.now(),
    }

    if (args.paidAt) {
      updateData.paidAt = args.paidAt
    }

    await ctx.db.patch(payment._id, updateData)
  },
})

export const addProjectContribution = mutation({
  args: {
    projectId: v.id('communityProjects'),
    amount: v.number(),
    paymentMethod: v.union(v.literal('stripe'), v.literal('bank_transfer'), v.literal('cash'), v.literal('other')),
    referenceId: v.optional(v.string()),
    isAnonymous: v.boolean(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    // Add contribution
    await ctx.db.insert('projectContributions', {
      projectId: args.projectId,
      userId: user._id,
      amount: args.amount,
      paymentMethod: args.paymentMethod,
      referenceId: args.referenceId,
      contributedAt: Date.now(),
      isAnonymous: args.isAnonymous,
      message: args.message,
      createdAt: Date.now(),
    })

    // Update project raised amount
    const project = await ctx.db.get(args.projectId)
    if (project) {
      await ctx.db.patch(args.projectId, {
        raised: project.raised + args.amount,
        updatedAt: Date.now(),
      })
    }
  },
})
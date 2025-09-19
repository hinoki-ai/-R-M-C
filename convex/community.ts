import { v } from 'convex/values'

import { mutation, query } from './_generated/server'

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

// Admin functions for managing announcements
export const updateAnnouncement = mutation({
  args: {
    announcementId: v.id('announcements'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    priority: v.optional(v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical'))),
    category: v.optional(v.union(v.literal('general'), v.literal('emergency'), v.literal('maintenance'), v.literal('event'), v.literal('news'))),
    isActive: v.optional(v.boolean()),
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

    // Check if user is admin
    const userRole = user.role || 'user'
    if (userRole !== 'admin') {
      throw new Error('Only administrators can update announcements')
    }

    const announcement = await ctx.db.get(args.announcementId)
    if (!announcement) throw new Error('Announcement not found')

    const updateData: Partial<{
      title?: string
      content?: string
      priority?: 'low' | 'medium' | 'high' | 'critical'
      category?: 'general' | 'emergency' | 'maintenance' | 'event' | 'news'
      isActive?: boolean
      expiresAt?: number
      updatedAt: number
    }> = {
      updatedAt: Date.now(),
    }

    // Only add fields that are provided
    if (args.title !== undefined) updateData.title = args.title
    if (args.content !== undefined) updateData.content = args.content
    if (args.priority !== undefined) updateData.priority = args.priority
    if (args.category !== undefined) updateData.category = args.category
    if (args.isActive !== undefined) updateData.isActive = args.isActive
    if (args.expiresAt !== undefined) updateData.expiresAt = args.expiresAt

    await ctx.db.patch(args.announcementId, updateData)

    return args.announcementId
  },
})

export const deleteAnnouncement = mutation({
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

    // Check if user is admin
    const userRole = user.role || 'user'
    if (userRole !== 'admin') {
      throw new Error('Only administrators can delete announcements')
    }

    const announcement = await ctx.db.get(args.announcementId)
    if (!announcement) throw new Error('Announcement not found')

    await ctx.db.delete(args.announcementId)

    return args.announcementId
  },
})

// Admin query to get all announcements (not filtered by user)
export const getAllAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('announcements')
      .order('desc')
      .collect()
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
      .filter((q) => q.eq(q.field('status'), 'active'))
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

    const updateData: Partial<{
      status: 'pending' | 'completed' | 'failed' | 'cancelled'
      updatedAt: number
      paidAt?: number
    }> = {
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

// Helper function to calculate consecutive months from current month backwards
function calculateConsecutiveMonths(monthlyData: Set<string>): number {
  if (monthlyData.size === 0) return 0

  const now = new Date()
  let consecutiveCount = 0
  const checkMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Count backwards from current month
  while (true) {
    const monthKey = `${checkMonth.getFullYear()}-${String(checkMonth.getMonth() + 1).padStart(2, '0')}`

    if (monthlyData.has(monthKey)) {
      consecutiveCount++
      // Move to previous month
      checkMonth.setMonth(checkMonth.getMonth() - 1)
    } else {
      break
    }
  }

  return consecutiveCount
}

/**
 * Get member rankings based on donation amounts and consecutive subscription months.
 *
 * Ranking Logic:
 * - Apellinado: $50,000+ donations OR 24+ consecutive months
 * - Nativo: $10,000+ donations OR 12+ consecutive months
 * - Aprendiz: Everyone else
 *
 * Rankings are sorted by rank priority (Apellinado > Nativo > Aprendiz),
 * then by total donations, then by consecutive months.
 */
export const getMemberRankings = query({
  args: {},
  returns: v.array(v.object({
    userId: v.id('users'),
    userName: v.string(),
    totalDonations: v.number(), // Amount in CLP
    consecutiveMonths: v.number(),
    rank: v.union(v.literal('Semilla'), v.literal('Hualle'), v.literal('Roble'), v.literal('Apellinado')),
  })),
  handler: async (ctx) => {
    try {
      // Authentication check
      const identity = await ctx.auth.getUserIdentity()
      if (!identity) throw new Error('Authentication required')

      // Verify user exists
      const currentUser = await ctx.db
        .query('users')
        .withIndex('byExternalId', (q) => q.eq('externalId', identity.subject))
        .first()

      if (!currentUser) throw new Error('User not found')

      // TODO: Add admin-only access control if needed

      // Get all payment data in single queries
      const [contributionPayments, projectContributions, paymentAttempts] = await Promise.all([
        ctx.db.query('payments')
          .filter((q) => q.and(
            q.eq(q.field('type'), 'contribution'),
            q.eq(q.field('status'), 'completed')
          ))
          .collect(),
        ctx.db.query('projectContributions').collect(),
        ctx.db.query('paymentAttempts')
          .filter((q) => q.and(
            q.eq(q.field('status'), 'paid'),
            q.neq(q.field('userId'), null)
          ))
          .collect()
      ])

      // Aggregate donation data by user
      const userDonations = new Map<string, number>()

      // Process contribution payments with validation
      for (const payment of contributionPayments) {
        if (payment.amount > 0 && payment.amount < 10000000) { // Reasonable upper limit
          const current = userDonations.get(payment.userId) || 0
          userDonations.set(payment.userId, current + payment.amount)
        }
      }

      // Process project contributions with validation
      for (const contribution of projectContributions) {
        if (contribution.amount > 0 && contribution.amount < 10000000) { // Reasonable upper limit
          const current = userDonations.get(contribution.userId) || 0
          userDonations.set(contribution.userId, current + contribution.amount)
        }
      }

      // Aggregate subscription data by user
      const userSubscriptions = new Map<string, Set<string>>()

      for (const attempt of paymentAttempts) {
        if (!attempt.userId) continue

        const userMonths = userSubscriptions.get(attempt.userId) || new Set<string>()

        for (const item of attempt.subscription_items) {
          // Include active, paid, and trial subscriptions
          if (['active', 'paid', 'trialing'].includes(item.status)) {
            const periodStart = new Date(item.period_start * 1000)
            const periodEnd = new Date(item.period_end * 1000)

            // Validate date ranges
            if (periodStart <= periodEnd && periodStart.getTime() > 0) {
              // Add all months covered by this subscription period
              for (let monthOffset = 0; ; monthOffset++) {
                const currentMonth = new Date(periodStart.getFullYear(), periodStart.getMonth() + monthOffset, 1)
                if (currentMonth > periodEnd) break

                const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`
                userMonths.add(monthKey)
              }
            }
          }
        }

        if (userMonths.size > 0) {
          userSubscriptions.set(attempt.userId, userMonths)
        }
      }

      // Get all users and build rankings
      const users = await ctx.db.query('users').collect()
      const rankings = []

      for (const user of users) {
        const totalDonations = userDonations.get(user._id) || 0
        const monthlyData = userSubscriptions.get(user._id) || new Set<string>()
        const consecutiveMonths = calculateConsecutiveMonths(monthlyData)

        // Calculate rank - check highest qualifying rank first
        let rank: 'Semilla' | 'Hualle' | 'Roble' | 'Apellinado'
        const donationAmount = totalDonations // Amount is already in CLP

        // Apellinado: Either 150k+ CLP donations OR 24+ consecutive months
        if (donationAmount >= 150000 || consecutiveMonths >= 24) {
          rank = 'Apellinado'
        }
        // Roble: Either 50k+ CLP donations OR 12+ consecutive months
        else if (donationAmount >= 50000 || consecutiveMonths >= 12) {
          rank = 'Roble'
        }
        // Hualle: Either 15k+ CLP donations OR 6+ consecutive months
        else if (donationAmount >= 15000 || consecutiveMonths >= 6) {
          rank = 'Hualle'
        }
        // Semilla: Everyone else (0 to 15,000 CLP)
        else {
          rank = 'Semilla'
        }

        rankings.push({
          userId: user._id,
          userName: user.name,
          totalDonations,
          consecutiveMonths,
          rank,
        })
      }

      // Sort by rank priority, then by donations, then by consecutive months
      const rankOrder = { 'Apellinado': 4, 'Roble': 3, 'Hualle': 2, 'Semilla': 1 }

      return rankings.sort((a, b) => {
        if (a.rank !== b.rank) {
          return rankOrder[b.rank] - rankOrder[a.rank]
        }
        if (a.totalDonations !== b.totalDonations) {
          return b.totalDonations - a.totalDonations
        }
        return b.consecutiveMonths - a.consecutiveMonths
      })

    } catch (error) {
      console.error('Error calculating member rankings:', error)
      throw new Error('Failed to calculate member rankings')
    }
  },
})

// Engagement statistics for dashboard
export const getEngagementStats = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Get announcements from last 7 days
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      const recentAnnouncements = await ctx.db
        .query('announcements')
        .filter(q => q.gte(q.field('_creationTime'), sevenDaysAgo))
        .collect()

      // Get events from last 7 days
      const recentEvents = await ctx.db
        .query('calendarEvents')
        .filter(q => q.gte(q.field('startDate'), new Date(sevenDaysAgo).toISOString().split('T')[0]))
        .collect()

      // Get maintenance requests from last 7 days
      const recentMaintenance = await ctx.db
        .query('maintenanceRequests')
        .filter(q => q.gte(q.field('_creationTime'), sevenDaysAgo))
        .collect()

      // Calculate engagement by day of week
      const engagementByDay = Array.from({ length: 7 }, (_, index) => ({
        dayOfWeek: index,
        views: 0,
        interactions: 0
      }))

      // Count announcements by day
      recentAnnouncements.forEach(announcement => {
        const dayOfWeek = new Date(announcement._creationTime).getDay()
        engagementByDay[dayOfWeek].views += 1
        engagementByDay[dayOfWeek].interactions += announcement.readBy?.length || 0
      })

      // Count events by day
      recentEvents.forEach(event => {
        const dayOfWeek = new Date(event.startDate).getDay()
        engagementByDay[dayOfWeek].views += 1
        // Events don't have direct interactions, but we can count attendees
        engagementByDay[dayOfWeek].interactions += event.maxAttendees || 0
      })

      // Count maintenance requests by day
      recentMaintenance.forEach(request => {
        const dayOfWeek = new Date(request._creationTime).getDay()
        engagementByDay[dayOfWeek].views += 1
        engagementByDay[dayOfWeek].interactions += 1 // Each request is an interaction
      })

      return engagementByDay
    } catch (error) {
      console.error('Error calculating engagement stats:', error)
      return []
    }
  },
})
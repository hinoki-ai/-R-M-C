import { v } from 'convex/values'

import { mutation, query } from './_generated/server'

// Get all active contacts
export const getContacts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('contacts')
      .withIndex('byActive', (q) => q.eq('isActive', true))
      .order('asc')
      .collect()
  },
})

// Get contacts by type
export const getContactsByType = query({
  args: {
    type: v.union(v.literal('directiva'), v.literal('seguridad'), v.literal('social'), v.literal('municipal'), v.literal('health'), v.literal('police'), v.literal('fire'), v.literal('service')),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contacts')
      .withIndex('byType', (q) => q.eq('type', args.type))
      .filter((q) => q.eq(q.field('isActive'), true))
      .order('asc')
      .collect()
  },
})

// Create a new contact
export const createContact = mutation({
  args: {
    name: v.string(),
    position: v.optional(v.string()),
    department: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    availability: v.optional(v.string()),
    hours: v.optional(v.string()),
    type: v.union(v.literal('directiva'), v.literal('seguridad'), v.literal('social'), v.literal('municipal'), v.literal('health'), v.literal('police'), v.literal('fire'), v.literal('service')),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
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

    return await ctx.db.insert('contacts', {
      name: args.name,
      position: args.position,
      department: args.department,
      phone: args.phone,
      email: args.email,
      address: args.address,
      availability: args.availability,
      hours: args.hours,
      type: args.type,
      description: args.description,
      location: args.location,
      isActive: true,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Update contact
export const updateContact = mutation({
  args: {
    contactId: v.id('contacts'),
    name: v.optional(v.string()),
    position: v.optional(v.string()),
    department: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    availability: v.optional(v.string()),
    hours: v.optional(v.string()),
    type: v.optional(v.union(v.literal('directiva'), v.literal('seguridad'), v.literal('social'), v.literal('municipal'), v.literal('health'), v.literal('police'), v.literal('fire'), v.literal('service'))),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    const updateData: any = {
      updatedAt: Date.now(),
    }

    // Add only provided fields
    Object.keys(args).forEach((key: string) => {
      if (key !== 'contactId' && (args as any)[key] !== undefined) {
        updateData[key] = (args as any)[key]
      }
    })

    await ctx.db.patch(args.contactId, updateData)
  },
})

// Delete contact (soft delete by setting isActive to false)
export const deleteContact = mutation({
  args: {
    contactId: v.id('contacts'),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', userId.subject))
      .first()

    if (!user) throw new Error('User not found')

    await ctx.db.patch(args.contactId, {
      isActive: false,
      updatedAt: Date.now(),
    })
  },
})
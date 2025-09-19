import { query, mutation, action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

// Event Categories
export const createEventCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    icon: v.string(),
  },
  returns: v.id('eventCategories'),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').withIndex('byExternalId', q => q.eq('externalId', userId.subject)).first();
    if (!user) throw new Error('User not found');

    const categoryId = await ctx.db.insert('eventCategories', {
      name: args.name,
      description: args.description,
      color: args.color,
      icon: args.icon,
      isActive: true,
      createdBy: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return categoryId;
  },
});

export const getEventCategories = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('eventCategories'),
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    icon: v.string(),
    isActive: v.boolean(),
  })),
  handler: async (ctx) => {
    const categories = await ctx.db.query('eventCategories').withIndex('byActive', q => q.eq('isActive', true)).collect();
    return categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      description: cat.description,
      color: cat.color,
      icon: cat.icon,
      isActive: cat.isActive,
    }));
  },
});

// Calendar Events
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id('eventCategories'),
    startDate: v.string(),
    endDate: v.string(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    location: v.optional(v.string()),
    isAllDay: v.boolean(),
    isRecurring: v.boolean(),
    recurrenceRule: v.optional(v.object({
      frequency: v.union(v.literal('daily'), v.literal('weekly'), v.literal('monthly'), v.literal('yearly')),
      interval: v.number(),
      endDate: v.optional(v.string()),
      daysOfWeek: v.optional(v.array(v.number())),
      count: v.optional(v.number()),
    })),
    maxAttendees: v.optional(v.number()),
    isPublic: v.boolean(),
    requiresApproval: v.boolean(),
    inviteUserIds: v.optional(v.array(v.id('users'))),
  },
  returns: v.id('calendarEvents'),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').withIndex('byExternalId', q => q.eq('externalId', userId.subject)).first();
    if (!user) throw new Error('User not found');

    const eventId = await ctx.db.insert('calendarEvents', {
      title: args.title,
      description: args.description,
      categoryId: args.categoryId,
      startDate: args.startDate,
      endDate: args.endDate,
      startTime: args.startTime,
      endTime: args.endTime,
      location: args.location,
      isAllDay: args.isAllDay,
      isRecurring: args.isRecurring,
      recurrenceRule: args.recurrenceRule,
      maxAttendees: args.maxAttendees,
      isPublic: args.isPublic,
      requiresApproval: args.requiresApproval,
      organizerId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add organizer as confirmed attendee
    await ctx.db.insert('eventAttendees', {
      eventId,
      userId: user._id,
      status: 'confirmed',
      invitedBy: user._id,
      invitedAt: Date.now(),
    });

    // Invite additional users if provided
    if (args.inviteUserIds && args.inviteUserIds.length > 0) {
      for (const inviteUserId of args.inviteUserIds) {
        if (inviteUserId !== user._id) { // Don't invite organizer twice
          await ctx.db.insert('eventAttendees', {
            eventId,
            userId: inviteUserId,
            status: 'pending',
            invitedBy: user._id,
            invitedAt: Date.now(),
          });
        }
      }
    }

    return eventId;
  },
});

export const getEvents = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    categoryId: v.optional(v.id('eventCategories')),
    userId: v.optional(v.id('users')), // Filter by user's events (organized or attending)
  },
  returns: v.array(v.object({
    _id: v.id('calendarEvents'),
    title: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id('eventCategories'),
    category: v.object({
      name: v.string(),
      color: v.string(),
      icon: v.string(),
    }),
    startDate: v.string(),
    endDate: v.string(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    location: v.optional(v.string()),
    isAllDay: v.boolean(),
    isRecurring: v.boolean(),
    recurrenceRule: v.optional(v.any()),
    maxAttendees: v.optional(v.number()),
    isPublic: v.boolean(),
    requiresApproval: v.boolean(),
    organizerId: v.id('users'),
    organizer: v.object({
      name: v.string(),
    }),
    attendeeCount: v.number(),
    userAttendanceStatus: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    let user = null;

    if (userId) {
      user = await ctx.db.query('users').withIndex('byExternalId', q => q.eq('externalId', userId.subject)).first();
    }

    let eventsQuery = ctx.db.query('calendarEvents');

    // Filter by date range if provided
    if (args.startDate) {
      eventsQuery = eventsQuery.filter(q => q.gte(q.field('endDate'), args.startDate!));
    }
    if (args.endDate) {
      eventsQuery = eventsQuery.filter(q => q.lte(q.field('startDate'), args.endDate!));
    }

    // Filter by category if provided
    if (args.categoryId) {
      eventsQuery = eventsQuery.filter(q => q.eq(q.field('categoryId'), args.categoryId));
    }

    // Filter by user events if userId provided
    if (args.userId) {
      const attendeeEvents = await ctx.db.query('eventAttendees')
        .withIndex('byUser', q => q.eq('userId', args.userId))
        .collect();
      const eventIds = attendeeEvents.map(att => att.eventId);
      eventsQuery = eventsQuery.filter(q => q.or(
        q.eq(q.field('organizerId'), args.userId),
        ...eventIds.map(eventId => q.eq(q.field('_id'), eventId))
      ));
    }

    // Only show public events if not authenticated or not invited
    if (!user) {
      eventsQuery = eventsQuery.filter(q => q.eq(q.field('isPublic'), true));
    }

    const events = await eventsQuery.collect();

    // Get additional data for each event
    const eventsWithDetails = await Promise.all(events.map(async (event) => {
      const category = await ctx.db.get(event.categoryId);
      const organizer = await ctx.db.get(event.organizerId);
      const attendees = await ctx.db.query('eventAttendees')
        .withIndex('byEvent', q => q.eq('eventId', event._id))
        .collect();

      let userAttendanceStatus = null;
      if (user) {
        const userAttendance = attendees.find(att => att.userId === user!._id);
        userAttendanceStatus = userAttendance?.status || null;
      }

      return {
        _id: event._id,
        title: event.title,
        description: event.description,
        categoryId: event.categoryId,
        category: category ? {
          name: category.name,
          color: category.color,
          icon: category.icon,
        } : { name: 'Unknown', color: '#gray', icon: '❓' },
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        isAllDay: event.isAllDay,
        isRecurring: event.isRecurring,
        recurrenceRule: event.recurrenceRule,
        maxAttendees: event.maxAttendees,
        isPublic: event.isPublic,
        requiresApproval: event.requiresApproval,
        organizerId: event.organizerId,
        organizer: organizer ? { name: organizer.name } : { name: 'Unknown' },
        attendeeCount: attendees.filter(att => att.status === 'confirmed').length,
        userAttendanceStatus,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      };
    }));

    return eventsWithDetails;
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id('calendarEvents'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id('eventCategories')),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    location: v.optional(v.string()),
    isAllDay: v.optional(v.boolean()),
    maxAttendees: v.optional(v.number()),
    isPublic: v.optional(v.boolean()),
    requiresApproval: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').withIndex('byExternalId', q => q.eq('externalId', userId.subject)).first();
    if (!user) throw new Error('User not found');

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    // Only organizer can update event
    if (event.organizerId !== user._id) throw new Error('Not authorized to update this event');

    const updates: any = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.categoryId !== undefined) updates.categoryId = args.categoryId;
    if (args.startDate !== undefined) updates.startDate = args.startDate;
    if (args.endDate !== undefined) updates.endDate = args.endDate;
    if (args.startTime !== undefined) updates.startTime = args.startTime;
    if (args.endTime !== undefined) updates.endTime = args.endTime;
    if (args.location !== undefined) updates.location = args.location;
    if (args.isAllDay !== undefined) updates.isAllDay = args.isAllDay;
    if (args.maxAttendees !== undefined) updates.maxAttendees = args.maxAttendees;
    if (args.isPublic !== undefined) updates.isPublic = args.isPublic;
    if (args.requiresApproval !== undefined) updates.requiresApproval = args.requiresApproval;

    await ctx.db.patch(args.eventId, updates);
  },
});

export const deleteEvent = mutation({
  args: {
    eventId: v.id('calendarEvents'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').withIndex('byExternalId', q => q.eq('externalId', userId.subject)).first();
    if (!user) throw new Error('User not found');

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    // Only organizer can delete event
    if (event.organizerId !== user._id) throw new Error('Not authorized to delete this event');

    // Delete related records
    const attendees = await ctx.db.query('eventAttendees').withIndex('byEvent', q => q.eq('eventId', args.eventId)).collect();
    const reminders = await ctx.db.query('eventReminders').withIndex('byEvent', q => q.eq('eventId', args.eventId)).collect();

    for (const attendee of attendees) {
      await ctx.db.delete(attendee._id);
    }

    for (const reminder of reminders) {
      await ctx.db.delete(reminder._id);
    }

    await ctx.db.delete(args.eventId);
  },
});

// RSVP Functionality
export const respondToEvent = mutation({
  args: {
    eventId: v.id('calendarEvents'),
    status: v.union(v.literal('confirmed'), v.literal('declined'), v.literal('tentative')),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').withIndex('byExternalId', q => q.eq('externalId', userId.subject)).first();
    if (!user) throw new Error('User not found');

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error('Event not found');

    const attendee = await ctx.db.query('eventAttendees')
      .withIndex('byEvent', q => q.eq('eventId', args.eventId))
      .filter(q => q.eq(q.field('userId'), user._id))
      .first();

    if (!attendee) throw new Error('Not invited to this event');

    await ctx.db.patch(attendee._id, {
      status: args.status,
      respondedAt: Date.now(),
      notes: args.notes,
    });
  },
});

// Calendar Settings
export const getCalendarSettings = query({
  args: {},
  returns: v.optional(v.object({
    defaultView: v.string(),
    workingHoursStart: v.string(),
    workingHoursEnd: v.string(),
    weekStartsOn: v.number(),
    timeZone: v.string(),
    showWeekends: v.boolean(),
    defaultReminderTime: v.number(),
  })),
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) return null;

    const user = await ctx.db.query('users').withIndex('byExternalId', q => q.eq('externalId', userId.subject)).first();
    if (!user) return null;

    const settings = await ctx.db.query('calendarSettings').withIndex('byUser', q => q.eq('userId', user._id)).first();
    if (!settings) return null;

    return {
      defaultView: settings.defaultView,
      workingHoursStart: settings.workingHoursStart,
      workingHoursEnd: settings.workingHoursEnd,
      weekStartsOn: settings.weekStartsOn,
      timeZone: settings.timeZone,
      showWeekends: settings.showWeekends,
      defaultReminderTime: settings.defaultReminderTime,
    };
  },
});

export const updateCalendarSettings = mutation({
  args: {
    defaultView: v.optional(v.union(v.literal('month'), v.literal('week'), v.literal('day'), v.literal('agenda'))),
    workingHoursStart: v.optional(v.string()),
    workingHoursEnd: v.optional(v.string()),
    weekStartsOn: v.optional(v.number()),
    timeZone: v.optional(v.string()),
    showWeekends: v.optional(v.boolean()),
    defaultReminderTime: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').withIndex('byExternalId', q => q.eq('externalId', userId.subject)).first();
    if (!user) throw new Error('User not found');

    let settings = await ctx.db.query('calendarSettings').withIndex('byUser', q => q.eq('userId', user._id)).first();

    const updates: any = { updatedAt: Date.now() };
    if (args.defaultView !== undefined) updates.defaultView = args.defaultView;
    if (args.workingHoursStart !== undefined) updates.workingHoursStart = args.workingHoursStart;
    if (args.workingHoursEnd !== undefined) updates.workingHoursEnd = args.workingHoursEnd;
    if (args.weekStartsOn !== undefined) updates.weekStartsOn = args.weekStartsOn;
    if (args.timeZone !== undefined) updates.timeZone = args.timeZone;
    if (args.showWeekends !== undefined) updates.showWeekends = args.showWeekends;
    if (args.defaultReminderTime !== undefined) updates.defaultReminderTime = args.defaultReminderTime;

    if (settings) {
      await ctx.db.patch(settings._id, updates);
    } else {
      // Create default settings
      await ctx.db.insert('calendarSettings', {
        userId: user._id,
        defaultView: args.defaultView || 'month',
        workingHoursStart: args.workingHoursStart || '09:00',
        workingHoursEnd: args.workingHoursEnd || '17:00',
        weekStartsOn: args.weekStartsOn || 1, // Monday
        timeZone: args.timeZone || 'America/Santiago',
        showWeekends: args.showWeekends !== undefined ? args.showWeekends : true,
        defaultReminderTime: args.defaultReminderTime || 15,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});
import { action, query, mutation, internalAction, internalQuery, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import { api, internal } from './_generated/api'

// Get upcoming events for notifications
export const getUpcomingEvents = query({
  args: {
    hoursAhead: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id('calendarEvents'),
    title: v.string(),
    startDate: v.string(),
    startTime: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.object({
      name: v.string(),
      color: v.string(),
      icon: v.string(),
    }),
    organizer: v.object({
      name: v.string(),
    }),
    userAttendanceStatus: v.union(v.string(), v.null()),
  })),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) return []

    const user = await ctx.db.query('users').withIndex('byExternalId', q => q.eq('externalId', userId.subject)).first()
    if (!user) return []

    const hoursAhead = args.hoursAhead || 24
    const now = new Date()
    const futureDate = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)

    // Get events user is attending or organizing
    const attendeeEvents = await ctx.db.query('eventAttendees')
      .withIndex('byUser', q => q.eq('userId', user._id))
      .filter(q => q.eq(q.field('status'), 'confirmed'))
      .collect()

    const eventIds = attendeeEvents.map(att => att.eventId)
    const organizedEvents = await ctx.db.query('calendarEvents')
      .withIndex('byOrganizer', q => q.eq('organizerId', user._id))
      .collect()

    const allEventIds = [...new Set([...eventIds, ...organizedEvents.map(e => e._id)])]

    const upcomingEvents = []

    for (const eventId of allEventIds) {
      const event = await ctx.db.get(eventId)
      if (!event) continue

      const eventDateTime = new Date(event.startDate)
      if (event.startTime) {
        const [hours, minutes] = event.startTime.split(':')
        eventDateTime.setHours(parseInt(hours), parseInt(minutes))
      } else if (!event.isAllDay) {
        eventDateTime.setHours(9, 0) // Default to 9 AM if no time specified
      }

      // Check if event is within the next hoursAhead hours
      if (eventDateTime > now && eventDateTime <= futureDate) {
        const category = await ctx.db.get(event.categoryId)
        const organizer = await ctx.db.get(event.organizerId)
        const userAttendance = attendeeEvents.find(att => att.eventId === eventId)

        upcomingEvents.push({
          _id: event._id,
          title: event.title,
          startDate: event.startDate,
          startTime: event.startTime,
          location: event.location,
          category: category ? {
            name: category.name,
            color: category.color,
            icon: category.icon,
          } : { name: 'Unknown', color: '#gray', icon: '❓' },
          organizer: organizer ? { name: organizer.name } : { name: 'Unknown' },
          userAttendanceStatus: userAttendance?.status || (event.organizerId === user._id ? 'organizer' : null),
        })
      }
    }

    // Sort by date/time
    return upcomingEvents.sort((a, b) => {
      const aDate = new Date(a.startDate)
      const bDate = new Date(b.startDate)
      return aDate.getTime() - bDate.getTime()
    })
  },
})

// Send reminder notifications (this would be called by a cron job)
export const sendEventReminders = action({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Actions should call mutations for database operations
    await ctx.runMutation(api.calendar_notifications.sendEventRemindersMutation, {})
  },
})

// Internal mutation for sending reminders
export const sendEventRemindersMutation = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const now = new Date()

    // Find reminders that should be sent
    const reminders = await ctx.db.query('eventReminders')
      .withIndex('bySent', (q: any) => q.eq('isSent', false))
      .collect()

    for (const reminder of reminders) {
      const event = await ctx.db.get(reminder.eventId)
      if (!event) continue

      const eventDateTime = new Date(event.startDate)
      if (event.startTime) {
        const [hours, minutes] = event.startTime.split(':')
        eventDateTime.setHours(parseInt(hours), parseInt(minutes))
      }

      const reminderTime = new Date(eventDateTime.getTime() - reminder.reminderTime * 60 * 1000)

      // If it's time to send the reminder
      if (now >= reminderTime) {
        // Here you would integrate with your notification service
        // For now, we'll just mark it as sent
        await ctx.db.patch(reminder._id, {
          isSent: true,
          sentAt: Date.now(),
        })

        // You could also create a notification record or send push notifications
        console.log(`Reminder sent for event: ${event.title}`)
      }
    }
  },
})

// Create a reminder for an event
export const createEventReminder = action({
  args: {
    eventId: v.id('calendarEvents'),
    reminderTime: v.number(), // Minutes before event
    method: v.union(v.literal('notification'), v.literal('email'), v.literal('sms')),
  },
  returns: v.id('eventReminders'),
  handler: async (ctx: any, args: any) => {
    return await ctx.runMutation(api.calendar_notifications.createEventReminderMutation, args)
  },
})

// Internal mutation for creating event reminders
export const createEventReminderMutation = mutation({
  args: {
    eventId: v.id('calendarEvents'),
    reminderTime: v.number(), // Minutes before event
    method: v.union(v.literal('notification'), v.literal('email'), v.literal('sms')),
  },
  returns: v.id('eventReminders'),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) throw new Error('Not authenticated')

    const user = await ctx.db.query('users').withIndex('byExternalId', (q: any) => q.eq('externalId', userId.subject)).first()
    if (!user) throw new Error('User not found')

    const event = await ctx.db.get(args.eventId)
    if (!event) throw new Error('Event not found')

    // Check if user is attending the event
    const attendance = await ctx.db.query('eventAttendees')
      .withIndex('byEvent', (q: any) => q.eq('eventId', args.eventId))
      .filter((q: any) => q.eq(q.field('userId'), user._id))
      .first()

    if (!attendance && event.organizerId !== user._id) {
      throw new Error('User is not attending this event')
    }

    const reminderId = await ctx.db.insert('eventReminders', {
      eventId: args.eventId,
      userId: user._id,
      reminderTime: args.reminderTime,
      method: args.method,
      isSent: false,
      createdAt: Date.now(),
    })

    return reminderId
  },
})
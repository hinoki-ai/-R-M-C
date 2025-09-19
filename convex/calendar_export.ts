import { action } from './_generated/server'
import { v } from 'convex/values'

// Generate ICS calendar export
export const exportCalendarICS = action({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    categoryId: v.optional(v.id('eventCategories')),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const events = await ctx.runQuery('calendar.getEvents', {
      startDate: args.startDate,
      endDate: args.endDate,
      categoryId: args.categoryId,
      userId: undefined,
    })

    const icsEvents = events.map(event => {
      const startDateTime = event.isAllDay
        ? event.startDate.replace(/-/g, '')
        : event.startDate.replace(/-/g, '') + 'T' + (event.startTime || '00:00').replace(':', '') + '00'

      const endDateTime = event.isAllDay
        ? (() => {
            const end = new Date(event.endDate)
            end.setDate(end.getDate() + 1)
            return end.toISOString().split('T')[0].replace(/-/g, '')
          })()
        : event.endDate.replace(/-/g, '') + 'T' + (event.endTime || '23:59').replace(':', '') + '00'

      return `BEGIN:VEVENT
UID:${event._id}@pellines-calendar
DTSTART${event.isAllDay ? ';VALUE=DATE' : ''}:${startDateTime}
DTEND${event.isAllDay ? ';VALUE=DATE' : ''}:${endDateTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
CATEGORIES:${event.category.name}
ORGANIZER;CN=${event.organizer.name}
END:VEVENT`
    }).join('\n')

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pinto Los Pellines//Calendario Comunitario//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Calendario Comunitario - Pinto Los Pellines
X-WR-TIMEZONE:America/Santiago
${icsEvents}
END:VCALENDAR`

    return icsContent
  },
})

// Export single event as ICS
export const exportEventICS = action({
  args: {
    eventId: v.id('calendarEvents'),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const events = await ctx.runQuery('calendar.getEvents', {
      userId: undefined,
    })

    const event = events.find(e => e._id === args.eventId)
    if (!event) throw new Error('Event not found')

    const startDateTime = event.isAllDay
      ? event.startDate.replace(/-/g, '')
      : event.startDate.replace(/-/g, '') + 'T' + (event.startTime || '00:00').replace(':', '') + '00'

    const endDateTime = event.isAllDay
      ? (() => {
          const end = new Date(event.endDate)
          end.setDate(end.getDate() + 1)
          return end.toISOString().split('T')[0].replace(/-/g, '')
        })()
      : event.endDate.replace(/-/g, '') + 'T' + (event.endTime || '23:59').replace(':', '') + '00'

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pinto Los Pellines//Calendario Comunitario//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Calendario Comunitario - Pinto Los Pellines
X-WR-TIMEZONE:America/Santiago
BEGIN:VEVENT
UID:${event._id}@pellines-calendar
DTSTART${event.isAllDay ? ';VALUE=DATE' : ''}:${startDateTime}
DTEND${event.isAllDay ? ';VALUE=DATE' : ''}:${endDateTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
CATEGORIES:${event.category.name}
ORGANIZER;CN=${event.organizer.name}
END:VEVENT
END:VCALENDAR`

    return icsContent
  },
})
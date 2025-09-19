import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { paymentAttemptSchemaValidator } from './utils/paymentAttemptTypes';

export default defineSchema({
    users: defineTable({
      name: v.string(),
      // this the Clerk ID, stored in the subject JWT field
      externalId: v.string(),
    }).index('byExternalId', ['externalId']),

    paymentAttempts: defineTable(paymentAttemptSchemaValidator)
      .index('byPaymentId', ['payment_id'])
      .index('byUserId', ['userId'])
      .index('byPayerUserId', ['payer.user_id']),

    // Security Camera Tables
    cameras: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      location: v.optional(v.string()),
      streamUrl: v.string(), // Direct stream URL for viewport
      isActive: v.boolean(),
      isOnline: v.boolean(),
      lastSeen: v.optional(v.number()),
      resolution: v.optional(v.string()),
      frameRate: v.optional(v.number()),
      hasAudio: v.optional(v.boolean()),
      createdBy: v.id('users'),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byUser', ['createdBy'])
    .index('byActive', ['isActive'])
    .index('byOnline', ['isOnline'])
    .index('byLocation', ['location']),

    cameraFeeds: defineTable({
      cameraId: v.id('cameras'),
      url: v.string(), // Stream URL for viewport
      isActive: v.boolean(),
      lastAccessed: v.optional(v.number()),
      createdAt: v.number(),
    })
    .index('byCamera', ['cameraId'])
    .index('byActive', ['isActive']),

    cameraEvents: defineTable({
      cameraId: v.id('cameras'),
      eventType: v.union(
        v.literal('stream_started'),
        v.literal('stream_stopped'),
        v.literal('connection_lost'),
        v.literal('connection_restored'),
        v.literal('maintenance_required')
      ),
      message: v.string(),
      timestamp: v.number(),
      metadata: v.optional(v.any()),
      severity: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
      acknowledged: v.boolean(),
      acknowledgedBy: v.optional(v.id('users')),
      acknowledgedAt: v.optional(v.number()),
    })
    .index('byCamera', ['cameraId'])
    .index('byType', ['eventType'])
    .index('byTimestamp', ['timestamp'])
    .index('bySeverity', ['severity'])
    .index('byAcknowledged', ['acknowledged']),

    cameraPermissions: defineTable({
      cameraId: v.id('cameras'),
      userId: v.id('users'),
      permissionLevel: v.union(
        v.literal('view'),
        v.literal('admin')
      ),
      grantedBy: v.id('users'),
      grantedAt: v.number(),
      expiresAt: v.optional(v.number()),
      isActive: v.boolean(),
    })
    .index('byCamera', ['cameraId'])
    .index('byUser', ['userId'])
    .index('byPermissionLevel', ['permissionLevel'])
    .index('byActive', ['isActive']),

    // Weather Tables
    weatherData: defineTable({
      timestamp: v.number(),
      temperature: v.number(),
      humidity: v.number(),
      pressure: v.number(),
      windSpeed: v.number(),
      windDirection: v.number(),
      precipitation: v.number(),
      uvIndex: v.number(),
      visibility: v.number(),
      description: v.string(),
      icon: v.string(),
      feelsLike: v.number(),
      dewPoint: v.number(),
      cloudCover: v.number(),
      location: v.string(),
      source: v.union(v.literal('api'), v.literal('manual'), v.literal('sensor')),
      isHistorical: v.optional(v.boolean()),
      createdBy: v.optional(v.id('users')),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byTimestamp', ['timestamp'])
    .index('byLocation', ['location'])
    .index('bySource', ['source']),

    weatherAlerts: defineTable({
      title: v.string(),
      description: v.string(),
      severity: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('extreme')),
      type: v.union(v.literal('storm'), v.literal('heat'), v.literal('cold'), v.literal('flood'), v.literal('wind'), v.literal('other')),
      startTime: v.number(),
      endTime: v.number(),
      areas: v.array(v.string()),
      instructions: v.string(),
      isActive: v.boolean(),
      createdBy: v.id('users'),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('bySeverity', ['severity'])
    .index('byType', ['type'])
    .index('byActive', ['isActive'])
    .index('byStartTime', ['startTime']),

    weatherForecasts: defineTable({
      date: v.string(),
      tempMin: v.number(),
      tempMax: v.number(),
      humidity: v.number(),
      precipitation: v.number(),
      precipitationProbability: v.number(),
      windSpeed: v.number(),
      windDirection: v.number(),
      description: v.string(),
      icon: v.string(),
      uvIndex: v.number(),
      sunrise: v.string(),
      sunset: v.string(),
      location: v.string(),
      source: v.union(v.literal('api'), v.literal('manual')),
      updatedAt: v.number(),
      createdBy: v.optional(v.id('users')),
      createdAt: v.number(),
    })
    .index('byDate', ['date'])
    .index('byLocation', ['location'])
    .index('bySource', ['source']),

    // Alarm System Tables
    alarms: defineTable({
      title: v.string(),
      description: v.string(),
      type: v.union(
        v.literal('emergency'),
        v.literal('weather'),
        v.literal('community'),
        v.literal('maintenance'),
        v.literal('security'),
        v.literal('medical'),
        v.literal('fire'),
        v.literal('custom')
      ),
      isActive: v.boolean(),
      isRecurring: v.boolean(),
      schedule: v.optional(v.object({
        startTime: v.string(), // HH:MM format
        endTime: v.string(),   // HH:MM format
        daysOfWeek: v.optional(v.array(v.number())) // 0-6 (Sunday-Saturday)
      })),
      soundEnabled: v.boolean(),
      vibrationEnabled: v.boolean(),
      notificationEnabled: v.boolean(),
      priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
      userId: v.id('users'),
      lastTriggered: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byUser', ['userId'])
    .index('byType', ['type'])
    .index('byActive', ['isActive'])
    .index('byPriority', ['priority']),

    alarmTriggers: defineTable({
      alarmId: v.id('alarms'),
      userId: v.id('users'),
      triggerType: v.union(
        v.literal('scheduled'),
        v.literal('manual'),
        v.literal('weather_alert'),
        v.literal('emergency'),
        v.literal('security'),
        v.literal('maintenance')
      ),
      triggerData: v.optional(v.any()), // Additional context data
      message: v.string(),
      acknowledged: v.boolean(),
      acknowledgedAt: v.optional(v.number()),
      triggeredAt: v.number(),
    })
    .index('byAlarm', ['alarmId'])
    .index('byUser', ['userId'])
    .index('byTriggerType', ['triggerType'])
    .index('byAcknowledged', ['acknowledged'])
    .index('byTriggeredAt', ['triggeredAt']),

    alarmSettings: defineTable({
      userId: v.id('users'),
      globalSoundEnabled: v.boolean(),
      globalVibrationEnabled: v.boolean(),
      globalNotificationEnabled: v.boolean(),
      quietHours: v.optional(v.object({
        enabled: v.boolean(),
        startTime: v.string(), // HH:MM
        endTime: v.string(),   // HH:MM
        daysOfWeek: v.array(v.number()) // 0-6
      })),
      emergencyOverride: v.boolean(), // Always trigger emergency alarms
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byUser', ['userId']),

    // Calendar System Tables
    eventCategories: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      color: v.string(), // Hex color code
      icon: v.string(), // Emoji or icon name
      isActive: v.boolean(),
      createdBy: v.id('users'),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byActive', ['isActive'])
    .index('byCreatedBy', ['createdBy']),

    calendarEvents: defineTable({
      title: v.string(),
      description: v.optional(v.string()),
      categoryId: v.id('eventCategories'),
      startDate: v.string(), // ISO date string
      endDate: v.string(), // ISO date string
      startTime: v.optional(v.string()), // HH:MM format
      endTime: v.optional(v.string()), // HH:MM format
      location: v.optional(v.string()),
      isAllDay: v.boolean(),
      isRecurring: v.boolean(),
      recurrenceRule: v.optional(v.object({
        frequency: v.union(v.literal('daily'), v.literal('weekly'), v.literal('monthly'), v.literal('yearly')),
        interval: v.number(), // Every N days/weeks/months/years
        endDate: v.optional(v.string()), // ISO date string
        daysOfWeek: v.optional(v.array(v.number())), // 0-6 for weekly recurrence
        count: v.optional(v.number()), // Number of occurrences
      })),
      maxAttendees: v.optional(v.number()),
      isPublic: v.boolean(),
      requiresApproval: v.boolean(),
      organizerId: v.id('users'),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byCategory', ['categoryId'])
    .index('byOrganizer', ['organizerId'])
    .index('byStartDate', ['startDate'])
    .index('byEndDate', ['endDate'])
    .index('byPublic', ['isPublic'])
    .index('byRecurring', ['isRecurring']),

    eventAttendees: defineTable({
      eventId: v.id('calendarEvents'),
      userId: v.id('users'),
      status: v.union(
        v.literal('pending'),
        v.literal('confirmed'),
        v.literal('declined'),
        v.literal('tentative')
      ),
      respondedAt: v.optional(v.number()),
      notes: v.optional(v.string()),
      invitedBy: v.id('users'),
      invitedAt: v.number(),
    })
    .index('byEvent', ['eventId'])
    .index('byUser', ['userId'])
    .index('byStatus', ['status']),

    eventReminders: defineTable({
      eventId: v.id('calendarEvents'),
      userId: v.id('users'),
      reminderTime: v.number(), // Minutes before event
      method: v.union(
        v.literal('notification'),
        v.literal('email'),
        v.literal('sms')
      ),
      isSent: v.boolean(),
      sentAt: v.optional(v.number()),
      createdAt: v.number(),
    })
    .index('byEvent', ['eventId'])
    .index('byUser', ['userId'])
    .index('byReminderTime', ['reminderTime'])
    .index('bySent', ['isSent']),

    calendarSettings: defineTable({
      userId: v.id('users'),
      defaultView: v.union(
        v.literal('month'),
        v.literal('week'),
        v.literal('day'),
        v.literal('agenda')
      ),
      workingHoursStart: v.string(), // HH:MM
      workingHoursEnd: v.string(), // HH:MM
      weekStartsOn: v.number(), // 0-6 (Sunday-Saturday)
      timeZone: v.string(), // IANA time zone identifier
      showWeekends: v.boolean(),
      defaultReminderTime: v.number(), // Minutes before events
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byUser', ['userId']),

    // Community Management Tables
    announcements: defineTable({
      title: v.string(),
      content: v.string(),
      authorId: v.id('users'),
      publishedAt: v.number(),
      priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
      category: v.union(v.literal('general'), v.literal('emergency'), v.literal('maintenance'), v.literal('event'), v.literal('news')),
      isActive: v.boolean(),
      expiresAt: v.optional(v.number()),
      readBy: v.array(v.id('users')),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byAuthor', ['authorId'])
    .index('byPriority', ['priority'])
    .index('byCategory', ['category'])
    .index('byActive', ['isActive'])
    .index('byPublishedAt', ['publishedAt']),

    maintenanceRequests: defineTable({
      title: v.string(),
      description: v.string(),
      location: v.string(),
      priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
      status: v.union(v.literal('pending'), v.literal('in-progress'), v.literal('completed'), v.literal('cancelled')),
      category: v.union(v.literal('roads'), v.literal('lighting'), v.literal('water'), v.literal('sewage'), v.literal('buildings'), v.literal('other')),
      reportedBy: v.id('users'),
      reportedAt: v.number(),
      assignedTo: v.optional(v.id('users')),
      assignedAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      estimatedCost: v.optional(v.number()),
      actualCost: v.optional(v.number()),
      photos: v.array(v.string()), // File URLs
      notes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byReporter', ['reportedBy'])
    .index('byAssignee', ['assignedTo'])
    .index('byStatus', ['status'])
    .index('byPriority', ['priority'])
    .index('byCategory', ['category']),

    payments: defineTable({
      userId: v.id('users'),
      amount: v.number(), // Amount in cents
      description: v.string(),
      type: v.union(v.literal('contribution'), v.literal('project'), v.literal('maintenance'), v.literal('event'), v.literal('other')),
      status: v.union(v.literal('pending'), v.literal('completed'), v.literal('failed'), v.literal('cancelled')),
      paymentMethod: v.optional(v.union(v.literal('stripe'), v.literal('bank_transfer'), v.literal('cash'), v.literal('other'))),
      referenceId: v.optional(v.string()), // External payment ID
      dueDate: v.optional(v.string()), // ISO date string
      paidAt: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byUser', ['userId'])
    .index('byType', ['type'])
    .index('byStatus', ['status'])
    .index('byDueDate', ['dueDate'])
    .index('byReferenceId', ['referenceId']),

    communityProjects: defineTable({
      title: v.string(),
      description: v.string(),
      goal: v.number(), // Goal amount in cents
      raised: v.number(), // Raised amount in cents
      deadline: v.string(), // ISO date string
      category: v.union(v.literal('agricultural'), v.literal('infrastructure'), v.literal('education'), v.literal('health'), v.literal('cultural'), v.literal('other')),
      status: v.union(v.literal('planning'), v.literal('active'), v.literal('completed'), v.literal('cancelled')),
      organizerId: v.id('users'),
      isPublic: v.boolean(),
      images: v.array(v.string()), // File URLs
      documents: v.array(v.string()), // File URLs
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byOrganizer', ['organizerId'])
    .index('byCategory', ['category'])
    .index('byStatus', ['status'])
    .index('byDeadline', ['deadline'])
    .index('byPublic', ['isPublic']),

    projectContributions: defineTable({
      projectId: v.id('communityProjects'),
      userId: v.id('users'),
      amount: v.number(), // Amount in cents
      paymentMethod: v.union(v.literal('stripe'), v.literal('bank_transfer'), v.literal('cash'), v.literal('other')),
      referenceId: v.optional(v.string()), // External payment ID
      contributedAt: v.number(),
      isAnonymous: v.boolean(),
      message: v.optional(v.string()),
      createdAt: v.number(),
    })
    .index('byProject', ['projectId'])
    .index('byUser', ['userId'])
    .index('byContributedAt', ['contributedAt']),

    // Contacts System Tables
    contacts: defineTable({
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
      isActive: v.boolean(),
      createdBy: v.id('users'),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
    .index('byType', ['type'])
    .index('byActive', ['isActive'])
    .index('byCreatedBy', ['createdBy']),

  });
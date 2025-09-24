import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { paymentAttemptSchemaValidator } from './utils/paymentAttemptTypes';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
    role: v.optional(v.union(v.literal('user'), v.literal('admin'))),
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
    permissionLevel: v.union(v.literal('view'), v.literal('admin')),
    grantedBy: v.id('users'),
    grantedAt: v.number(),
    expiresAt: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index('byCamera', ['cameraId'])
    .index('byUser', ['userId'])
    .index('byPermissionLevel', ['permissionLevel'])
    .index('byActive', ['isActive'])
    .index('byUser_and_isActive', ['userId', 'isActive'])
    .index('byCamera_and_isActive', ['cameraId', 'isActive']),

  // Weather Tables
  weatherData: defineTable({
    timestamp: v.number(),
    temperature: v.number(),
    humidity: v.number(),
    pressure: v.number(),
    surfacePressure: v.optional(v.number()), // Ground level pressure
    windSpeed: v.number(),
    windDirection: v.number(),
    windGusts: v.optional(v.number()), // Wind gust speed
    precipitation: v.number(),
    uvIndex: v.optional(v.number()), // Now optional since it's available
    visibility: v.number(),
    description: v.string(),
    icon: v.string(),
    feelsLike: v.optional(v.number()), // Real feels-like temperature
    dewPoint: v.optional(v.number()), // Calculated dew point
    cloudCover: v.optional(v.number()), // Now optional since it's available
    weatherCode: v.optional(v.number()), // WMO weather code
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
    severity: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('extreme')
    ),
    type: v.union(
      v.literal('storm'),
      v.literal('heat'),
      v.literal('cold'),
      v.literal('flood'),
      v.literal('wind'),
      v.literal('other')
    ),
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
    schedule: v.optional(
      v.object({
        startTime: v.string(), // HH:MM format
        endTime: v.string(), // HH:MM format
        daysOfWeek: v.optional(v.array(v.number())), // 0-6 (Sunday-Saturday)
      })
    ),
    soundEnabled: v.boolean(),
    vibrationEnabled: v.boolean(),
    notificationEnabled: v.boolean(),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('critical')
    ),
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
    quietHours: v.optional(
      v.object({
        enabled: v.boolean(),
        startTime: v.string(), // HH:MM
        endTime: v.string(), // HH:MM
        daysOfWeek: v.array(v.number()), // 0-6
      })
    ),
    emergencyOverride: v.boolean(), // Always trigger emergency alarms
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('byUser', ['userId']),

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
    recurrenceRule: v.optional(
      v.object({
        frequency: v.union(
          v.literal('daily'),
          v.literal('weekly'),
          v.literal('monthly'),
          v.literal('yearly')
        ),
        interval: v.number(), // Every N days/weeks/months/years
        endDate: v.optional(v.string()), // ISO date string
        daysOfWeek: v.optional(v.array(v.number())), // 0-6 for weekly recurrence
        count: v.optional(v.number()), // Number of occurrences
      })
    ),
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
  }).index('byUser', ['userId']),

  // Community Management Tables
  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id('users'),
    publishedAt: v.number(),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('critical')
    ),
    category: v.union(
      v.literal('general'),
      v.literal('emergency'),
      v.literal('maintenance'),
      v.literal('event'),
      v.literal('news')
    ),
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
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('critical')
    ),
    status: v.union(
      v.literal('pending'),
      v.literal('in-progress'),
      v.literal('completed'),
      v.literal('cancelled')
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
    type: v.union(
      v.literal('contribution'),
      v.literal('project'),
      v.literal('maintenance'),
      v.literal('event'),
      v.literal('other')
    ),
    status: v.union(
      v.literal('pending'),
      v.literal('completed'),
      v.literal('failed'),
      v.literal('cancelled')
    ),
    paymentMethod: v.optional(
      v.union(
        v.literal('stripe'),
        v.literal('bank_transfer'),
        v.literal('cash'),
        v.literal('other')
      )
    ),
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
    category: v.union(
      v.literal('agricultural'),
      v.literal('infrastructure'),
      v.literal('education'),
      v.literal('health'),
      v.literal('cultural'),
      v.literal('other')
    ),
    status: v.union(
      v.literal('planning'),
      v.literal('active'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
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
    paymentMethod: v.union(
      v.literal('stripe'),
      v.literal('bank_transfer'),
      v.literal('cash'),
      v.literal('other')
    ),
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
    type: v.union(
      v.literal('directiva'),
      v.literal('seguridad'),
      v.literal('social'),
      v.literal('municipal'),
      v.literal('health'),
      v.literal('police'),
      v.literal('fire'),
      v.literal('service')
    ),
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

  // Emergency Protocols Tables
  emergencyProtocols: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal('fire'),
      v.literal('medical'),
      v.literal('police'),
      v.literal('natural_disaster'),
      v.literal('security'),
      v.literal('evacuation'),
      v.literal('general')
    ),
    priority: v.union(
      v.literal('critical'),
      v.literal('high'),
      v.literal('medium'),
      v.literal('low')
    ),
    pdfUrl: v.string(), // Convex file storage URL
    thumbnailUrl: v.optional(v.string()),
    emergencyContacts: v.array(
      v.object({
        name: v.string(),
        phone: v.string(),
        role: v.string(),
      })
    ),
    steps: v.array(v.string()), // Step-by-step instructions
    isActive: v.boolean(),
    offlineAvailable: v.boolean(),
    downloadCount: v.number(),
    lastDownloaded: v.optional(v.number()),
    createdBy: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('byCategory', ['category'])
    .index('byPriority', ['priority'])
    .index('byActive', ['isActive'])
    .index('byCreatedBy', ['createdBy']),

  // Radio Streaming Tables
  radioStations: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    streamUrl: v.string(),
    logoUrl: v.optional(v.string()),
    frequency: v.optional(v.string()), // e.g., "96.7 FM"
    category: v.union(
      v.literal('news'),
      v.literal('music'),
      v.literal('sports'),
      v.literal('cultural'),
      v.literal('emergency'),
      v.literal('community')
    ),
    region: v.string(), // e.g., "Ñuble", "Pinto", "Recinto"
    isActive: v.boolean(),
    isOnline: v.boolean(),
    lastChecked: v.optional(v.number()),
    quality: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    backupStreamUrl: v.optional(v.string()),
    createdBy: v.optional(v.id('users')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('byCategory', ['category'])
    .index('byRegion', ['region'])
    .index('byActive', ['isActive'])
    .index('byOnline', ['isOnline'])
    .index('byCreatedBy', ['createdBy']),

  radioPlaylists: defineTable({
    userId: v.id('users'),
    stationId: v.id('radioStations'),
    isFavorite: v.boolean(),
    lastPlayed: v.optional(v.number()),
    playCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('byUser', ['userId'])
    .index('byStation', ['stationId'])
    .index('byFavorite', ['isFavorite']),

  // RSS News Integration Tables
  rssFeeds: defineTable({
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal('news'),
      v.literal('sports'),
      v.literal('local'),
      v.literal('politics'),
      v.literal('emergency')
    ),
    region: v.string(), // e.g., "Ñuble", "Biobío", "Nacional"
    isActive: v.boolean(),
    lastFetched: v.optional(v.number()),
    fetchInterval: v.number(), // minutes between fetches
    logoUrl: v.optional(v.string()),
    createdBy: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('byCategory', ['category'])
    .index('byRegion', ['region'])
    .index('byActive', ['isActive'])
    .index('byLastFetched', ['lastFetched']),

  rssArticles: defineTable({
    feedId: v.id('rssFeeds'),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    url: v.string(),
    author: v.optional(v.string()),
    publishedAt: v.number(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    region: v.string(),
    isRead: v.boolean(),
    isArchived: v.boolean(),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('byFeed', ['feedId'])
    .index('byCategory', ['category'])
    .index('byRegion', ['region'])
    .index('byPublishedAt', ['publishedAt'])
    .index('byRead', ['isRead'])
    .index('byArchived', ['isArchived']),

  // Performance and Memory Monitoring Tables
  systemMetrics: defineTable({
    timestamp: v.number(),
    cpuUsage: v.number(), // Percentage 0-100
    memoryUsage: v.number(), // MB
    memoryPercentage: v.number(), // Percentage 0-100
    diskUsage: v.optional(v.number()), // GB
    diskPercentage: v.optional(v.number()), // Percentage 0-100
    networkIn: v.optional(v.number()), // KB/s
    networkOut: v.optional(v.number()), // KB/s
    activeConnections: v.optional(v.number()),
    uptime: v.optional(v.number()), // Seconds
    loadAverage: v.optional(v.array(v.number())), // 1min, 5min, 15min
    temperature: v.optional(v.number()), // Celsius (system temp)
    component: v.union(
      v.literal('web_app'),
      v.literal('api_server'),
      v.literal('database'),
      v.literal('cache'),
      v.literal('load_balancer'),
      v.literal('monitoring'),
      v.literal('system')
    ),
    server: v.optional(v.string()), // Server identifier
    environment: v.union(v.literal('development'), v.literal('staging'), v.literal('production')),
    createdAt: v.number(),
  })
    .index('byTimestamp', ['timestamp'])
    .index('byComponent', ['component'])
    .index('byEnvironment', ['environment'])
    .index('byServer', ['server']),

  performanceMetrics: defineTable({
    timestamp: v.number(),
    pageLoadTime: v.optional(v.number()), // Milliseconds
    timeToFirstByte: v.optional(v.number()), // Milliseconds
    firstContentfulPaint: v.optional(v.number()), // Milliseconds
    largestContentfulPaint: v.optional(v.number()), // Milliseconds
    firstInputDelay: v.optional(v.number()), // Milliseconds
    cumulativeLayoutShift: v.optional(v.number()), // Score
    interactionToNextPaint: v.optional(v.number()), // Milliseconds
    apiResponseTime: v.optional(v.number()), // Milliseconds
    errorRate: v.optional(v.number()), // Percentage 0-100
    userSatisfaction: v.optional(v.number()), // Score 0-100
    page: v.optional(v.string()), // Page/route identifier
    userAgent: v.optional(v.string()),
    userId: v.optional(v.id('users')),
    sessionId: v.optional(v.string()),
    deviceType: v.union(v.literal('desktop'), v.literal('mobile'), v.literal('tablet')),
    browser: v.optional(v.string()),
    environment: v.union(v.literal('development'), v.literal('staging'), v.literal('production')),
    createdAt: v.number(),
  })
    .index('byTimestamp', ['timestamp'])
    .index('byPage', ['page'])
    .index('byUser', ['userId'])
    .index('byDeviceType', ['deviceType'])
    .index('byEnvironment', ['environment'])
    .index('bySession', ['sessionId']),

  memoryUsage: defineTable({
    timestamp: v.number(),
    component: v.union(
      v.literal('web_app'),
      v.literal('api_server'),
      v.literal('database'),
      v.literal('cache'),
      v.literal('worker'),
      v.literal('scheduler')
    ),
    heapUsed: v.number(), // MB
    heapTotal: v.number(), // MB
    external: v.optional(v.number()), // MB
    rss: v.optional(v.number()), // MB (Resident Set Size)
    arrayBuffers: v.optional(v.number()), // MB
    gcCollections: v.optional(v.number()), // Number of GC cycles
    gcPauseTime: v.optional(v.number()), // Milliseconds
    eventLoopLag: v.optional(v.number()), // Milliseconds
    activeHandles: v.optional(v.number()),
    activeRequests: v.optional(v.number()),
    server: v.optional(v.string()),
    environment: v.union(v.literal('development'), v.literal('staging'), v.literal('production')),
    createdAt: v.number(),
  })
    .index('byTimestamp', ['timestamp'])
    .index('byComponent', ['component'])
    .index('byEnvironment', ['environment'])
    .index('byServer', ['server']),

  // Community Businesses Directory
  businesses: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal('supermercado'),
      v.literal('panaderia'),
      v.literal('restaurante'),
      v.literal('farmacia'),
      v.literal('ferreteria'),
      v.literal('otros')
    ),
    address: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    hours: v.string(),
    rating: v.number(), // 1-5 stars
    featured: v.boolean(),
    isActive: v.boolean(),
    ownerId: v.optional(v.id('users')),
    ownerName: v.string(),
    verified: v.boolean(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    socialMedia: v.optional(v.object({
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
    })),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('byCategory', ['category'])
    .index('byFeatured', ['featured'])
    .index('byActive', ['isActive'])
    .index('byVerified', ['verified'])
    .index('byOwner', ['ownerId'])
    .index('byRating', ['rating']),
});

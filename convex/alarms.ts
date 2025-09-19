import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Get all alarms for a user
export const getAlarms = query({
  args: {
    userId: v.id("users")
  },
  returns: v.array(v.object({
    _id: v.id("alarms"),
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
      startTime: v.string(),
      endTime: v.string(),
      daysOfWeek: v.optional(v.array(v.number()))
    })),
    soundEnabled: v.boolean(),
    vibrationEnabled: v.boolean(),
    notificationEnabled: v.boolean(),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
    lastTriggered: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const alarms = await ctx.db
      .query("alarms")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();

    return alarms.map(alarm => ({
      _id: alarm._id,
      title: alarm.title,
      description: alarm.description,
      type: alarm.type,
      isActive: alarm.isActive,
      isRecurring: alarm.isRecurring,
      schedule: alarm.schedule,
      soundEnabled: alarm.soundEnabled,
      vibrationEnabled: alarm.vibrationEnabled,
      notificationEnabled: alarm.notificationEnabled,
      priority: alarm.priority,
      lastTriggered: alarm.lastTriggered,
      createdAt: alarm.createdAt,
      updatedAt: alarm.updatedAt,
    }));
  },
});

// Create a new alarm
export const createAlarm = mutation({
  args: {
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
      startTime: v.string(),
      endTime: v.string(),
      daysOfWeek: v.optional(v.array(v.number()))
    })),
    soundEnabled: v.boolean(),
    vibrationEnabled: v.boolean(),
    notificationEnabled: v.boolean(),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
    userId: v.id("users"),
  },
  returns: v.id("alarms"),
  handler: async (ctx, args) => {
    const now = Date.now();

    const alarmId = await ctx.db.insert("alarms", {
      ...args,
      lastTriggered: undefined,
      createdAt: now,
      updatedAt: now,
    });

    return alarmId;
  },
});

// Update an existing alarm
export const updateAlarm = mutation({
  args: {
    alarmId: v.id("alarms"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal('emergency'),
      v.literal('weather'),
      v.literal('community'),
      v.literal('maintenance'),
      v.literal('security'),
      v.literal('medical'),
      v.literal('fire'),
      v.literal('custom')
    )),
    isActive: v.optional(v.boolean()),
    isRecurring: v.optional(v.boolean()),
    schedule: v.optional(v.object({
      startTime: v.string(),
      endTime: v.string(),
      daysOfWeek: v.optional(v.array(v.number()))
    })),
    soundEnabled: v.optional(v.boolean()),
    vibrationEnabled: v.optional(v.boolean()),
    notificationEnabled: v.optional(v.boolean()),
    priority: v.optional(v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical'))),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { alarmId, ...updates } = args;

    await ctx.db.patch(alarmId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Delete an alarm
export const deleteAlarm = mutation({
  args: {
    alarmId: v.id("alarms"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // First delete all triggers for this alarm
    const triggers = await ctx.db
      .query("alarmTriggers")
      .withIndex("byAlarm", (q) => q.eq("alarmId", args.alarmId))
      .collect();

    for (const trigger of triggers) {
      await ctx.db.delete(trigger._id);
    }

    // Then delete the alarm
    await ctx.db.delete(args.alarmId);
    return true;
  },
});

// Toggle alarm active state
export const toggleAlarm = mutation({
  args: {
    alarmId: v.id("alarms"),
    isActive: v.boolean(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alarmId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Trigger an alarm manually
export const triggerAlarm = mutation({
  args: {
    alarmId: v.id("alarms"),
    userId: v.id("users"),
    message: v.optional(v.string()),
  },
  returns: v.id("alarmTriggers"),
  handler: async (ctx, args) => {
    const alarm = await ctx.db.get(args.alarmId);
    if (!alarm) {
      throw new Error("Alarm not found");
    }

    const triggerId = await ctx.db.insert("alarmTriggers", {
      alarmId: args.alarmId,
      userId: args.userId,
      triggerType: "manual",
      message: args.message || `Manual trigger: ${alarm.title}`,
      acknowledged: false,
      triggeredAt: Date.now(),
    });

    // Update last triggered timestamp
    await ctx.db.patch(args.alarmId, {
      lastTriggered: Date.now(),
      updatedAt: Date.now(),
    });

    return triggerId;
  },
});

// Get alarm settings for a user
export const getAlarmSettings = query({
  args: {
    userId: v.id("users")
  },
  returns: v.optional(v.object({
    _id: v.id("alarmSettings"),
    globalSoundEnabled: v.boolean(),
    globalVibrationEnabled: v.boolean(),
    globalNotificationEnabled: v.boolean(),
    quietHours: v.optional(v.object({
      enabled: v.boolean(),
      startTime: v.string(),
      endTime: v.string(),
      daysOfWeek: v.array(v.number())
    })),
    emergencyOverride: v.boolean(),
  })),
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("alarmSettings")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .first();

    if (!settings) return null;

    return {
      _id: settings._id,
      globalSoundEnabled: settings.globalSoundEnabled,
      globalVibrationEnabled: settings.globalVibrationEnabled,
      globalNotificationEnabled: settings.globalNotificationEnabled,
      quietHours: settings.quietHours,
      emergencyOverride: settings.emergencyOverride,
    };
  },
});

// Update alarm settings
export const updateAlarmSettings = mutation({
  args: {
    userId: v.id("users"),
    globalSoundEnabled: v.optional(v.boolean()),
    globalVibrationEnabled: v.optional(v.boolean()),
    globalNotificationEnabled: v.optional(v.boolean()),
    quietHours: v.optional(v.object({
      enabled: v.boolean(),
      startTime: v.string(),
      endTime: v.string(),
      daysOfWeek: v.array(v.number())
    })),
    emergencyOverride: v.optional(v.boolean()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    const existingSettings = await ctx.db
      .query("alarmSettings")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .first();

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        ...updates,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("alarmSettings", {
        userId,
        globalSoundEnabled: updates.globalSoundEnabled ?? true,
        globalVibrationEnabled: updates.globalVibrationEnabled ?? true,
        globalNotificationEnabled: updates.globalNotificationEnabled ?? true,
        quietHours: updates.quietHours,
        emergencyOverride: updates.emergencyOverride ?? true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return true;
  },
});

// Get recent alarm triggers
export const getRecentTriggers = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("alarmTriggers"),
    alarmId: v.id("alarms"),
    alarmTitle: v.string(),
    alarmType: v.string(),
    triggerType: v.string(),
    message: v.string(),
    acknowledged: v.boolean(),
    triggeredAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    const triggers = await ctx.db
      .query("alarmTriggers")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    const result = [];
    for (const trigger of triggers) {
      const alarm = await ctx.db.get(trigger.alarmId);
      if (alarm) {
        result.push({
          _id: trigger._id,
          alarmId: trigger.alarmId,
          alarmTitle: alarm.title,
          alarmType: alarm.type,
          triggerType: trigger.triggerType,
          message: trigger.message,
          acknowledged: trigger.acknowledged,
          triggeredAt: trigger.triggeredAt,
        });
      }
    }

    return result;
  },
});

// Acknowledge an alarm trigger
export const acknowledgeTrigger = mutation({
  args: {
    triggerId: v.id("alarmTriggers"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.triggerId, {
      acknowledged: true,
      acknowledgedAt: Date.now(),
    });

    return true;
  },
});

// Get active alarms that should trigger now
export const getActiveAlarmsToTrigger = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(v.id("alarms")),
  handler: async (ctx, args) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const alarms = await ctx.db
      .query("alarms")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const alarmsToTrigger = [];

    for (const alarm of alarms) {
      if (!alarm.schedule) {
        // Non-scheduled alarm, can be triggered manually
        continue;
      }

      const { startTime, endTime, daysOfWeek } = alarm.schedule;

      // Check if current day is in the schedule
      if (daysOfWeek && !daysOfWeek.includes(currentDay)) {
        continue;
      }

      // Check if current time is within the schedule
      if (currentTime >= startTime && currentTime <= endTime) {
        alarmsToTrigger.push(alarm._id);
      }
    }

    return alarmsToTrigger;
  },
});
"use node";

import { action, internalAction, internalMutation } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { v } from "convex/values";

// Import notification actions
const { sendAlarmNotification, broadcastEmergencyNotification } = internal.notifications;

// Internal action to check and trigger scheduled alarms
export const checkScheduledAlarms = internalAction({
  args: {},
  returns: v.number(), // Returns number of alarms triggered
  handler: async (ctx) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();
    let triggeredCount = 0;

    // Get all active alarms with schedules
    const alarms = await ctx.runQuery(internal.alarms.getActiveAlarmsToTrigger, {});

    for (const alarm of alarms) {
      if (!alarm.schedule) continue;

      const { startTime, endTime, daysOfWeek } = alarm.schedule;

      // Check if current day is in schedule
      if (daysOfWeek && !daysOfWeek.includes(currentDay)) {
        continue;
      }

      // Check if current time is within schedule
      if (currentTime >= startTime && currentTime <= endTime) {
        // Check if alarm was already triggered recently (within last minute)
        const lastTriggered = alarm.lastTriggered;
        if (lastTriggered && (now.getTime() - lastTriggered) < 60000) {
          continue; // Skip if triggered within last minute
        }

        // Check user's settings
        const settings = await ctx.runQuery(internal.alarms.getAlarmSettings, { userId: alarm.userId });

        const soundEnabled = (settings?.globalSoundEnabled ?? true) && alarm.soundEnabled;
        const vibrationEnabled = (settings?.globalVibrationEnabled ?? true) && alarm.vibrationEnabled;
        const notificationEnabled = (settings?.globalNotificationEnabled ?? true) && alarm.notificationEnabled;

        // Check quiet hours
        let shouldTrigger = true;
        if (settings?.quietHours?.enabled) {
          const quietStart = settings.quietHours.startTime;
          const quietEnd = settings.quietHours.endTime;
          const quietDays = settings.quietHours.daysOfWeek;

          if (quietDays.includes(currentDay) &&
              currentTime >= quietStart &&
              currentTime <= quietEnd) {
            // In quiet hours, only trigger if emergency override is enabled
            shouldTrigger = alarm.priority === 'critical' && (settings.emergencyOverride ?? true);
          }
        }

        if (shouldTrigger && (soundEnabled || vibrationEnabled || notificationEnabled)) {
          // Create trigger record
          const triggerId = await ctx.runMutation(internal.alarms.createAlarmTrigger, {
            alarmId: alarm._id,
            userId: alarm.userId,
            triggerType: "scheduled",
            message: `Scheduled alarm: ${alarm.title}`,
            acknowledged: false,
            triggeredAt: now.getTime(),
          });

          // Update last triggered
          await ctx.runMutation(internal.alarms.updateAlarmLastTriggered, {
            alarmId: alarm._id,
            lastTriggered: now.getTime(),
          });

          // Send notification if enabled
          if (notificationEnabled) {
            await ctx.runAction(sendAlarmNotification, {
              triggerId: triggerId as any,
              userId: alarm.userId,
            });
          }

          triggeredCount++;
        }
      }
    }

    return triggeredCount;
  },
});

// Emergency alarm functionality disabled - too complex for community app
export const triggerEmergencyAlarm = action({
  args: {
    message: v.string(),
    triggeredBy: v.id("users"),
  },
  returns: v.number(), // Returns number of users notified
  handler: async (ctx, args) => {
    return await ctx.runMutation(internal.alarmScheduler.triggerEmergencyAlarmMutation, args);
  },
});

// Internal action to trigger weather-based alarms
export const triggerWeatherAlarm = internalAction({
  args: {
    weatherAlertId: v.id("weatherAlerts"),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    return await ctx.runMutation(internal.alarmScheduler.triggerWeatherAlarmMutation, args);
  },
});

// Mutations for database operations

// Internal mutation to trigger emergency alarm
export const triggerEmergencyAlarmMutation = internalMutation({
  args: {
    message: v.string(),
    triggeredBy: v.id("users"),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    // Get all users
    const users = await ctx.db.query("users").collect();
    let notifiedCount = 0;

    for (const user of users) {
      // Get user's emergency alarm
      const emergencyAlarm = await ctx.db
        .query("alarms")
        .withIndex("byUser", (q: any) => q.eq("userId", user._id))
        .filter((q: any) =>
          q.eq(q.field("type"), "emergency") &&
          q.eq(q.field("isActive"), true)
        )
        .first();

      if (emergencyAlarm) {
        // Check settings
        const settings = await ctx.db
          .query("alarmSettings")
          .withIndex("byUser", (q: any) => q.eq("userId", user._id))
          .first();

        const shouldNotify =
          (settings?.globalSoundEnabled ?? true) &&
          (settings?.globalVibrationEnabled ?? true) &&
          (settings?.globalNotificationEnabled ?? true) &&
          (settings?.emergencyOverride ?? true);

        if (shouldNotify) {
          // Create trigger record
          await ctx.db.insert("alarmTriggers", {
            alarmId: emergencyAlarm._id,
            userId: user._id,
            triggerType: "emergency",
            message: args.message,
            acknowledged: false,
            triggeredAt: Date.now(),
          });

          // Update last triggered
          await ctx.db.patch(emergencyAlarm._id, {
            lastTriggered: Date.now(),
            updatedAt: Date.now(),
          });

          notifiedCount++;
        }
      }
    }

    return notifiedCount;
  },
});

// Internal mutation to trigger weather alarm
export const triggerWeatherAlarmMutation = internalMutation({
  args: {
    weatherAlertId: v.id("weatherAlerts"),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    const weatherAlert = await ctx.db.get(args.weatherAlertId);
    if (!weatherAlert || !weatherAlert.isActive) {
      return 0;
    }

    let triggeredCount = 0;

    // Get all users with weather alarms
    const weatherAlarms = await ctx.db
      .query("alarms")
      .withIndex("byType", (q: any) => q.eq("type", "weather"))
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .collect();

    for (const alarm of weatherAlarms) {
      // Check if user is in affected area
      const isAffected = weatherAlert.areas.some((area: string) =>
        area.toLowerCase().includes("pinto") ||
        area.toLowerCase().includes("cobquecura") ||
        area.toLowerCase().includes("ñuble")
      );

      if (isAffected) {
        // Check settings
        const settings = await ctx.db
          .query("alarmSettings")
          .withIndex("byUser", (q: any) => q.eq("userId", alarm.userId))
          .first();

        const shouldTrigger =
          (settings?.globalNotificationEnabled ?? true) &&
          alarm.notificationEnabled;

        if (shouldTrigger) {
          await ctx.db.insert("alarmTriggers", {
            alarmId: alarm._id,
            userId: alarm.userId,
            triggerType: "weather_alert",
            message: `${weatherAlert.title}: ${weatherAlert.description}`,
            triggerData: {
              weatherAlertId: args.weatherAlertId,
              severity: weatherAlert.severity,
              areas: weatherAlert.areas,
            },
            acknowledged: false,
            triggeredAt: Date.now(),
          });

          await ctx.db.patch(alarm._id, {
            lastTriggered: Date.now(),
            updatedAt: Date.now(),
          });

          triggeredCount++;
        }
      }
    }

    return triggeredCount;
  },
});

// Internal mutation to test alarm
export const testAlarmMutation = internalMutation({
  args: {
    alarmId: v.id("alarms"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const alarm = await ctx.db.get(args.alarmId);
    if (!alarm) {
      throw new Error("Alarm not found");
    }

    // Check settings
    const settings = await ctx.db
      .query("alarmSettings")
      .withIndex("byUser", (q: any) => q.eq("userId", alarm.userId))
      .first();

    const soundEnabled = (settings?.globalSoundEnabled ?? true) && alarm.soundEnabled;
    const vibrationEnabled = (settings?.globalVibrationEnabled ?? true) && alarm.vibrationEnabled;
    const notificationEnabled = (settings?.globalNotificationEnabled ?? true) && alarm.notificationEnabled;

    if (!soundEnabled && !vibrationEnabled && !notificationEnabled) {
      return false; // Nothing to test
    }

    // Create test trigger
    await ctx.db.insert("alarmTriggers", {
      alarmId: alarm._id,
      userId: alarm.userId,
      triggerType: "manual",
      message: `Test: ${alarm.title}`,
      triggerData: { isTest: true },
      acknowledged: false,
      triggeredAt: Date.now(),
    });

    // Update last triggered
    await ctx.db.patch(alarm._id, {
      lastTriggered: Date.now(),
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Action to test an alarm
export const testAlarm = action({
  args: {
    alarmId: v.id("alarms"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    return await ctx.runMutation(internal.alarmScheduler.testAlarmMutation, args);
  },
});
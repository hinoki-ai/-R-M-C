"use node";

import { action, internalAction } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// Internal action to send push notification for alarm trigger
export const sendAlarmNotification = internalAction({
  args: {
    triggerId: v.id("alarmTriggers"),
    userId: v.id("users"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Actions cannot directly access ctx.db, so we need to call queries
    const trigger = await ctx.runQuery(api.alarms.getTrigger, { triggerId: args.triggerId });
    if (!trigger) return false;

    const alarm = await ctx.runQuery(api.alarms.getAlarm, { alarmId: trigger.alarmId });
    if (!alarm) return false;

    // In a real implementation, this would integrate with a push notification service
    // like Expo Notifications, Firebase Cloud Messaging, or similar
    // For now, we'll log the notification that would be sent

    const notificationData = {
      to: args.userId, // In real app, this would be device tokens
      title: `🚨 ${alarm.title}`,
      body: trigger.message,
      data: {
        alarmId: alarm._id,
        triggerId: args.triggerId,
        type: trigger.triggerType,
        priority: alarm.priority,
      },
      sound: alarm.soundEnabled ? 'default' : undefined,
      vibrate: alarm.vibrationEnabled ? [0, 250, 250, 250] : undefined,
    };

    console.log('📱 Push Notification:', notificationData);

    // TODO: Integrate with actual push notification service
    // Example integration:
    // await fetch('https://exp.host/--/api/v2/push/send', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Accept-encoding': 'gzip, deflate',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(notificationData),
    // });

    return true;
  },
});

// Action to register device token for push notifications
export const registerDeviceToken = action({
  args: {
    userId: v.id("users"),
    deviceToken: v.string(),
    platform: v.union(v.literal('ios'), v.literal('android')),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Store device token for push notifications
    // In a real app, you'd have a deviceTokens table
    console.log(`📱 Registered device token for user ${args.userId}:`, {
      token: args.deviceToken,
      platform: args.platform,
    });

    // TODO: Store in database for later use
    return true;
  },
});

// Action to send test notification
export const sendTestNotification = action({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    console.log('🧪 Test Notification:', {
      userId: args.userId,
      title: args.title,
      message: args.message,
    });

    // TODO: Send actual test notification
    return true;
  },
});

// Internal action to handle emergency broadcast notifications
export const broadcastEmergencyNotification = internalAction({
  args: {
    message: v.string(),
    triggeredBy: v.id("users"),
    excludeUserId: v.optional(v.id("users")),
  },
  returns: v.number(), // Number of notifications sent
  handler: async (ctx, args) => {
    // Get all users except the one who triggered it
    const users = await ctx.runQuery(api.users.listUsers, {});

    let notificationCount = 0;

    for (const user of users) {
      if (args.excludeUserId && user._id === args.excludeUserId) {
        continue;
      }

      // Get user's emergency alarm settings
      const settings = await ctx.runQuery(api.alarms.getAlarmSettings, { userId: user._id });

      if (settings?.emergencyOverride) {
        console.log(`🚨 Emergency broadcast to user ${user._id}: ${args.message}`);
        notificationCount++;
      }
    }

    return notificationCount;
  },
});
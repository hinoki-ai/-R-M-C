import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';

import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import {
  createNotFoundError,
  createAuthzError,
  createValidationError,
  createConflictError,
  createServerError,
} from './utils/error_handler';

// Camera queries
export const getCameras = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('cameras'),
      name: v.string(),
      description: v.optional(v.string()),
      location: v.optional(v.string()),
      streamUrl: v.string(),
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
  ),
  handler: async ctx => {
    const user = await getCurrentUserOrThrow(ctx);

    // Get cameras created by the user
    const userCameras = await ctx.db
      .query('cameras')
      .withIndex('byUser', q => q.eq('createdBy', user._id))
      .collect();

    // Get active permissions for the user
    const sharedPermissions = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser_and_isActive', q =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .collect();

    // Get all camera IDs the user has access to
    const allCameraIds = [
      ...userCameras.map(c => c._id),
      ...sharedPermissions.map(p => p.cameraId),
    ];

    // Remove duplicates
    const uniqueCameraIds = [...new Set(allCameraIds)];

    // Get all cameras in a single batch operation
    const allCameras = await Promise.all(
      uniqueCameraIds.map(id => ctx.db.get(id))
    );

    // Filter out nulls (though there shouldn't be any)
    return allCameras.filter(
      (camera): camera is NonNullable<typeof camera> => camera !== null
    );
  },
});

export const getCameraById = query({
  args: { cameraId: v.id('cameras') },
  returns: v.object({
    _id: v.id('cameras'),
    name: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    streamUrl: v.string(),
    isActive: v.boolean(),
    isOnline: v.boolean(),
    lastSeen: v.optional(v.number()),
    resolution: v.optional(v.string()),
    frameRate: v.optional(v.number()),
    hasAudio: v.optional(v.boolean()),
    createdBy: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  handler: async (ctx, { cameraId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const camera = await ctx.db.get(cameraId);

    if (!camera) {
      throw createNotFoundError('Camera');
    }

    // Check if user has access to this camera
    const hasAccess =
      camera.createdBy === user._id ||
      (await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser', q => q.eq('userId', user._id))
        .filter(q => q.eq(q.field('cameraId'), cameraId))
        .filter(q => q.eq(q.field('isActive'), true))
        .first());

    if (!hasAccess) {
      throw createAuthzError('Access denied to camera');
    }

    return camera;
  },
});

export const getCameraFeeds = query({
  args: { cameraId: v.id('cameras') },
  returns: v.array(
    v.object({
      _id: v.id('cameraFeeds'),
      cameraId: v.id('cameras'),
      url: v.string(),
      isActive: v.boolean(),
      lastAccessed: v.optional(v.number()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, { cameraId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera access
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw createNotFoundError('Camera');
    }

    const hasAccess =
      camera.createdBy === user._id ||
      (await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser', q => q.eq('userId', user._id))
        .filter(q => q.eq(q.field('cameraId'), cameraId))
        .filter(q => q.eq(q.field('isActive'), true))
        .first());

    if (!hasAccess) {
      throw createAuthzError('Access denied to camera feeds');
    }

    return await ctx.db
      .query('cameraFeeds')
      .withIndex('byCamera', q => q.eq('cameraId', cameraId))
      .collect();
  },
});

export const getCamerasWithFeeds = query({
  args: { cameraIds: v.array(v.id('cameras')) },
  returns: v.record(
    v.string(),
    v.array(
      v.object({
        _id: v.id('cameraFeeds'),
        cameraId: v.id('cameras'),
        url: v.string(),
        isActive: v.boolean(),
        lastAccessed: v.optional(v.number()),
        createdAt: v.number(),
      })
    )
  ),
  handler: async (ctx, { cameraIds }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const result: Record<string, any[]> = {};

    for (const cameraId of cameraIds) {
      // Verify camera access
      const camera = await ctx.db.get(cameraId);
      if (!camera) continue;

      const hasAccess =
        camera.createdBy === user._id ||
        (await ctx.db
          .query('cameraPermissions')
          .withIndex('byUser_and_isActive', q =>
            q.eq('userId', user._id).eq('isActive', true)
          )
          .filter(q => q.eq(q.field('cameraId'), cameraId))
          .first());

      if (hasAccess) {
        const feeds = await ctx.db
          .query('cameraFeeds')
          .withIndex('byCamera', q => q.eq('cameraId', cameraId))
          .collect();
        result[cameraId] = feeds;
      } else {
        result[cameraId] = [];
      }
    }

    return result;
  },
});

export const getCameraEvents = query({
  args: {
    cameraId: v.optional(v.id('cameras')),
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    page: v.array(
      v.object({
        _id: v.id('cameraEvents'),
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
        severity: v.union(
          v.literal('low'),
          v.literal('medium'),
          v.literal('high')
        ),
        acknowledged: v.boolean(),
        acknowledgedBy: v.optional(v.id('users')),
        acknowledgedAt: v.optional(v.number()),
      })
    ),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, { cameraId, paginationOpts }) => {
    const user = await getCurrentUserOrThrow(ctx);

    let eventsQuery = ctx.db.query('cameraEvents');

    if (cameraId) {
      // Verify camera access
      const camera = await ctx.db.get(cameraId);
      if (!camera) {
        throw createNotFoundError('Camera');
      }

      const hasAccess =
        camera.createdBy === user._id ||
        (await ctx.db
          .query('cameraPermissions')
          .withIndex('byUser_and_isActive', q =>
            q.eq('userId', user._id).eq('isActive', true)
          )
          .filter(q => q.eq(q.field('cameraId'), cameraId))
          .first());

      if (!hasAccess) {
        throw createAuthzError('Access denied to camera events');
      }

      // Filter events by camera ID
      eventsQuery = eventsQuery.filter(q =>
        q.eq(q.field('cameraId'), cameraId)
      );
    } else {
      // Get events for all cameras the user has access to
      const userCameras = await ctx.db
        .query('cameras')
        .withIndex('byUser', q => q.eq('createdBy', user._id))
        .collect();

      const sharedPermissions = await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser_and_isActive', q =>
          q.eq('userId', user._id).eq('isActive', true)
        )
        .collect();

      const allCameraIds = [
        ...userCameras.map(c => c._id),
        ...sharedPermissions.map(p => p.cameraId),
      ];

      // Remove duplicates
      const uniqueCameraIds = [...new Set(allCameraIds)];

      if (uniqueCameraIds.length === 0) {
        return { page: [], isDone: true, continueCursor: null };
      }

      eventsQuery = eventsQuery.filter(q =>
        q.or(...uniqueCameraIds.map(id => q.eq(q.field('cameraId'), id)))
      );
    }

    return await eventsQuery.order('desc').paginate(paginationOpts);
  },
});

export const getAllCameras = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('cameras'),
      name: v.string(),
      description: v.optional(v.string()),
      location: v.optional(v.string()),
      streamUrl: v.string(),
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
  ),
  handler: async ctx => {
    const user = await getCurrentUserOrThrow(ctx);

    // Check if user is admin
    if (user.role !== 'admin') {
      throw createAuthzError('Admin privileges required');
    }

    // Return all cameras for admin users
    return await ctx.db.query('cameras').collect();
  },
});

// Camera mutations
export const addCamera = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    streamUrl: v.string(),
    resolution: v.optional(v.string()),
    frameRate: v.optional(v.number()),
    hasAudio: v.optional(v.boolean()),
  },
  returns: v.id('cameras'),
  handler: async (ctx, args) => {
    try {
      const user = await getCurrentUserOrThrow(ctx);

      const now = Date.now();
      const cameraId = await ctx.db.insert('cameras', {
        ...args,
        isActive: true,
        isOnline: false,
        createdBy: user._id,
        createdAt: now,
        updatedAt: now,
      });

      // Create admin permission for camera management
      await ctx.db.insert('cameraPermissions', {
        cameraId,
        userId: user._id,
        permissionLevel: 'admin',
        grantedBy: user._id,
        grantedAt: now,
        isActive: true,
      });

      return cameraId;
    } catch (error) {
      console.error('Error adding camera:', error);
      throw createServerError('Failed to add camera. Please try again.');
    }
  },
});

export const updateCamera = mutation({
  args: {
    cameraId: v.id('cameras'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    streamUrl: v.optional(v.string()),
    resolution: v.optional(v.string()),
    frameRate: v.optional(v.number()),
    hasAudio: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  returns: v.id('cameras'),
  handler: async (ctx, { cameraId, ...updates }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify admin permission
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw createNotFoundError('Camera');
    }

    const permission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', q => q.eq('userId', user._id))
      .filter(q => q.eq(q.field('cameraId'), cameraId))
      .filter(q => q.eq(q.field('isActive'), true))
      .first();

    const hasPermission =
      camera.createdBy === user._id ||
      (permission && permission.permissionLevel === 'admin');

    if (!hasPermission) {
      throw createAuthzError('Insufficient permissions to update camera');
    }

    await ctx.db.patch(cameraId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return cameraId;
  },
});

export const deleteCamera = mutation({
  args: { cameraId: v.id('cameras') },
  returns: v.null(),
  handler: async (ctx, { cameraId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify ownership
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw createNotFoundError('Camera');
    }

    if (camera.createdBy !== user._id) {
      throw createAuthzError('Only camera owner can delete the camera');
    }

    // Delete related records
    const feeds = await ctx.db
      .query('cameraFeeds')
      .withIndex('byCamera', q => q.eq('cameraId', cameraId))
      .collect();

    const events = await ctx.db
      .query('cameraEvents')
      .withIndex('byCamera', q => q.eq('cameraId', cameraId))
      .collect();

    const permissions = await ctx.db
      .query('cameraPermissions')
      .withIndex('byCamera', q => q.eq('cameraId', cameraId))
      .collect();

    // Delete feeds
    await Promise.all(feeds.map(feed => ctx.db.delete(feed._id)));

    // Delete events
    await Promise.all(events.map(event => ctx.db.delete(event._id)));

    // Delete permissions
    await Promise.all(permissions.map(perm => ctx.db.delete(perm._id)));

    // Delete camera
    await ctx.db.delete(cameraId);

    return null;
  },
});

export const addCameraFeed = mutation({
  args: {
    cameraId: v.id('cameras'),
    url: v.string(),
  },
  returns: v.id('cameraFeeds'),
  handler: async (ctx, { cameraId, url }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera access
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw createNotFoundError('Camera');
    }

    const permission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', q => q.eq('userId', user._id))
      .filter(q => q.eq(q.field('cameraId'), cameraId))
      .filter(q => q.eq(q.field('isActive'), true))
      .first();

    const hasPermission =
      camera.createdBy === user._id ||
      (permission && permission.permissionLevel === 'admin');

    if (!hasPermission) {
      throw createAuthzError('Insufficient permissions to add camera feed');
    }

    return await ctx.db.insert('cameraFeeds', {
      cameraId,
      url,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const logCameraEvent = mutation({
  args: {
    cameraId: v.id('cameras'),
    eventType: v.union(
      v.literal('stream_started'),
      v.literal('stream_stopped'),
      v.literal('connection_lost'),
      v.literal('connection_restored'),
      v.literal('maintenance_required')
    ),
    message: v.string(),
    metadata: v.optional(v.any()),
    severity: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
  },
  returns: v.id('cameraEvents'),
  handler: async (ctx, { cameraId, ...eventData }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera exists (anyone with access can log events)
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw createNotFoundError('Camera');
    }

    const hasAccess =
      camera.createdBy === user._id ||
      (await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser', q => q.eq('userId', user._id))
        .filter(q => q.eq(q.field('cameraId'), cameraId))
        .filter(q => q.eq(q.field('isActive'), true))
        .first());

    if (!hasAccess) {
      throw createAuthzError('Access denied to camera');
    }

    return await ctx.db.insert('cameraEvents', {
      ...eventData,
      cameraId,
      timestamp: Date.now(),
      acknowledged: false,
    });
  },
});

export const acknowledgeCameraEvent = mutation({
  args: { eventId: v.id('cameraEvents') },
  returns: v.boolean(),
  handler: async (ctx, { eventId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const event = await ctx.db.get(eventId);
    if (!event) {
      throw createNotFoundError('Event');
    }

    // Verify camera access
    const camera = await ctx.db.get(event.cameraId);
    if (!camera) {
      throw createNotFoundError('Camera');
    }

    const hasAccess =
      camera.createdBy === user._id ||
      (await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser', q => q.eq('userId', user._id))
        .filter(q => q.eq(q.field('cameraId'), camera._id))
        .filter(q => q.eq(q.field('isActive'), true))
        .first());

    if (!hasAccess) {
      throw createAuthzError('Access denied to acknowledge event');
    }

    await ctx.db.patch(eventId, {
      acknowledged: true,
      acknowledgedBy: user._id,
      acknowledgedAt: Date.now(),
    });

    return true;
  },
});

export const grantCameraPermission = mutation({
  args: {
    cameraId: v.id('cameras'),
    userId: v.id('users'),
    permissionLevel: v.union(v.literal('view'), v.literal('admin')),
    expiresAt: v.optional(v.number()),
  },
  returns: v.id('cameraPermissions'),
  handler: async (ctx, { cameraId, userId, ...permissionData }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera ownership or admin permission
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw createNotFoundError('Camera');
    }

    const permission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', q => q.eq('userId', user._id))
      .filter(q => q.eq(q.field('cameraId'), cameraId))
      .filter(q => q.eq(q.field('isActive'), true))
      .first();

    const hasPermission =
      camera.createdBy === user._id ||
      (permission && ['admin', 'owner'].includes(permission.permissionLevel));

    if (!hasPermission) {
      throw createAuthzError('Insufficient permissions to grant camera access');
    }

    // Check if permission already exists
    const existingPermission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', q => q.eq('userId', userId))
      .filter(q => q.eq(q.field('cameraId'), cameraId))
      .first();

    if (existingPermission) {
      // Update existing permission
      await ctx.db.patch(existingPermission._id, {
        ...permissionData,
        grantedBy: user._id,
        grantedAt: Date.now(),
        isActive: true,
      });
      return existingPermission._id;
    } else {
      // Create new permission
      return await ctx.db.insert('cameraPermissions', {
        ...permissionData,
        cameraId,
        userId,
        grantedBy: user._id,
        grantedAt: Date.now(),
        isActive: true,
      });
    }
  },
});

export const revokeCameraPermission = mutation({
  args: { cameraId: v.id('cameras'), userId: v.id('users') },
  returns: v.boolean(),
  handler: async (ctx, { cameraId, userId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera ownership or admin permission
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw createNotFoundError('Camera');
    }

    const permission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', q => q.eq('userId', user._id))
      .filter(q => q.eq(q.field('cameraId'), cameraId))
      .filter(q => q.eq(q.field('isActive'), true))
      .first();

    const hasPermission =
      camera.createdBy === user._id ||
      (permission && ['admin', 'owner'].includes(permission.permissionLevel));

    if (!hasPermission) {
      throw createAuthzError(
        'Insufficient permissions to revoke camera access'
      );
    }

    // Find and deactivate permission
    const targetPermission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', q => q.eq('userId', userId))
      .filter(q => q.eq(q.field('cameraId'), cameraId))
      .first();

    if (targetPermission) {
      await ctx.db.patch(targetPermission._id, { isActive: false });
    }

    return true;
  },
});

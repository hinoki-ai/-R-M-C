import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

// Camera queries
export const getCameras = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Get cameras created by the user
    const userCameras = await ctx.db
      .query('cameras')
      .withIndex('byUser', (q) => q.eq('createdBy', user._id))
      .collect();

    // Get cameras shared with the user via permissions
    const sharedPermissions = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    const sharedCameraIds = sharedPermissions.map(p => p.cameraId);
    const sharedCameras = sharedCameraIds.length > 0 ?
      await Promise.all(
        sharedCameraIds.map(id =>
          ctx.db.get(id).then(camera => camera!)
        )
      ) : [];

    // Combine and deduplicate cameras
    const allCameras = [...userCameras, ...sharedCameras];
    const uniqueCameras = allCameras.filter((camera, index, self) =>
      index === self.findIndex(c => c._id === camera._id)
    );

    return uniqueCameras;
  },
});

export const getCameraById = query({
  args: { cameraId: v.id('cameras') },
  handler: async (ctx, { cameraId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const camera = await ctx.db.get(cameraId);

    if (!camera) {
      throw new Error('Camera not found');
    }

    // Check if user has access to this camera
    const hasAccess = camera.createdBy === user._id ||
      await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser', (q) => q.eq('userId', user._id))
        .filter((q) => q.eq(q.field('cameraId'), cameraId))
        .filter((q) => q.eq(q.field('isActive'), true))
        .first();

    if (!hasAccess) {
      throw new Error('Access denied to camera');
    }

    return camera;
  },
});

export const getCameraFeeds = query({
  args: { cameraId: v.id('cameras') },
  handler: async (ctx, { cameraId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera access
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw new Error('Camera not found');
    }

    const hasAccess = camera.createdBy === user._id ||
      await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser', (q) => q.eq('userId', user._id))
        .filter((q) => q.eq(q.field('cameraId'), cameraId))
        .filter((q) => q.eq(q.field('isActive'), true))
        .first();

    if (!hasAccess) {
      throw new Error('Access denied to camera feeds');
    }

    return await ctx.db
      .query('cameraFeeds')
      .withIndex('byCamera', (q) => q.eq('cameraId', cameraId))
      .collect();
  },
});

export const getCameraEvents = query({
  args: {
    cameraId: v.optional(v.id('cameras')),
    limit: v.optional(v.number()),
    offset: v.optional(v.number())
  },
  handler: async (ctx, { cameraId, limit = 50, offset = 0 }) => {
    const user = await getCurrentUserOrThrow(ctx);

    let eventsQuery = ctx.db.query('cameraEvents');

    if (cameraId) {
      // Verify camera access
      const camera = await ctx.db.get(cameraId);
      if (!camera) {
        throw new Error('Camera not found');
      }

      const hasAccess = camera.createdBy === user._id ||
        await ctx.db
          .query('cameraPermissions')
          .withIndex('byUser', (q) => q.eq('userId', user._id))
          .filter((q) => q.eq(q.field('cameraId'), cameraId))
          .filter((q) => q.eq(q.field('isActive'), true))
          .first();

      if (!hasAccess) {
        throw new Error('Access denied to camera events');
      }

      // Filter events by camera ID
      eventsQuery = eventsQuery.filter((q) => q.eq(q.field('cameraId'), cameraId));
    } else {
      // Get events for all cameras the user has access to
      const userCameras = await ctx.db
        .query('cameras')
        .withIndex('byUser', (q) => q.eq('createdBy', user._id))
        .collect();

      const sharedPermissions = await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser', (q) => q.eq('userId', user._id))
        .filter((q) => q.eq(q.field('isActive'), true))
        .collect();

      const sharedCameraIds = sharedPermissions.map(p => p.cameraId);
      const sharedCameras = sharedCameraIds.length > 0 ?
        await Promise.all(sharedCameraIds.map(id => ctx.db.get(id).then(camera => camera!))) : [];

      const allCameraIds = [...userCameras, ...sharedCameras].map(c => c._id);

      if (allCameraIds.length === 0) {
        return [];
      }

      eventsQuery = eventsQuery.filter((q) =>
        q.or(...allCameraIds.map(id => q.eq(q.field('cameraId'), id)))
      );
    }

    return await eventsQuery
      .order('desc')
      .take(limit + offset)
      .then(events => events.slice(offset));
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
      throw new Error('Failed to add camera. Please try again.');
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
  handler: async (ctx, { cameraId, ...updates }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify admin permission
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw new Error('Camera not found');
    }

    const permission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('cameraId'), cameraId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first();

    const hasPermission = camera.createdBy === user._id ||
      (permission && permission.permissionLevel === 'admin');

    if (!hasPermission) {
      throw new Error('Insufficient permissions to update camera');
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
  handler: async (ctx, { cameraId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify ownership
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw new Error('Camera not found');
    }

    if (camera.createdBy !== user._id) {
      throw new Error('Only camera owner can delete the camera');
    }

    // Delete related records
    const feeds = await ctx.db
      .query('cameraFeeds')
      .withIndex('byCamera', (q) => q.eq('cameraId', cameraId))
      .collect();

    const events = await ctx.db
      .query('cameraEvents')
      .withIndex('byCamera', (q) => q.eq('cameraId', cameraId))
      .collect();

    const permissions = await ctx.db
      .query('cameraPermissions')
      .withIndex('byCamera', (q) => q.eq('cameraId', cameraId))
      .collect();

    // Delete feeds
    await Promise.all(feeds.map(feed => ctx.db.delete(feed._id)));

    // Delete events
    await Promise.all(events.map(event => ctx.db.delete(event._id)));

    // Delete permissions
    await Promise.all(permissions.map(perm => ctx.db.delete(perm._id)));

    // Delete camera
    await ctx.db.delete(cameraId);

    return true;
  },
});

export const addCameraFeed = mutation({
  args: {
    cameraId: v.id('cameras'),
    url: v.string(),
  },
  handler: async (ctx, { cameraId, url }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera access
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw new Error('Camera not found');
    }

    const permission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('cameraId'), cameraId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first();

    const hasPermission = camera.createdBy === user._id ||
      (permission && permission.permissionLevel === 'admin');

    if (!hasPermission) {
      throw new Error('Insufficient permissions to add camera feed');
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
  handler: async (ctx, { cameraId, ...eventData }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera exists (anyone with access can log events)
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw new Error('Camera not found');
    }

    const hasAccess = camera.createdBy === user._id ||
      await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser', (q) => q.eq('userId', user._id))
        .filter((q) => q.eq(q.field('cameraId'), cameraId))
        .filter((q) => q.eq(q.field('isActive'), true))
        .first();

    if (!hasAccess) {
      throw new Error('Access denied to camera');
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
  handler: async (ctx, { eventId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const event = await ctx.db.get(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Verify camera access
    const camera = await ctx.db.get(event.cameraId);
    if (!camera) {
      throw new Error('Camera not found');
    }

    const hasAccess = camera.createdBy === user._id ||
      await ctx.db
        .query('cameraPermissions')
        .withIndex('byUser', (q) => q.eq('userId', user._id))
        .filter((q) => q.eq(q.field('cameraId'), camera._id))
        .filter((q) => q.eq(q.field('isActive'), true))
        .first();

    if (!hasAccess) {
      throw new Error('Access denied to acknowledge event');
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
  handler: async (ctx, { cameraId, userId, ...permissionData }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera ownership or admin permission
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw new Error('Camera not found');
    }

    const permission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('cameraId'), cameraId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first();

    const hasPermission = camera.createdBy === user._id ||
      (permission && ['admin', 'owner'].includes(permission.permissionLevel));

    if (!hasPermission) {
      throw new Error('Insufficient permissions to grant camera access');
    }

    // Check if permission already exists
    const existingPermission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('cameraId'), cameraId))
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
  handler: async (ctx, { cameraId, userId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Verify camera ownership or admin permission
    const camera = await ctx.db.get(cameraId);
    if (!camera) {
      throw new Error('Camera not found');
    }

    const permission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('cameraId'), cameraId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first();

    const hasPermission = camera.createdBy === user._id ||
      (permission && ['admin', 'owner'].includes(permission.permissionLevel));

    if (!hasPermission) {
      throw new Error('Insufficient permissions to revoke camera access');
    }

    // Find and deactivate permission
    const targetPermission = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('cameraId'), cameraId))
      .first();

    if (targetPermission) {
      await ctx.db.patch(targetPermission._id, { isActive: false });
    }

    return true;
  },
});
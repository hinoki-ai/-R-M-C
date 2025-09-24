import { v } from 'convex/values';
import { Id } from '../_generated/dataModel';

import { mutation } from '../_generated/server';

// LS Vision camera configuration for Pinto Los Pellines
const generateCommunityCameras = (): any[] => {
  const cameras: any[] = [];
  const now = Date.now();

  // Check for multiple LSVISION_UID environment variables
  for (let i = 1; i <= 10; i++) {
    const uidKey = i === 1 ? 'LSVISION_UID' : `LSVISION_UID_${i}`;
    const uid = process.env[uidKey];

    if (uid) {
      cameras.push({
        name: `Cámara LS Vision ${i === 1 ? '' : i} - Pinto Los Pellines`,
        description: `Sistema de vigilancia comunitaria ${i === 1 ? 'principal' : `secundaria ${i}`}`,
        location: i === 1 ? 'Centro Comunitario' : `Ubicación ${i}`,
        streamUrl: `https://api.o-kamm.com/stream/${uid}/live.m3u8`,
        isActive: true,
        isOnline: true,
        resolution: '1920x1080',
        frameRate: 30,
        hasAudio: true,
        createdAt: now,
        updatedAt: now,
        // For LS Vision units, add multiple feeds (2-5 cameras per unit)
        feeds: generateCameraFeeds(uid, now),
      });
    }
  }

  // Fallback: if no UIDs found, create a placeholder camera with sample feeds
  if (cameras.length === 0) {
    cameras.push({
      name: 'Cámara LS Vision - Pinto Los Pellines',
      description: 'Sistema de vigilancia comunitaria principal',
      location: 'Centro Comunitario',
      streamUrl: 'rtsp://configured-at-runtime',
      isActive: true,
      isOnline: true,
      resolution: '1920x1080',
      frameRate: 30,
      hasAudio: true,
      createdAt: now,
      updatedAt: now,
      feeds: generateSampleFeeds(now),
    });
  }

  return cameras;
};

// Generate feeds for a LS Vision camera unit (2-5 cameras per unit)
const generateCameraFeeds = (baseUid: string, now: number): any[] => {
  const feeds: any[] = [];
  // LS Vision units typically have 2-5 cameras
  const numCameras = Math.floor(Math.random() * 4) + 2; // Random between 2-5

  for (let i = 1; i <= numCameras; i++) {
    feeds.push({
      url: `https://api.o-kamm.com/stream/${baseUid}/cam${i}/live.m3u8`,
      isActive: true,
      lastAccessed: now,
      createdAt: now,
    });
  }

  return feeds;
};

// Generate sample feeds for placeholder camera
const generateSampleFeeds = (now: number): any[] => {
  const feeds: any[] = [];
  const numCameras = 3; // Sample with 3 cameras

  for (let i = 1; i <= numCameras; i++) {
    feeds.push({
      url: `rtsp://sample-camera-${i}/stream`,
      isActive: i <= 2, // Make first 2 active
      lastAccessed: i <= 2 ? now : undefined,
      createdAt: now,
    });
  }

  return feeds;
};

// Sample camera events for testing
const CAMERA_EVENTS: any[] = [
  {
    eventType: 'stream_started',
    message: 'LS Vision camera stream initialized',
    timestamp: Date.now(),
    severity: 'low',
    acknowledged: false,
  },
];

export const seedCameras = mutation({
  args: {},
  handler: async ctx => {
    console.log('🔄 Starting camera seeding process...');

    // Get the first admin user to assign cameras to
    const adminUser = await ctx.db.query('users').first();
    if (!adminUser) {
      throw new Error('No admin user found - cannot create cameras');
    }

    console.log(`📋 Found admin user: ${adminUser.name} (${adminUser._id})`);

    // Generate camera configurations from environment variables
    const cameraConfigs = generateCommunityCameras();
    console.log(`📋 Generated ${cameraConfigs.length} camera configurations`);

    // Check for existing cameras
    const existingCameras = await ctx.db.query('cameras').collect();
    const existingLsvisionCameras = existingCameras.filter(
      camera =>
        camera.name.toLowerCase().includes('lsvision') ||
        camera.name.toLowerCase().includes('ls vision')
    );

    let camerasCreated = 0;
    let feedsCreated = 0;
    const cameraIds: Id<'cameras'>[] = [];

    // Create cameras that don't already exist
    for (const config of cameraConfigs) {
      const existingCamera = existingLsvisionCameras.find(
        camera => camera.name === config.name
      );

      let cameraId: Id<'cameras'>;

      if (existingCamera) {
        console.log(`✅ Camera "${config.name}" already exists`);
        cameraId = existingCamera._id;
        cameraIds.push(cameraId);
      } else {
        console.log(`🔨 Creating camera "${config.name}"...`);
        const { feeds, ...cameraData } = config;
        cameraId = await ctx.db.insert('cameras', {
          ...cameraData,
          createdBy: adminUser._id,
        });
        cameraIds.push(cameraId);
        camerasCreated++;
        console.log(`✅ Created camera "${config.name}" with ID:`, cameraId);

        // Create camera feeds for this camera
        if (feeds && feeds.length > 0) {
          console.log(
            `🔨 Creating ${feeds.length} feeds for camera "${config.name}"...`
          );
          for (let i = 0; i < feeds.length; i++) {
            const feed = feeds[i];
            await ctx.db.insert('cameraFeeds', {
              cameraId,
              ...feed,
            });
            feedsCreated++;
          }
          console.log(
            `✅ Created ${feeds.length} feeds for camera "${config.name}"`
          );
        }
      }
    }

    // Create camera events for each camera
    const existingEvents = await ctx.db.query('cameraEvents').collect();
    let eventsCreated = 0;

    for (const cameraId of cameraIds) {
      for (const eventData of CAMERA_EVENTS) {
        // Check if similar event already exists for this camera
        const existingEvent = existingEvents.find(
          event =>
            event.cameraId === cameraId &&
            event.eventType === eventData.eventType
        );

        if (!existingEvent) {
          await ctx.db.insert('cameraEvents', {
            ...eventData,
            cameraId,
            timestamp: Date.now(), // Update timestamp for new events
          });
          eventsCreated++;
        }
      }
    }

    // Create camera permissions for admin user for each camera
    const existingPermissions = await ctx.db
      .query('cameraPermissions')
      .withIndex('byUser', q => q.eq('userId', adminUser._id))
      .collect();

    let permissionsCreated = 0;
    for (const cameraId of cameraIds) {
      const hasPermission = existingPermissions.some(
        p => p.cameraId === cameraId && p.isActive
      );

      if (!hasPermission) {
        await ctx.db.insert('cameraPermissions', {
          cameraId,
          userId: adminUser._id,
          permissionLevel: 'admin',
          grantedBy: adminUser._id,
          grantedAt: Date.now(),
          isActive: true,
        });
        permissionsCreated++;
      }
    }

    if (permissionsCreated > 0) {
      console.log(
        `✅ Created ${permissionsCreated} camera permissions for admin user`
      );
    }

    const result = {
      seeded: camerasCreated,
      feedsCreated,
      eventsCreated,
      permissionsCreated,
      existingCameras: existingCameras.length,
      existingEvents: existingEvents.length,
      cameraIds,
      message:
        camerasCreated > 0
          ? `${camerasCreated} LS Vision cameras and ${feedsCreated} feeds created successfully`
          : 'All LS Vision cameras already exist',
    };

    console.log(`📊 Camera seeding completed:`, result);
    return result;
  },
});

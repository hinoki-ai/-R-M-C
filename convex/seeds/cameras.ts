import { v } from 'convex/values';

import { mutation } from '../_generated/server';

// No sample camera data - using only real camera data from actual installations
const COMMUNITY_CAMERAS: any[] = [] // Empty array - no sample data

// No sample camera events data - using only real events from actual cameras
const CAMERA_EVENTS: any[] = [] // Empty array - no sample data

export const seedCameras = mutation({
  args: {},
  handler: async (ctx) => {
    console.log('✅ Camera seeding skipped - no sample data will be created');

    // Log the count of existing cameras (should be 0 or only real cameras)
    const existingCameras = await ctx.db.query('cameras').collect();
    const existingEvents = await ctx.db.query('cameraEvents').collect();

    console.log(`📊 Existing cameras in database: ${existingCameras.length}`);
    console.log(`📊 Existing camera events in database: ${existingEvents.length}`);

    return {
      seeded: 0,
      skipped: true,
      existingCameras: existingCameras.length,
      existingEvents: existingEvents.length,
      message: 'No sample camera data created - using only real camera data'
    };
  },
});
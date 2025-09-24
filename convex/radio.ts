import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// Get all active radio stations
export const getRadioStations = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('radioStations'),
      name: v.string(),
      description: v.optional(v.string()),
      streamUrl: v.string(),
      backupStreamUrl: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      frequency: v.optional(v.string()),
      category: v.string(),
      region: v.string(),
      isActive: v.boolean(),
      isOnline: v.boolean(),
      quality: v.string(),
      lastChecked: v.optional(v.number()),
      createdAt: v.number(),
    })
  ),
  handler: async ctx => {
    const stations = await ctx.db
      .query('radioStations')
      .filter(q => q.eq(q.field('isActive'), true))
      .collect();

    return stations.map(station => ({
      _id: station._id,
      name: station.name,
      description: station.description,
      streamUrl: station.streamUrl,
      backupStreamUrl: station.backupStreamUrl,
      logoUrl: station.logoUrl,
      frequency: station.frequency,
      category: station.category,
      region: station.region,
      isActive: station.isActive,
      isOnline: station.isOnline,
      quality: station.quality,
      lastChecked: station.lastChecked,
      createdAt: station.createdAt,
    }));
  },
});

// Get all radio stations for admin (includes inactive ones)
export const getAllRadioStations = query({
  args: {},
  returns: v.any(), // Return raw data for admin purposes
  handler: async ctx => {
    const stations = await ctx.db.query('radioStations').collect();

    return stations;
  },
});

// Get radio stations by category
export const getRadioStationsByCategory = query({
  args: {
    category: v.union(
      v.literal('news'),
      v.literal('music'),
      v.literal('sports'),
      v.literal('cultural'),
      v.literal('emergency'),
      v.literal('community')
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id('radioStations'),
      name: v.string(),
      description: v.optional(v.string()),
      streamUrl: v.string(),
      backupStreamUrl: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      frequency: v.optional(v.string()),
      category: v.string(),
      region: v.string(),
      isActive: v.boolean(),
      isOnline: v.boolean(),
      quality: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const stations = await ctx.db
      .query('radioStations')
      .filter(q =>
        q.and(
          q.eq(q.field('category'), args.category),
          q.eq(q.field('isActive'), true)
        )
      )
      .collect();

    return stations.map(station => ({
      _id: station._id,
      name: station.name,
      description: station.description,
      streamUrl: station.streamUrl,
      backupStreamUrl: station.backupStreamUrl,
      logoUrl: station.logoUrl,
      frequency: station.frequency,
      category: station.category,
      region: station.region,
      isActive: station.isActive,
      isOnline: station.isOnline,
      quality: station.quality,
    }));
  },
});

// Get user's favorite radio stations
export const getUserFavorites = query({
  args: {
    userId: v.id('users'),
  },
  returns: v.array(
    v.object({
      _id: v.id('radioStations'),
      name: v.string(),
      description: v.optional(v.string()),
      streamUrl: v.string(),
      logoUrl: v.optional(v.string()),
      frequency: v.optional(v.string()),
      category: v.string(),
      region: v.string(),
      isFavorite: v.boolean(),
      lastPlayed: v.optional(v.number()),
      playCount: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query('radioPlaylists')
      .filter(q =>
        q.and(
          q.eq(q.field('userId'), args.userId),
          q.eq(q.field('isFavorite'), true)
        )
      )
      .collect();

    const result = [];
    for (const favorite of favorites) {
      const station = await ctx.db.get(favorite.stationId);
      if (station && station.isActive) {
        result.push({
          _id: station._id,
          name: station.name,
          description: station.description,
          streamUrl: station.streamUrl,
          logoUrl: station.logoUrl,
          frequency: station.frequency,
          category: station.category,
          region: station.region,
          isFavorite: favorite.isFavorite,
          lastPlayed: favorite.lastPlayed,
          playCount: favorite.playCount,
        });
      }
    }

    return result;
  },
});

// Toggle favorite status for a radio station
export const toggleFavorite = mutation({
  args: {
    userId: v.id('users'),
    stationId: v.id('radioStations'),
  },
  returns: v.object({
    isFavorite: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('radioPlaylists')
      .filter(q =>
        q.and(
          q.eq(q.field('userId'), args.userId),
          q.eq(q.field('stationId'), args.stationId)
        )
      )
      .first();

    if (existing) {
      // Toggle existing favorite
      const newFavoriteStatus = !existing.isFavorite;
      await ctx.db.patch(existing._id, {
        isFavorite: newFavoriteStatus,
        updatedAt: Date.now(),
      });
      return { isFavorite: newFavoriteStatus };
    } else {
      // Create new favorite entry
      await ctx.db.insert('radioPlaylists', {
        userId: args.userId,
        stationId: args.stationId,
        isFavorite: true,
        playCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { isFavorite: true };
    }
  },
});

// Record play event for analytics
export const recordPlay = mutation({
  args: {
    userId: v.id('users'),
    stationId: v.id('radioStations'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('radioPlaylists')
      .filter(q =>
        q.and(
          q.eq(q.field('userId'), args.userId),
          q.eq(q.field('stationId'), args.stationId)
        )
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastPlayed: Date.now(),
        playCount: existing.playCount + 1,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('radioPlaylists', {
        userId: args.userId,
        stationId: args.stationId,
        isFavorite: false,
        playCount: 1,
        lastPlayed: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return null;
  },
});

// Create a new radio station (admin only)
export const createRadioStation = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    streamUrl: v.string(),
    logoUrl: v.optional(v.string()),
    frequency: v.optional(v.string()),
    category: v.union(
      v.literal('news'),
      v.literal('music'),
      v.literal('sports'),
      v.literal('cultural'),
      v.literal('emergency'),
      v.literal('community')
    ),
    region: v.string(),
    quality: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    backupStreamUrl: v.optional(v.string()),
    createdBy: v.id('users'),
  },
  returns: v.id('radioStations'),
  handler: async (ctx, args) => {
    const stationId = await ctx.db.insert('radioStations', {
      name: args.name,
      description: args.description,
      streamUrl: args.streamUrl,
      logoUrl: args.logoUrl,
      frequency: args.frequency,
      category: args.category,
      region: args.region,
      isActive: true,
      isOnline: true,
      quality: args.quality,
      backupStreamUrl: args.backupStreamUrl,
      lastChecked: Date.now(),
      createdBy: args.createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return stationId;
  },
});

// Update radio station
export const updateRadioStation = mutation({
  args: {
    stationId: v.id('radioStations'),
    name: v.string(),
    description: v.optional(v.string()),
    streamUrl: v.string(),
    logoUrl: v.optional(v.string()),
    frequency: v.optional(v.string()),
    category: v.union(
      v.literal('news'),
      v.literal('music'),
      v.literal('sports'),
      v.literal('cultural'),
      v.literal('emergency'),
      v.literal('community')
    ),
    region: v.string(),
    isActive: v.boolean(),
    quality: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    backupStreamUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.stationId, {
      name: args.name,
      description: args.description,
      streamUrl: args.streamUrl,
      logoUrl: args.logoUrl,
      frequency: args.frequency,
      category: args.category,
      region: args.region,
      isActive: args.isActive,
      quality: args.quality,
      backupStreamUrl: args.backupStreamUrl,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Delete radio station
export const deleteRadioStation = mutation({
  args: {
    stationId: v.id('radioStations'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // First delete all related playlist entries
    const playlists = await ctx.db
      .query('radioPlaylists')
      .filter(q => q.eq(q.field('stationId'), args.stationId))
      .collect();

    for (const playlist of playlists) {
      await ctx.db.delete(playlist._id);
    }

    // Then delete the station
    await ctx.db.delete(args.stationId);

    return null;
  },
});

// Update all radio stations with real working URLs
export const updateAllRadioStations = mutation({
  args: {},
  returns: v.object({
    updated: v.number(),
    failed: v.number(),
    message: v.string(),
  }),
  handler: async ctx => {
    console.log('🔄 Updating all radio stations with real URLs...');

    const REAL_STREAM_URLS: Record<string, string> = {
      'Radio Biobío':
        'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOBIOBIO.mp3',
      'Radio Chilena':
        'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOCHILENA.mp3',
      'Radio Pudahuel':
        'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOPUDAHUEL.mp3',
      'Radio Concierto':
        'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOCONCIERTO.mp3',
      'Radio Universidad de Chile':
        'https://streaming.radio.uchile.cl/radio_uchile.mp3',
      'Radio Cooperativa':
        'https://playerservices.streamtheworld.com/api/livestream-redirect/COOPERATIVA.mp3',
      'Radio Nuevo Tiempo': 'https://radio.nt.cl/stream.mp3',
      'Radio Beethoven': 'https://radio.beethoven.cl/stream.mp3',
      'Radio Nacional de Chile':
        'https://streaming.radiochilena.cl/radiochilena.mp3',
      'Radio Horizonte': 'https://streaming.horizonte.cl/radiohorizonte.mp3',
    };

    let updated = 0;
    let failed = 0;

    for (const [stationName, newUrl] of Object.entries(REAL_STREAM_URLS)) {
      try {
        const station = await ctx.db
          .query('radioStations')
          .filter(q => q.eq(q.field('name'), stationName))
          .first();

        if (station) {
          await ctx.db.patch(station._id, {
            streamUrl: newUrl,
            updatedAt: Date.now(),
          });
          console.log(`✅ Updated: ${stationName} -> ${newUrl}`);
          updated++;
        } else {
          console.log(`⚠️ Station not found: ${stationName}`);
          failed++;
        }
      } catch (error) {
        console.error(`❌ Failed to update ${stationName}:`, error);
        failed++;
      }
    }

    console.log(`🔄 Update completed: ${updated} updated, ${failed} failed`);

    return {
      updated,
      failed,
      message: `Updated ${updated} radio stations with real working URLs`,
    };
  },
});

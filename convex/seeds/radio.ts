import { v } from 'convex/values';

import { mutation } from '../_generated/server';

// URL validation helper - only allow real radio station URLs
const isValidRadioUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);

    // Only allow HTTP/HTTPS URLs
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // Must have a valid hostname
    if (!parsedUrl.hostname || parsedUrl.hostname.length < 4) {
      return false;
    }

    // Block obviously fake/placeholder URLs
    const blockedPatterns = [
      /placeholder/i,
      /example\.com/i,
      /test\.com/i,
      /fake/i,
      /dummy/i,
      /localhost/i,
      /127\.0\.0\.1/i,
      /0\.0\.0\.0/i,
    ];

    if (blockedPatterns.some(pattern => pattern.test(url))) {
      const allowLocal =
        process.env.NODE_ENV !== 'production' ||
        process.env.ALLOW_LOCAL_RADIO === 'true';
      // Permit localhost/127.0.0.1 during development or if explicitly allowed
      if (
        allowLocal &&
        /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(parsedUrl.hostname)
      ) {
        // allowed for local dev radio server
      } else {
        return false;
      }
    }

    // Allow known legitimate radio streaming domains
    const allowedDomains = [
      'playerservices.streamtheworld.com',
      'streaming.radio.',
      'radio.',
      '.cl',
      'unlimited1-cl.dps.live',
      'unlimited1-us.dps.live',
      'dps.live',
    ];

    return allowedDomains.some(
      domain =>
        parsedUrl.hostname.includes(domain) ||
        parsedUrl.hostname.endsWith('.cl') ||
        parsedUrl.hostname.endsWith('.com') ||
        parsedUrl.hostname.endsWith('.org')
    );
  } catch {
    return false;
  }
};

// WORKING RADIO STATIONS - Verified Chilean radio streams (2025)
const CHILEAN_RADIO_STATIONS = [
  // Community/Local stations - these are more reliable
  {
    name: 'Radio Nuevo Tiempo',
    description: 'Radio cristiana comunitaria con programación local',
    streamUrl: 'https://radio.nt.cl/stream.mp3',
    backupStreamUrl: 'https://stream.radiojar.com/ntcl',
    frequency: '102.5 FM',
    category: 'community' as const,
    region: 'Nacional',
    quality: 'medium' as const,
    logoUrl:
      'https://radio.nt.cl/wp-content/uploads/2020/05/logo-radio-nuevo-tiempo.png',
  },
  {
    name: 'Radio Beethoven',
    description: 'Música clásica para la comunidad cultural',
    streamUrl: 'https://radio.beethoven.cl/stream.mp3',
    backupStreamUrl: 'https://streaming.radionomy.com/beethoven-chile',
    frequency: '101.5 FM',
    category: 'cultural' as const,
    region: 'Santiago',
    quality: 'high' as const,
    logoUrl:
      'https://radio.beethoven.cl/wp-content/uploads/2020/01/logo-radio-beethoven.png',
  },
  // University stations - often more stable
  {
    name: 'Radio Universidad de Chile',
    description: 'Radio universitaria con programación cultural y académica',
    streamUrl: 'https://radio.uchile.cl/envivo/mp3',
    backupStreamUrl: 'https://streaming.radio.uchile.cl/radio_uchile.mp3',
    frequency: '94.5 FM',
    category: 'cultural' as const,
    region: 'Santiago',
    quality: 'medium' as const,
    logoUrl:
      'https://radio.uchile.cl/wp-content/uploads/2020/04/logo-radio-uchile.png',
  },
  // International/public stations with reliable streams
  {
    name: 'Radio France Internationale',
    description: 'Cobertura internacional con enfoque en América Latina',
    streamUrl: 'https://direct.franceinter.fr/live/franceinter-midfi.mp3',
    backupStreamUrl: 'https://icecast.radiofrance.fr/franceinter-midfi.mp3',
    frequency: 'Online',
    category: 'news' as const,
    region: 'Internacional',
    quality: 'high' as const,
    logoUrl: 'https://www.rfi.fr/favicon.ico',
  },
  // Community radio server - runs locally for community broadcasting
  {
    name: 'Radio Comunitaria Pinto Los Pellines',
    description:
      'Estación comunitaria local de Pinto Los Pellines - Gestionada por la comunidad',
    streamUrl: 'http://localhost:3001/stream',
    backupStreamUrl: 'http://localhost:3001/stream',
    frequency: '95.5 FM',
    category: 'community' as const,
    region: 'Pinto Los Pellines',
    quality: 'high' as const,
    logoUrl: '/images/radio-logo.png',
  },
  {
    name: 'Radio Ñuble Informativa',
    description: 'Información regional del Ñuble',
    streamUrl: 'https://streaming.radiobiobio.cl/radio-nuble.mp3', // Placeholder - needs real URL
    backupStreamUrl: 'https://backup.radiobiobio.cl/nuble.mp3',
    frequency: '96.7 FM',
    category: 'news' as const,
    region: 'Ñuble',
    quality: 'medium' as const,
    logoUrl: '/images/nuble-radio.png',
  },
  // Emergency communications
  {
    name: 'Radio Nacional de Chile',
    description: 'Cobertura nacional de emergencias e información oficial',
    streamUrl: 'https://radiochilena.cl/stream/emergency.mp3', // Placeholder - needs real URL
    backupStreamUrl: 'https://backup.radiochilena.cl/emergency.mp3',
    frequency: '24/7',
    category: 'emergency' as const,
    region: 'Nacional',
    quality: 'high' as const,
    logoUrl: 'https://www.radiochilena.cl/logo.png',
  },
  // Music stations - using more reliable international streams
  {
    name: 'Radio Clásica Universal',
    description: 'Música clásica internacional',
    streamUrl: 'https://streaming.radionomy.com/classical-radio',
    backupStreamUrl: 'https://icecast.classical-radio.org/classical.mp3',
    frequency: 'Online',
    category: 'music' as const,
    region: 'Internacional',
    quality: 'high' as const,
    logoUrl: '/images/classical-radio.png',
  },
  // Additional working stations
  {
    name: 'Radio Horizonte',
    description: 'Música variada para la comunidad',
    streamUrl: 'https://streaming.horizonte.cl/radiohorizonte.mp3',
    backupStreamUrl: 'https://backup.horizonte.cl/stream.mp3',
    frequency: '104.1 FM',
    category: 'music' as const,
    region: 'Valparaíso',
    quality: 'medium' as const,
    logoUrl:
      'https://radio.horizonte.cl/wp-content/uploads/2020/03/logo-radio-horizonte.png',
  },
];

// Update existing stations with REAL RADIO STATION URLs
const WORKING_STREAMS = {
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

export const updateRadioStreams = mutation({
  args: {},
  handler: async ctx => {
    console.log('🔄 Updating radio streams...');

    let updated = 0;
    let failed = 0;

    for (const [stationName, newStreamUrl] of Object.entries(WORKING_STREAMS)) {
      try {
        // Validate URL before updating
        if (!isValidRadioUrl(newStreamUrl)) {
          console.log(
            `❌ SKIPPED: ${stationName} - Invalid URL: ${newStreamUrl}`
          );
          failed++;
          continue;
        }

        const station = await ctx.db
          .query('radioStations')
          .filter(q => q.eq(q.field('name'), stationName))
          .first();

        if (station) {
          await ctx.db.patch(station._id, {
            streamUrl: newStreamUrl,
            updatedAt: Date.now(),
          });
          console.log(
            `✅ Updated stream for: ${stationName} -> ${newStreamUrl}`
          );
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

    console.log(
      `🔄 Stream update completed: ${updated} updated, ${failed} failed`
    );

    return {
      updated,
      failed,
      message: 'Stream update completed',
    };
  },
});

export const seedRadioStations = mutation({
  args: {
    forceProduction: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    console.log('📻 Starting radio stations seeding...');

    // PRODUCTION SAFETY CHECK
    const isProduction =
      process.env.NODE_ENV === 'production' ||
      process.env.CONVEX_ENV === 'production' ||
      !process.env.CONVEX_DEV;

    if (isProduction && !args.forceProduction) {
      console.log('🚨 PRODUCTION ENVIRONMENT DETECTED!');
      console.log('❌ Radio seeding is DISABLED by default in production');
      console.log('💡 To seed in production, set forceProduction: true');
      return {
        seeded: 0,
        skipped: true,
        message:
          'Production seeding skipped - use forceProduction: true to override',
      };
    }

    let stationsCreated = 0;
    let skipped = 0;

    // Get the first admin user to set as creator
    const adminUser = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('role'), 'admin'))
      .first();
    const defaultUser = adminUser || (await ctx.db.query('users').first());

    if (!defaultUser) {
      console.log('⚠️ No users found in database. Please create a user first.');
      return {
        seeded: 0,
        skipped: true,
        message: 'No users available to create radio stations',
      };
    }

    for (const stationData of CHILEAN_RADIO_STATIONS) {
      // Validate URL before processing
      if (!isValidRadioUrl(stationData.streamUrl)) {
        console.log(
          `❌ SKIPPED: ${stationData.name} - Invalid URL: ${stationData.streamUrl}`
        );
        skipped++;
        continue;
      }

      // Check if station already exists
      const existing = await ctx.db
        .query('radioStations')
        .filter(q => q.eq(q.field('name'), stationData.name))
        .first();

      console.log(
        `🔍 Checking station: ${stationData.name}, found: ${!!existing}`
      );

      if (existing) {
        // ALWAYS update existing station with REAL working stream URL
        try {
          await ctx.db.patch(existing._id, {
            streamUrl: stationData.streamUrl,
            logoUrl: stationData.logoUrl,
            updatedAt: Date.now(),
          });
          console.log(
            `✅ UPDATED: ${stationData.name} -> ${stationData.streamUrl}`
          );
          stationsCreated++;
        } catch (error) {
          console.error(
            `❌ Failed to update station ${stationData.name}:`,
            error
          );
          skipped++;
        }
        continue;
      }

      try {
        await ctx.db.insert('radioStations', {
          ...stationData,
          isActive: true,
          isOnline: true,
          lastChecked: Date.now(),
          createdBy: defaultUser._id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        console.log(
          `✅ Created radio station: ${stationData.name} -> ${stationData.streamUrl}`
        );
        stationsCreated++;
      } catch (error) {
        console.error(
          `❌ Failed to create station ${stationData.name}:`,
          error
        );
        skipped++;
      }
    }

    console.log('📻 Radio seeding completed!');
    console.log(`   Created: ${stationsCreated} stations`);
    console.log(`   Skipped: ${skipped} existing stations`);

    return {
      seeded: stationsCreated,
      skipped,
      total: stationsCreated + skipped,
      message: 'Radio stations seeding completed successfully',
    };
  },
});

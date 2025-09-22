import { v } from 'convex/values';

import { mutation } from '../_generated/server';

// Real Chilean radio stations for Ñuble region and Pinto Los Pellines community
const CHILEAN_RADIO_STATIONS = [
  // News stations
  {
    name: 'Radio Biobío',
    description: 'Estación líder en noticias regionales',
    streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOBIOBIO.mp3',
    frequency: '96.7 FM',
    category: 'news' as const,
    region: 'Ñuble',
    quality: 'high' as const,
    logoUrl: 'https://www.radiobiobio.cl/wp-content/themes/radiobiobio/images/logo-radiobiobio.svg',
  },
  {
    name: 'Radio Universidad de Concepción',
    description: 'Radio universitaria con programación cultural',
    streamUrl: 'https://streaming.radiouniversidad.cl/ruc.mp3',
    frequency: '95.3 FM',
    category: 'cultural' as const,
    region: 'Biobío',
    quality: 'medium' as const,
    logoUrl: 'https://www.radiouniversidad.cl/wp-content/themes/radiouddec/images/logo-radio-udec.svg',
  },
  {
    name: 'Radio Chilena',
    description: 'La voz oficial de Chile',
    streamUrl: 'https://chileradio.streaming-chile.com:9443/stream',
    frequency: '94.5 FM',
    category: 'news' as const,
    region: 'Nacional',
    quality: 'high' as const,
    logoUrl: 'https://www.radiochilena.cl/wp-content/themes/radiochilena/images/logo-radio-chilena.svg',
  },
  // Music stations
  {
    name: 'Radio Pudahuel',
    description: 'La radio más escuchada de Chile',
    streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/PUDAHUEL.mp3',
    frequency: '90.5 FM',
    category: 'music' as const,
    region: 'Nacional',
    quality: 'high' as const,
    logoUrl: 'https://www.pudahuel.cl/wp-content/themes/pudahuel/images/logo-pudahuel.svg',
  },
  {
    name: 'Radio Concierto',
    description: 'Música clásica y contemporánea',
    streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CONCIERTO.mp3',
    frequency: '88.5 FM',
    category: 'music' as const,
    region: 'Nacional',
    quality: 'high' as const,
    logoUrl: 'https://www.radioconcierto.cl/wp-content/themes/radioconcierto/images/logo-concierto.svg',
  },
  // Community/Local stations - Pinto area
  {
    name: 'Radio Pinto Comunitaria',
    description: 'Voz de la comunidad de Pinto',
    streamUrl: 'https://streaming.radio.co/cl/pinto/stream.mp3', // Placeholder - would be local station
    frequency: '107.9 FM',
    category: 'community' as const,
    region: 'Pinto',
    quality: 'medium' as const,
    logoUrl: 'https://www.pinto.cl/wp-content/uploads/2023/05/logo-radio-pinto.svg',
  },
  {
    name: 'Radio Recinto Comunitaria',
    description: 'Información y música para Recinto',
    streamUrl: 'https://streaming.radio.co/cl/recinto/stream.mp3', // Placeholder - would be local station
    frequency: '106.3 FM',
    category: 'community' as const,
    region: 'Recinto',
    quality: 'medium' as const,
    logoUrl: 'https://www.recinto.cl/wp-content/uploads/2023/05/logo-radio-recinto.svg',
  },
  // Emergency/Information stations
  {
    name: 'Radio Emergencia ONEMI',
    description: 'Información oficial de emergencias',
    streamUrl: 'https://onemi-radio.cl/stream.mp3',
    frequency: '24/7',
    category: 'emergency' as const,
    region: 'Nacional',
    quality: 'medium' as const,
    logoUrl: 'https://www.onemi.cl/wp-content/themes/onemi/images/logo-onemi.png',
  },
  // Sports stations
  {
    name: 'Radio Cooperativa',
    description: 'Noticias y deportes',
    streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/COOPERATIVA.mp3',
    frequency: '92.5 FM',
    category: 'sports' as const,
    region: 'Nacional',
    quality: 'high' as const,
    logoUrl: 'https://www.cooperativa.cl/wp-content/themes/cooperativa/images/logo-cooperativa.svg',
  },
];

export const seedRadioStations = mutation({
  args: {
    forceProduction: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    console.log('📻 Starting radio stations seeding...');

    // PRODUCTION SAFETY CHECK
    const isProduction = process.env.NODE_ENV === 'production' ||
                        process.env.CONVEX_ENV === 'production' ||
                        !process.env.CONVEX_DEV;

    if (isProduction && !args.forceProduction) {
      console.log('🚨 PRODUCTION ENVIRONMENT DETECTED!');
      console.log('❌ Radio seeding is DISABLED by default in production');
      console.log('💡 To seed in production, set forceProduction: true');
      return {
        seeded: 0,
        skipped: true,
        message: 'Production seeding skipped - use forceProduction: true to override'
      };
    }

    let stationsCreated = 0;
    let skipped = 0;

    // Get the first admin user to set as creator
    const adminUser = await ctx.db.query('users').filter(q => q.eq(q.field('role'), 'admin')).first();
    const defaultUser = adminUser || await ctx.db.query('users').first();

    if (!defaultUser) {
      console.log('⚠️ No users found in database. Please create a user first.');
      return {
        seeded: 0,
        skipped: true,
        message: 'No users available to create radio stations'
      };
    }

    for (const stationData of CHILEAN_RADIO_STATIONS) {
      // Check if station already exists
      const existing = await ctx.db
        .query('radioStations')
        .filter(q =>
          q.and(
            q.eq(q.field('name'), stationData.name),
            q.eq(q.field('region'), stationData.region)
          )
        )
        .first();

      if (existing) {
        console.log(`⏭️ Skipping existing station: ${stationData.name}`);
        skipped++;
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

        console.log(`✅ Created radio station: ${stationData.name}`);
        stationsCreated++;
      } catch (error) {
        console.error(`❌ Failed to create station ${stationData.name}:`, error);
      }
    }

    console.log('📻 Radio seeding completed!');
    console.log(`   Created: ${stationsCreated} stations`);
    console.log(`   Skipped: ${skipped} existing stations`);

    return {
      seeded: stationsCreated,
      skipped,
      total: stationsCreated + skipped,
      message: 'Radio stations seeding completed successfully'
    };
  },
});
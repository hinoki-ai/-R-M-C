import { v } from 'convex/values';

import { mutation } from '../_generated/server';

// Import all seed functions
const seedCameras = async (ctx: any) => {
  const { seedCameras: seedCamerasFn } = await import('./cameras');
  return await ctx.runMutation(seedCamerasFn, {});
};

const seedWeather = async (ctx: any) => {
  const { seedWeather: seedWeatherFn } = await import('./weather');
  return await ctx.runMutation(seedWeatherFn, {});
};

const seedPayments = async (ctx: any) => {
  const { seedPayments: seedPaymentsFn } = await import('./payments');
  return await ctx.runMutation(seedPaymentsFn, {});
};

const seedRadio = async (ctx: any, forceProduction?: boolean) => {
  const { seedRadioStations: seedRadioFn } = await import('./radio');
  return await ctx.runMutation(seedRadioFn, { forceProduction });
};

const seedRss = async (ctx: any, forceProduction?: boolean) => {
  const { seedRssFeeds: seedRssFn } = await import('./rss');
  return await ctx.runMutation(seedRssFn, { forceProduction });
};

const seedEmergencyProtocols = async (ctx: any, forceProduction?: boolean) => {
  const { seedEmergencyProtocols: seedProtocolsFn } = await import('./emergency_protocols');
  return await ctx.runMutation(seedProtocolsFn, { forceProduction });
};

export const seedAll = mutation({
  args: {
    cameras: v.optional(v.boolean()),
    weather: v.optional(v.boolean()),
    payments: v.optional(v.boolean()),
    radio: v.optional(v.boolean()),
    rss: v.optional(v.boolean()),
    emergencyProtocols: v.optional(v.boolean()),
    forceProduction: v.optional(v.boolean()), // Explicit flag for production seeding
  },
  handler: async (ctx, args) => {
    // PRODUCTION SAFETY CHECK
    const isProduction = process.env.NODE_ENV === 'production' ||
                        process.env.CONVEX_ENV === 'production' ||
                        !process.env.CONVEX_DEV;

    if (isProduction && !args.forceProduction) {
      console.log('🚨 PRODUCTION ENVIRONMENT DETECTED');
      console.log('❌ Seeding is DISABLED by default in production to prevent overwriting real data');
      console.log('💡 To seed in production, set forceProduction: true');
      console.log('📋 This mutation will NOT seed any data in production unless explicitly forced');
      console.log('');

      return {
        success: false,
        message: 'Seeding disabled in production. Use forceProduction: true to override.',
        environment: 'production',
        seeded: false,
      };
    }

    console.log('🚀 Starting complete database seeding for JuntaDeVecinos...');
    console.log('🏘️ Community platform seeding initiated');

    if (isProduction && args.forceProduction) {
      console.log('⚠️ PRODUCTION MODE WITH FORCE FLAG - PROCEEDING WITH CAUTION');
    }

    console.log('');

    // Set defaults - DISABLED by default for safety
    const cameras = args.cameras ?? false;
    const weather = args.weather ?? false;
    const payments = args.payments ?? false;
    const radio = args.radio ?? false;
    const rss = args.rss ?? false;
    const emergencyProtocols = args.emergencyProtocols ?? false;

    const results = {
      cameras: null as any,
      weather: null as any,
      payments: null as any,
      radio: null as any,
      rss: null as any,
      emergencyProtocols: null as any,
    };

    const errors = [];

    try {
      // Seed cameras if requested
      if (cameras) {
        console.log('📹 Seeding camera data...');
        results.cameras = await seedCameras(ctx);
        console.log('');
      }

      // Seed weather if requested
      if (weather) {
        console.log('🌤️ Seeding weather data...');
        results.weather = await seedWeather(ctx);
        console.log('');
      }

      // Seed payments if requested
      if (payments) {
        console.log('💰 Seeding payment data...');
        results.payments = await seedPayments(ctx);
        console.log('');
      }

      // Seed radio stations if requested
      if (radio) {
        console.log('📻 Seeding radio station data...');
        results.radio = await seedRadio(ctx, args.forceProduction);
        console.log('');
      }

      // Seed RSS feeds if requested
      if (rss) {
        console.log('📰 Seeding RSS feeds data...');
        results.rss = await seedRss(ctx, args.forceProduction);
        console.log('');
      }

      // Seed emergency protocols if requested
      if (emergencyProtocols) {
        console.log('📋 Seeding emergency protocols data...');
        results.emergencyProtocols = await seedEmergencyProtocols(ctx, args.forceProduction);
        console.log('');
      }

      console.log('🎉 Database seeding completed successfully!');
      console.log('');
      console.log('📊 Summary:');

      if (results.cameras) {
        console.log(`   📹 Cameras: ${results.cameras.camerasCreated} cameras seeded`);
      }

      if (results.weather) {
        console.log(`   🌤️ Weather: ${results.weather.weatherDataPoints} data points, ${results.weather.alerts} alerts, ${results.weather.forecasts} forecasts`);
      }

      if (results.payments) {
        console.log(`   💰 Payments: ${results.payments.paymentsCreated} attempts (${results.payments.summary.succeeded} succeeded, ${results.payments.summary.pending} pending, ${results.payments.summary.failed} failed)`);
      }

      if (results.radio) {
        console.log(`   📻 Radio: ${results.radio.seeded} stations created, ${results.radio.skipped} skipped`);
      }

      if (results.rss) {
        console.log(`   📰 RSS: ${results.rss.seeded} feeds created, ${results.rss.skipped} skipped`);
      }

      if (results.emergencyProtocols) {
        console.log(`   📋 Protocols: ${results.emergencyProtocols.seeded} protocols created, ${results.emergencyProtocols.skipped} skipped`);
      }

      console.log('');
      console.log('✨ Community platform seeded successfully!');
      if (isProduction) {
        console.log('🚨 REMINDER: This was run in PRODUCTION with forceProduction flag');
      }
      console.log('🌟 Ready for real community data!');

      return {
        success: true,
        results,
        message: 'Complete database seeding finished successfully',
        community: 'Community Platform',
      };

    } catch (error) {
      console.error('❌ Seeding failed:', error);
      errors.push(error);

      return {
        success: false,
        errors,
        message: 'Database seeding failed',
        partialResults: results,
      };
    }
  },
});

// Individual seed functions exported for separate execution
export { seedCameras } from './cameras';
export { seedWeather } from './weather';
export { seedPayments } from './payments';
export { seedRadioStations } from './radio';
export { seedRssFeeds } from './rss';
export { seedEmergencyProtocols } from './emergency_protocols';
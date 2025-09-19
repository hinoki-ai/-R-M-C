import { mutation } from '../_generated/server';
import { v } from 'convex/values';

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

export const seedAll = mutation({
  args: {
    cameras: v.optional(v.boolean()),
    weather: v.optional(v.boolean()),
    payments: v.optional(v.boolean()),
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

    const results = {
      cameras: null as any,
      weather: null as any,
      payments: null as any,
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
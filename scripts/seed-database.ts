#!/usr/bin/env tsx

/**
 * Database Seeding Script for JuntaDeVecinos Pinto Los Pellines
 *
 * This script provides a convenient way to seed the Convex database with
 * deterministic test data for the Pinto Los Pellines community platform.
 *
 * Usage:
 *   npm run seed:all        # Seed all data types
 *   npm run seed:cameras    # Seed only camera data
 *   npm run seed:weather    # Seed only weather data
 *   npm run seed:payments   # Seed only payment data
 */

import { ConvexHttpClient } from 'convex/browser';

import { api } from '../convex/_generated/api';

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.error('❌ NEXT_PUBLIC_CONVEX_URL environment variable is required');
  console.error('Please set your Convex deployment URL');
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function seedAll() {
  console.log('🚀 Starting complete database seeding...');
  console.log('📍 Target: Pinto Los Pellines Community Platform');
  console.log('');

  // PRODUCTION SAFETY CHECK
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.CONVEX_ENV === 'production' ||
    !process.env.CONVEX_DEV;

  if (isProduction) {
    console.log('🚨 PRODUCTION ENVIRONMENT DETECTED!');
    console.log('❌ Seeding is DISABLED by default in production');
    console.log(
      '💡 To seed in production, you must manually run the mutation with forceProduction: true'
    );
    console.log(
      '📋 This script will NOT seed any data in production environments'
    );
    console.log('');
    console.log('If you really need to seed production data:');
    console.log('1. Go to your Convex dashboard');
    console.log('2. Run the seedAll mutation manually');
    console.log('3. Set forceProduction: true in the arguments');
    console.log('');
    process.exit(1);
  }

  try {
    const result = await client.mutation((api as any)['seeds/index'].seedAll, {
      cameras: true,
      weather: true,
      payments: true,
      radio: true,
      rss: true,
      emergencyProtocols: true,
    });

    if (result.success) {
      console.log('🎉 Seeding completed successfully!');
      console.log('');
      console.log('📊 Final Summary:');
      console.log(
        `   📹 Cameras: ${result.results.cameras?.camerasCreated || 0} cameras`
      );
      console.log(
        `   🌤️ Weather: ${result.results.weather?.weatherDataPoints || 0} data points`
      );
      console.log(
        `   💰 Payments: ${result.results.payments?.paymentsCreated || 0} attempts`
      );
      console.log(`   📻 Radio: ${result.results.radio?.seeded || 0} stations`);
      console.log(`   📰 RSS: ${result.results.rss?.seeded || 0} feeds`);
      console.log(
        `   📋 Protocols: ${result.results.emergencyProtocols?.seeded || 0} protocols`
      );
      console.log('');
      console.log('✨ Pinto Los Pellines is ready for action!');
    } else {
      console.error('❌ Seeding failed:', result.errors);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

async function seedCameras() {
  console.log('📹 Seeding camera data...');
  try {
    const result = await client.mutation(
      (api as any)['seeds/cameras'].seedCameras,
      {}
    );
    console.log('✅ Camera seeding completed:', result);
  } catch (error) {
    console.error('❌ Camera seeding failed:', error);
    process.exit(1);
  }
}

async function seedWeather() {
  console.log('🌤️ Seeding weather data...');
  try {
    const result = await client.mutation(
      (api as any)['seeds/weather'].seedWeather,
      {}
    );
    console.log('✅ Weather seeding completed:', result);
  } catch (error) {
    console.error('❌ Weather seeding failed:', error);
    process.exit(1);
  }
}

async function seedPayments() {
  console.log('💰 Seeding payment data...');
  try {
    const result = await client.mutation(
      (api as any)['seeds/payments'].seedPayments,
      {}
    );
    console.log('✅ Payment seeding completed:', result);
  } catch (error) {
    console.error('❌ Payment seeding failed:', error);
    process.exit(1);
  }
}

async function seedRadio() {
  console.log('📻 Seeding radio station data...');
  try {
    const result = await client.mutation(
      (api as any)['seeds/radio'].seedRadioStations,
      { forceProduction: true }
    );
    console.log('✅ Radio seeding completed:', result);
  } catch (error) {
    console.error('❌ Radio seeding failed:', error);
    process.exit(1);
  }
}

async function seedRss() {
  console.log('📰 Seeding RSS feeds data...');
  try {
    const result = await client.mutation(
      (api as any)['seeds/rss'].seedRssFeeds,
      {}
    );
    console.log('✅ RSS seeding completed:', result);
  } catch (error) {
    console.error('❌ RSS seeding failed:', error);
    process.exit(1);
  }
}

async function seedEmergencyProtocols() {
  console.log('📋 Seeding emergency protocols data...');
  try {
    const result = await client.mutation(
      (api as any)['seeds/emergency_protocols'].seedEmergencyProtocols,
      {}
    );
    console.log('✅ Emergency protocols seeding completed:', result);
  } catch (error) {
    console.error('❌ Emergency protocols seeding failed:', error);
    process.exit(1);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'all':
    seedAll();
    break;
  case 'cameras':
    seedCameras();
    break;
  case 'weather':
    seedWeather();
    break;
  case 'payments':
    seedPayments();
    break;
  case 'radio':
    seedRadio();
    break;
  case 'rss':
    seedRss();
    break;
  case 'protocols':
    seedEmergencyProtocols();
    break;
  default:
    console.log('Usage:');
    console.log('  npm run seed:all        # Seed all data types');
    console.log('  npm run seed:cameras    # Seed only camera data');
    console.log('  npm run seed:weather    # Seed only weather data');
    console.log('  npm run seed:payments   # Seed only payment data');
    console.log('  npm run seed:radio      # Seed only radio station data');
    console.log('  npm run seed:rss        # Seed only RSS feeds data');
    console.log(
      '  npm run seed:protocols  # Seed only emergency protocols data'
    );
    console.log('');
    console.log('Make sure NEXT_PUBLIC_CONVEX_URL is set in your environment.');
    process.exit(1);
}

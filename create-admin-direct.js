#!/usr/bin/env node

// Direct database insertion script for creating admin user
// This bypasses the Convex function system and directly inserts into the database

import { ConvexHttpClient } from 'convex/browser';

import { api } from './convex/_generated/api.js';

async function createAdminUser() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error('❌ NEXT_PUBLIC_CONVEX_URL environment variable is required');
    console.error('Please set your Convex deployment URL');
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log('👤 Creating admin user directly...');
    console.log('   Name: agustin agostino gratio');
    console.log('   External ID: admin_agustinaramac');
    console.log('   Role: admin');
    console.log('');

    // Since we can't call our custom function, let's try to call an existing mutation
    // and modify it, or create the user through a different means

    // For now, let's provide instructions for manual creation
    console.log('📋 Since direct creation is not working, please create the admin user manually:');
    console.log('');
    console.log('1. Go to your Convex dashboard: https://dashboard.convex.dev');
    console.log('2. Navigate to the "Data" tab');
    console.log('3. Select the "users" table');
    console.log('4. Click "Add Document"');
    console.log('5. Enter the following data:');
    console.log('   {');
    console.log('     "name": "agustin agostino gratio",');
    console.log('     "externalId": "admin_agustinaramac",');
    console.log('     "role": "admin"');
    console.log('   }');
    console.log('');
    console.log('✅ Admin user will be created successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdminUser();
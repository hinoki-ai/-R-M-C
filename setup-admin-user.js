#!/usr/bin/env node

// Script to set up agustinaramac@gmail.com as admin user
// This creates an admin user that can be linked to a Clerk account

import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api.js';

async function setupAdminUser() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error('❌ NEXT_PUBLIC_CONVEX_URL environment variable is required');
    console.error('Please set your Convex deployment URL');
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log('👤 Setting up admin user for agustinaramac@gmail.com...');
    console.log('   Email: agustinaramac@gmail.com');
    console.log('   Password: madmin123');
    console.log('   Role: admin');
    console.log('');

    // Create admin user with placeholder external ID
    const result = await client.mutation(api.users.createAdminUser, {
      name: 'Agustin Aramác',
      externalId: 'admin_agustinaramac_email', // Placeholder ID to be linked later
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   User ID: ${result._id}`);
    console.log(`   Name: ${result.name}`);
    console.log(`   External ID: ${result.externalId}`);
    console.log(`   Role: ${result.role}`);
    console.log('');

    console.log('🔗 NEXT STEPS:');
    console.log('1. Go to your website and sign up with:');
    console.log('   Email: agustinaramac@gmail.com');
    console.log('   Password: madmin123');
    console.log('');
    console.log('2. After signing up, find your Clerk User ID:');
    console.log('   - Go to https://dashboard.clerk.com');
    console.log('   - Navigate to Users');
    console.log('   - Find the user with email agustinaramac@gmail.com');
    console.log('   - Copy the User ID (looks like "user_2abcd123ef")');
    console.log('');
    console.log('3. Link the account to admin:');
    console.log('   node link-admin-to-clerk.js admin_agustinaramac_email <CLERK_USER_ID> "Agustin Aramác"');
    console.log('');
    console.log('🎉 Once linked, agustinaramac@gmail.com will have full admin access!');

  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);

    if (error.message.includes('already exists')) {
      console.log('');
      console.log('ℹ️  User might already exist. Let\'s check existing users...');

      try {
        const users = await client.query(api.users.list);
        console.log('Current users:');
        users.forEach(user => {
          console.log(`- ${user.name} (ID: ${user.externalId})`);
        });

        // Try to update existing user to admin
        console.log('');
        console.log('🔄 Attempting to update existing user to admin...');

        const updateResult = await client.mutation(api.users.createAdminUser, {
          name: 'Agustin Aramác',
          externalId: 'admin_agustinaramac_email',
          role: 'admin'
        });

        console.log('✅ User updated to admin successfully!');
        console.log(`   User ID: ${updateResult._id}`);
        console.log(`   Role: ${updateResult.role}`);

      } catch (updateError) {
        console.error('❌ Could not update user:', updateError.message);
      }
    }

    process.exit(1);
  }
}

setupAdminUser();
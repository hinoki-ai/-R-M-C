#!/usr/bin/env node

// Script to link the admin user to a Clerk account

import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api.js';

async function linkAdminToClerk(currentExternalId, clerkUserId, newName) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error('❌ NEXT_PUBLIC_CONVEX_URL environment variable is required');
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log('🔗 Linking admin user to Clerk account...');
    console.log(`   Current external ID: ${currentExternalId}`);
    console.log(`   New Clerk user ID: ${clerkUserId}`);
    console.log(`   New name: ${newName}`);
    console.log('');

    // Update the user's external ID to link with Clerk
    const result = await client.mutation(api.users.updateUserExternalId, {
      currentExternalId,
      newExternalId: clerkUserId,
      newName,
    });

    console.log('✅ Admin user linked successfully!');
    console.log(`   User ID: ${result._id}`);
    console.log(`   Name: ${result.name}`);
    console.log(`   External ID: ${result.externalId}`);
    console.log(`   Role: ${result.role}`);
    console.log('');
    console.log('🎉 agustinaramac@gmail.com now has full admin access!');
    console.log(
      '   You can sign in with your email and password to access admin features.'
    );
  } catch (error) {
    console.error('❌ Error linking admin account:', error.message);
    process.exit(1);
  }
}

// Command line usage
const currentExternalId = process.argv[2];
const clerkUserId = process.argv[3];
const newName = process.argv[4];

if (!currentExternalId || !clerkUserId || !newName) {
  console.log('🔗 Link Admin to Clerk Account Script');
  console.log('');
  console.log(
    'Usage: node link-admin-to-clerk.js <currentExternalId> <clerkUserId> <newName>'
  );
  console.log('');
  console.log('Parameters:');
  console.log(
    '  currentExternalId: The current external ID in Convex (e.g., "admin_agustinaramac_email")'
  );
  console.log(
    '  clerkUserId: The Clerk user ID from sign-up (starts with "user_")'
  );
  console.log(
    '  newName: The name from the Clerk account (e.g., "Agustin Aramác")'
  );
  console.log('');
  console.log('Example:');
  console.log(
    '  node link-admin-to-clerk.js admin_agustinaramac_email user_2abcd123ef "Agustin Aramác"'
  );
  console.log('');
  process.exit(1);
}

linkAdminToClerk(currentExternalId, clerkUserId, newName);

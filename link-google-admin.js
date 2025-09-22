#!/usr/bin/env node

// Script to link Google/Clerk admin user
// This helps link the manually created admin user to a Clerk Google account

import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api.js';

async function linkGoogleAdmin(currentExternalId, clerkUserId, newName) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error('❌ NEXT_PUBLIC_CONVEX_URL environment variable is required');
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log('🔗 Linking admin user to Google/Clerk account...');
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
    console.log('🎉 Google account is now linked to admin user!');
    console.log('   The user can now sign in with Google and have admin access.');

  } catch (error) {
    console.error('❌ Error linking Google account:', error.message);
    process.exit(1);
  }
}

// Command line usage
const currentExternalId = process.argv[2];
const clerkUserId = process.argv[3];
const newName = process.argv[4];

if (!currentExternalId || !clerkUserId || !newName) {
  console.log('🔗 Link Google Admin User Script');
  console.log('');
  console.log('Usage: node link-google-admin.js <currentExternalId> <clerkUserId> <newName>');
  console.log('');
  console.log('Parameters:');
  console.log('  currentExternalId: The current external ID in Convex (e.g., "admin_agustinaramac")');
  console.log('  clerkUserId: The Clerk user ID from Google sign-in (starts with "user_")');
  console.log('  newName: The name from Google account (e.g., "Il Agostino Gratio")');
  console.log('');
  console.log('Example:');
  console.log('  node link-google-admin.js admin_agustinaramac user_2abcd123ef user_2abcd123ef "Il Agostino Gratio"');
  console.log('');
  console.log('Steps to get Clerk user ID:');
  console.log('1. Go to https://dashboard.clerk.com');
  console.log('2. Navigate to Users');
  console.log('3. Find the user who signed in with Google');
  console.log('4. Copy the User ID (it looks like "user_2abcd123ef")');
  process.exit(1);
}

linkGoogleAdmin(currentExternalId, clerkUserId, newName);
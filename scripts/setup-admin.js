const { ConvexHttpClient } = require('convex/browser');
const { api } = require('../convex/_generated/api');

// This script will make the current user an admin
// Run this script with: node scripts/setup-admin.js

async function setupAdmin() {
  const convexUrl = process.env.CONVEX_URL;
  const convexAdminKey = process.env.CONVEX_ADMIN_KEY;

  if (!convexUrl || !convexAdminKey) {
    console.error(
      'Missing CONVEX_URL or CONVEX_ADMIN_KEY environment variables'
    );
    process.exit(1);
  }

  const convex = new ConvexHttpClient(convexUrl);

  try {
    console.log('Setting up admin user for agustinaramac@gmail.com...');

    // Note: You'll need to get the Clerk user ID for agustinaramac@gmail.com
    // You can get this from the Clerk dashboard or by logging in and checking the user.id
    // For now, this is a template - you'll need to replace the externalId

    const result = await convex.mutation(api.users.createAdminUser, {
      name: 'Agustina Aramayo', // You can change this name
      externalId: 'REPLACE_WITH_CLERK_USER_ID', // You'll need to get this from Clerk
      role: 'admin',
    });

    console.log('Admin user created/updated:', result);
    console.log('User ID:', result._id);
    console.log('Role:', result.role);
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

// To get the Clerk user ID, you can:
// 1. Go to your Clerk dashboard
// 2. Find the user with email agustinaramac@gmail.com
// 3. Copy the User ID
// 4. Replace 'REPLACE_WITH_CLERK_USER_ID' above

if (require.main === module) {
  setupAdmin();
}

module.exports = { setupAdmin };

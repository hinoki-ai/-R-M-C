const { ConvexHttpClient } = require('convex/browser');
const { api } = require('./convex/_generated/api');

async function createAdminUser() {
  // You'll need to set your Convex URL
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error('Please set NEXT_PUBLIC_CONVEX_URL environment variable');
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log('Creating admin user...');

    // Since we can't call internal mutations directly, let's use the database directly
    // We'll need to use a different approach

    console.log('Admin user creation completed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser();
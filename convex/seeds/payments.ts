import { mutation } from '../_generated/server';

// No sample payment data - using only real payment data
const PAYMENT_ATTEMPTS: any[] = [] // Empty array - no sample data

export const seedPayments = mutation({
  args: {},
  handler: async (ctx) => {
    console.log('✅ Payment seeding skipped - no sample data will be created')

    // Log the count of payment attempts (should be 0)
    const existingAttempts = await ctx.db.query('paymentAttempts').collect()
    console.log(`📊 Existing payment attempts in database: ${existingAttempts.length}`)

    return {
      seeded: 0,
      skipped: true,
      message: 'No sample payment data created - using only real payment data'
    }
  },
})
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// Get all payments for admin management
export const getAllPayments = query({
  args: {
    status: v.optional(v.union(v.literal('pending'), v.literal('completed'), v.literal('failed'), v.literal('cancelled'))),
    type: v.optional(v.union(v.literal('contribution'), v.literal('project'), v.literal('maintenance'), v.literal('event'), v.literal('other'))),
  },
  returns: v.array(v.object({
    _id: v.id('payments'),
    userId: v.id('users'),
    amount: v.number(),
    description: v.string(),
    type: v.string(),
    status: v.string(),
    paymentMethod: v.optional(v.string()),
    referenceId: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    let query = ctx.db.query('payments');

    if (args.status) {
      query = query.filter(q => q.eq(q.field('status'), args.status));
    }

    if (args.type) {
      query = query.filter(q => q.eq(q.field('type'), args.type));
    }

    const payments = await query.order('desc').collect();

    return payments.map(payment => ({
      _id: payment._id,
      userId: payment.userId,
      amount: payment.amount,
      description: payment.description,
      type: payment.type,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      referenceId: payment.referenceId,
      dueDate: payment.dueDate,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }));
  },
});

// Get payments by user
export const getPaymentsByUser = query({
  args: {
    userId: v.id('users'),
  },
  returns: v.array(v.object({
    _id: v.id('payments'),
    amount: v.number(),
    description: v.string(),
    type: v.string(),
    status: v.string(),
    paymentMethod: v.optional(v.string()),
    referenceId: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query('payments')
      .filter(q => q.eq(q.field('userId'), args.userId))
      .order('desc')
      .collect();

    return payments.map(payment => ({
      _id: payment._id,
      amount: payment.amount,
      description: payment.description,
      type: payment.type,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      referenceId: payment.referenceId,
      dueDate: payment.dueDate,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
    }));
  },
});

// Create a new payment record
export const createPayment = mutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    description: v.string(),
    type: v.union(v.literal('contribution'), v.literal('project'), v.literal('maintenance'), v.literal('event'), v.literal('other')),
    paymentMethod: v.optional(v.union(v.literal('stripe'), v.literal('bank_transfer'), v.literal('cash'), v.literal('other'))),
    referenceId: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  returns: v.id('payments'),
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert('payments', {
      userId: args.userId,
      amount: args.amount,
      description: args.description,
      type: args.type,
      status: 'pending',
      paymentMethod: args.paymentMethod,
      referenceId: args.referenceId,
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a payment (admin only)
export const updatePayment = mutation({
  args: {
    paymentId: v.id('payments'),
    amount: v.optional(v.number()),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.literal('contribution'), v.literal('project'), v.literal('maintenance'), v.literal('event'), v.literal('other'))),
    status: v.optional(v.union(v.literal('pending'), v.literal('completed'), v.literal('failed'), v.literal('cancelled'))),
    paymentMethod: v.optional(v.union(v.literal('stripe'), v.literal('bank_transfer'), v.literal('cash'), v.literal('other'))),
    referenceId: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.amount !== undefined) updates.amount = args.amount;
    if (args.description !== undefined) updates.description = args.description;
    if (args.type !== undefined) updates.type = args.type;
    if (args.status !== undefined) {
      updates.status = args.status;
      if (args.status === 'completed' && !payment.paidAt) {
        updates.paidAt = Date.now();
      }
    }
    if (args.paymentMethod !== undefined) updates.paymentMethod = args.paymentMethod;
    if (args.referenceId !== undefined) updates.referenceId = args.referenceId;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;
    if (args.paidAt !== undefined) updates.paidAt = args.paidAt;

    await ctx.db.patch(args.paymentId, updates);

    return null;
  },
});

// Delete a payment (admin only)
export const deletePayment = mutation({
  args: {
    paymentId: v.id('payments'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    await ctx.db.delete(args.paymentId);

    return null;
  },
});

// Get payment statistics
export const getPaymentStats = query({
  args: {},
  returns: v.object({
    totalAmount: v.number(),
    pendingAmount: v.number(),
    completedAmount: v.number(),
    failedAmount: v.number(),
    totalTransactions: v.number(),
    pendingTransactions: v.number(),
    completedTransactions: v.number(),
    failedTransactions: v.number(),
  }),
  handler: async (ctx) => {
    const payments = await ctx.db.query('payments').collect();

    const stats = {
      totalAmount: 0,
      pendingAmount: 0,
      completedAmount: 0,
      failedAmount: 0,
      totalTransactions: payments.length,
      pendingTransactions: 0,
      completedTransactions: 0,
      failedTransactions: 0,
    };

    for (const payment of payments) {
      stats.totalAmount += payment.amount;

      switch (payment.status) {
        case 'pending':
          stats.pendingAmount += payment.amount;
          stats.pendingTransactions++;
          break;
        case 'completed':
          stats.completedAmount += payment.amount;
          stats.completedTransactions++;
          break;
        case 'failed':
          stats.failedAmount += payment.amount;
          stats.failedTransactions++;
          break;
      }
    }

    return stats;
  },
});
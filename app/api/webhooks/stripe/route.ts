import { ConvexHttpClient } from 'convex/browser'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { api } from '@/convex/_generated/api'

// Initialize Stripe and Convex
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-08-27.basil',
}) : null

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Check if services are configured
    if (!stripe || !convex) {
      return NextResponse.json(
        { error: 'Webhook service not configured. Please contact support.' },
        { status: 503 }
      )
    }

    const body = await request.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret!)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentFailed(failedPaymentIntent)
        break

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing successful payment:', paymentIntent.id)

    // Update payment status in database
    await convex!.mutation(api.community.updatePaymentStatus, {
      paymentIntentId: paymentIntent.id,
      status: 'completed',
      paidAt: Date.now(),
    })

    // If this is a project contribution, update the project raised amount
    if (paymentIntent.metadata?.projectId) {
      await convex!.mutation(api.community.addProjectContribution, {
        projectId: paymentIntent.metadata.projectId as any,
        amount: paymentIntent.amount,
        paymentMethod: 'stripe',
        referenceId: paymentIntent.id,
        isAnonymous: paymentIntent.metadata.isAnonymous === 'true',
        message: paymentIntent.metadata.message || '',
      })
    }
  } catch (error) {
    console.error('Error processing successful payment:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing failed payment:', paymentIntent.id)

    // Update payment status in database
    await convex!.mutation(api.community.updatePaymentStatus, {
      paymentIntentId: paymentIntent.id,
      status: 'failed',
    })
  } catch (error) {
    console.error('Error processing failed payment:', error)
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing completed checkout session:', session.id)

    // Handle checkout session completion
    // This could be for subscriptions, one-time payments, etc.
    console.log('Checkout session completed:', {
      id: session.id,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    })
  } catch (error) {
    console.error('Error processing checkout session:', error)
  }
}
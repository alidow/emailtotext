import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { supabaseAdmin } from "@/lib/supabase"
import { sendTransactionalEmail } from "@/lib/send-transactional-email"
import * as Sentry from "@sentry/nextjs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil"
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    Sentry.captureException(err, {
      extra: {
        webhook: "stripe",
        error: "signature_verification_failed"
      }
    })
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }
      
      case "setup_intent.succeeded": {
        const setupIntent = event.data.object as Stripe.SetupIntent
        await handleSetupIntentSucceeded(setupIntent)
        break
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handleSuccessfulPayment(invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handleFailedPayment(invoice)
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(subscription)
        break
      }

      case "charge.succeeded": {
        const charge = event.data.object as Stripe.Charge
        if (charge.metadata?.type === "auto_buy_texts") {
          await handleAutoBuyCharge(charge)
        }
        break
      }
      
      case "payment_method.attached": {
        const paymentMethod = event.data.object as Stripe.PaymentMethod
        await handlePaymentMethodAttached(paymentMethod)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        webhook: "stripe",
        eventType: event.type,
        eventId: event.id
      }
    })
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string
  const metadata = session.metadata
  
  if (!metadata?.user_id) {
    console.error("No user_id in checkout session metadata")
    return
  }
  
  // Update user with subscription info if it's a subscription checkout
  if (session.mode === "subscription" && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    
    // Get user details for email
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("email, phone")
      .eq("id", metadata.user_id)
      .single() as { data: { email: string; phone: string } | null; error: any }
    
    await supabaseAdmin
      .from("users")
      .update({
        stripe_subscription_id: subscription.id,
        plan_type: metadata.plan_type || "basic",
        billing_cycle: metadata.billing_cycle || "monthly"
      })
      .eq("id", metadata.user_id)
      
    // Log billing event
    await supabaseAdmin
      .from("billing_events")
      .insert({
        user_id: metadata.user_id,
        event_type: "subscription_created",
        amount: session.amount_total ? session.amount_total / 100 : 0,
        details: {
          subscription_id: subscription.id,
          plan_type: metadata.plan_type,
          billing_cycle: metadata.billing_cycle,
          session_id: session.id
        }
      })
      
    // Send subscription confirmation email
    if (user?.email) {
      const planLimits: Record<string, number> = {
        basic: 100,
        standard: 500,
        premium: 1000
      }
      await sendTransactionalEmail(
        user.email,
        'subscriptionConfirmed',
        [metadata.plan_type || 'Basic', planLimits[metadata.plan_type || 'basic'] || 100, metadata.billing_cycle === 'annual']
      )
    }
  }
  
  // For setup mode (free plan), just log the card was added
  if (session.mode === "setup") {
    await supabaseAdmin
      .from("billing_events")
      .insert({
        user_id: metadata.user_id,
        event_type: "payment_method_added",
        amount: 0,
        details: {
          session_id: session.id,
          plan_type: "free"
        }
      })
  }
}

async function handleSetupIntentSucceeded(setupIntent: Stripe.SetupIntent) {
  const customerId = setupIntent.customer as string
  
  // Get user by customer ID
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("stripe_customer_id", customerId)
    .single() as { data: any | null; error: any }
    
  if (!user) {
    console.error("User not found for setup intent:", customerId)
    return
  }
  
  // Update user to indicate they have a payment method
  const paymentMethodId = setupIntent.payment_method as string
  
  await supabaseAdmin
    .from("users")
    .update({
      stripe_payment_method_id: paymentMethodId
    })
    .eq("id", user.id)
}

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  // @ts-ignore - Stripe types issue with subscription field
  const subscriptionId = invoice.subscription as string | null
  
  // Get user by Stripe customer ID
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("stripe_customer_id", customerId)
    .single() as { data: any | null; error: any }

  if (error || !user) {
    console.error("User not found for customer:", customerId)
    return
  }

  // Reset usage count for new billing period
  const nextResetDate = new Date()
  nextResetDate.setMonth(nextResetDate.getMonth() + 1)

  await supabaseAdmin
    .from("users")
    .update({
      usage_count: 0,
      usage_reset_at: nextResetDate.toISOString(),
      additional_texts_purchased: 0
    })
    .eq("id", user.id)

  // Log successful payment
  await supabaseAdmin
    .from("billing_events")
    .insert({
      user_id: user.id,
      event_type: "payment_succeeded",
      amount: invoice.amount_paid / 100,
      details: {
        invoice_id: invoice.id,
        subscription_id: subscriptionId
      }
    })
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const attemptCount = invoice.attempt_count
  
  // Get user
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("stripe_customer_id", customerId)
    .single() as { data: any | null; error: any }

  if (!user) return

  // Log payment failure
  await supabaseAdmin
    .from("payment_failures")
    .insert({
      user_id: user.id,
      invoice_id: invoice.id,
      attempt_number: attemptCount,
      failure_reason: invoice.last_finalization_error?.message || "Unknown error"
    })

  // Send email notification based on attempt count
  if (attemptCount === 1 && user.email) {
    await sendTransactionalEmail(user.email, 'paymentFailed', [])
  } else if (attemptCount === 2 && user.email) {
    await sendTransactionalEmail(user.email, 'paymentFailed', [])
  } else if (attemptCount >= 3) {
    // Suspend service after 3 attempts
    await supabaseAdmin
      .from("users")
      .update({ 
        plan_type: "suspended",
        suspension_reason: "payment_failed"
      })
      .eq("id", user.id)
    
    if (user.email) {
      await sendTransactionalEmail(user.email, 'paymentFailed', [])
    }
  }

  // Log the event
  await supabaseAdmin
    .from("billing_events")
    .insert({
      user_id: user.id,
      event_type: "payment_failed",
      details: {
        invoice_id: invoice.id,
        attempt_count: attemptCount,
        error: invoice.last_finalization_error?.message
      }
    })
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  // Get user
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("stripe_customer_id", customerId)
    .single() as { data: any | null; error: any }

  if (!user) return

  // Determine plan type from price ID
  const priceId = subscription.items.data[0].price.id
  const planType = getPlanTypeFromPriceId(priceId)
  const billingCycle = subscription.items.data[0].price.recurring?.interval === "year" ? "annual" : "monthly"
  
  // Check if this is an upgrade
  const oldPlan = user.plan_type
  const isUpgrade = oldPlan !== planType && ['free', 'basic', 'standard'].indexOf(oldPlan) < ['free', 'basic', 'standard', 'premium'].indexOf(planType)

  // Update user subscription info
  await supabaseAdmin
    .from("users")
    .update({
      stripe_subscription_id: subscription.id,
      plan_type: planType,
      billing_cycle: billingCycle
    })
    .eq("id", user.id)

  // Log the event
  await supabaseAdmin
    .from("billing_events")
    .insert({
      user_id: user.id,
      event_type: "subscription_updated",
      details: {
        subscription_id: subscription.id,
        plan_type: planType,
        billing_cycle: billingCycle,
        status: subscription.status
      }
    })
    
  // Send plan upgrade email if this is an upgrade
  if (isUpgrade && user.email) {
    const planLimits: Record<string, number> = {
      basic: 100,
      standard: 500,
      premium: 1000
    }
    await sendTransactionalEmail(
      user.email,
      'planUpgraded',
      [oldPlan.charAt(0).toUpperCase() + oldPlan.slice(1), planType.charAt(0).toUpperCase() + planType.slice(1), planLimits[planType] || 100]
    )
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  // Get user
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("stripe_customer_id", customerId)
    .single() as { data: any | null; error: any }

  if (!user) return

  // Downgrade to free plan
  await supabaseAdmin
    .from("users")
    .update({
      plan_type: "free",
      stripe_subscription_id: null,
      billing_cycle: null
    })
    .eq("id", user.id)

  // Send cancellation email
  if (user.email) {
    // We don't have a specific cancellation template, but we could add one
    // For now, we'll just log this
    console.log(`Subscription cancelled for user ${user.id}`)
  }

  // Log the event
  await supabaseAdmin
    .from("billing_events")
    .insert({
      user_id: user.id,
      event_type: "subscription_cancelled",
      details: {
        subscription_id: subscription.id,
        cancelled_at: new Date().toISOString()
      }
    })
}

async function handleAutoBuyCharge(charge: Stripe.Charge) {
  const userId = charge.metadata.user_id
  const textsPurchased = parseInt(charge.metadata.texts_purchased || "0")
  
  if (!userId || !textsPurchased) return

  // Update user's additional texts
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("additional_texts_purchased")
    .eq("id", userId)
    .single() as { data: { additional_texts_purchased: number | null } | null; error: any }

  if (!user) return

  await supabaseAdmin
    .from("users")
    .update({
      additional_texts_purchased: (user.additional_texts_purchased || 0) + textsPurchased
    })
    .eq("id", userId)

  // Get user for email notification
  const { data: userData } = await supabaseAdmin
    .from("users")
    .select("email")
    .eq("id", userId)
    .single() as { data: { email: string } | null; error: any }
    
  // Send auto-buy notification
  if (userData?.email) {
    await sendTransactionalEmail(
      userData.email,
      'quotaOverage',
      [textsPurchased, (charge.amount / 100).toFixed(2)]
    )
  }

  // Log the event
  await supabaseAdmin
    .from("billing_events")
    .insert({
      user_id: userId,
      event_type: "auto_buy_texts",
      amount: charge.amount / 100,
      details: {
        charge_id: charge.id,
        texts_purchased: textsPurchased
      }
    })
}

function getPlanTypeFromPriceId(priceId: string): string {
  // Map Stripe price IDs to plan types
  const priceMap: Record<string, string> = {
    [process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID!]: "basic",
    [process.env.NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID!]: "basic",
    [process.env.NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID!]: "standard",
    [process.env.NEXT_PUBLIC_STRIPE_STANDARD_ANNUAL_PRICE_ID!]: "standard",
    [process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID!]: "premium",
    [process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID!]: "premium"
  }
  
  return priceMap[priceId] || "free"
}

// Helper functions removed - now using sendTransactionalEmail directly

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  const customerId = paymentMethod.customer as string
  
  // Get user by customer ID
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("stripe_customer_id", customerId)
    .single() as { data: any | null; error: any }
    
  if (!user) {
    console.error("User not found for payment method:", customerId)
    return
  }
  
  // Update user with new payment method ID
  await supabaseAdmin
    .from("users")
    .update({
      stripe_payment_method_id: paymentMethod.id
    })
    .eq("id", user.id)
    
  // Send payment method updated email
  if (user.email) {
    await sendTransactionalEmail(
      user.email,
      'paymentMethodUpdated',
      []
    )
  }
  
  // Log the event
  await supabaseAdmin
    .from("billing_events")
    .insert({
      user_id: user.id,
      event_type: "payment_method_updated",
      details: {
        payment_method_id: paymentMethod.id,
        type: paymentMethod.type,
        last4: paymentMethod.card?.last4
      }
    })
}
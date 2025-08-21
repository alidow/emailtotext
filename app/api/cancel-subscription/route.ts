import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import Stripe from "stripe"
import * as Sentry from "@sentry/nextjs"

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil"
})

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { immediate = false, reason = null } = body

    // Get user from database
    const { data: dbUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single()

    if (fetchError || !dbUser) {
      Sentry.captureException(fetchError || new Error("User not found"), {
        extra: { clerkId: user.id }
      })
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if already cancelled
    if (dbUser.account_status === 'cancelled') {
      return NextResponse.json({ 
        error: "Account is already cancelled" 
      }, { status: 400 })
    }

    let cancellationDate = new Date()
    let effectiveDate = new Date()

    // Handle Stripe subscription cancellation if user has one
    if (dbUser.stripe_subscription_id) {
      try {
        if (immediate) {
          // Cancel immediately
          await stripe.subscriptions.del(dbUser.stripe_subscription_id)
        } else {
          // Cancel at end of billing period
          const subscription = await stripe.subscriptions.update(
            dbUser.stripe_subscription_id,
            { cancel_at_period_end: true }
          )
          effectiveDate = new Date(subscription.current_period_end * 1000)
        }
      } catch (stripeError: any) {
        Sentry.captureException(stripeError, {
          extra: {
            userId: dbUser.id,
            subscriptionId: dbUser.stripe_subscription_id
          }
        })
        console.error("Stripe cancellation error:", stripeError)
        return NextResponse.json({ 
          error: "Failed to cancel subscription with payment provider" 
        }, { status: 500 })
      }
    }

    // Update user account status
    const updateData: any = {
      cancelled_at: cancellationDate.toISOString()
    }

    // Only set to cancelled status if immediate or no subscription
    if (immediate || !dbUser.stripe_subscription_id) {
      updateData.account_status = 'cancelled'
      updateData.plan_type = 'free'
      updateData.stripe_subscription_id = null
      updateData.billing_cycle = null
    }

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", dbUser.id)

    if (updateError) {
      Sentry.captureException(updateError, {
        extra: { userId: dbUser.id }
      })
      return NextResponse.json({ 
        error: "Failed to update account status" 
      }, { status: 500 })
    }

    // Log cancellation event
    const { error: eventError } = await supabaseAdmin
      .from("account_lifecycle_events")
      .insert({
        user_id: dbUser.id,
        event_type: 'cancelled',
        phone: dbUser.phone,
        email: dbUser.email,
        clerk_id: dbUser.clerk_id,
        metadata: {
          reason,
          immediate,
          effective_date: effectiveDate.toISOString(),
          cancelled_at: cancellationDate.toISOString(),
          previous_plan: dbUser.plan_type,
          usage_at_cancellation: dbUser.usage_count || 0
        }
      })

    if (eventError) {
      // Log error but don't fail the request
      Sentry.captureException(eventError, {
        extra: { userId: dbUser.id }
      })
      console.error("Failed to log cancellation event:", eventError)
    }

    return NextResponse.json({
      success: true,
      immediate,
      effectiveDate: effectiveDate.toISOString(),
      message: immediate || !dbUser.stripe_subscription_id
        ? "Your account has been cancelled immediately."
        : `Your subscription will be cancelled at the end of your current billing period on ${effectiveDate.toLocaleDateString()}.`
    })

  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        endpoint: "cancel-subscription"
      }
    })
    console.error("Cancellation error:", error)
    return NextResponse.json({ 
      error: "An unexpected error occurred during cancellation" 
    }, { status: 500 })
  }
}

// GET endpoint to check cancellation status
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: dbUser, error } = await supabaseAdmin
      .from("users")
      .select("account_status, cancelled_at, plan_type, stripe_subscription_id")
      .eq("clerk_id", user.id)
      .single()

    if (error || !dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if subscription is set to cancel at period end
    let pendingCancellation = false
    let cancellationDate = null

    if (dbUser.stripe_subscription_id && dbUser.account_status === 'active') {
      try {
        const subscription = await stripe.subscriptions.retrieve(dbUser.stripe_subscription_id)
        if (subscription.cancel_at_period_end) {
          pendingCancellation = true
          cancellationDate = new Date(subscription.current_period_end * 1000).toISOString()
        }
      } catch (err) {
        console.error("Error fetching subscription status:", err)
      }
    }

    return NextResponse.json({
      status: dbUser.account_status,
      cancelledAt: dbUser.cancelled_at,
      pendingCancellation,
      cancellationDate
    })

  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json({ 
      error: "Failed to fetch cancellation status" 
    }, { status: 500 })
  }
}
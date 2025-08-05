import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { stripeClient } from "@/lib/stripe-client"
import { isTestMode } from "@/lib/test-mode"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { priceId, planType, collectCardOnly, billingCycle } = await req.json()
    
    // Get user from database
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single()
    
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Create or retrieve Stripe customer
    let customerId = dbUser.stripe_customer_id
    
    if (!customerId) {
      const customer = await stripeClient.createCustomer({
        email: user.primaryEmailAddress?.emailAddress,
        metadata: {
          clerk_id: user.id,
          phone: dbUser.phone
        }
      })
      
      customerId = customer.id
      
      // Update user with Stripe customer ID
      await supabaseAdmin
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", dbUser.id)
    }
    
    // Handle free plan (collect card only)
    if (collectCardOnly) {
      const session = await stripeClient.createCheckoutSession({
        customerId,
        userId: dbUser.id,
        mode: "setup",
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?setup=complete`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
        metadata: {
          user_id: dbUser.id,
          plan_type: "free"
        }
      })
      
      if (isTestMode()) {
        console.log(`[TEST MODE] Created setup session for free plan: ${session.id}`)
      }
      
      return NextResponse.json({ 
        sessionId: session.id,
        url: (session as any).url,
        testMode: isTestMode()
      })
    }
    
    // Get the correct price ID based on plan and billing cycle
    let finalPriceId = priceId
    
    if (billingCycle === "annual") {
      // Map monthly price IDs to annual ones
      const annualPriceMap: Record<string, string> = {
        [process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID!]: process.env.NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID!,
        [process.env.NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID!]: process.env.NEXT_PUBLIC_STRIPE_STANDARD_ANNUAL_PRICE_ID!,
        [process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID!]: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID!
      }
      
      finalPriceId = annualPriceMap[priceId] || priceId
    }
    
    // Create subscription checkout session
    const session = await stripeClient.createCheckoutSession({
      customerId,
      userId: dbUser.id,
      mode: "subscription",
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
      lineItems: [
        {
          price: finalPriceId,
          quantity: 1
        }
      ],
      planType,
      billingCycle: billingCycle || "monthly",
      metadata: {
        user_id: dbUser.id,
        plan_type: planType,
        billing_cycle: billingCycle || "monthly"
      }
    })
    
    if (isTestMode()) {
      console.log(`[TEST MODE] Created subscription session for ${planType} plan: ${session.id}`)
      
      // In test mode, automatically mark the user as upgraded
      await supabaseAdmin
        .from("users")
        .update({ 
          plan_type: planType,
          billing_cycle: billingCycle || "monthly"
        })
        .eq("id", dbUser.id)
    }
    
    return NextResponse.json({ 
      sessionId: session.id,
      url: (session as any).url,
      testMode: isTestMode()
    })
  } catch (error) {
    console.error("Create checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
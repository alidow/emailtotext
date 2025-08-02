import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil"
})

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { priceId } = await req.json()
    
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
      const customer = await stripe.customers.create({
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
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
      metadata: {
        user_id: dbUser.id
      }
    })
    
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Create checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
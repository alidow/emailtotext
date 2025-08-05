import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import Stripe from "stripe"

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil"
})

export async function POST() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Get user from database
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id")
      .eq("clerk_id", user.id)
      .single() as { data: { stripe_customer_id: string } | null; error: any }
    
    if (!dbUser || !dbUser.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 })
    }
    
    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`
    })
    
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}
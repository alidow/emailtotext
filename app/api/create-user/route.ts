import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { cookies } from "next/headers"
import { sendTransactionalEmail } from "@/lib/send-transactional-email"
import * as Sentry from "@sentry/nextjs"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { planType } = await req.json()
    const cookieStore = await cookies()
    const verifiedPhone = cookieStore.get("verified_phone")?.value
    
    if (!verifiedPhone) {
      return NextResponse.json({ error: "Phone verification required" }, { status: 400 })
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single()
    
    if (existingUser) {
      return NextResponse.json({ success: true, userId: existingUser.id })
    }
    
    // Create new user
    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert({
        clerk_id: user.id,
        phone: verifiedPhone,
        phone_verified: true,
        email: user.primaryEmailAddress?.emailAddress,
        plan_type: planType,
        accepts_24hr_texts: false, // Default to standard hours only
        usage_reset_at: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
      })
      .select()
      .single()
    
    if (error) {
      Sentry.captureException(error, {
        extra: {
          userId: user.id,
          phone: verifiedPhone,
          planType
        }
      })
      console.error("Error creating user:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }
    
    // Clear verification cookie
    cookieStore.delete("verified_phone")
    
    // Send welcome email
    if (user.primaryEmailAddress?.emailAddress) {
      await sendTransactionalEmail(
        user.primaryEmailAddress.emailAddress,
        'welcome',
        [verifiedPhone]
      )
    }
    
    return NextResponse.json({ success: true, userId: newUser.id })
  } catch (error) {
    Sentry.captureException(error)
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
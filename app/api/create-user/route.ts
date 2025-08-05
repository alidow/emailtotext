import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireSupabaseAdmin } from "@/lib/supabase-helpers"
import { cookies } from "next/headers"
import { sendTransactionalEmail } from "@/lib/send-transactional-email"
import { isTestMode } from "@/lib/test-mode"
import * as Sentry from "@sentry/nextjs"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Get user details
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Check if Supabase is configured
    const adminCheck = requireSupabaseAdmin('create user')
    if (adminCheck.error) return adminCheck.response
    
    const { planType } = await req.json()
    const cookieStore = await cookies()
    const verifiedPhone = cookieStore.get("verified_phone")?.value
    
    if (!verifiedPhone) {
      return NextResponse.json({ error: "Phone verification required" }, { status: 400 })
    }
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await adminCheck.admin
      .from("users")
      .select("id, phone, plan_type")
      .eq("clerk_id", user.id)
      .single()
    
    if (existingUser) {
      // Update plan type if different
      if (existingUser.plan_type !== planType) {
        const { error: updateError } = await adminCheck.admin
          .from("users")
          .update({ plan_type: planType })
          .eq("id", existingUser.id)
        
        if (updateError) {
          console.error("Error updating plan type:", updateError)
        }
      }
      
      // Update phone if different
      if (existingUser.phone !== verifiedPhone) {
        const { error: updateError } = await adminCheck.admin
          .from("users")
          .update({ 
            phone: verifiedPhone,
            phone_verified: true
          })
          .eq("id", existingUser.id)
        
        if (updateError) {
          console.error("Error updating phone:", updateError)
        }
      }
      
      return NextResponse.json({ success: true, userId: existingUser.id })
    }
    
    // If checkError is not PGRST116 (not found), there's an actual error
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }
    
    // Create new user
    const { data: newUser, error } = await adminCheck.admin
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
          planType,
          errorCode: error.code,
          errorDetails: error.details,
          errorHint: error.hint
        }
      })
      console.error("Error creating user:", {
        error,
        errorCode: error.code,
        errorDetails: error.details,
        errorHint: error.hint,
        errorMessage: error.message,
        userId: user.id,
        phone: verifiedPhone,
        planType
      })
      
      // In test mode, provide more details
      if (isTestMode()) {
        return NextResponse.json({ 
          error: "Failed to create user",
          details: error.message,
          code: error.code
        }, { status: 500 })
      }
      
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
  } catch (error: any) {
    Sentry.captureException(error)
    console.error("Create user error:", error)
    
    // In test mode, provide more details
    if (isTestMode()) {
      return NextResponse.json({ 
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { status: 500 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
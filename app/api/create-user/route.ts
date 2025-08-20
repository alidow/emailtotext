import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireSupabaseAdmin } from "@/lib/supabase-helpers"
import { cookies } from "next/headers"
import { sendTransactionalEmail } from "@/lib/send-transactional-email"
import { isTestMode, isTestPhoneNumber } from "@/lib/test-mode"
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
    
    // adminCheck.admin is guaranteed to exist after the error check
    const admin = adminCheck.admin!
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await admin
      .from("users")
      .select("id, phone, plan_type")
      .eq("clerk_id", user.id)
      .single() as { data: { id: string; phone: string; plan_type: string } | null; error: any }
    
    if (existingUser) {
      // Update plan type if different
      if (existingUser.plan_type !== planType) {
        const { error: updateError } = await admin
          .from("users")
          .update({ plan_type: planType })
          .eq("id", existingUser.id)
        
        if (updateError) {
          console.error("Error updating plan type:", updateError)
        }
      }
      
      // Update phone if different
      if (existingUser.phone !== verifiedPhone) {
        const { error: updateError } = await admin
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
    
    // Check if this is a test phone number
    const isTestPhone = isTestPhoneNumber(verifiedPhone)
    
    // Get current month's usage for this phone number (persists across accounts)
    const { data: phoneUsage } = await admin
      .rpc('get_phone_monthly_usage', {
        p_phone: verifiedPhone
      })
      .single() as { data: { sms_sent: number; sms_quota: number; month_year: string } | null; error: any }
    
    // Check if user previously had an account with this phone (cancelled/deleted)
    const { data: previousAccount } = await admin
      .from("users")
      .select("id, sms_sent, account_status")
      .eq("phone", verifiedPhone)
      .eq("clerk_id", user.id)
      .single() as { data: any | null; error: any }
    
    let newUser;
    let error;
    
    if (previousAccount && previousAccount.account_status === 'cancelled') {
      // Reactivate previous account instead of creating new one
      const { data: reactivatedUser, error: reactivateError } = await admin
        .from("users")
        .update({
          account_status: 'active',
          plan_type: planType,
          cancelled_at: null,
          sms_sent: phoneUsage?.sms_sent || 0, // Use phone-level usage tracking
          usage_reset_at: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        })
        .eq("id", previousAccount.id)
        .select()
        .single()
      
      newUser = reactivatedUser;
      error = reactivateError;
      
      // Log reactivation event
      if (!error) {
        await admin
          .from("account_lifecycle_events")
          .insert({
            user_id: previousAccount.id,
            event_type: 'reactivated',
            phone: verifiedPhone,
            email: user.primaryEmailAddress?.emailAddress,
            clerk_id: user.id,
            metadata: {
              plan_type: planType,
              previous_sms_sent: phoneUsage?.sms_sent || 0
            }
          })
      }
    } else {
      // Create new user
      const { data: createdUser, error: createError } = await admin
        .from("users")
        .insert({
          clerk_id: user.id,
          phone: verifiedPhone,
          phone_verified: true,
          email: user.primaryEmailAddress?.emailAddress,
          plan_type: planType,
          accepts_24hr_texts: false, // Default to standard hours only
          sms_sent: phoneUsage?.sms_sent || 0, // Inherit phone-level usage
          usage_reset_at: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          is_test_phone: isTestPhone,
          account_status: 'active'
        })
        .select()
        .single()
      
      newUser = createdUser;
      error = createError;
      
      // Log account creation event
      if (!error && newUser) {
        await admin
          .from("account_lifecycle_events")
          .insert({
            user_id: newUser.id,
            event_type: 'created',
            phone: verifiedPhone,
            email: user.primaryEmailAddress?.emailAddress,
            clerk_id: user.id,
            metadata: {
              plan_type: planType,
              inherited_sms_count: phoneUsage?.sms_sent || 0
            }
          })
      }
    }
    
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
    
    if (!newUser) {
      console.error("Failed to create or reactivate user")
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 })
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
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { cookies } from "next/headers"
import { isMockMode } from "@/lib/mock-mode"
import { isTestMode, isTestPhoneNumber } from "@/lib/test-mode"
import * as Sentry from "@sentry/nextjs"

export async function POST(req: NextRequest) {
  let phone: string | undefined
  
  try {
    const body = await req.json()
    phone = body.phone
    const code = body.code
    
    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      )
    }
    
    // Clean phone number to E.164 format
    const cleanPhone = phone.replace(/\D/g, "")
    const e164Phone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`
    
    console.log(`[DEBUG] Phone formatting: input="${phone}" -> clean="${cleanPhone}" -> e164="${e164Phone}"`)
    
    // Check if this is a test phone number
    const isTestPhone = isTestPhoneNumber(e164Phone)
    
    if (isTestPhone) {
      console.log(`[TEST PHONE] Verifying test phone ${e164Phone} with code ${code}`)
    }
    
    // First, let's see what's in the database for this phone
    console.log(`[DEBUG] Looking for verification with phone: ${e164Phone} and code: ${code}`)
    
    // Get all recent verifications for debugging
    const { data: allVerifications, error: allError } = await supabaseAdmin
      .from("phone_verifications")
      .select("*")
      .eq("phone", e164Phone)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(5)
    
    console.log(`[DEBUG] Found ${allVerifications?.length || 0} non-expired verifications for ${e164Phone}:`)
    allVerifications?.forEach((v: any) => {
      console.log(`[DEBUG]   - Code: ${v.code}, Created: ${v.created_at}, Expires: ${v.expires_at}, Test: ${v.is_test_phone}`)
    })
    
    // Check verification code in database (for all phones including test phones)
    const { data: verification, error: verifyError } = await supabaseAdmin
      .from("phone_verifications")
      .select("*")
      .eq("phone", e164Phone)
      .eq("code", code)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single() as { data: { attempts: number } | null; error: any }
    
    if (verifyError || !verification) {
      console.log(`[${isTestPhone ? 'TEST PHONE' : 'VERIFY'}] Failed for ${e164Phone} with code ${code}`)
      console.log(`[${isTestPhone ? 'TEST PHONE' : 'VERIFY'}] Error:`, verifyError)
      console.log(`[${isTestPhone ? 'TEST PHONE' : 'VERIFY'}] Verification data:`, verification)
      
      // Increment attempts if we found a record
      if (!verifyError && verification) {
        await supabaseAdmin
          .from("phone_verifications")
          .update({ attempts: verification?.attempts ? verification.attempts + 1 : 1 })
          .eq("phone", e164Phone)
          .eq("code", code)
      }
      
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      )
    }
    
    console.log(`[${isTestPhone ? 'TEST PHONE' : 'VERIFY'}] Success for ${e164Phone} with code ${code}`)
    
    // Delete used verification codes
    await supabaseAdmin
      .from("phone_verifications")
      .delete()
      .eq("phone", e164Phone)
    
    // Set verified phone in cookie for signup flow
    const cookieStore = await cookies()
    cookieStore.set("verified_phone", e164Phone, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 // 1 hour
    })
    
    // Get consent status
    const { data: consentLog } = await supabaseAdmin
      .from("consent_logs")
      .select("consent_24hr_texts")
      .eq("phone", e164Phone)
      .order("consented_at", { ascending: false })
      .limit(1)
      .single() as { data: { consent_24hr_texts: boolean } | null; error: any }
    
    cookieStore.set("consent_24hr", consentLog?.consent_24hr_texts?.toString() || "false", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 // 1 hour
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: {
        endpoint: "verify-phone",
        phone: phone
      }
    })
    console.error("Verify phone error:", error)
    return NextResponse.json(
      { error: "Failed to verify phone number" },
      { status: 500 }
    )
  }
}
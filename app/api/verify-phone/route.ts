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
    
    // Check if this is a test phone number
    const isTestPhone = isTestPhoneNumber(e164Phone)
    
    if (isTestPhone) {
      console.log(`[TEST PHONE] Verifying test phone ${e164Phone} with code ${code}`)
    }
    
    // In mock mode or for test phones, handle verification differently
    if (isMockMode || isTestPhone) {
      // For test phones and mock mode, accept the fixed code "123456"
      if ((isMockMode || isTestPhone) && code === "123456") {
        console.log(`[TEST PHONE] Accepting fixed code 123456 for ${e164Phone}`)
        // Continue to set cookies below
      } else if (isTestPhone) {
        // If they didn't use the fixed code, check the database just in case
        const { data: verification, error: verifyError } = await supabaseAdmin
          .from("phone_verifications")
          .select("*")
          .eq("phone", e164Phone)
          .eq("code", code)
          .eq("is_test_phone", true)
          .gte("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(1)
          .single() as { data: any | null; error: any }
        
        if (verifyError || !verification) {
          console.log(`[TEST PHONE] Verification failed for ${e164Phone} with code ${code} (expected 123456)`)
          return NextResponse.json(
            { error: "Invalid or expired verification code. Test phones should use code: 123456" },
            { status: 400 }
          )
        }
        
        // Delete used verification codes for test phone
        await supabaseAdmin
          .from("phone_verifications")
          .delete()
          .eq("phone", e164Phone)
      } else {
        return NextResponse.json(
          { error: "Invalid verification code" },
          { status: 400 }
        )
      }
      
      // Set verified phone in cookie
      const cookieStore = await cookies()
      cookieStore.set("verified_phone", e164Phone, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 // 1 hour
      })
      
      cookieStore.set("consent_24hr", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 // 1 hour
      })
      
      console.log(`[${isMockMode ? 'MOCK MODE' : 'TEST PHONE'}] Phone ${e164Phone} verified with code ${code}`)
      
      return NextResponse.json({ success: true })
    }
    
    // Check verification code
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
      // Increment attempts
      await supabaseAdmin
        .from("phone_verifications")
        .update({ attempts: verification?.attempts ? verification.attempts + 1 : 1 })
        .eq("phone", e164Phone)
        .eq("code", code)
      
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      )
    }
    
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
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { cookies } from "next/headers"
import { isMockMode } from "@/lib/mock-mode"
import { isTestMode, isTestPhoneNumber } from "@/lib/test-mode"
import * as Sentry from "@sentry/nextjs"

// Force dynamic rendering since we use cookies()
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  let phone: string | undefined
  let code: string | undefined
  const startTime = Date.now()
  
  // Track request metadata for debugging
  const requestMeta = {
    ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
    timestamp: new Date().toISOString(),
    url: req.url
  }
  
  try {
    // Log incoming request
    Sentry.addBreadcrumb({
      message: "Phone verification attempt started",
      level: "info",
      category: "verify-phone",
      data: requestMeta
    })
    
    const body = await req.json()
    phone = body.phone
    code = body.code
    
    // Log parsed request body
    Sentry.addBreadcrumb({
      message: "Request body parsed",
      level: "info",
      category: "verify-phone",
      data: { phoneProvided: !!phone, codeProvided: !!code, phoneLength: phone?.length, codeLength: code?.length }
    })
    
    if (!phone) {
      Sentry.captureMessage("Phone verification failed: No phone number provided", {
        level: "warning",
        tags: { step: "validation" },
        extra: { ...requestMeta, body }
      })
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      )
    }
    
    if (!code) {
      Sentry.captureMessage("Phone verification failed: No code provided", {
        level: "warning",
        tags: { step: "validation" },
        extra: { ...requestMeta, phone }
      })
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      )
    }
    
    // Clean phone number to E.164 format
    const cleanPhone = phone.replace(/\D/g, "")
    const e164Phone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`
    
    console.log(`[DEBUG] Phone formatting: input="${phone}" -> clean="${cleanPhone}" -> e164="${e164Phone}"`)
    
    // Log phone formatting
    Sentry.addBreadcrumb({
      message: "Phone number formatted",
      level: "info",
      category: "verify-phone",
      data: { original: phone, cleaned: cleanPhone, e164: e164Phone }
    })
    
    // Check if this is a test phone number
    const isTestPhone = isTestPhoneNumber(e164Phone)
    
    if (isTestPhone) {
      console.log(`[TEST PHONE] Verifying test phone ${e164Phone} with code ${code}`)
    }
    
    // First, let's see what's in the database for this phone
    console.log(`[DEBUG] Looking for verification with phone: ${e164Phone} and code: ${code}`)
    
    // Log database query attempt
    Sentry.addBreadcrumb({
      message: "Querying phone_verifications table",
      level: "info",
      category: "verify-phone",
      data: { phone: e164Phone, isTestPhone }
    })
    
    // Get all recent verifications for debugging
    const { data: allVerifications, error: allError } = await supabaseAdmin
      .from("phone_verifications")
      .select("*")
      .eq("phone", e164Phone)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(5)
    
    if (allError) {
      Sentry.captureException(allError, {
        tags: { step: "database_query", table: "phone_verifications" },
        extra: { phone: e164Phone, query: "get_all_verifications" }
      })
    }
    
    console.log(`[DEBUG] Found ${allVerifications?.length || 0} non-expired verifications for ${e164Phone}:`)
    allVerifications?.forEach((v: any) => {
      console.log(`[DEBUG]   - Code: ${v.code}, Created: ${v.created_at}, Expires: ${v.expires_at}, Test: ${v.is_test_phone}`)
    })
    
    // Log verification records found
    Sentry.addBreadcrumb({
      message: `Found ${allVerifications?.length || 0} verification records`,
      level: "info",
      category: "verify-phone",
      data: {
        count: allVerifications?.length || 0,
        codes: allVerifications?.map((v: any) => ({ 
          codeMatch: v.code === code,
          createdAt: v.created_at,
          expiresAt: v.expires_at,
          isTestPhone: v.is_test_phone
        }))
      }
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
      
      // Capture detailed failure in Sentry
      const failureReason = verifyError ? "database_error" : "code_mismatch"
      Sentry.captureMessage(`Phone verification failed: ${failureReason}`, {
        level: "error",
        tags: { 
          step: "verification",
          failureReason,
          isTestPhone: isTestPhone.toString()
        },
        extra: {
          phone: e164Phone,
          providedCode: code,
          error: verifyError,
          verificationFound: !!verification,
          allVerificationsCount: allVerifications?.length || 0,
          availableCodes: allVerifications?.map((v: any) => v.code),
          timeSinceStart: Date.now() - startTime,
          ...requestMeta
        }
      })
      
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
    
    // Log successful verification
    Sentry.addBreadcrumb({
      message: "Verification code matched successfully",
      level: "info",
      category: "verify-phone",
      data: { phone: e164Phone, isTestPhone }
    })
    
    // Delete used verification codes
    const { error: deleteError } = await supabaseAdmin
      .from("phone_verifications")
      .delete()
      .eq("phone", e164Phone)
    
    if (deleteError) {
      Sentry.captureException(deleteError, {
        tags: { step: "cleanup", table: "phone_verifications" },
        extra: { phone: e164Phone }
      })
    }
    
    // Set verified phone in cookie for signup flow
    try {
      const cookieStore = await cookies()
      cookieStore.set("verified_phone", e164Phone, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 // 1 hour
      })
      
      Sentry.addBreadcrumb({
        message: "Cookie set successfully",
        level: "info",
        category: "verify-phone",
        data: { cookieName: "verified_phone" }
      })
    } catch (cookieError) {
      Sentry.captureException(cookieError, {
        tags: { step: "cookie_set" },
        extra: { phone: e164Phone, error: cookieError }
      })
      throw cookieError
    }
    
    // Get consent status
    const { data: consentLog, error: consentError } = await supabaseAdmin
      .from("consent_logs")
      .select("consent_24hr_texts")
      .eq("phone", e164Phone)
      .order("consented_at", { ascending: false })
      .limit(1)
      .single() as { data: { consent_24hr_texts: boolean } | null; error: any }
    
    if (consentError && consentError.code !== 'PGRST116') { // PGRST116 is "no rows found"
      Sentry.captureException(consentError, {
        tags: { step: "consent_check", table: "consent_logs" },
        extra: { phone: e164Phone }
      })
    }
    
    try {
      const cookieStore = await cookies()
      cookieStore.set("consent_24hr", consentLog?.consent_24hr_texts?.toString() || "false", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 // 1 hour
      })
      
      Sentry.addBreadcrumb({
        message: "Consent cookie set",
        level: "info",
        category: "verify-phone",
        data: { consent24hr: consentLog?.consent_24hr_texts || false }
      })
    } catch (consentCookieError) {
      Sentry.captureException(consentCookieError, {
        tags: { step: "consent_cookie_set" },
        extra: { phone: e164Phone, error: consentCookieError }
      })
    }
    
    // Log analytics event server-side
    console.log('[ANALYTICS_EVENT] phone_verified', JSON.stringify({
      type: 'ANALYTICS_EVENT',
      timestamp: new Date().toISOString(),
      event: 'phone_verified',
      source: 'server',
      parameters: {
        phone: phone,
        test_phone: isTestPhone
      },
      context: {
        ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
        user_agent: req.headers.get("user-agent")
      }
    }, null, 2))
    
    console.log('[PHONE_VERIFICATION_SUCCESS]', JSON.stringify({
      timestamp: new Date().toISOString(),
      phone: phone,
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    }))
    
    // Log successful completion
    const totalTime = Date.now() - startTime
    Sentry.captureMessage("Phone verification completed successfully", {
      level: "info",
      tags: { 
        step: "success",
        isTestPhone: isTestPhone.toString()
      },
      extra: {
        phone: e164Phone,
        totalTimeMs: totalTime,
        ...requestMeta
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    const totalTime = Date.now() - startTime
    
    // Capture detailed error context
    Sentry.captureException(error, {
      tags: {
        endpoint: "verify-phone",
        errorType: error.name || "unknown"
      },
      extra: {
        phone: phone,
        code: code,
        errorMessage: error.message,
        errorStack: error.stack,
        totalTimeMs: totalTime,
        ...requestMeta
      }
    })
    
    console.error("Verify phone error:", error)
    
    // Check for specific error types
    if (error.message?.includes("cookies")) {
      return NextResponse.json(
        { error: "Session error. Please try again." },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to verify phone number" },
      { status: 500 }
    )
  }
}
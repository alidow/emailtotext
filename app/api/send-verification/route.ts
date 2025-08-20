import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { isMockMode } from "@/lib/mock-mode"
import { smsProvider } from "@/lib/sms-provider"
import { isTestMode, isTestPhoneNumber } from "@/lib/test-mode"
import { 
  rateLimiters, 
  getClientIp, 
  isVpnOrProxy, 
  isSuspiciousPhoneNumber,
  logSuspiciousActivity,
  blockIp 
} from "@/lib/rate-limit"

// Track recent verification attempts in memory for additional protection
const recentAttempts = new Map<string, number>()

// Clean up old entries every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000
  const entries = Array.from(recentAttempts.entries())
  for (const [key, timestamp] of entries) {
    if (timestamp < oneHourAgo) {
      recentAttempts.delete(key)
    }
  }
}, 3600000)

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body FIRST to check for test phone
    const body = await req.json()
    const { phone, captchaToken } = body
    
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      )
    }
    
    // 2. Clean and validate phone number
    const cleanPhone = phone.replace(/\D/g, "")
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      )
    }
    
    const e164Phone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`
    
    // 3. Check if this is a test phone number FIRST, before any blocking
    const isTestPhone = isTestPhoneNumber(e164Phone)
    
    if (isTestPhone) {
      console.log(`[TEST PHONE] Detected test phone number: ${e164Phone}`)
    }
    
    // 4. Get client IP for logging and rate limiting
    const clientIp = getClientIp(req)
    console.log("Client IP detected:", clientIp)
    console.log("Headers:", {
      "cf-connecting-ip": req.headers.get("cf-connecting-ip"),
      "x-forwarded-for": req.headers.get("x-forwarded-for"),
      "x-real-ip": req.headers.get("x-real-ip"),
    })
    
    // 5. Check if IP is blocked (skip for test phones)
    if (!isTestPhone && await isVpnOrProxy(clientIp)) {
      await logSuspiciousActivity(clientIp, "unknown", "VPN/Proxy detected")
      return NextResponse.json(
        { error: "Access denied. VPNs and proxies are not allowed." },
        { status: 403 }
      )
    }
    
    // 6. Apply multiple rate limits (skip for test phones and test mode)
    if (!isTestMode() && !isTestPhone) {
      const [ipLimit, globalLimit, burstLimit] = await Promise.all([
        rateLimiters.phoneVerification.limit(clientIp),
        rateLimiters.globalIP.limit(clientIp),
        rateLimiters.burst.limit(clientIp),
      ])
      
      if (!ipLimit.success || !globalLimit.success || !burstLimit.success) {
        await logSuspiciousActivity(clientIp, "unknown", "Rate limit exceeded")
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        )
      }
    }
    
    // 7. Check for suspicious phone numbers (skip for test phones)
    if (!isTestPhone && await isSuspiciousPhoneNumber(cleanPhone)) {
      await logSuspiciousActivity(clientIp, e164Phone, "Suspicious phone number pattern")
      await blockIp(clientIp, "Suspicious phone number usage", 86400) // 24 hour ban
      return NextResponse.json(
        { error: "This phone number cannot be used for verification" },
        { status: 400 }
      )
    }
    
    // 8. Check per-phone-number rate limit (skip for test phones and test mode)
    // Moved after database operations to not count failed attempts
    
    // 9. Check for rapid repeated attempts to same number from different IPs (skip for test phones and test mode)
    if (!isTestMode() && !isTestPhone) {
      const recentKey = `recent:${e164Phone}`
      const lastAttempt = recentAttempts.get(recentKey)
      if (lastAttempt && Date.now() - lastAttempt < 30000) { // 30 seconds
        await logSuspiciousActivity(clientIp, e164Phone, "Rapid repeated attempts")
        return NextResponse.json(
          { error: "Please wait before requesting another code" },
          { status: 429 }
        )
      }
      recentAttempts.set(recentKey, Date.now())
    }
    
    // 10. Verify CAPTCHA if provided (will be required in frontend)
    if (captchaToken && process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
      const captchaResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
            response: captchaToken,
            remoteip: clientIp,
          }),
        }
      )
      
      const captchaResult = await captchaResponse.json()
      if (!captchaResult.success) {
        await logSuspiciousActivity(clientIp, e164Phone, "Failed CAPTCHA")
        return NextResponse.json(
          { error: "CAPTCHA verification failed" },
          { status: 400 }
        )
      }
    }
    
    // Generate 6-digit code
    const code = isMockMode 
      ? "123456" 
      : Math.floor(100000 + Math.random() * 900000).toString()
    
    if (isTestPhone) {
      console.log(`[TEST PHONE] Generated verification code ${code} for ${e164Phone}`)
      console.log(`[TEST PHONE] Storing in database with phone format: ${e164Phone}`)
    }
    
    // Check if phone number is already in use by an ACTIVE account
    const { data: existingActiveUser } = await supabaseAdmin
      .from("users")
      .select("id, account_status")
      .eq("phone", e164Phone)
      .eq("account_status", "active")
      .single()
    
    if (existingActiveUser) {
      console.log(`Phone ${e164Phone} already registered to active user ${existingActiveUser.id}`)
      return NextResponse.json(
        { error: "This phone number is already associated with an active account. Each phone number can only be used with one account at a time." },
        { status: 400 }
      )
    }
    
    // Check if phone can sign up (not blocked for abuse)
    const { data: canSignup } = await supabaseAdmin
      .rpc('can_phone_signup', {
        p_phone: e164Phone,
        p_email: '' // Email will be checked during account creation
      })
    
    if (canSignup === false) {
      console.log(`Phone ${e164Phone} blocked from signup due to abuse detection`)
      await logSuspiciousActivity(clientIp, e164Phone, "Blocked signup attempt - abuse detected")
      return NextResponse.json(
        { error: "This phone number is temporarily restricted. Please contact support if you believe this is an error." },
        { status: 403 }
      )
    }
    
    // Always store verification code in database (even for test phones)
    try {
      // Store verification code in database
      const verificationData = {
        phone: e164Phone,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent"),
        is_test_phone: isTestPhone,
        attempts: 0  // Initialize attempts counter
      }
      
      console.log(`[DEBUG] Inserting verification:`, verificationData)
      
      const { error: dbError } = await supabaseAdmin
        .from("phone_verifications")
        .insert(verificationData)
        
        if (dbError) {
          console.error("Error storing verification code:", dbError)
          throw dbError
        }
        
      // Log consent with additional tracking
      const { error: consentError } = await supabaseAdmin
        .from("consent_logs")
        .insert({
          phone: e164Phone,
          consent_24hr_texts: false, // Default to standard hours only
          ip_address: clientIp,
          user_agent: req.headers.get("user-agent"),
          consented_at: new Date().toISOString(),
        })
      
      if (consentError) {
        console.error("Error logging consent:", consentError)
        throw consentError
      }
      
      // Apply per-phone-number rate limit AFTER successful DB operations
      // This ensures failed attempts don't count against the limit
      if (!isTestMode() && !isTestPhone) {
        const phoneLimit = await rateLimiters.perPhoneNumber.limit(e164Phone)
        if (!phoneLimit.success) {
          // Delete the verification we just created since we're rate limited
          await supabaseAdmin
            .from("phone_verifications")
            .delete()
            .eq("phone", e164Phone)
            .eq("code", code)
          
          await logSuspiciousActivity(clientIp, e164Phone, "Too many attempts for single phone number")
          return NextResponse.json(
            { error: "This phone number has received too many verification codes. Please try again tomorrow." },
            { status: 429 }
          )
        }
      }
    } catch (dbError: any) {
      console.error("Database operation error:", dbError)
      // Continue for test phones or test mode
      if (isTestPhone || isTestMode()) {
        console.log(`[${isTestPhone ? 'TEST PHONE' : 'TEST MODE'}] Continuing despite database error`)
      } else {
        throw dbError
      }
    }
    
    // Send SMS using the unified provider (handles test mode and failover automatically)
    try {
      await smsProvider.sendSMS({
        to: e164Phone,
        body: `Email to Text Notifier: Your verification code is ${code}. By requesting this code, you consent to receive SMS from us at (866) 942-1024. Reply STOP to opt-out. Msg&data rates may apply. Expires in 10 min.`,
        type: 'verification',
        metadata: {
          code,
          ip_address: clientIp,
          user_agent: req.headers.get("user-agent"),
          configured_providers: smsProvider.getConfiguredProviders(),
          sms_strategy: smsProvider.getCurrentStrategy()
        }
      })
      
      if (isTestPhone || isTestMode()) {
        console.log(`[${isTestPhone ? 'TEST PHONE' : 'TEST MODE'}] Verification code ${code} logged for ${e164Phone}`)
      }
    } catch (twilioError: any) {
      console.error("SMS send error:", twilioError)
      
      // Check if it's a blacklisted number error
      if (twilioError.code === 21610) {
        return NextResponse.json(
          { error: "This phone number cannot receive SMS messages" },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to send verification code. Please try again." },
        { status: 500 }
      )
    }
    
    // Log successful verification for monitoring
    if (!isMockMode) {
      await supabaseAdmin
        .from("verification_logs")
        .insert({
          phone: e164Phone,
          ip_address: clientIp,
          success: true,
          created_at: new Date().toISOString(),
        })
    }
    
    return NextResponse.json({ 
      success: true,
      testMode: isTestMode()
    })
    
  } catch (error: any) {
    console.error("Send verification error:", error)
    
    // In test mode, provide more details for debugging
    if (isTestMode()) {
      return NextResponse.json(
        { 
          error: "Failed to send verification code", 
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      )
    }
    
    // Don't leak specific error details to potential attackers in production
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    )
  }
}
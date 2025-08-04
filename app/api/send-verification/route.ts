import { NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { supabaseAdmin } from "@/lib/supabase"
import { isMockMode } from "@/lib/mock-mode"
import { 
  rateLimiters, 
  getClientIp, 
  isVpnOrProxy, 
  isSuspiciousPhoneNumber,
  logSuspiciousActivity,
  blockIp 
} from "@/lib/rate-limit"

const twilioClient = process.env.TWILIO_ACCOUNT_SID !== 'mock_account_sid' 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

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
    const clientIp = getClientIp(req)
    
    // 1. Check if IP is blocked
    if (await isVpnOrProxy(clientIp)) {
      await logSuspiciousActivity(clientIp, "unknown", "VPN/Proxy detected")
      return NextResponse.json(
        { error: "Access denied. VPNs and proxies are not allowed." },
        { status: 403 }
      )
    }
    
    // 2. Apply multiple rate limits
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
    
    // 3. Validate request body
    const body = await req.json()
    const { phone, captchaToken } = body
    
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      )
    }
    
    // 4. Clean and validate phone number
    const cleanPhone = phone.replace(/\D/g, "")
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      )
    }
    
    const e164Phone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`
    
    // 5. Check for suspicious phone numbers
    if (await isSuspiciousPhoneNumber(cleanPhone)) {
      await logSuspiciousActivity(clientIp, e164Phone, "Suspicious phone number pattern")
      await blockIp(clientIp, "Suspicious phone number usage", 86400) // 24 hour ban
      return NextResponse.json(
        { error: "This phone number cannot be used for verification" },
        { status: 400 }
      )
    }
    
    // 6. Check per-phone-number rate limit
    const phoneLimit = await rateLimiters.perPhoneNumber.limit(e164Phone)
    if (!phoneLimit.success) {
      await logSuspiciousActivity(clientIp, e164Phone, "Too many attempts for single phone number")
      return NextResponse.json(
        { error: "This phone number has received too many verification codes. Please try again tomorrow." },
        { status: 429 }
      )
    }
    
    // 7. Check for rapid repeated attempts to same number from different IPs
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
    
    // 8. Verify CAPTCHA if provided (will be required in frontend)
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
    const code = isMockMode ? "123456" : Math.floor(100000 + Math.random() * 900000).toString()
    
    // In mock mode, skip database operations
    if (!isMockMode) {
      // Store verification code in database
      const { error: dbError } = await supabaseAdmin
        .from("phone_verifications")
        .insert({
          phone: e164Phone,
          code,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          ip_address: clientIp,
          user_agent: req.headers.get("user-agent"),
        })
      
      if (dbError) throw dbError
      
      // Log consent with additional tracking
      const { error: consentError } = await supabaseAdmin
        .from("consent_logs")
        .insert({
          phone: e164Phone,
          consent_24hr_texts: false, // Default to standard hours only
          ip_address: clientIp,
          user_agent: req.headers.get("user-agent"),
          created_at: new Date().toISOString(),
        })
      
      if (consentError) throw consentError
    } else {
      console.log("[MOCK MODE] Would store verification code:", code, "for phone:", e164Phone)
    }
    
    // Send SMS
    if (twilioClient) {
      try {
        await twilioClient.messages.create({
          body: `Your Email to Text Notifier verification code is: ${code}. This code expires in 10 minutes.`,
          to: e164Phone,
          from: process.env.TWILIO_PHONE_NUMBER
        })
      } catch (twilioError: any) {
        console.error("Twilio error:", twilioError)
        
        // Check if it's a blacklisted number error
        if (twilioError.code === 21610) {
          return NextResponse.json(
            { error: "This phone number cannot receive SMS messages" },
            { status: 400 }
          )
        }
        
        throw twilioError
      }
    } else {
      console.log("[MOCK MODE] Would send SMS to", e164Phone, "with code:", code)
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
      rateLimitRemaining: ipLimit.remaining,
      resetAt: new Date(ipLimit.reset).toISOString(),
    })
    
  } catch (error: any) {
    console.error("Send verification error:", error)
    
    // Don't leak specific error details to potential attackers
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    )
  }
}
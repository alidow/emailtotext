import { NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { supabaseAdmin } from "@/lib/supabase"
import { isMockMode } from "@/lib/mock-mode"

const twilioClient = process.env.TWILIO_ACCOUNT_SID !== 'mock_account_sid' 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    
    // Clean phone number to E.164 format
    const cleanPhone = phone.replace(/\D/g, "")
    const e164Phone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`
    
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
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        })
      
      if (dbError) throw dbError
      
      // Log consent
      const { error: consentError } = await supabaseAdmin
        .from("consent_logs")
        .insert({
          phone: e164Phone,
          consent_24hr_texts: false, // Default to standard hours only
          ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
          user_agent: req.headers.get("user-agent")
        })
      
      if (consentError) throw consentError
    } else {
      console.log("[MOCK MODE] Would store verification code:", code, "for phone:", e164Phone)
    }
    
    // Send SMS
    if (twilioClient) {
      await twilioClient.messages.create({
        body: `Your Email to Text Notifier verification code is: ${code}. This code expires in 10 minutes.`,
        to: e164Phone,
        from: process.env.TWILIO_PHONE_NUMBER
      })
    } else {
      console.log("[MOCK MODE] Would send SMS to", e164Phone, "with code:", code)
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Send verification error:", error)
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    )
  }
}
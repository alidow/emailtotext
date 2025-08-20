import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json()
    
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      )
    }
    
    // Clean phone number to E.164 format
    const cleanPhone = phoneNumber.replace(/\D/g, "")
    const e164Phone = cleanPhone.startsWith("+") ? cleanPhone : cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`
    
    // Get phone-level usage tracking
    const { data: phoneUsage, error } = await supabaseAdmin
      .rpc('get_phone_monthly_usage', {
        p_phone: e164Phone
      })
      .single() as { data: { sms_sent: number; sms_quota: number; month_year: string } | null; error: any }
    
    if (error) {
      console.error("Error checking phone usage:", error)
      // Don't fail the request if we can't check usage
      return NextResponse.json({ hasUsage: false })
    }
    
    const hasUsage = phoneUsage && phoneUsage.sms_sent > 0
    
    return NextResponse.json({
      hasUsage,
      sms_sent: phoneUsage?.sms_sent || 0,
      sms_quota: phoneUsage?.sms_quota || 10,
      month_year: phoneUsage?.month_year
    })
  } catch (error) {
    console.error("Check phone usage error:", error)
    // Don't fail the verification flow if this check fails
    return NextResponse.json({ hasUsage: false })
  }
}
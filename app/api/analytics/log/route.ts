import { NextRequest, NextResponse } from "next/server"

/**
 * Server-side analytics logging endpoint
 * Logs all analytics events to Vercel logs for debugging
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, parameters, value, source, timestamp, userAgent, url, referrer } = body
    
    // Get additional context
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    const country = req.headers.get("x-vercel-ip-country") || "unknown"
    const city = req.headers.get("x-vercel-ip-city") || "unknown"
    
    // Create searchable log entry
    const logEntry = {
      type: "ANALYTICS_EVENT",
      timestamp,
      event: name,
      value,
      source,
      parameters,
      context: {
        url,
        referrer,
        userAgent,
        ip: ip.split(',')[0].trim(), // Get first IP if multiple
        country,
        city
      }
    }
    
    // Log with a searchable prefix for Vercel logs
    console.log(`[ANALYTICS_EVENT] ${name}`, JSON.stringify(logEntry, null, 2))
    
    // Log specific important events with special markers for easy searching
    if (name === 'phone_code_sent') {
      console.log(`[PHONE_VERIFICATION_START]`, JSON.stringify({
        timestamp,
        phone: parameters?.phone,
        ip: ip.split(',')[0].trim()
      }))
    }
    
    if (name === 'phone_verified') {
      console.log(`[PHONE_VERIFICATION_SUCCESS]`, JSON.stringify({
        timestamp,
        phone: parameters?.phone,
        ip: ip.split(',')[0].trim()
      }))
    }
    
    if (name === 'account_created') {
      console.log(`[ACCOUNT_CREATED]`, JSON.stringify({
        timestamp,
        method: parameters?.method,
        ip: ip.split(',')[0].trim()
      }))
    }
    
    if (name === 'payment_completed') {
      console.log(`[PAYMENT_SUCCESS]`, JSON.stringify({
        timestamp,
        plan: parameters?.plan,
        amount: value,
        ip: ip.split(',')[0].trim()
      }))
    }
    
    if (name.includes('error')) {
      console.error(`[ANALYTICS_ERROR]`, JSON.stringify({
        timestamp,
        error: name,
        details: parameters,
        ip: ip.split(',')[0].trim()
      }))
    }
    
    return NextResponse.json({ 
      success: true,
      logged: true,
      event: name
    })
    
  } catch (error: any) {
    console.error("[ANALYTICS_LOG_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to log analytics event", details: error.message },
      { status: 500 }
    )
  }
}
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "emailtotext",
    version: process.env.VERCEL_GIT_COMMIT_SHA || "development",
    checks: {
      api: true,
      database: false,
      mailgun: false,
      twilio: false,
      stripe: false,
    }
  }

  try {
    // Check database connection
    try {
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .select('count')
        .limit(1)
        .single() as { data: any | null; error: any }
      
      checks.checks.database = !dbError
    } catch (error) {
      checks.checks.database = false
    }

    // Check Mailgun configuration
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_API_KEY !== 'mock_api_key') {
      checks.checks.mailgun = true
    }

    // Check Twilio configuration
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'mock_account_sid') {
      checks.checks.twilio = true
    }

    // Check Stripe configuration
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock') {
      checks.checks.stripe = true
    }

    // Determine overall health
    // API and database are critical
    const criticalChecks = [checks.checks.api, checks.checks.database]
    const allCriticalHealthy = criticalChecks.every(check => check === true)
    
    if (!allCriticalHealthy) {
      checks.status = "unhealthy"
      return NextResponse.json(checks, { status: 503 })
    }

    // If critical services are up but others aren't, status is "degraded"
    const allChecks = Object.values(checks.checks)
    const allHealthy = allChecks.every(check => check === true)
    
    if (!allHealthy) {
      checks.status = "degraded"
    }

    return NextResponse.json(checks, { 
      status: checks.status === "unhealthy" ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      service: "emailtotext",
      error: "Health check failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 503 })
  }
}
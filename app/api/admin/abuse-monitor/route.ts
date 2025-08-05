import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { Redis } from "@upstash/redis"
import { supabaseAdmin } from "@/lib/supabase"
import { requireSupabaseAdmin } from "@/lib/supabase-helpers"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Admin emails allowed to access this endpoint
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean)

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin based on email
    const userEmail = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json()).then(data => data.email_addresses?.[0]?.email_address)

    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get abuse metrics
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    // Initialize variables that will be used in the response
    let blockedIps: any[] = []
    let suspiciousActivities: any[] = []
    let rateLimitStats = {
      phoneVerification: 0,
      perPhone: 0,
      globalIP: 0,
      burst: 0,
    }

    // Check if Supabase is configured
    const adminCheck = requireSupabaseAdmin('abuse monitoring')
    if (adminCheck.error) {
      // Still try to get Redis data even without Supabase
      try {
        // Get blocked IPs from Redis
        const blockedIpsKeys = await redis.keys("blocked-ip:*")
        for (const key of blockedIpsKeys) {
          const reason = await redis.get(key)
          const ip = key.replace("blocked-ip:", "")
          const ttl = await redis.ttl(key)
          blockedIps.push({ ip, reason, expiresIn: ttl })
        }

        // Get suspicious activity logs
        const suspiciousKeys = await redis.keys("suspicious:*")
        for (const key of suspiciousKeys.slice(0, 50)) {
          const data = await redis.get(key)
          if (data) {
            suspiciousActivities.push(JSON.parse(data as string))
          }
        }

        // Get rate limit analytics
        const rateLimitKeys = await redis.keys("rl:*")
        for (const key of rateLimitKeys) {
          if (key.includes("phone-verify")) rateLimitStats.phoneVerification++
          else if (key.includes("per-phone")) rateLimitStats.perPhone++
          else if (key.includes("global-ip")) rateLimitStats.globalIP++
          else if (key.includes("burst")) rateLimitStats.burst++
        }
      } catch (redisError) {
        console.error('Redis error in abuse monitor:', redisError)
      }

      // Return partial data without database info
      return NextResponse.json({
        recentAttempts: [],
        blockedIps,
        suspiciousActivities: suspiciousActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, 50),
        rateLimitStats,
        verificationStats: { total: 0, successful: 0, failed: 0, successRate: 0 },
        summary: {
          totalAttempts: 0,
          uniqueIPs: 0,
          uniquePhones: 0,
          blockedIPs: blockedIps.length,
          suspiciousActivities: suspiciousActivities.length
        }
      })
    }

    // Get recent verification attempts from database
    const { data: recentAttempts, error: attemptsError } = await adminCheck.admin!
      .from("verification_logs")
      .select("*")
      .gte("created_at", oneHourAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(100)

    if (attemptsError) throw attemptsError

    // Get blocked IPs from Redis
    const blockedIpsKeys = await redis.keys("blocked-ip:*")
    blockedIps = []
    
    for (const key of blockedIpsKeys) {
      const reason = await redis.get(key)
      const ip = key.replace("blocked-ip:", "")
      const ttl = await redis.ttl(key)
      blockedIps.push({ ip, reason, expiresIn: ttl })
    }

    // Get suspicious activity logs
    const suspiciousKeys = await redis.keys("suspicious:*")
    suspiciousActivities = []
    
    for (const key of suspiciousKeys.slice(0, 50)) { // Limit to 50 most recent
      const data = await redis.get(key)
      if (data) {
        suspiciousActivities.push(JSON.parse(data as string))
      }
    }

    // Get rate limit analytics
    const rateLimitKeys = await redis.keys("rl:*")
    rateLimitStats = {
      phoneVerification: 0,
      perPhone: 0,
      globalIP: 0,
      burst: 0,
    }

    for (const key of rateLimitKeys) {
      if (key.includes("phone-verify")) rateLimitStats.phoneVerification++
      else if (key.includes("per-phone")) rateLimitStats.perPhone++
      else if (key.includes("global-ip")) rateLimitStats.globalIP++
      else if (key.includes("burst")) rateLimitStats.burst++
    }

    // Get verification success/failure rates
    const { data: verificationStats, error: statsError } = await adminCheck.admin!
      .from("verification_logs")
      .select("success, count", { count: "exact" })
      .gte("created_at", oneDayAgo.toISOString())

    if (statsError) throw statsError

    const successCount = verificationStats?.filter(v => v.success).length || 0
    const failureCount = verificationStats?.filter(v => !v.success).length || 0

    // Get top attempted phone numbers
    const { data: topPhones, error: phonesError } = await supabaseAdmin
      .from("phone_verifications")
      .select("phone, count")
      .gte("created_at", oneDayAgo.toISOString())
      .order("count", { ascending: false })
      .limit(10)

    if (phonesError) throw phonesError

    // Create alert thresholds
    const alerts = []
    
    // Alert if too many blocked IPs
    if (blockedIps.length > 10) {
      alerts.push({
        type: "warning",
        message: `${blockedIps.length} IPs are currently blocked`,
        severity: "medium"
      })
    }

    // Alert if high failure rate
    const failureRate = failureCount / (successCount + failureCount) || 0
    if (failureRate > 0.3) {
      alerts.push({
        type: "error",
        message: `High failure rate: ${(failureRate * 100).toFixed(1)}%`,
        severity: "high"
      })
    }

    // Alert if suspicious activity spike
    const recentSuspicious = suspiciousActivities.filter(
      a => new Date(a.timestamp) > oneHourAgo
    ).length
    
    if (recentSuspicious > 20) {
      alerts.push({
        type: "error",
        message: `${recentSuspicious} suspicious activities in the last hour`,
        severity: "high"
      })
    }

    return NextResponse.json({
      summary: {
        totalAttempts24h: verificationStats?.length || 0,
        successfulVerifications: successCount,
        failedVerifications: failureCount,
        successRate: ((successCount / (successCount + failureCount)) * 100).toFixed(1) + "%",
        blockedIPs: blockedIps.length,
        suspiciousActivities: suspiciousActivities.length,
      },
      alerts,
      blockedIPs: blockedIps.slice(0, 20), // Top 20
      suspiciousActivities: suspiciousActivities.slice(0, 20), // Most recent 20
      rateLimitStats,
      recentAttempts: recentAttempts?.slice(0, 20) || [], // Most recent 20
      topPhoneNumbers: topPhones || [],
      timestamp: now.toISOString(),
    })
    
  } catch (error: any) {
    console.error("Abuse monitor error:", error)
    return NextResponse.json(
      { error: "Failed to fetch abuse metrics" },
      { status: 500 }
    )
  }
}
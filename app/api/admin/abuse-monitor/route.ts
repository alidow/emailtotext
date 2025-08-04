import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { Redis } from "@upstash/redis"
import { supabaseAdmin } from "@/lib/supabase"

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

    // Check if user is admin (you'd implement this based on your user system)
    // For now, we'll use a simple check
    const isAdmin = true // Replace with actual admin check

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get abuse metrics
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    // Get recent verification attempts from database
    const { data: recentAttempts, error: attemptsError } = await supabaseAdmin
      .from("verification_logs")
      .select("*")
      .gte("created_at", oneHourAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(100)

    if (attemptsError) throw attemptsError

    // Get blocked IPs from Redis
    const blockedIpsKeys = await redis.keys("blocked-ip:*")
    const blockedIps = []
    
    for (const key of blockedIpsKeys) {
      const reason = await redis.get(key)
      const ip = key.replace("blocked-ip:", "")
      const ttl = await redis.ttl(key)
      blockedIps.push({ ip, reason, expiresIn: ttl })
    }

    // Get suspicious activity logs
    const suspiciousKeys = await redis.keys("suspicious:*")
    const suspiciousActivities = []
    
    for (const key of suspiciousKeys.slice(0, 50)) { // Limit to 50 most recent
      const data = await redis.get(key)
      if (data) {
        suspiciousActivities.push(JSON.parse(data as string))
      }
    }

    // Get rate limit analytics
    const rateLimitKeys = await redis.keys("rl:*")
    const rateLimitStats = {
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
    const { data: verificationStats, error: statsError } = await supabaseAdmin
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
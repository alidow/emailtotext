import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Different rate limiters for different purposes
export const rateLimiters = {
  // For phone verification - strict limits
  phoneVerification: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 attempts per hour per IP
    analytics: true,
    prefix: "rl:phone-verify",
  }),
  
  // Per phone number limit - prevent targeting specific numbers
  perPhoneNumber: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "24 h"), // 2 attempts per day per phone number
    analytics: true,
    prefix: "rl:per-phone",
  }),
  
  // Global IP limit - prevent overall abuse
  globalIP: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 attempts per hour across all endpoints
    analytics: true,
    prefix: "rl:global-ip",
  }),
  
  // Burst protection - prevent rapid-fire attempts
  burst: new Ratelimit({
    redis,
    limiter: Ratelimit.tokenBucket(1, "10 s", 3), // 1 request per 10 seconds, burst of 3
    analytics: true,
    prefix: "rl:burst",
  }),
}

// Helper to get client IP
export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for")
  const xri = request.headers.get("x-real-ip")
  const cfIp = request.headers.get("cf-connecting-ip") // Cloudflare
  
  return cfIp || (xff ? xff.split(",")[0].trim() : xri || "unknown")
}

// Check if IP is from known VPN/proxy
export async function isVpnOrProxy(ip: string): Promise<boolean> {
  // In production, you'd check against a VPN/proxy detection service
  // For now, we'll implement basic checks
  
  // Check if IP is in blocklist
  const blocked = await redis.get(`blocked-ip:${ip}`)
  if (blocked) return true
  
  // Check for common VPN/datacenter IP ranges
  const vpnPatterns = [
    /^10\./, // Private network
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private network
    /^192\.168\./, // Private network
    /^127\./, // Localhost
  ]
  
  return vpnPatterns.some(pattern => pattern.test(ip))
}

// Block an IP address
export async function blockIp(ip: string, reason: string, duration = 86400): Promise<void> {
  await redis.setex(`blocked-ip:${ip}`, duration, reason)
}

// Check if phone number is suspicious
export async function isSuspiciousPhoneNumber(phone: string): Promise<boolean> {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "")
  
  // Check for obviously fake patterns
  const fakePatterns = [
    /^1?5{10}$/, // All 5s
    /^1?(\d)\1{9}$/, // Same digit repeated
    /^1?1234567890$/, // Sequential
    /^1?0{10}$/, // All zeros
  ]
  
  if (fakePatterns.some(pattern => pattern.test(digits))) {
    return true
  }
  
  // Check if number has been flagged
  const flagged = await redis.get(`flagged-phone:${digits}`)
  return !!flagged
}

// Log suspicious activity
export async function logSuspiciousActivity(
  ip: string,
  phone: string,
  reason: string
): Promise<void> {
  const timestamp = new Date().toISOString()
  const key = `suspicious:${timestamp}:${ip}`
  
  await redis.setex(key, 86400 * 7, JSON.stringify({
    ip,
    phone,
    reason,
    timestamp,
  }))
  
  // Increment suspicious activity counter for this IP
  const countKey = `suspicious-count:${ip}`
  const count = await redis.incr(countKey)
  await redis.expire(countKey, 86400) // Reset daily
  
  // Auto-block if too many suspicious activities
  if (count > 5) {
    await blockIp(ip, "Too many suspicious activities", 86400 * 7) // 7 day ban
  }
}
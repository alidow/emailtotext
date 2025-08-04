import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a new Redis instance for middleware (only if configured)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Global rate limiter for API routes
const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
      analytics: true,
      prefix: 'middleware',
    })
  : null

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Skip rate limiting if not configured
  if (!ratelimit) {
    return NextResponse.next()
  }

  // Get client IP
  const ip = request.ip ?? 
    request.headers.get('x-forwarded-for')?.split(',')[0] ?? 
    request.headers.get('x-real-ip') ?? 
    request.headers.get('cf-connecting-ip') ?? // Cloudflare
    'unknown'

  // Apply rate limiting to sensitive endpoints
  const sensitivePaths = [
    '/api/send-verification',
    '/api/verify-code',
    '/api/register',
  ]

  if (sensitivePaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip)

      if (!success) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Too many requests. Please try again later.', 
            retryAfter: new Date(reset).toISOString() 
          }),
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': new Date(reset).toISOString(),
              'Content-Type': 'application/json',
            },
          }
        )
      }

      // Add rate limit headers to successful requests
      const response = NextResponse.next()
      response.headers.set('X-RateLimit-Limit', limit.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString())
      
      return response
    } catch (error) {
      console.error('Middleware rate limit error:', error)
      // Continue if rate limiting fails
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
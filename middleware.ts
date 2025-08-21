import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
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

// Create matchers
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/create-user',
  '/api/user',
  '/api/admin/(.*)',
  '/onboarding',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/send-verification',
  '/api/verify-phone',
  '/api/webhooks/(.*)',
  '/api/stripe-webhook',
  '/features/(.*)',
  '/pricing',
  '/e/(.*)',
])

// Custom middleware function for rate limiting
async function rateLimitMiddleware(request: NextRequest) {
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

// Export Clerk middleware with custom rate limiting
export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host') || ''
  
  // Redirect to www and HTTPS in production
  const isProduction = process.env.NODE_ENV === 'production'
  const isHttp = url.protocol === 'http:'
  const isNonWww = hostname === 'emailtotextnotify.com'
  
  if (isProduction && (isHttp || isNonWww)) {
    url.protocol = 'https:'
    url.host = 'www.emailtotextnotify.com'
    return NextResponse.redirect(url, { status: 301 })
  }
  
  // Apply rate limiting first
  const rateLimitResponse = await rateLimitMiddleware(req)
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
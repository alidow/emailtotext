# SMS Verification Security Implementation

This document outlines the comprehensive security measures implemented to prevent SMS spam and abuse in the Email to Text Notifier application.

## Overview

The SMS verification system has multiple layers of protection to prevent abuse while maintaining a good user experience for legitimate users.

## Security Layers

### 1. Rate Limiting (Multiple Layers)

#### IP-Based Rate Limits
- **Phone Verification**: 3 attempts per hour per IP
- **Global IP Limit**: 10 requests per hour across all endpoints
- **Burst Protection**: 1 request per 10 seconds with burst of 3
- **Middleware**: 100 requests per hour for API routes

#### Phone Number Rate Limits
- **Per Phone Number**: 2 verification attempts per 24 hours
- **Recent Attempts**: 30-second cooldown between attempts to same number

### 2. CAPTCHA Protection

- **Cloudflare Turnstile**: Required for all verification attempts
- **Invisible challenge**: Minimal friction for legitimate users
- **Bot detection**: Automatically blocks automated attempts

### 3. Phone Number Validation

#### Pattern Detection
- Blocks obviously fake numbers (all same digits, sequential, etc.)
- Validates phone number length (10-15 digits)
- Checks against known test number patterns

#### Suspicious Activity Detection
- Tracks rapid attempts to different numbers
- Monitors for pattern-based attacks
- Auto-blocks IPs showing suspicious behavior

### 4. VPN/Proxy Detection

- Blocks requests from known VPN/proxy IPs
- Checks against private network ranges
- Maintains blocklist of suspicious IPs

### 5. Monitoring & Alerting

#### Abuse Monitoring Dashboard (`/api/admin/abuse-monitor`)
- Real-time metrics on verification attempts
- Blocked IP tracking
- Suspicious activity logs
- Success/failure rates
- Alert thresholds for unusual activity

#### Automatic Actions
- Auto-block IPs after 5 suspicious activities
- 7-day bans for severe violations
- 24-hour bans for minor violations

### 6. Database Logging

All verification attempts are logged with:
- IP address
- User agent
- Timestamp
- Success/failure status
- Phone number (hashed for privacy)

## Implementation Details

### Rate Limiting with Upstash Redis

```typescript
// Multiple rate limiters for different purposes
export const rateLimiters = {
  phoneVerification: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "rl:phone-verify",
  }),
  perPhoneNumber: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "24 h"),
    analytics: true,
    prefix: "rl:per-phone",
  }),
  // ... more limiters
}
```

### CAPTCHA Integration

```typescript
// Frontend component
<Turnstile
  siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
  onVerify={(token) => setCaptchaToken(token)}
  onError={() => setError("Security check failed")}
/>

// Backend verification
const captchaResponse = await fetch(
  'https://challenges.cloudflare.com/turnstile/v0/siteverify',
  {
    method: 'POST',
    body: JSON.stringify({
      secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
      response: captchaToken,
      remoteip: clientIp,
    }),
  }
)
```

### Suspicious Pattern Detection

```typescript
// Check for fake number patterns
const fakePatterns = [
  /^1?5{10}$/,          // All 5s
  /^1?(\d)\1{9}$/,      // Same digit repeated
  /^1?1234567890$/,     // Sequential
  /^1?0{10}$/,          // All zeros
]
```

## Configuration

### Required Environment Variables

```env
# Rate Limiting
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# CAPTCHA
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your-site-key
CLOUDFLARE_TURNSTILE_SECRET_KEY=your-secret-key

# Monitoring
ADMIN_EMAILS=admin@example.com,security@example.com
```

## Monitoring

### Check Abuse Metrics

1. Access `/api/admin/abuse-monitor` (requires admin authentication)
2. Monitor key metrics:
   - Total verification attempts
   - Success/failure rates
   - Blocked IPs
   - Suspicious activities
   - Rate limit violations

### Alerts

The system generates alerts for:
- High failure rates (>30%)
- Multiple blocked IPs (>10)
- Suspicious activity spikes (>20/hour)

## Best Practices

1. **Regular Monitoring**: Check abuse metrics daily
2. **Update Blocklists**: Add new suspicious patterns as discovered
3. **Adjust Rate Limits**: Fine-tune based on usage patterns
4. **Review Logs**: Analyze failed attempts for new attack patterns
5. **Test Regularly**: Ensure security doesn't impact legitimate users

## Emergency Response

If under attack:

1. **Immediate Actions**:
   - Increase rate limits temporarily
   - Enable stricter CAPTCHA challenges
   - Block suspicious IP ranges

2. **Investigation**:
   - Check abuse monitor for patterns
   - Review Twilio logs for abuse
   - Analyze blocked IPs for commonalities

3. **Long-term Fixes**:
   - Update validation patterns
   - Implement additional checks
   - Consider requiring authentication

## Future Enhancements

- [ ] Machine learning for pattern detection
- [ ] Geographic restrictions
- [ ] Device fingerprinting
- [ ] Behavioral analysis
- [ ] Integration with third-party fraud detection services
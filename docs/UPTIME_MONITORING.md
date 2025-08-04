# Uptime Monitoring Setup Guide

Uptime monitoring ensures your Email to Text Notifier service is always available and alerts you immediately if it goes down.

## Recommended Services (Choose One)

### 1. **Better Stack (Better Uptime) - Recommended**
- **Free tier**: 10 monitors, 3-minute checks
- **Features**: Status pages, incident management, on-call scheduling
- **Setup**:
  1. Sign up at [betterstack.com](https://betterstack.com)
  2. Create a new monitor
  3. Add these endpoints:
     - `https://emailtotextnotify.com` (Homepage)
     - `https://emailtotextnotify.com/api/health` (API health check)
  4. Set check frequency (3 minutes on free plan)
  5. Configure alerts (email, SMS, Slack)

### 2. **UptimeRobot**
- **Free tier**: 50 monitors, 5-minute checks
- **Features**: Public status pages, multiple alert channels
- **Setup**:
  1. Sign up at [uptimerobot.com](https://uptimerobot.com)
  2. Click "Add New Monitor"
  3. Monitor Type: HTTP(s)
  4. URL: `https://emailtotextnotify.com`
  5. Check interval: 5 minutes
  6. Alert contacts: Add your email/SMS

### 3. **Pingdom (SolarWinds)**
- **Free tier**: 1 monitor with 10 SMS alerts/month
- **Features**: Detailed performance metrics, root cause analysis
- **Setup**:
  1. Sign up at [pingdom.com](https://www.pingdom.com)
  2. Add website check
  3. Configure alert policies

### 4. **StatusCake**
- **Free tier**: 10 monitors, 5-minute checks
- **Features**: Page speed monitoring, SSL monitoring
- **Setup**:
  1. Sign up at [statuscake.com](https://www.statuscake.com)
  2. Add Uptime test
  3. Configure contact groups

## Creating a Health Check Endpoint

First, let's create a proper health check endpoint for monitoring:

```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: {
      api: true,
      database: false,
      mailgun: false,
      twilio: false,
    }
  }

  try {
    // Check database connection
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)
      .single()
    
    checks.checks.database = !dbError

    // Check Mailgun (if needed)
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_API_KEY !== 'mock_api_key') {
      checks.checks.mailgun = true
    }

    // Check Twilio (if needed)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'mock_account_sid') {
      checks.checks.twilio = true
    }

    // Determine overall health
    const criticalChecks = [checks.checks.api, checks.checks.database]
    const allHealthy = criticalChecks.every(check => check === true)
    
    if (!allHealthy) {
      checks.status = "unhealthy"
      return NextResponse.json(checks, { status: 503 })
    }

    return NextResponse.json(checks)
  } catch (error) {
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Health check failed"
    }, { status: 503 })
  }
}
```

## What to Monitor

### 1. **Critical Endpoints**
- Homepage: `https://emailtotextnotify.com`
- API Health: `https://emailtotextnotify.com/api/health`
- Supabase Edge Function: `https://your-project.supabase.co/functions/v1/process-email`

### 2. **Response Time Thresholds**
- Homepage: < 3 seconds
- API endpoints: < 1 second
- Edge functions: < 5 seconds

### 3. **SSL Certificate Monitoring**
- Alert 30 days before expiration
- Check certificate validity

## Alert Configuration

### Email Alerts
- Primary contact for all incidents
- Include error details and response codes

### SMS Alerts (Critical Only)
- Only for complete outages
- API health check failures
- SSL certificate issues

### Slack/Discord Integration
- Real-time notifications
- Less critical alerts
- Performance degradation warnings

## Incident Response Plan

1. **Immediate Response (< 5 minutes)**
   - Check Vercel dashboard for deployment issues
   - Check Supabase dashboard for database issues
   - Review recent deployments

2. **Investigation (5-15 minutes)**
   - Check Sentry for recent errors
   - Review server logs
   - Test critical user flows manually

3. **Communication**
   - Update status page (if you have one)
   - Notify users via email/social media for extended outages

## Status Page (Optional)

Consider adding a public status page:

1. **Better Stack Status Pages** (Free with Better Uptime)
2. **Instatus** (instatus.com) - Free tier available
3. **Custom Status Page** using Next.js:

```typescript
// app/status/page.tsx
export default async function StatusPage() {
  const healthCheck = await fetch('https://emailtotextnotify.com/api/health')
  const health = await healthCheck.json()
  
  return (
    <div>
      <h1>Service Status</h1>
      <div className={health.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}>
        {health.status === 'healthy' ? 'All Systems Operational' : 'Service Degradation'}
      </div>
    </div>
  )
}
```

## Monitoring Best Practices

1. **Check Frequency**
   - Production: Every 1-5 minutes
   - Non-critical: Every 10-15 minutes

2. **Alert Fatigue Prevention**
   - Set proper thresholds (2-3 consecutive failures)
   - Different channels for different severities
   - Quiet hours for non-critical alerts

3. **False Positive Reduction**
   - Longer timeout periods (30 seconds)
   - Multiple location checks
   - Retry failed checks

4. **Regular Testing**
   - Test alert channels monthly
   - Simulate outages quarterly
   - Review and update thresholds

## Integration with Sentry

Since you have Sentry set up, you can:
1. Create alerts in Sentry for error rate spikes
2. Set up performance monitoring alerts
3. Link uptime incidents to error tracking

## Quick Start Recommendation

For Email to Text Notifier, I recommend:

1. **Sign up for Better Stack** (free tier)
2. **Monitor these URLs**:
   - `https://emailtotextnotify.com` (1-minute checks)
   - `https://emailtotextnotify.com/api/health` (3-minute checks)
   - Your Supabase edge function URL (5-minute checks)
3. **Set up alerts**:
   - Email for all incidents
   - SMS for critical failures only
4. **Response time thresholds**:
   - Homepage: 3000ms warning, 5000ms critical
   - API: 1000ms warning, 3000ms critical
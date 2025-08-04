# Sentry Setup Instructions

## 1. Environment Variables

Add these to your `.env.local` file (and later to Vercel):

```bash
# Sentry Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_KEY@YOUR_ORG.ingest.sentry.io/YOUR_PROJECT_ID
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=emailtotext
SENTRY_AUTH_TOKEN=sntrys_YOUR_AUTH_TOKEN

# Optional: For better error tracking
SENTRY_ENVIRONMENT=production  # or development/staging
```

## 2. Getting Your Values

### DSN
- Found on your project's **Settings > Client Keys (DSN)** page
- Example: `https://abc123@o123456.ingest.sentry.io/1234567`

### Organization Slug
- Found in your Sentry URL: `https://YOUR-ORG-SLUG.sentry.io/`
- Or go to **Settings > General** and look for "Organization Slug"

### Project Name
- The name you gave your project (e.g., `emailtotext`)
- Found in **Settings > General**

### Auth Token (for source maps)
1. Go to **Settings > Account > API > Auth Tokens**
2. Click **"Create New Token"**
3. Give it a name like "emailtotext-sourcemaps"
4. Select scopes:
   - `project:releases` (create and edit releases)
   - `org:read` (read org details)
   - `project:write` (for source maps)
5. Click **"Create Token"**
6. Copy the token (starts with `sntrys_`)

## 3. Test Your Setup

### Local Testing
1. Add the environment variables to `.env.local`
2. Restart your development server: `npm run dev`
3. Trigger a test error by visiting: `/api/test-sentry` (create this endpoint)

### Create Test Endpoint
Create `/app/api/test-sentry/route.ts`:

```typescript
import { NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  try {
    throw new Error("Test Sentry error - this is intentional!")
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        test: true,
        endpoint: "test-sentry"
      }
    })
    return NextResponse.json({ 
      message: "Error sent to Sentry! Check your Sentry dashboard." 
    })
  }
}
```

## 4. Verify in Sentry Dashboard

1. Go to your Sentry project dashboard
2. Check the **Issues** tab
3. You should see "Test Sentry error - this is intentional!"
4. Click on it to see details including:
   - Stack trace
   - Browser/OS information
   - Custom tags

## 5. Vercel Deployment

Add these same environment variables to Vercel:

1. Go to your Vercel project
2. Navigate to **Settings > Environment Variables**
3. Add each variable for Production environment:
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN`

## 6. Advanced Configuration (Optional)

### Performance Monitoring
To enable performance monitoring, update `sentry.client.config.ts`:
```typescript
tracesSampleRate: 0.1, // Capture 10% of transactions
```

### Session Replay
Already configured to capture replays on errors:
```typescript
replaysSessionSampleRate: 0.1, // 10% of sessions
replaysOnErrorSampleRate: 1.0, // 100% when errors occur
```

### Release Tracking
Sentry will automatically track releases when deployed via Vercel.

## 7. Alerts & Notifications

1. Go to **Alerts** in Sentry
2. Create alert rules for:
   - High error rate
   - New error types
   - Performance degradation
3. Configure notifications via:
   - Email
   - Slack
   - PagerDuty

## Common Issues

### "Invalid DSN" Error
- Make sure you copied the entire DSN including `https://`
- Check there are no extra spaces

### Source Maps Not Working
- Ensure `SENTRY_AUTH_TOKEN` has the correct permissions
- Token must have `project:releases` scope

### No Errors Showing Up
- Check that `NODE_ENV` is not set to "development" in production
- Verify DSN is in `NEXT_PUBLIC_SENTRY_DSN` (needs the prefix)

## Testing Checklist

- [ ] Test error appears in Sentry dashboard
- [ ] Stack traces show correct file names and line numbers
- [ ] User context is captured (when logged in)
- [ ] Custom tags and extra data appear
- [ ] Replays work for errors
- [ ] Performance monitoring shows transactions
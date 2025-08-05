# URGENT: Credential Rotation Guide

## CRITICAL SECURITY ALERT
Your production credentials have been exposed in the `.env.production` file. You must rotate ALL credentials immediately.

## Step-by-Step Rotation Guide

### 1. Clerk Authentication
1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to API Keys
4. Generate new keys
5. Update:
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

### 2. Supabase
1. Go to https://app.supabase.com
2. Select your project
3. Settings > API
4. Regenerate:
   - Service role key (`SUPABASE_SERVICE_ROLE_KEY`)
   - Anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
5. Settings > Database
6. Reset database password (`SUPABASE_POSTGRES_PASSWORD`)

### 3. Twilio
1. Go to https://console.twilio.com
2. Account > API keys & tokens
3. Create new API key
4. Update:
   - `TWILIO_AUTH_TOKEN`
   - Consider getting a new phone number

### 4. Stripe
1. Go to https://dashboard.stripe.com
2. Developers > API keys
3. Roll secret key
4. Update:
   - `STRIPE_SECRET_KEY`
5. Webhooks > Update webhook signing secret
   - `STRIPE_WEBHOOK_SECRET`

### 5. Mailgun
1. Go to https://app.mailgun.com
2. Settings > API Security
3. Generate new API key
4. Update:
   - `MAILGUN_API_KEY`
5. Webhooks > Update signing key
   - `MAILGUN_WEBHOOK_SIGNING_KEY`

### 6. Upstash Redis
1. Go to https://console.upstash.com
2. Select your database
3. Details > REST API
4. Regenerate token
5. Update:
   - `UPSTASH_REDIS_REST_TOKEN`

### 7. Cloudflare Turnstile
1. Go to https://dash.cloudflare.com
2. Turnstile > Your site
3. Settings > Rotate secret key
4. Update:
   - `CLOUDFLARE_TURNSTILE_SECRET_KEY`

## After Rotation

1. Update all credentials in your production environment
2. Test all integrations to ensure they work
3. Monitor logs for any authentication failures
4. Consider implementing a secret management system (e.g., AWS Secrets Manager, HashiCorp Vault)

## Prevention

1. Never commit `.env.production` to git
2. Use environment variables in your hosting provider
3. Implement secret rotation policies
4. Use least-privilege access for all API keys
5. Monitor for exposed credentials using tools like GitGuardian

## Additional Security Measures Implemented

- Email viewer pages now require authentication
- Admin endpoints properly check user roles
- Test endpoints are secured
- Mailgun webhooks use HMAC with timestamp validation
- Rate limiting is enhanced
- CORS is properly configured
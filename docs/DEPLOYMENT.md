# Deployment Guide

## Prerequisites
- Vercel account
- Supabase account
- Clerk account
- Stripe account
- Twilio account
- Mailgun account
- Domain name (emailtotextnotify.com)

## Step 1: Environment Setup

Create a `.env.production` file with all required variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Twilio
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Mailgun
MAILGUN_API_KEY=xxx
MAILGUN_DOMAIN=txt.emailtotextnotify.com
MAILGUN_WEBHOOK_SIGNING_KEY=xxx

# App Config
NEXT_PUBLIC_APP_URL=https://emailtotextnotify.com
```

## Step 2: Supabase Setup

1. Create a new Supabase project
2. Run the database schema:
```bash
supabase db push --db-url "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

3. Deploy edge function:
```bash
cd supabase/functions/process-email
supabase functions deploy process-email
```

4. Set secrets:
```bash
supabase secrets set TWILIO_ACCOUNT_SID=xxx
supabase secrets set TWILIO_AUTH_TOKEN=xxx
supabase secrets set TWILIO_PHONE_NUMBER=xxx
supabase secrets set MAILGUN_WEBHOOK_SIGNING_KEY=xxx
supabase secrets set NEXT_PUBLIC_APP_URL=https://emailtotextnotify.com
```

## Step 3: Clerk Configuration

1. Create a Clerk application
2. Configure sign-up/sign-in:
   - Enable Email
   - Enable Google OAuth (optional)
3. Set redirect URLs:
   - Sign-in: `/dashboard`
   - Sign-up: `/onboarding`
4. Add production domain to allowed origins

## Step 4: Stripe Setup

1. Create products and prices:
   - Basic Plan: $4.99/month (annual: $47.88/year)
   - Standard Plan: $9.99/month (annual: $95.88/year)
   - Premium Plan: $19.99/month (annual: $191.88/year)
2. Get price IDs and add to environment variables:
   - `NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_STANDARD_ANNUAL_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID`
3. Configure webhook endpoint:
   - URL: `https://emailtotextnotify.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`
4. Set up Customer Portal

## Step 5: Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up custom domain:
   - Add `emailtotextnotify.com` and `www.emailtotextnotify.com`
   - Configure DNS records
4. Deploy:
```bash
vercel --prod
```

## Step 6: Post-Deployment

1. Test the complete flow:
   - Sign up with phone verification
   - Subscribe to a plan
   - Send test email
   - Verify SMS received

2. Configure monitoring:
   - Set up Vercel Analytics
   - Enable Supabase logging
   - Configure error tracking (Sentry)

3. Set up backups:
   - Enable Supabase database backups
   - Configure point-in-time recovery

## Production Checklist

### Security
- [ ] All API keys are in environment variables
- [ ] Database RLS policies are enabled
- [ ] HTTPS is enforced
- [ ] Rate limiting is configured
- [ ] Input validation is implemented

### Functionality
- [ ] Phone verification works
- [ ] Payment processing works
- [ ] Email receiving works
- [ ] SMS delivery works
- [ ] Usage quotas are enforced
- [ ] 24/7 delivery settings work

### Compliance
- [ ] TCPA consent is collected
- [ ] Privacy policy is published
- [ ] Terms of service are published
- [ ] Opt-out mechanism works

### Monitoring
- [ ] Error logging is set up
- [ ] Usage metrics are tracked
- [ ] Alerts are configured
- [ ] Backup strategy is in place

## Troubleshooting

### Common Issues

1. **SMS not sending**
   - Verify Twilio credentials
   - Check phone number format (E.164)
   - Review Twilio logs

2. **Emails not received**
   - Check Mailgun DNS settings
   - Verify routing rules
   - Review Mailgun logs

3. **Payment issues**
   - Verify Stripe webhook secret
   - Check webhook logs in Stripe
   - Ensure products/prices exist

4. **Authentication problems**
   - Verify Clerk keys
   - Check redirect URLs
   - Review Clerk logs

## Scaling Considerations

1. **Database**
   - Monitor connection pool
   - Consider read replicas
   - Implement caching

2. **Edge Functions**
   - Monitor execution time
   - Implement retry logic
   - Consider rate limiting

3. **SMS Delivery**
   - Monitor Twilio limits
   - Implement queue system
   - Consider multiple providers
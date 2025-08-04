# Email to Text Notifier - Setup Checklist

This checklist covers all the configuration steps needed to deploy Email to Text Notifier.

## ✅ Completed
- [x] Cookie consent banner implementation
- [x] Mailgun email templates for transactional emails
- [x] Email sending API endpoint
- [x] Email triggers integrated into user flows
- [x] Sentry error monitoring setup (code-side)

## 🔧 Required Configuration

### 1. Mailgun Setup
- [ ] Add `MAILGUN_API_KEY` to environment variables
  - Get from: Mailgun Dashboard > API Keys
- [ ] Verify `MAILGUN_DOMAIN` is set to `txt.emailtotextnotify.com`
- [ ] Ensure Mailgun route is configured (already done per user)

### 2. Stripe Configuration
- [ ] Create products in Stripe Dashboard:
  - Basic Plan ($4.99/month, $47.88/year)
  - Standard Plan ($9.99/month, $95.88/year)
  - Premium Plan ($19.99/month, $191.88/year)
- [ ] Add price IDs to environment:
  ```
  NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxx
  NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID=price_xxx
  NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID=price_xxx
  NEXT_PUBLIC_STRIPE_STANDARD_ANNUAL_PRICE_ID=price_xxx
  NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
  NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_xxx
  ```
- [ ] Configure webhook endpoint:
  - URL: `https://your-domain.com/api/stripe-webhook`
  - Events to listen for:
    - `checkout.session.completed`
    - `setup_intent.succeeded`
    - `invoice.payment_succeeded`
    - `invoice.payment_failed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `charge.succeeded`
    - `payment_method.attached`
- [ ] Add webhook signing secret: `STRIPE_WEBHOOK_SECRET=whsec_xxx`

### 3. Sentry Error Monitoring
- [ ] Create Sentry project
- [ ] Add environment variables:
  ```
  NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
  SENTRY_ORG=your-org
  SENTRY_PROJECT=emailtotext
  SENTRY_AUTH_TOKEN=xxx (for source maps upload)
  ```

### 4. Twilio Configuration
- [ ] Verify `TWILIO_PHONE_NUMBER` is approved for A2P messaging
- [ ] Ensure phone number is registered with carriers

### 5. Supabase Edge Functions
- [ ] Deploy the `process-email` edge function
- [ ] Add required secrets to edge function:
  ```bash
  supabase secrets set MAILGUN_WEBHOOK_SIGNING_KEY=xxx
  supabase secrets set TWILIO_ACCOUNT_SID=xxx
  supabase secrets set TWILIO_AUTH_TOKEN=xxx
  supabase secrets set TWILIO_PHONE_NUMBER=xxx
  supabase secrets set STRIPE_SECRET_KEY=xxx
  supabase secrets set STRIPE_BASIC_MONTHLY_PRICE_ID=xxx
  supabase secrets set NEXT_PUBLIC_APP_URL=https://emailtotextnotify.com
  ```

## 📊 Optional Enhancements

### Analytics
- [ ] Google Analytics 4
  - Add tracking ID to environment
  - Install @next/third-parties package
- [ ] Vercel Analytics
  - Enable in Vercel dashboard
  - Install @vercel/analytics

### Monitoring
- [ ] Uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Set up alerts for:
  - API endpoint failures
  - High error rates
  - Payment failures

### Customer Support
- [ ] Stripe Customer Portal
  - Enable in Stripe Dashboard
  - Configure allowed actions (cancel, update payment method)
  - Add portal link to settings page

## 🚀 Pre-Launch Checklist

1. [ ] All environment variables configured
2. [ ] Stripe products and webhooks tested
3. [ ] Email delivery tested (both transactional and SMS forwarding)
4. [ ] Error monitoring verified (trigger test error)
5. [ ] Payment flows tested:
   - [ ] Free plan signup (with card collection)
   - [ ] Paid plan signup
   - [ ] Plan upgrades
   - [ ] Auto-upgrade from free to basic
   - [ ] Auto-buy additional texts
6. [ ] Email templates rendered correctly
7. [ ] Cookie consent working
8. [ ] All links and buttons functional
9. [ ] SEO meta tags and sitemap verified
10. [ ] Legal pages accessible (privacy, terms, refund)
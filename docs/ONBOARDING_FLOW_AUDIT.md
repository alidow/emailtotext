# Onboarding Flow Audit

## Critical Issues Found & Fixed

1. **Missing Webhook Handlers** ✅ FIXED
   - Added `checkout.session.completed` handler for subscription activation
   - Added `setup_intent.succeeded` handler for free plan card collection
   - Without these, users would pay but not get activated subscriptions

2. **Missing Database Column** ✅ FIXED
   - Added `stripe_payment_method_id` column to track payment methods
   - Required for free plan auto-upgrade functionality

## All Possible User Flows

### Flow 1: Hero Phone Input → Free Plan
1. User enters phone on landing page hero
2. Redirects to `/verify?phone={phone}` (NO plan parameter)
3. Verify phone → redirect to `/sign-up`
4. Sign up → redirect to `/onboarding` (NO plan parameter)
5. User manually selects plan on onboarding page
6. If Free: Stripe checkout in "setup" mode to collect card
7. `checkout.session.completed` webhook fires → logs card added
8. User redirected to dashboard

**Billing Result**: Free plan with card on file for auto-upgrade

### Flow 2: Pricing "Start Free" Button → Free Plan
1. User clicks "Start Free" under Free plan
2. Redirects to `/verify` (NO parameters)
3. User must enter phone manually
4. Same flow as Flow 1 from step 3

**Billing Result**: Free plan with card on file

### Flow 3: Pricing "Get Started" Button → Paid Plan
1. User clicks "Get Started" under Basic/Standard/Premium
2. Redirects to `/verify?plan={plan}&billing={cycle}`
3. User must enter phone manually
4. Verify phone → redirect to `/sign-up?plan={plan}&billing={cycle}`
5. Sign up → redirect to `/onboarding?plan={plan}&billing={cycle}`
6. Plan auto-selected and form auto-submitted after 500ms
7. Stripe checkout in "subscription" mode with correct price ID
8. `checkout.session.completed` webhook fires → activates subscription
9. User redirected to dashboard

**Billing Result**: Active subscription at selected plan/cycle

### Flow 4: Direct Navigation to /onboarding
1. User navigates directly to `/onboarding`
2. No plan parameters → manual selection required
3. User selects plan and billing cycle
4. Same checkout flow as above

**Billing Result**: Depends on user selection

### Flow 5: Direct Navigation to /verify
1. User navigates directly to `/verify`
2. Must enter phone manually
3. No plan parameters passed through
4. Same as Flow 1 from step 3

**Billing Result**: User must manually select on onboarding

## Price ID Mapping

The system correctly handles annual vs monthly pricing:

- **Monthly Plans**:
  - Basic: `process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID`
  - Standard: `process.env.NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID`
  - Premium: `process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID`

- **Annual Plans** (20% discount):
  - Basic: `process.env.NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID`
  - Standard: `process.env.NEXT_PUBLIC_STRIPE_STANDARD_ANNUAL_PRICE_ID`
  - Premium: `process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID`

## Auto-Upgrade & Auto-Buy Logic

### Free Plan Auto-Upgrade
1. User exceeds 10 texts
2. `process-email` function creates subscription via Stripe API
3. Uses stored `stripe_payment_method_id` from setup
4. User upgraded to Basic plan ($4.99/month)
5. Email notification sent

### Paid Plan Auto-Buy
1. User exceeds monthly quota
2. `process-email` function creates one-time charge
3. Charges for 100 texts at plan rate + 10%:
   - Basic: $0.055/text
   - Standard/Premium: $0.022/text
4. Updates `additional_texts_purchased` in database
5. Email notification sent

## Edge Cases Handled

1. **Mid-cycle upgrade/downgrade**: Proration handled by Stripe
2. **Payment failures**: 3 retry attempts, then suspension
3. **Service suspension**: Plan set to "suspended", emails blocked
4. **Reactivation**: Automatic on successful payment
5. **Annual billing**: Discounted rates properly applied

## Required Environment Variables

```env
# Stripe Price IDs (must be created in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_STANDARD_ANNUAL_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_xxx

# Stripe Keys
STRIPE_SECRET_KEY=sk_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Testing Checklist

- [ ] Test hero phone input → free plan flow
- [ ] Test each pricing button (monthly & annual)
- [ ] Test direct navigation to each page
- [ ] Test Stripe webhook with CLI: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- [ ] Test auto-upgrade from free to basic
- [ ] Test auto-buy for paid plans
- [ ] Test payment failure scenarios
- [ ] Test plan switching (upgrade/downgrade)
- [ ] Test annual subscription creation
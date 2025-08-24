# GA4 Setup Guide for Email to Text Notifier

## Quick Setup Checklist (15 minutes)

### Step 1: Mark Events as Conversions (2 min)
Go to: [GA4 Admin > Events](https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/conversions/list)

Toggle "Mark as conversion" for these events:
- [ ] `account_created`
- [ ] `phone_verified` 
- [ ] `payment_completed`
- [ ] `start_flow_initiated` (optional)

### Step 2: Create Custom Dimensions (5 min)
Go to: [GA4 Admin > Custom Definitions](https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/customdefinitions/list)

Click "Create custom dimension" and add each:

| Dimension name | Scope | Description | Event parameter |
|----------------|-------|-------------|-----------------|
| Verification Method | Event | How user created account | `method` |
| Phone Number | User | User's phone (hashed) | `phone` |
| Plan Type | Event | Selected subscription plan | `plan` |
| Error Message | Event | Error details | `error` |
| Error Step | Event | Where error occurred | `step` |
| Button Clicked | Event | Which button was clicked | `button` |

### Step 3: Import GTM Container (3 min)
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Select your container (GTM-M7GMCQX9)
3. Go to Admin > Import Container
4. Upload the file: `/docs/gtm-container-config.json`
5. Choose "Merge" and "Rename conflicting tags"
6. Review and confirm
7. Submit and publish

### Step 4: Create Funnel Exploration (3 min)
Go to: [GA4 Explore](https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/analysis/p269480984/explorer)

1. Click "Blank" to create new exploration
2. Name it: "Signup Funnel Analysis"
3. Change visualization to "Funnel"
4. Add these steps in order:
   - Step 1: `start_page_view`
   - Step 2: `start_flow_initiated`
   - Step 3: `account_created`
   - Step 4: `phone_verified`
   - Step 5: `plan_selected`
   - Step 6: `payment_completed`

### Step 5: Google Ads Conversion Import (2 min)
If running Google Ads:

1. Go to [Google Ads Conversions](https://ads.google.com/aw/conversions)
2. Click "+ Conversion" > "Import"
3. Select "Google Analytics 4 properties"
4. Choose your property
5. Select and import:
   - `account_created`
   - `phone_verified`
   - `payment_completed`

## Verification Steps

### Check Events Are Flowing
1. Open your website with `?debug=analytics` added to URL
2. Go through signup flow
3. Watch [GA4 Realtime](https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/reports/realtime)
4. Verify events appear within 5 seconds

### Check DebugView
1. Events sent with `debug_mode: true` appear in [DebugView](https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/debugview)
2. You can see all parameters and values
3. Useful for troubleshooting

### Check Vercel Logs
Search for these prefixes:
- `[ANALYTICS_EVENT]` - All events
- `[PHONE_VERIFICATION_START]` - Code sent
- `[PHONE_VERIFICATION_SUCCESS]` - Phone verified
- `[ACCOUNT_CREATED]` - Account created
- `[PAYMENT_SUCCESS]` - Payment completed

## Event Reference

### Conversion Events (High Priority)
| Event | Value | When | Purpose |
|-------|-------|------|---------|
| `account_created` | 2.0 | Account creation | Track signups |
| `phone_verified` | 5.0 | Phone verification | Track activations |
| `payment_completed` | varies | Payment success | Track revenue |

### Engagement Events
| Event | When | Key Parameters |
|-------|------|----------------|
| `start_flow_initiated` | Click "Get Started" | `button`, `page_location` |
| `phone_code_sent` | Request verification | `phone` |
| `plan_selected` | Choose plan | `plan` |

### Diagnostic Events
| Event | When | Key Parameters |
|-------|------|----------------|
| `verification_error` | Verification fails | `error`, `step` |
| `payment_error` | Payment fails | `error` |

## Troubleshooting

### Events not showing in GA4?
1. Check Realtime report first (immediate)
2. Standard reports take 24-48 hours
3. Verify GTM is publishing correctly
4. Check browser console for errors
5. Use `?debug=analytics` to see client-side logs

### Conversions not tracking?
1. Ensure events are marked as conversions
2. Wait 24 hours for processing
3. Check date range in reports
4. Verify event parameters are correct

### Missing parameters?
1. Register as custom dimensions first
2. Parameters must be sent with event
3. Check parameter spelling (case-sensitive)
4. Max 25 parameters per event

## Support

- GA4 Property ID: `269480984`
- GTM Container: `GTM-M7GMCQX9` 
- Measurement ID: `G-CB0Q6E7ND3`

For issues, check Vercel logs for `[ANALYTICS_ERROR]` entries.
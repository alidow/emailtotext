# Mailgun Setup Guide for Email to Text Notifier

## Step 1: Add Domain to Mailgun

1. Log into your Mailgun account
2. Go to **Sending > Domains**
3. Click **Add New Domain**
4. Enter domain: `txt.emailtotextnotify.com`
5. Select region (preferably US)
6. Click **Add Domain**

## Step 2: Configure DNS Records

Add these DNS records to your domain (emailtotextnotify.com):

### Required MX Records (for receiving email)
```
Type: MX
Name: txt
Priority: 10
Value: mxa.mailgun.org

Type: MX  
Name: txt
Priority: 10
Value: mxb.mailgun.org
```

### SPF Record (for sending)
```
Type: TXT
Name: txt
Value: "v=spf1 include:mailgun.org ~all"
```

### DKIM Record (for authentication)
```
Type: TXT
Name: mailo._domainkey.txt
Value: [Mailgun will provide this - looks like "k=rsa; p=MIGfMA0GCS..."]
```

### Tracking CNAME (optional, for link tracking)
```
Type: CNAME
Name: email.txt
Value: mailgun.org
```

## Step 3: Verify Domain

1. After adding DNS records, go back to Mailgun
2. Click **Verify DNS Settings**
3. Wait for all checks to pass (can take up to 48 hours, usually much faster)

## Step 4: Setup Routing (for receiving emails)

1. Go to **Receiving > Routes**
2. Click **Create Route**
3. Configure:
   - **Expression Type**: Match Recipient
   - **Recipient**: `.*@txt.emailtotextnotify.com`
   - **Actions**: 
     - Check "Forward"
     - URL: `https://yeqhslferewupusmvggo.supabase.co/functions/v1/process-email`
     - Check "Store and notify"
   - **Description**: "Forward all emails to Supabase edge function"
   - **Priority**: 0
4. Click **Create Route**

## Step 5: Get API Credentials

1. Go to **Settings > API Keys**
2. Copy your **Private API Key** (starts with `key-`)
3. Copy your domain name: `txt.emailtotextnotify.com`

## Step 6: Setup Webhook Signing

1. Go to **Webhooks** (under your domain settings)
2. Click **Add Webhook**
3. Select webhook type: **Permanent Failure** and **Delivered**
4. Enter URL: `https://yeqhslferewupusmvggo.supabase.co/functions/v1/process-email`
5. After creating, find the **Signing Key** (click on the webhook to see it)

## Step 7: Update Environment Variables

### In `.env.production` file:
```bash
# Mailgun Configuration
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Your new Private API key
MAILGUN_DOMAIN=txt.emailtotextnotify.com
MAILGUN_WEBHOOK_SIGNING_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # From webhook settings
```

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Update these variables:
   - `MAILGUN_API_KEY` = [your new API key]
   - `MAILGUN_DOMAIN` = txt.emailtotextnotify.com
   - `MAILGUN_WEBHOOK_SIGNING_KEY` = [your webhook signing key]

### In Supabase Edge Functions:
1. Go to Supabase Dashboard
2. Navigate to **Edge Functions**
3. Click on `process-email` function
4. Go to **Secrets** tab
5. Add/Update these secrets:
   - `MAILGUN_API_KEY` = [your new API key]
   - `MAILGUN_DOMAIN` = txt.emailtotextnotify.com
   - `MAILGUN_WEBHOOK_SIGNING_KEY` = [your webhook signing key]
   - `TWILIO_ACCOUNT_SID` = [from .env.production]
   - `TWILIO_AUTH_TOKEN` = [from .env.production]
   - `TWILIO_PHONE_NUMBER` = +18669421024
   - `STRIPE_SECRET_KEY` = [from .env.production]
   - `NEXT_PUBLIC_APP_URL` = https://emailtotextnotify.com
   - `TEST_PHONE_NUMBERS` = +16096476162,6096476162
   - `ENABLE_TEST_MODE` = false
   - All Stripe price IDs from .env.production

## Step 8: Test the Setup

### Test DNS:
```bash
# Check MX records
dig MX txt.emailtotextnotify.com

# Check TXT records
dig TXT txt.emailtotextnotify.com
```

### Test Email Receiving:
1. Send test email to: `6096476162@txt.emailtotextnotify.com`
2. Check Mailgun logs: **Sending > Logs**
3. Check Supabase function logs
4. Check database:
```sql
-- Check SMS logs
SELECT * FROM sms_logs 
WHERE phone = '+16096476162'
ORDER BY created_at DESC;

-- Check emails table
SELECT * FROM emails
WHERE user_id IN (
  SELECT id FROM users WHERE phone = '+16096476162'
)
ORDER BY created_at DESC;
```

## Troubleshooting

### If webhook returns 401:
- Verify `MAILGUN_WEBHOOK_SIGNING_KEY` is set in Supabase
- Check if Mailgun is sending the signature header
- Look at Supabase function logs for details

### If no emails are received:
- Check MX records are properly configured
- Verify domain is verified in Mailgun
- Check routing rules in Mailgun

### If emails bounce:
- Check user exists in database with that phone number
- Verify phone number format (+16096476162)
- Check user quota hasn't been exceeded

## API Endpoints to Update

Make sure these files use the correct environment variables:
- `/app/api/emails/send/route.ts` - for sending emails
- `/supabase/functions/process-email/index.ts` - for receiving emails
- Any other files using Mailgun API

## Notes
- The domain `txt.emailtotextnotify.com` is a subdomain specifically for email receiving
- Main domain `emailtotextnotify.com` is for the web app
- Keep the webhook signing key secret - it's used to verify requests are from Mailgun
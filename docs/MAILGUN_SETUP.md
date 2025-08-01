# Mailgun Setup Guide

## Prerequisites
- Mailgun account (sign up at mailgun.com)
- Domain name (emailtotextnotify.com)
- Access to DNS settings

## Step 1: Add Domain to Mailgun

1. Log into Mailgun dashboard
2. Go to Sending > Domains
3. Click "Add New Domain"
4. Enter: `txt.emailtotextnotify.com` (subdomain for email receiving)
5. Select your region (US recommended)
6. Click "Add Domain"

## Step 2: Configure DNS Records

Add these DNS records to your domain:

### For Domain Verification:
```
Type: TXT
Name: txt
Value: v=spf1 include:mailgun.org ~all
```

```
Type: TXT  
Name: mx._domainkey.txt
Value: [Provided by Mailgun]
```

### For Email Receiving:
```
Type: MX
Name: txt
Priority: 10
Value: mxa.mailgun.org
```

```
Type: MX
Name: txt
Priority: 10
Value: mxb.mailgun.org
```

## Step 3: Create Routing Rule

1. In Mailgun dashboard, go to Receiving > Routes
2. Click "Create Route"
3. Configure:
   - Expression Type: Match Recipient
   - Recipient: `(.*)@txt.emailtotextnotify.com`
   - Actions: Forward to `https://[YOUR-SUPABASE-PROJECT].supabase.co/functions/v1/process-email`
   - Priority: 0
   - Description: "Forward all emails to Supabase function"
4. Click "Create Route"

## Step 4: Get API Credentials

1. Go to Settings > API Keys
2. Copy your Private API key
3. Go to Webhooks > Webhook signing key
4. Copy the signing key

## Step 5: Configure Supabase Edge Function

1. Deploy the edge function:
```bash
supabase functions deploy process-email
```

2. Set environment variables:
```bash
supabase secrets set MAILGUN_API_KEY=your-api-key
supabase secrets set MAILGUN_DOMAIN=txt.emailtotextnotify.com
supabase secrets set MAILGUN_WEBHOOK_SIGNING_KEY=your-signing-key
```

## Step 6: Test the Setup

Send a test email to: `1234567890@txt.emailtotextnotify.com`

Check:
1. Mailgun logs (Sending > Logs)
2. Supabase function logs
3. Database for stored email

## Troubleshooting

### DNS Not Verified
- Wait 24-48 hours for DNS propagation
- Use `dig` or `nslookup` to verify records

### Emails Not Received
- Check spam filters
- Verify MX records are correct
- Check Mailgun logs for bounces

### Webhook Errors
- Verify signing key is correct
- Check Supabase function logs
- Ensure function URL is accessible

## Production Checklist
- [ ] Domain verified in Mailgun
- [ ] DNS records configured
- [ ] Routing rule created
- [ ] API keys stored securely
- [ ] Edge function deployed
- [ ] Test email sent successfully
# Supabase Edge Function Deployment

## Prerequisites
1. Install Supabase CLI (already installed)
2. Get Supabase access token from https://app.supabase.com/account/tokens

## Deploy Edge Function

1. Login to Supabase CLI:
```bash
supabase login --token YOUR_ACCESS_TOKEN
```

2. Deploy the process-email function:
```bash
supabase functions deploy process-email --project-ref yeqhslferewupusmvggo
```

3. Set the required environment variables for the Edge Function:
```bash
# Set all required env vars
supabase secrets set --project-ref yeqhslferewupusmvggo \
  MAILGUN_WEBHOOK_SIGNING_KEY=your_mailgun_webhook_signing_key \
  TWILIO_ACCOUNT_SID=your_twilio_account_sid \
  TWILIO_AUTH_TOKEN=your_twilio_auth_token \
  TWILIO_PHONE_NUMBER=your_twilio_phone_number \
  NEXT_PUBLIC_APP_URL=https://emailtotextnotify.com
```

## Get Edge Function URL

After deployment, your Edge Function will be available at:
```
https://yeqhslferewupusmvggo.supabase.co/functions/v1/process-email
```

## Configure Mailgun Webhook

1. Go to Mailgun Dashboard > Webhooks
2. Add a new webhook:
   - URL: `https://yeqhslferewupusmvggo.supabase.co/functions/v1/process-email`
   - Events: Select "Inbound Message"
3. Copy the webhook signing key and update the Edge Function secrets

## Test the Function

You can test the function locally first:
```bash
supabase functions serve process-email --env-file .env.local
```

Then send a test request:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/process-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: multipart/form-data' \
  --form 'recipient="5551234567@txt.emailtotextnotify.com"' \
  --form 'sender="test@example.com"' \
  --form 'subject="Test Email"' \
  --form 'body-plain="This is a test email"' \
  --form 'timestamp="1234567890"' \
  --form 'token="test_token"' \
  --form 'signature="test_signature"'
```

## Monitoring

View function logs:
```bash
supabase functions logs process-email --project-ref yeqhslferewupusmvggo
```
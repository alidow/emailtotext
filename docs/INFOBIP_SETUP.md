# Infobip SMS Integration Setup Guide

## Overview

Email to Text Notifier now supports Infobip as an SMS provider in addition to Twilio. This provides:
- Redundancy and failover capabilities
- Alternative pricing options
- Better coverage in certain regions
- Automatic provider switching if one fails

## Getting Started with Infobip

### 1. Create an Infobip Account

1. Sign up at [Infobip.com](https://www.infobip.com)
2. Complete account verification
3. Note: Free trial includes 100 free SMS messages

### 2. Get Your API Credentials

1. Log into your [Infobip Dashboard](https://portal.infobip.com)
2. Navigate to **Developers** → **API Keys**
3. Create a new API key if you don't have one
4. Copy your:
   - **API Key**: Your authentication token
   - **Base URL**: Your account's base URL (e.g., `xxxxxx` from `xxxxxx.api.infobip.com`)

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# SMS Provider Configuration
# Options: 'twilio', 'infobip', or 'auto' (automatic failover)
SMS_PROVIDER=auto

# Infobip Configuration
INFOBIP_BASE_URL=your-base-url  # Without .api.infobip.com
INFOBIP_API_KEY=your-api-key-here
INFOBIP_SENDER_NAME=EmailToText  # Or your toll-free number
```

### 4. Install Dependencies

```bash
npm install @infobip-api/sdk axios
```

## Configuration Options

### Provider Selection Strategies

1. **Twilio Only** (existing setup):
   ```env
   SMS_PROVIDER=twilio
   ```

2. **Infobip Only**:
   ```env
   SMS_PROVIDER=infobip
   ```

3. **Automatic Failover** (recommended):
   ```env
   SMS_PROVIDER=auto
   ```
   - Tries Twilio first
   - Falls back to Infobip if Twilio fails
   - Remembers last successful provider

## Sender ID Configuration

### For US/Canada (Toll-Free Numbers)
If you have a toll-free number approved with Infobip:
```env
INFOBIP_SENDER_NAME=18669421024  # Your toll-free number without +
```

### For Other Regions
Use an alphanumeric sender ID:
```env
INFOBIP_SENDER_NAME=EmailAlert
```

## Testing the Integration

### 1. Test Mode
The integration respects the same test mode as Twilio:
```env
ENABLE_TEST_MODE=true
TEST_PHONE_NUMBERS=+15555551234,+15555555678
```

### 2. Send a Test SMS
```javascript
// Test in your application
import { smsProvider } from '@/lib/sms-provider'

await smsProvider.sendSMS({
  to: '+1234567890',
  body: 'Test message from Infobip',
  type: 'notification'
})
```

### 3. Check Logs
Monitor the console for:
```
Attempting to send SMS via infobip...
Successfully sent SMS via infobip
```

## Monitoring & Debugging

### Check Provider Status
```javascript
// Get configured providers
const providers = smsProvider.getConfiguredProviders()
console.log('Available providers:', providers)
// Output: ['twilio', 'infobip']

// Get current strategy
const strategy = smsProvider.getCurrentStrategy()
console.log('SMS strategy:', strategy)
// Output: 'auto'
```

### Database Logging
All SMS messages are logged in the `sms_logs` table with:
- `provider`: Which provider was used
- `provider_message_id`: Provider's message ID
- `status`: sent, failed, or test_mode
- `metadata`: Additional details including failover attempts

## Pricing Comparison

### Twilio (US)
- Toll-free SMS: ~$0.0075 per message
- Phone number: $2/month

### Infobip
- SMS: Starting at $0.0050 per message (volume-based)
- No monthly number fees for alphanumeric sender IDs
- Toll-free number fees vary by country

## Troubleshooting

### Common Issues

1. **"Infobip credentials not configured"**
   - Ensure `INFOBIP_BASE_URL` and `INFOBIP_API_KEY` are set
   - Restart your application after adding environment variables

2. **"Invalid API Key"**
   - Check that your API key is active in Infobip dashboard
   - Ensure no extra spaces in the environment variable

3. **"Message not delivered"**
   - For trial accounts, you can only send to verified numbers
   - Check recipient number format (international format required)

4. **Failover not working**
   - Ensure `SMS_PROVIDER=auto` is set
   - Check that both providers have valid credentials
   - Review console logs for specific error messages

### Getting Help

- Infobip Documentation: [docs.infobip.com](https://www.infobip.com/docs)
- Infobip Support: Available through your dashboard
- Our Support: support@emailtotextnotify.com

## Migration from Twilio-Only Setup

No changes required! The system is backward compatible:

1. If only Twilio is configured, it works exactly as before
2. Adding Infobip credentials enables failover automatically
3. All existing code continues to work without modification

## Best Practices

1. **Use Auto Mode**: Let the system choose the best provider
2. **Monitor Both Providers**: Set up alerts for both Twilio and Infobip
3. **Test Regularly**: Periodically test both providers work
4. **Keep Credentials Secure**: Never commit API keys to version control
5. **Review Logs**: Check `sms_logs` table for delivery patterns

## Advanced Configuration

### Custom Provider Priority
To prefer Infobip over Twilio, modify `lib/sms-provider.ts`:
```javascript
// Change provider order in auto mode
if (this.hasProvider('infobip')) {
  providers.push('infobip')
}
if (this.hasProvider('twilio')) {
  providers.push('twilio')
}
```

### Region-Based Routing
You can implement region-based provider selection:
```javascript
// Example: Use Infobip for European numbers
const isEuropean = to.startsWith('+3') || to.startsWith('+4')
const provider = isEuropean ? 'infobip' : 'twilio'
```

## Security Notes

1. **API Keys**: Store securely, rotate regularly
2. **Webhook Validation**: Both providers sign webhooks differently
3. **Rate Limiting**: Apply same limits regardless of provider
4. **Audit Logs**: Track which provider sent each message

## Next Steps

1. Sign up for Infobip account
2. Add credentials to `.env.local`
3. Run `npm install`
4. Test with a verification code
5. Monitor logs for successful delivery
6. Consider upgrading to production account for better rates
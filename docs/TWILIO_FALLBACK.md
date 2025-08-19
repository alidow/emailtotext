# Twilio Fallback Phone Numbers

This feature allows you to configure multiple Twilio phone numbers for SMS delivery. If the primary number fails to deliver a message, the system will automatically try backup numbers in sequence.

## Configuration

### Environment Variables

Add backup Twilio phone numbers to your `.env.local` or `.env.production`:

```env
# Primary Twilio number (required)
TWILIO_PHONE_NUMBER="+18669421024"

# Backup Twilio numbers (optional, comma-separated)
TWILIO_BACKUP_NUMBERS="+15551234567,+15559876543"
```

### Vercel Environment Variables

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add `TWILIO_BACKUP_NUMBERS` with comma-separated phone numbers
4. Redeploy your application

## How It Works

1. **Primary Number First**: The system always tries the primary number (`TWILIO_PHONE_NUMBER`) first
2. **Automatic Fallback**: If the primary number fails (due to filtering, blocking, or delivery issues), it automatically tries the backup numbers in order
3. **Quota Protection**: User quota is ONLY incremented when SMS is successfully delivered
4. **Safe Template Retry**: If a message fails on all numbers, the system tries again with a simplified "safe" template that's less likely to be filtered
5. **Logging**: All attempts are logged with details about which number was used and why fallback was triggered

## Failure Detection

The system detects various failure scenarios:
- Twilio error codes 30007 (filtered), 30008 (undelivered), 21610 (blocked)
- Message status "failed" or "undelivered"
- Network errors or API failures

## Testing

Test your configuration:

```bash
# Check configuration (no SMS sent)
npm run test:twilio-fallback

# Test sending to a phone number
npm run test:twilio-fallback +1234567890
```

## Monitoring

Failed deliveries trigger Sentry alerts (if configured) with details about:
- Which numbers were tried
- Specific error codes
- Whether the safe template was attempted

## Best Practices

1. **Number Selection**: Use numbers from different regions or carriers to maximize delivery success
2. **Monitor Delivery**: Check SMS logs regularly to identify patterns in delivery failures
3. **Test Regularly**: Periodically test all configured numbers to ensure they're working
4. **Gradual Rollout**: Start with one backup number and add more as needed

## Edge Function Support

The Supabase Edge Functions (`process-email`) also support multiple Twilio numbers with the same fallback logic. This ensures reliability for email-to-SMS forwarding.

## Example Configuration

For maximum reliability:

```env
# Primary number (toll-free, good for transactional messages)
TWILIO_PHONE_NUMBER="+18669421024"

# Backup numbers (mix of local and toll-free)
TWILIO_BACKUP_NUMBERS="+12125551234,+14155559876,+18885551234"
```

This gives you 4 numbers total, increasing the chances of successful delivery even if some numbers are temporarily blocked or filtered.
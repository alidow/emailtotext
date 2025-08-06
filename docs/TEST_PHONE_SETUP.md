# Test Phone Setup Guide

This guide explains how to use test phone numbers in production for testing without sending real SMS messages.

## Overview

Instead of a global test mode that affects all users, we use a phone-based testing approach. This allows:
- Real Stripe payments for all users
- SMS logging only for specific test phone numbers
- Production testing without affecting real users
- Easy management of test accounts

## Configuration

### 1. Set Test Phone Numbers

Add test phone numbers to your environment variables:

```bash
# In .env.production or Vercel environment variables
TEST_PHONE_NUMBERS=+15555551234,+15555555678,5555551234

# Multiple formats are supported:
# - With country code: +15555551234
# - Without country code: 5555551234
# - Comma-separated list for multiple numbers
```

### 2. How It Works

When a phone number is marked as a test phone:
- **Verification**: Code is stored in database but SMS is logged instead of sent
- **Email Forwarding**: Email content is logged to `sms_logs` table instead of sent via Twilio
- **Stripe Payments**: Still processed normally (real payments)
- **Database**: User is marked with `is_test_phone = true`

### 3. Database Schema

The system uses these fields:
- `users.is_test_phone` - Boolean flag for test users
- `phone_verifications.is_test_phone` - Tracks test verifications
- `sms_logs.status` - Shows 'test_phone' for test SMS

### 4. Verification Codes

For test phones:
- In development: Fixed code `123456`
- In production: Random 6-digit code (check `sms_logs` table)

### 5. Viewing Test SMS

Test SMS messages are stored in the `sms_logs` table:

```sql
-- View recent test SMS messages
SELECT * FROM sms_logs 
WHERE status = 'test_phone' 
ORDER BY created_at DESC 
LIMIT 10;

-- Get verification code for a test phone
SELECT message FROM sms_logs 
WHERE phone = '+15555551234' 
AND type = 'verification'
ORDER BY created_at DESC 
LIMIT 1;
```

### 6. Admin Features

You can manually mark users as test users:

```sql
-- Mark existing user as test user
UPDATE users 
SET is_test_phone = true 
WHERE phone = '+15555551234';
```

## Testing Workflow

1. **Add test phone to environment**:
   ```
   TEST_PHONE_NUMBERS=+15555551234
   ```

2. **Sign up with test phone**:
   - Go through normal signup flow
   - Enter test phone number
   - Check `sms_logs` table for verification code

3. **Verify test account works**:
   - Complete onboarding with real Stripe payment
   - Send test emails to forwarding address
   - Check `sms_logs` for forwarded messages

4. **Monitor test activity**:
   ```sql
   -- View all test phone activity
   SELECT * FROM sms_logs 
   WHERE metadata->>'test_phone' = 'true'
   ORDER BY created_at DESC;
   ```

## Benefits

- **Production-safe**: No risk of breaking real user flows
- **Real payments**: Test actual Stripe integration
- **Flexible**: Add/remove test numbers without code changes
- **Auditable**: All test SMS logged for verification
- **Isolated**: Test accounts don't affect real users

## Troubleshooting

### SMS not logging
- Check phone number format matches environment variable
- Verify `TEST_PHONE_NUMBERS` is set in production
- Check `is_test_phone` flag in users table

### Can't find verification code
- Query `sms_logs` table with exact phone number
- Check for recent entries (codes expire in 10 minutes)
- Ensure phone number includes country code

### Test phone receiving real SMS
- Verify environment variable is properly set
- Check if Twilio is configured (might fallback to real SMS)
- Ensure phone number format matches exactly
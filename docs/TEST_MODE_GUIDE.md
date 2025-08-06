# Test Mode Guide

## Overview
Test mode allows you to test your Email to Text Notifier application in production without processing real payments through Stripe or sending actual SMS messages through Twilio. Instead, all SMS messages are logged to a database where you can view them.

## Enabling Test Mode

1. Set the following environment variables in your production environment:
   ```
   ENABLE_TEST_MODE=true
   NEXT_PUBLIC_ENABLE_TEST_MODE=true
   ```

2. Deploy your application with these settings.

## Features in Test Mode

### 1. SMS Logging
- All SMS messages (verification codes, email forwards, notifications) are logged to the `sms_logs` table
- No actual SMS messages are sent via Twilio
- View all logged messages at `/admin/sms-logs` (requires admin access)

### 2. Payment Simulation
- Stripe checkout sessions are simulated
- Users are redirected to `/test-checkout/[sessionId]` instead of Stripe
- Clicking "Complete Test Payment" simulates a successful payment
- All payment attempts are logged to the `payment_logs` table

### 3. Visual Indicators
- A yellow banner appears at the top of all pages indicating test mode is active
- Test mode badges appear in relevant UI components
- SMS logs show "test_mode" status

### 4. Admin Features
- **SMS Logs Viewer** (`/admin/sms-logs`)
  - View all SMS messages that would have been sent
  - Filter by type (verification, notification, email_forward)
  - Filter by status (sent, failed, test_mode, queued)
  - Search by phone number or message content
  - Export logs as CSV

## Testing Scenarios

### Phone Verification
1. Enter any valid phone number format
2. The verification code will be logged instead of sent
3. Check `/admin/sms-logs` to see the code
4. Use the code to complete verification

### Email Forwarding
1. Send an email to your assigned email address
2. The SMS that would be sent is logged
3. View the message content in the SMS logs

### Plan Upgrades
1. Go through the checkout flow
2. You'll be redirected to the test checkout page
3. Click "Complete Test Payment"
4. Your plan will be upgraded without any real payment

### Auto-upgrade/Auto-buy
- When quotas are exceeded, the system logs what would happen
- No real charges are made
- Check `payment_logs` table for details

## Admin Access

To access admin features like SMS logs:
1. Add your email to the `ADMIN_EMAILS` environment variable (comma-separated)
2. Sign in with that email address
3. Navigate to `/admin/sms-logs`

## Database Tables

### sms_logs
```sql
- id: UUID
- user_id: Reference to user
- phone: Phone number
- message: SMS content
- type: verification | notification | email_forward
- status: sent | failed | test_mode | queued
- metadata: JSON with additional details
- created_at: Timestamp
```

### payment_logs
```sql
- id: UUID
- user_id: Reference to user
- type: checkout | subscription | payment | refund
- status: success | failed | test_mode | pending
- amount: In cents
- metadata: JSON with additional details
- created_at: Timestamp
```

## Best Practices

1. **Test with Real Scenarios**: Use realistic phone numbers and email addresses
2. **Monitor Logs**: Regularly check SMS and payment logs to ensure everything works
3. **Test Edge Cases**: Try quota limits, failed payments, invalid inputs
4. **Use Test Users**: Mark specific users as test users with `is_test_user` flag

## Disabling Test Mode

To switch back to production mode:
1. Set `ENABLE_TEST_MODE=false` and `NEXT_PUBLIC_ENABLE_TEST_MODE=false`
2. Ensure you have valid Stripe and Twilio credentials configured
3. Deploy the changes

## Security Notes

- Test mode logs contain sensitive information (phone numbers, email content)
- Ensure proper access controls for admin endpoints
- Consider clearing test data before going live
- Test mode should only be used for testing, not as a permanent solution
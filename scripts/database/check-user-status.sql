-- Check user status
-- Run with: psql "postgresql://postgres:uHkXDfCdPe4CjScZ@db.yeqhslferewupusmvggo.supabase.co:5432/postgres" -f scripts/check-user-status.sql

-- Find users by phone or email
SELECT 
  id,
  clerk_id,
  phone,
  email,
  plan_type,
  phone_verified,
  stripe_customer_id,
  stripe_subscription_id,
  usage_count,
  usage_reset_at,
  is_test_user,
  created_at
FROM users
WHERE phone LIKE '%' || :phone_last_4_digits || '%'
   OR email = :email
ORDER BY created_at DESC;

-- Check recent phone verifications
SELECT 
  phone,
  code,
  expires_at,
  created_at
FROM phone_verifications
WHERE phone LIKE '%' || :phone_last_4_digits || '%'
ORDER BY created_at DESC
LIMIT 5;

-- Check recent SMS logs
SELECT 
  phone,
  message,
  type,
  status,
  created_at
FROM sms_logs
WHERE phone LIKE '%' || :phone_last_4_digits || '%'
ORDER BY created_at DESC
LIMIT 5;
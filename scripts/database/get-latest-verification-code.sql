-- Get the latest verification code from SMS logs
-- Run with: psql "postgresql://postgres:uHkXDfCdPe4CjScZ@db.yeqhslferewupusmvggo.supabase.co:5432/postgres" -f scripts/get-latest-verification-code.sql

SELECT 
  phone,
  message,
  created_at,
  metadata->>'code' as verification_code
FROM sms_logs 
WHERE type = 'verification' 
  AND status = 'test_mode'
ORDER BY created_at DESC 
LIMIT 5;
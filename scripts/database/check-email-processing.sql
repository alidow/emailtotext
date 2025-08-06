-- Check if email was received and processed
SELECT * FROM emails 
WHERE user_id IN (
  SELECT id FROM users WHERE phone = '+16096476162'
)
ORDER BY created_at DESC
LIMIT 5;

-- Check SMS logs for test phone
SELECT * FROM sms_logs 
WHERE phone = '+16096476162'
ORDER BY created_at DESC
LIMIT 5;

-- Check user details
SELECT id, phone, email, plan_type, usage_count, is_test_phone 
FROM users 
WHERE phone = '+16096476162';
-- Check if SMS was logged for test phone
SELECT 
    id,
    phone,
    message,
    type,
    status,
    created_at,
    metadata->>'short_url' as short_url,
    metadata->>'subject' as subject
FROM sms_logs 
WHERE phone = '+16096476162'
AND type = 'email_forward'
ORDER BY created_at DESC
LIMIT 5;

-- Check if email was stored
SELECT 
    e.id,
    e.subject,
    e.from_email,
    e.body,
    e.short_url,
    e.created_at,
    u.phone as user_phone
FROM emails e
JOIN users u ON e.user_id = u.id
WHERE u.phone = '+16096476162'
ORDER BY e.created_at DESC
LIMIT 5;

-- Verify user exists and is marked as test phone
SELECT 
    id,
    phone,
    email,
    plan_type,
    usage_count,
    is_test_phone
FROM users 
WHERE phone = '+16096476162';
-- Comprehensive check for test phone email-to-SMS processing
WITH user_info AS (
  SELECT 
    id,
    phone,
    email,
    plan_type,
    usage_count,
    is_test_phone,
    created_at as user_created
  FROM users 
  WHERE phone = '+16096476162'
),
recent_sms AS (
  SELECT 
    s.id as sms_id,
    s.phone,
    s.message,
    s.type,
    s.status,
    s.created_at as sms_sent,
    s.metadata->>'short_url' as short_url,
    s.metadata->>'subject' as subject,
    s.metadata->>'from_email' as from_email,
    s.metadata->>'email_id' as email_id
  FROM sms_logs s
  WHERE s.phone = '+16096476162'
    AND s.type = 'email_forward'
  ORDER BY s.created_at DESC
  LIMIT 5
),
recent_emails AS (
  SELECT 
    e.id as email_id,
    e.subject,
    e.from_email,
    LEFT(e.body, 100) as body_preview,
    e.short_url,
    e.attachment_count,
    e.created_at as email_received
  FROM emails e
  JOIN user_info u ON e.user_id = u.id
  ORDER BY e.created_at DESC
  LIMIT 5
)
SELECT 
  '=== USER INFO ===' as section,
  u.phone,
  u.email,
  u.plan_type,
  u.usage_count::text,
  u.is_test_phone::text,
  NULL as message,
  NULL as status,
  NULL as short_url,
  NULL as subject,
  NULL as from_email,
  NULL as body_preview,
  NULL as attachment_count,
  u.user_created as timestamp
FROM user_info u

UNION ALL

SELECT 
  '=== RECENT SMS LOGS ===' as section,
  s.phone,
  NULL as email,
  NULL as plan_type,
  NULL as usage_count,
  NULL as is_test_phone,
  s.message,
  s.status,
  s.short_url,
  s.subject,
  s.from_email,
  NULL as body_preview,
  NULL as attachment_count,
  s.sms_sent as timestamp
FROM recent_sms s

UNION ALL

SELECT 
  '=== RECENT EMAILS ===' as section,
  NULL as phone,
  NULL as email,
  NULL as plan_type,
  NULL as usage_count,
  NULL as is_test_phone,
  NULL as message,
  NULL as status,
  e.short_url,
  e.subject,
  e.from_email,
  e.body_preview,
  e.attachment_count::text,
  e.email_received as timestamp
FROM recent_emails e

ORDER BY section, timestamp DESC;
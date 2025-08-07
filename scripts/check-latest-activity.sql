-- Check latest email and SMS activity for test phone
SELECT 
    'EMAIL' as type,
    e.created_at,
    e.subject,
    e.from_email,
    LEFT(e.body, 30) as content,
    e.short_url
FROM emails e
JOIN users u ON e.user_id = u.id
WHERE u.phone = '+16096476162'

UNION ALL

SELECT 
    'SMS' as type,
    s.created_at,
    s.metadata->>'subject' as subject,
    s.metadata->>'from_email' as from_email,
    LEFT(s.message, 30) as content,
    s.metadata->>'short_url' as short_url
FROM sms_logs s
WHERE s.phone = '+16096476162'
  AND s.type = 'email_forward'

ORDER BY created_at DESC
LIMIT 10;
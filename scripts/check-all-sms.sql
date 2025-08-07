-- Check ALL SMS logs for test phone
SELECT 
    id,
    phone,
    LEFT(message, 50) as message_preview,
    type,
    status,
    created_at,
    metadata->>'short_url' as short_url
FROM sms_logs 
WHERE phone = '+16096476162' 
   OR phone = '6096476162'
   OR phone = '+1609-647-6162'
   OR phone = '609-647-6162'
ORDER BY created_at DESC
LIMIT 10;
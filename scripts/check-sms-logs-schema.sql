-- Check the sms_logs table schema
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'sms_logs'
ORDER BY ordinal_position;

-- Check if there are any constraints that might be blocking
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'sms_logs';

-- Try a manual insert to test
-- INSERT INTO sms_logs (
--     user_id,
--     phone,
--     message,
--     type,
--     status,
--     metadata
-- ) VALUES (
--     (SELECT id FROM users WHERE phone = '+16096476162'),
--     '+16096476162',
--     'Test SMS message',
--     'email_forward',
--     'test_phone',
--     '{"test": true}'::jsonb
-- );
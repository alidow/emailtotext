-- Check what values are allowed for the status column
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'sms_logs_status_check';

-- Check what status values are currently in the table
SELECT DISTINCT status, COUNT(*) 
FROM sms_logs 
GROUP BY status;

-- The fix: either update the constraint or use an allowed value
-- Option 1: Add 'test_phone' to the allowed values
ALTER TABLE sms_logs 
DROP CONSTRAINT IF EXISTS sms_logs_status_check;

ALTER TABLE sms_logs 
ADD CONSTRAINT sms_logs_status_check 
CHECK (status IN ('sent', 'failed', 'queued', 'delivered', 'test_mode', 'test_phone'));
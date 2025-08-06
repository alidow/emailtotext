-- Add support for test phone numbers
-- This allows specific phone numbers to be marked as test phones
-- which will log SMS messages instead of sending them via Twilio

-- Add is_test_phone column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_test_phone BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_is_test_phone ON users(is_test_phone) WHERE is_test_phone = TRUE;

-- Add comment explaining the column
COMMENT ON COLUMN users.is_test_phone IS 'When true, SMS messages to this user will be logged instead of sent via Twilio';

-- Update existing test mode records to use test phone approach
-- This converts any existing test_mode SMS logs to be associated with test phones
UPDATE sms_logs 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{test_phone}',
  'true'::jsonb
)
WHERE status = 'test_mode';

-- Add test_phone field to phone_verifications for tracking
ALTER TABLE phone_verifications
ADD COLUMN IF NOT EXISTS is_test_phone BOOLEAN DEFAULT FALSE;

-- Add index for test phone verifications
CREATE INDEX IF NOT EXISTS idx_phone_verifications_test_phone 
ON phone_verifications(phone, is_test_phone) 
WHERE is_test_phone = TRUE;
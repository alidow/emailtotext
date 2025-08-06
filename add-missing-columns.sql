-- Add missing columns to phone_verifications table
ALTER TABLE phone_verifications 
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS user_agent text,
ADD COLUMN IF NOT EXISTS is_test_phone boolean DEFAULT false;

-- Verify the columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'phone_verifications'
ORDER BY ordinal_position;
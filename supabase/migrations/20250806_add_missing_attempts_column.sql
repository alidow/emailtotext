-- These are the migrations that should have already been run:
-- 1. Run: supabase/migrations/20250109_add_phone_verifications_tables.sql
-- 2. Run: supabase/migrations/20250109_add_test_phone_support.sql

-- Add missing attempts column that wasn't in original migrations
ALTER TABLE phone_verifications 
ADD COLUMN IF NOT EXISTS attempts integer DEFAULT 0;

-- Verify all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'phone_verifications'
ORDER BY ordinal_position;

-- Check if the tables were created properly
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('phone_verifications', 'consent_logs', 'verification_logs');
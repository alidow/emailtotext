-- ============================================
-- PRODUCTION SCHEMA FIX - TARGETED MIGRATION
-- Email to Text Notifier
-- ============================================

-- This script will ONLY add what's missing, not recreate existing objects

BEGIN;

-- ============================================
-- 1. FIX PHONE_VERIFICATIONS TABLE - ADD MISSING COLUMNS
-- ============================================

ALTER TABLE public.phone_verifications 
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS user_agent text,
ADD COLUMN IF NOT EXISTS used_at timestamp with time zone;

-- ============================================
-- 2. ADD MISSING COLUMNS TO SMS_LOGS
-- ============================================

ALTER TABLE public.sms_logs
ADD COLUMN IF NOT EXISTS provider text,
ADD COLUMN IF NOT EXISTS provider_message_id text,
ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone;

-- ============================================
-- 3. VERIFY CRITICAL COLUMNS
-- ============================================

DO $$ 
BEGIN
  -- Verify phone_verifications has ip_address column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'phone_verifications' 
    AND column_name = 'ip_address'
    AND table_schema = 'public'
  ) THEN
    RAISE EXCEPTION 'CRITICAL: ip_address column still missing from phone_verifications table after migration';
  END IF;
  
  -- Verify phone_verifications has user_agent column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'phone_verifications' 
    AND column_name = 'user_agent'
    AND table_schema = 'public'
  ) THEN
    RAISE EXCEPTION 'CRITICAL: user_agent column still missing from phone_verifications table after migration';
  END IF;
  
  RAISE NOTICE 'SUCCESS: All critical columns added successfully';
END $$;

COMMIT;

-- ============================================
-- POST-MIGRATION VERIFICATION QUERIES
-- Run these to confirm everything is working:
-- ============================================

-- Check phone_verifications structure:
-- \d phone_verifications

-- Test insert (will rollback):
-- BEGIN;
-- INSERT INTO phone_verifications (phone, code, expires_at, ip_address, user_agent, is_test_phone, attempts)
-- VALUES ('+15555551234', '123456', NOW() + INTERVAL '10 minutes', '127.0.0.1', 'Test Agent', false, 0);
-- ROLLBACK;
-- Fix missing sms_sent column on users table
-- This column is used by the create-user API route but was never added to the users table
-- This migration is idempotent and safe to run multiple times

-- Add sms_sent column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'sms_sent'
  ) THEN
    ALTER TABLE public.users 
    ADD COLUMN sms_sent integer DEFAULT 0;
    
    RAISE NOTICE 'Added sms_sent column to users table';
  ELSE
    RAISE NOTICE 'sms_sent column already exists on users table';
  END IF;
END $$;

-- Create index for efficient lookups if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND indexname = 'idx_users_sms_sent'
  ) THEN
    CREATE INDEX idx_users_sms_sent ON public.users(sms_sent);
    RAISE NOTICE 'Created index idx_users_sms_sent';
  ELSE
    RAISE NOTICE 'Index idx_users_sms_sent already exists';
  END IF;
END $$;

-- Populate sms_sent values from phone_usage_tracking if available
-- This ensures existing users get their current usage counts
DO $$
DECLARE
  updated_count integer;
BEGIN
  WITH current_month_usage AS (
    SELECT DISTINCT ON (phone) 
      phone,
      sms_sent,
      month_year
    FROM public.phone_usage_tracking
    WHERE month_year = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
    ORDER BY phone, updated_at DESC
  )
  UPDATE public.users u
  SET sms_sent = COALESCE(cmu.sms_sent, 0)
  FROM current_month_usage cmu
  WHERE u.phone = cmu.phone
    AND u.sms_sent = 0;  -- Only update if currently 0
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated % users with SMS usage from phone_usage_tracking', updated_count;
END $$;

-- Add comment to document the column
COMMENT ON COLUMN public.users.sms_sent IS 'Current month SMS count for this user, synchronized with phone_usage_tracking';

-- Verify the migration succeeded
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'sms_sent'
  ) THEN
    RAISE NOTICE 'Migration completed successfully - sms_sent column exists on users table';
  ELSE
    RAISE EXCEPTION 'Migration failed - sms_sent column was not added to users table';
  END IF;
END $$;
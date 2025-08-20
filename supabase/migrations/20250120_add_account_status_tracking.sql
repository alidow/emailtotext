-- Add account status tracking for proper cancellation and re-signup handling
-- This migration adds the necessary columns and tables to track account lifecycle

-- Add status column to users table to track active/cancelled/deleted accounts
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'account_status') THEN
    ALTER TABLE public.users ADD COLUMN account_status text DEFAULT 'active' CHECK (account_status IN ('active', 'cancelled', 'deleted'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'cancelled_at') THEN
    ALTER TABLE public.users ADD COLUMN cancelled_at timestamp with time zone;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'deletion_scheduled_at') THEN
    ALTER TABLE public.users ADD COLUMN deletion_scheduled_at timestamp with time zone;
  END IF;
END $$;

-- Create a table to track SMS usage per phone number across all accounts
-- This ensures quota is tracked by phone number regardless of account cancellations
CREATE TABLE IF NOT EXISTS public.phone_usage_tracking (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone text NOT NULL,
  month_year text NOT NULL, -- Format: YYYY-MM
  sms_sent integer DEFAULT 0,
  sms_quota integer DEFAULT 10, -- Current quota for the month
  last_reset_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(phone, month_year)
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_phone_usage_tracking_phone ON public.phone_usage_tracking(phone);
CREATE INDEX IF NOT EXISTS idx_phone_usage_tracking_month_year ON public.phone_usage_tracking(month_year);

-- Create account lifecycle events table for audit trail
CREATE TABLE IF NOT EXISTS public.account_lifecycle_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('created', 'cancelled', 'reactivated', 'deleted', 'abuse_detected')),
  phone text NOT NULL,
  email text,
  clerk_id text,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_account_lifecycle_events_phone ON public.account_lifecycle_events(phone);
CREATE INDEX IF NOT EXISTS idx_account_lifecycle_events_email ON public.account_lifecycle_events(email);
CREATE INDEX IF NOT EXISTS idx_account_lifecycle_events_user_id ON public.account_lifecycle_events(user_id);
CREATE INDEX IF NOT EXISTS idx_account_lifecycle_events_created_at ON public.account_lifecycle_events(created_at);

-- Create abuse detection table to track potential abuse patterns
CREATE TABLE IF NOT EXISTS public.abuse_tracking (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone text NOT NULL,
  email text,
  abuse_type text NOT NULL CHECK (abuse_type IN ('rapid_cancellation', 'excessive_signups', 'quota_manipulation', 'suspicious_pattern')),
  detection_details jsonb,
  blocked boolean DEFAULT false,
  blocked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for abuse tracking
CREATE INDEX IF NOT EXISTS idx_abuse_tracking_phone ON public.abuse_tracking(phone);
CREATE INDEX IF NOT EXISTS idx_abuse_tracking_email ON public.abuse_tracking(email);
CREATE INDEX IF NOT EXISTS idx_abuse_tracking_blocked ON public.abuse_tracking(blocked);

-- Function to track phone usage across accounts
CREATE OR REPLACE FUNCTION track_phone_usage(
  p_phone text,
  p_sms_count integer DEFAULT 1
) RETURNS void AS $$
DECLARE
  v_month_year text;
BEGIN
  v_month_year := to_char(CURRENT_DATE, 'YYYY-MM');
  
  INSERT INTO public.phone_usage_tracking (phone, month_year, sms_sent)
  VALUES (p_phone, v_month_year, p_sms_count)
  ON CONFLICT (phone, month_year)
  DO UPDATE SET 
    sms_sent = phone_usage_tracking.sms_sent + p_sms_count,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Function to check if phone can sign up again (not blocked for abuse)
CREATE OR REPLACE FUNCTION can_phone_signup(
  p_phone text,
  p_email text
) RETURNS boolean AS $$
DECLARE
  v_recent_cancellations integer;
  v_is_blocked boolean;
  v_active_account_exists boolean;
BEGIN
  -- Check if phone has an active account
  SELECT EXISTS(
    SELECT 1 FROM public.users 
    WHERE phone = p_phone 
    AND account_status = 'active'
  ) INTO v_active_account_exists;
  
  IF v_active_account_exists THEN
    RETURN false; -- Cannot sign up with phone that has active account
  END IF;
  
  -- Check if phone/email is blocked for abuse
  SELECT EXISTS(
    SELECT 1 FROM public.abuse_tracking
    WHERE (phone = p_phone OR email = p_email)
    AND blocked = true
    AND (blocked_until IS NULL OR blocked_until > now())
  ) INTO v_is_blocked;
  
  IF v_is_blocked THEN
    RETURN false; -- Blocked for abuse
  END IF;
  
  -- Check for rapid cancellation pattern (more than 3 cancellations in last 30 days)
  SELECT COUNT(*) 
  FROM public.account_lifecycle_events
  WHERE phone = p_phone
  AND event_type = 'cancelled'
  AND created_at > now() - interval '30 days'
  INTO v_recent_cancellations;
  
  IF v_recent_cancellations > 3 THEN
    -- Log potential abuse
    INSERT INTO public.abuse_tracking (phone, email, abuse_type, detection_details)
    VALUES (p_phone, p_email, 'rapid_cancellation', jsonb_build_object(
      'cancellations_30d', v_recent_cancellations,
      'detected_at', now()
    ));
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to get current month's usage for a phone number
CREATE OR REPLACE FUNCTION get_phone_monthly_usage(
  p_phone text
) RETURNS TABLE (
  sms_sent integer,
  sms_quota integer,
  month_year text
) AS $$
DECLARE
  v_month_year text;
BEGIN
  v_month_year := to_char(CURRENT_DATE, 'YYYY-MM');
  
  RETURN QUERY
  SELECT 
    COALESCE(put.sms_sent, 0) as sms_sent,
    COALESCE(put.sms_quota, 10) as sms_quota,
    v_month_year as month_year
  FROM (SELECT 1) dummy
  LEFT JOIN public.phone_usage_tracking put 
    ON put.phone = p_phone 
    AND put.month_year = v_month_year;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update account lifecycle events
CREATE OR REPLACE FUNCTION log_account_lifecycle_event() RETURNS trigger AS $$
BEGIN
  -- Log cancellation
  IF OLD.account_status = 'active' AND NEW.account_status = 'cancelled' THEN
    INSERT INTO public.account_lifecycle_events (
      user_id, event_type, phone, email, clerk_id, metadata
    ) VALUES (
      NEW.id, 'cancelled', NEW.phone, NEW.email, NEW.clerk_id,
      jsonb_build_object(
        'plan_type', NEW.plan_type,
        'sms_sent', NEW.sms_sent,
        'cancelled_at', now()
      )
    );
  END IF;
  
  -- Log reactivation
  IF OLD.account_status = 'cancelled' AND NEW.account_status = 'active' THEN
    INSERT INTO public.account_lifecycle_events (
      user_id, event_type, phone, email, clerk_id, metadata
    ) VALUES (
      NEW.id, 'reactivated', NEW.phone, NEW.email, NEW.clerk_id,
      jsonb_build_object(
        'plan_type', NEW.plan_type,
        'reactivated_at', now()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for account lifecycle tracking
DROP TRIGGER IF EXISTS track_account_lifecycle ON public.users;
CREATE TRIGGER track_account_lifecycle
  AFTER UPDATE OF account_status ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION log_account_lifecycle_event();

-- Migrate existing data: Mark all current users as active
UPDATE public.users 
SET account_status = 'active' 
WHERE account_status IS NULL;

-- Initialize phone usage tracking for existing users
INSERT INTO public.phone_usage_tracking (phone, month_year, sms_sent, sms_quota)
SELECT 
  phone,
  to_char(CURRENT_DATE, 'YYYY-MM'),
  COALESCE(usage_count, 0),  -- Changed from sms_sent to usage_count
  CASE 
    WHEN plan_type = 'free' THEN 10
    WHEN plan_type = 'basic' THEN 100
    WHEN plan_type = 'standard' THEN 500
    WHEN plan_type = 'premium' THEN 1000
    ELSE 10
  END
FROM public.users
WHERE phone IS NOT NULL
  AND account_status = 'active'
ON CONFLICT (phone, month_year) DO UPDATE
SET 
  sms_sent = GREATEST(phone_usage_tracking.sms_sent, EXCLUDED.sms_sent),
  sms_quota = GREATEST(phone_usage_tracking.sms_quota, EXCLUDED.sms_quota);
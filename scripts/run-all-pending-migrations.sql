-- Combined migration script for all pending migrations
-- Run this script in Supabase SQL Editor

-- ============================================
-- 1. From 20250101_add_billing_columns.sql
-- ============================================

-- Add billing-related columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
ADD COLUMN IF NOT EXISTS additional_texts_purchased integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS suspension_reason text;

-- Create billing_events table for audit trail
CREATE TABLE IF NOT EXISTS public.billing_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  amount numeric(10,2),
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create payment_failures table for retry tracking
CREATE TABLE IF NOT EXISTS public.payment_failures (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  invoice_id text NOT NULL,
  attempt_number integer NOT NULL,
  failure_reason text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(invoice_id, attempt_number)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_billing_events_user_id ON public.billing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_event_type ON public.billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_billing_events_created_at ON public.billing_events(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_failures_user_id ON public.payment_failures(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_failures_invoice_id ON public.payment_failures(invoice_id);

-- Enable RLS
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_failures ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own billing events" ON public.billing_events;
DROP POLICY IF EXISTS "Users can read own payment failures" ON public.payment_failures;

-- RLS Policies for billing_events
CREATE POLICY "Users can read own billing events" ON public.billing_events
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'clerk_id'
    )
  );

-- RLS Policies for payment_failures
CREATE POLICY "Users can read own payment failures" ON public.payment_failures
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'clerk_id'
    )
  );

-- Update plan types to include 'suspended' and new plans
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_plan_type_check;

ALTER TABLE public.users
ADD CONSTRAINT users_plan_type_check 
CHECK (plan_type IN ('free', 'basic', 'standard', 'premium', 'pro', 'suspended'));

-- Create stripe_prices table
CREATE TABLE IF NOT EXISTS public.stripe_prices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_type text NOT NULL,
  billing_cycle text NOT NULL,
  price_id text NOT NULL UNIQUE,
  amount numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(plan_type, billing_cycle)
);

-- Insert default price mappings
INSERT INTO public.stripe_prices (plan_type, billing_cycle, price_id, amount) VALUES
  ('basic', 'monthly', 'price_basic_monthly', 4.99),
  ('basic', 'annual', 'price_basic_annual', 47.88),
  ('standard', 'monthly', 'price_standard_monthly', 9.99),
  ('standard', 'annual', 'price_standard_annual', 95.88),
  ('premium', 'monthly', 'price_premium_monthly', 19.99),
  ('premium', 'annual', 'price_premium_annual', 191.88)
ON CONFLICT (plan_type, billing_cycle) DO UPDATE
SET price_id = EXCLUDED.price_id,
    amount = EXCLUDED.amount;

-- ============================================
-- 2. From 20250102_add_stripe_payment_method.sql
-- ============================================

-- Add stripe_payment_method_id column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS stripe_payment_method_id text;

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_payment_method_id ON public.users(stripe_payment_method_id);

-- ============================================
-- 3. From 20250805_add_sms_logs_and_test_mode.sql
-- ============================================

-- Create SMS logs table for test mode and debugging
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  phone text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('verification', 'notification', 'email_forward')),
  status text NOT NULL DEFAULT 'test_mode' CHECK (status IN ('sent', 'failed', 'test_mode', 'queued')),
  twilio_sid text,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_sms_logs_user_id ON public.sms_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_phone ON public.sms_logs(phone);
CREATE INDEX IF NOT EXISTS idx_sms_logs_created_at ON public.sms_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON public.sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_type ON public.sms_logs(type);

-- Create payment logs table for test mode
CREATE TABLE IF NOT EXISTS public.payment_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('checkout', 'subscription', 'payment', 'refund')),
  status text NOT NULL DEFAULT 'test_mode' CHECK (status IN ('success', 'failed', 'test_mode', 'pending')),
  stripe_session_id text,
  amount integer, -- in cents
  currency text DEFAULT 'usd',
  plan_type text,
  billing_cycle text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for payment logs
CREATE INDEX IF NOT EXISTS idx_payment_logs_user_id ON public.payment_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON public.payment_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_logs_type ON public.payment_logs(type);

-- Add test_mode flag to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_test_user boolean DEFAULT false;

-- Create index for test users
CREATE INDEX IF NOT EXISTS idx_users_is_test_user ON public.users(is_test_user) WHERE is_test_user = true;

-- RLS policies for SMS logs
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "SMS logs are viewable by authenticated users for their own logs" ON public.sms_logs;

CREATE POLICY "SMS logs are viewable by authenticated users for their own logs"
  ON public.sms_logs FOR SELECT
  USING (auth.uid()::text = (SELECT clerk_id FROM public.users WHERE id = user_id));

-- RLS policies for payment logs
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Payment logs are viewable by authenticated users for their own logs" ON public.payment_logs;

CREATE POLICY "Payment logs are viewable by authenticated users for their own logs"
  ON public.payment_logs FOR SELECT
  USING (auth.uid()::text = (SELECT clerk_id FROM public.users WHERE id = user_id));

-- Grant permissions
GRANT SELECT ON public.sms_logs TO authenticated;
GRANT SELECT ON public.payment_logs TO authenticated;
GRANT INSERT ON public.sms_logs TO service_role;
GRANT INSERT ON public.payment_logs TO service_role;

-- ============================================
-- Migration Complete
-- ============================================

-- Verify all migrations were applied
SELECT 
    'Migration Status Check' as info,
    CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'billing_events') THEN '✅' ELSE '❌' END || ' billing_events table' as billing_events,
    CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'payment_failures') THEN '✅' ELSE '❌' END || ' payment_failures table' as payment_failures,
    CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'sms_logs') THEN '✅' ELSE '❌' END || ' sms_logs table' as sms_logs,
    CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'payment_logs') THEN '✅' ELSE '❌' END || ' payment_logs table' as payment_logs,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'billing_cycle') THEN '✅' ELSE '❌' END || ' users.billing_cycle' as billing_cycle,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'stripe_payment_method_id') THEN '✅' ELSE '❌' END || ' users.stripe_payment_method_id' as payment_method,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_test_user') THEN '✅' ELSE '❌' END || ' users.is_test_user' as test_user;
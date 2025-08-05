-- Run this migration to create phone verification tables
-- Command: psql "postgresql://postgres:uHkXDfCdPe4CjScZ@db.yeqhslferewupusmvggo.supabase.co:5432/postgres" -f scripts/run-phone-verification-migration.sql

-- Create phone_verifications table for storing verification codes
CREATE TABLE IF NOT EXISTS public.phone_verifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone text NOT NULL,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  ip_address text,
  user_agent text,
  used_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for phone lookups
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON public.phone_verifications(phone);

-- Create index for cleanup of expired codes
CREATE INDEX IF NOT EXISTS idx_phone_verifications_expires_at ON public.phone_verifications(expires_at);

-- Create consent_logs table for TCPA compliance
CREATE TABLE IF NOT EXISTS public.consent_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone text NOT NULL,
  consent_24hr_texts boolean DEFAULT false,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for phone lookups
CREATE INDEX IF NOT EXISTS idx_consent_logs_phone ON public.consent_logs(phone);

-- Create verification_logs table for tracking verification attempts
CREATE TABLE IF NOT EXISTS public.verification_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone text NOT NULL,
  ip_address text,
  success boolean NOT NULL DEFAULT false,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for phone lookups
CREATE INDEX IF NOT EXISTS idx_verification_logs_phone ON public.verification_logs(phone);

-- Create index for IP address lookups (for rate limiting)
CREATE INDEX IF NOT EXISTS idx_verification_logs_ip_address ON public.verification_logs(ip_address);

-- Add RLS policies
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can access these tables (they're used for verification flow)
CREATE POLICY IF NOT EXISTS "Service role only" ON public.phone_verifications
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role only" ON public.consent_logs
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role only" ON public.verification_logs
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Output success
SELECT 'Phone verification tables created successfully!' as status;
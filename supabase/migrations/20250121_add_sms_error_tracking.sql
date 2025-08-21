-- Create table to track SMS errors for monitoring and improvement
CREATE TABLE IF NOT EXISTS public.sms_error_logs (
  id BIGSERIAL PRIMARY KEY,
  phone TEXT NOT NULL,
  error_code TEXT NOT NULL,
  error_message TEXT,
  provider TEXT NOT NULL DEFAULT 'twilio',
  ip_address TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_sms_error_logs_phone ON public.sms_error_logs(phone);
CREATE INDEX IF NOT EXISTS idx_sms_error_logs_error_code ON public.sms_error_logs(error_code);
CREATE INDEX IF NOT EXISTS idx_sms_error_logs_created_at ON public.sms_error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_sms_error_logs_provider ON public.sms_error_logs(provider);

-- Add RLS policies (drop existing policies first to make idempotent)
ALTER TABLE public.sms_error_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can insert sms error logs" ON public.sms_error_logs;
DROP POLICY IF EXISTS "Users can view their own sms error logs" ON public.sms_error_logs;
DROP POLICY IF EXISTS "Service role can view all sms error logs" ON public.sms_error_logs;

-- Only service role can insert error logs
CREATE POLICY "Service role can insert sms error logs"
  ON public.sms_error_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only authenticated users can view their own error logs (for support purposes)
CREATE POLICY "Users can view their own sms error logs"
  ON public.sms_error_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can view all logs
CREATE POLICY "Service role can view all sms error logs"
  ON public.sms_error_logs
  FOR SELECT
  TO service_role
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE public.sms_error_logs IS 'Tracks SMS sending errors for monitoring and improving error handling';
COMMENT ON COLUMN public.sms_error_logs.error_code IS 'Provider-specific error code (e.g., Twilio 30006 for landline)';
COMMENT ON COLUMN public.sms_error_logs.provider IS 'SMS provider that returned the error (twilio, infobip, etc.)';
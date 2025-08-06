-- Add SMS tracking fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS sms_opted_out BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_opted_out_at TIMESTAMPTZ;

-- Add delivery tracking to sms_logs table
ALTER TABLE sms_logs
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sms_logs_twilio_sid ON sms_logs(twilio_sid);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Create SMS events table for tracking all SMS interactions
CREATE TABLE IF NOT EXISTS sms_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'opt_out', 'opt_in', 'help_request', 'incoming_message'
  phone TEXT NOT NULL,
  message_body TEXT,
  twilio_message_sid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sms_events_user_id ON sms_events(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_events_phone ON sms_events(phone);
CREATE INDEX IF NOT EXISTS idx_sms_events_created_at ON sms_events(created_at DESC);

-- Add RLS policies
ALTER TABLE sms_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to make idempotent)
DROP POLICY IF EXISTS "Users can view own SMS events" ON sms_events;
DROP POLICY IF EXISTS "Service role has full access to SMS events" ON sms_events;

-- Users can only see their own SMS events
CREATE POLICY "Users can view own SMS events" ON sms_events
  FOR SELECT
  USING (auth.uid()::text = (SELECT clerk_id FROM users WHERE id = user_id));

-- Service role can do everything
CREATE POLICY "Service role has full access to SMS events" ON sms_events
  FOR ALL
  USING (auth.role() = 'service_role');
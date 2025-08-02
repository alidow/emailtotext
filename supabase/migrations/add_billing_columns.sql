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

-- Add Stripe price ID constants (these would be environment-specific in production)
CREATE TABLE IF NOT EXISTS public.stripe_prices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_type text NOT NULL,
  billing_cycle text NOT NULL,
  price_id text NOT NULL UNIQUE,
  amount numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(plan_type, billing_cycle)
);

-- Insert default price mappings (these would be updated with actual Stripe price IDs)
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
-- Add stripe_payment_method_id column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS stripe_payment_method_id text;

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_payment_method_id ON public.users(stripe_payment_method_id);
-- Create SMS logs table for test mode and debugging
create table if not exists public.sms_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  phone text not null,
  message text not null,
  type text not null check (type in ('verification', 'notification', 'email_forward')),
  status text not null default 'test_mode' check (status in ('sent', 'failed', 'test_mode', 'queued')),
  twilio_sid text,
  error_message text,
  metadata jsonb default '{}',
  created_at timestamp with time zone default now()
);

-- Create indexes for efficient querying
create index idx_sms_logs_user_id on public.sms_logs(user_id);
create index idx_sms_logs_phone on public.sms_logs(phone);
create index idx_sms_logs_created_at on public.sms_logs(created_at desc);
create index idx_sms_logs_status on public.sms_logs(status);
create index idx_sms_logs_type on public.sms_logs(type);

-- Create payment logs table for test mode
create table if not exists public.payment_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  type text not null check (type in ('checkout', 'subscription', 'payment', 'refund')),
  status text not null default 'test_mode' check (status in ('success', 'failed', 'test_mode', 'pending')),
  stripe_session_id text,
  amount integer, -- in cents
  currency text default 'usd',
  plan_type text,
  billing_cycle text,
  metadata jsonb default '{}',
  created_at timestamp with time zone default now()
);

-- Create indexes for payment logs
create index idx_payment_logs_user_id on public.payment_logs(user_id);
create index idx_payment_logs_created_at on public.payment_logs(created_at desc);
create index idx_payment_logs_type on public.payment_logs(type);

-- Add test_mode flag to users table
alter table public.users 
add column if not exists is_test_user boolean default false;

-- Create index for test users
create index idx_users_is_test_user on public.users(is_test_user) where is_test_user = true;

-- RLS policies for SMS logs (admin only)
alter table public.sms_logs enable row level security;

create policy "SMS logs are viewable by authenticated users for their own logs"
  on public.sms_logs for select
  using (auth.uid()::text = (select clerk_id from public.users where id = user_id));

-- RLS policies for payment logs (admin only)
alter table public.payment_logs enable row level security;

create policy "Payment logs are viewable by authenticated users for their own logs"
  on public.payment_logs for select
  using (auth.uid()::text = (select clerk_id from public.users where id = user_id));

-- Grant permissions
grant select on public.sms_logs to authenticated;
grant select on public.payment_logs to authenticated;
grant insert on public.sms_logs to service_role;
grant insert on public.payment_logs to service_role;
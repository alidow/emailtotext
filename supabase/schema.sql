-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  clerk_id text unique not null,
  phone text unique not null,
  phone_verified boolean default false,
  email text,
  plan_type text default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  usage_count integer default 0,
  usage_reset_at timestamp with time zone,
  accepts_24hr_texts boolean default false,
  created_at timestamp with time zone default now()
);

-- Phone verifications table
create table public.phone_verifications (
  id uuid primary key default uuid_generate_v4(),
  phone text not null,
  code text not null,
  attempts integer default 0,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Emails received table
create table public.emails (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  from_email text not null,
  subject text,
  body text,
  raw_mime text,
  short_url text unique,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- SMS quota alerts table
create table public.sms_quota_alerts (
  user_id uuid not null references public.users(id) on delete cascade,
  sent_at date not null,
  primary key (user_id, sent_at)
);

-- TCPA consent logs table
create table public.consent_logs (
  id uuid primary key default uuid_generate_v4(),
  phone text not null,
  ip_address text,
  user_agent text,
  consent_24hr_texts boolean default false,
  consented_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_users_clerk_id on public.users(clerk_id);
create index idx_users_phone on public.users(phone);
create index idx_emails_user_id on public.emails(user_id);
create index idx_emails_short_url on public.emails(short_url);
create index idx_phone_verifications_phone on public.phone_verifications(phone);

-- RLS Policies
alter table public.users enable row level security;
alter table public.emails enable row level security;
alter table public.phone_verifications enable row level security;
alter table public.sms_quota_alerts enable row level security;
alter table public.consent_logs enable row level security;

-- Users can only read their own data
create policy "Users can read own data" on public.users
  for select using (auth.jwt() ->> 'clerk_id' = clerk_id);

create policy "Users can update own data" on public.users
  for update using (auth.jwt() ->> 'clerk_id' = clerk_id);

-- Emails policies
create policy "Users can read own emails" on public.emails
  for select using (
    user_id in (
      select id from public.users where clerk_id = auth.jwt() ->> 'clerk_id'
    )
  );

-- Function to clean up expired phone verifications
create or replace function cleanup_expired_verifications()
returns void as $$
begin
  delete from public.phone_verifications
  where expires_at < now();
end;
$$ language plpgsql security definer;

-- Function to generate short URL
create or replace function generate_short_url()
returns text as $$
declare
  chars text := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i integer;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;
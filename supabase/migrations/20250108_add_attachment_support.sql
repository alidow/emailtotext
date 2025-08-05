-- Add attachment support to Email to Text Notifier

-- Create attachments table
create table if not exists public.email_attachments (
  id uuid primary key default uuid_generate_v4(),
  email_id uuid references public.emails(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  filename text not null,
  content_type text not null,
  size_bytes integer not null,
  storage_path text not null,
  thumbnail_path text, -- Path to thumbnail for images
  mailgun_url text, -- Original Mailgun attachment URL (temporary, for debugging)
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone not null -- Same as parent email expiry
);

-- Add indexes for performance
create index idx_email_attachments_email_id on public.email_attachments(email_id);
create index idx_email_attachments_user_id on public.email_attachments(user_id);
create index idx_email_attachments_expires_at on public.email_attachments(expires_at);

-- Add RLS policies
alter table public.email_attachments enable row level security;

-- Users can only view their own attachments
create policy "Users can view own attachments"
  on public.email_attachments
  for select
  using (auth.uid()::text = (select clerk_id from public.users where id = user_id));

-- Only service role can insert/update/delete attachments
create policy "Service role manages attachments"
  on public.email_attachments
  for all
  using (auth.role() = 'service_role');

-- Add attachment count to emails table for quick reference
alter table public.emails 
add column if not exists attachment_count integer default 0;

-- Create storage bucket for attachments
insert into storage.buckets (id, name, public, avif_autodetection, allowed_mime_types, file_size_limit)
values (
  'email-attachments',
  'email-attachments', 
  false, -- Private bucket
  false,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/zip',
    'application/x-zip-compressed'
  ],
  10485760 -- 10MB limit per file
) on conflict (id) do nothing;

-- Storage policies for the email-attachments bucket
create policy "Users can view own attachments in storage"
  on storage.objects
  for select
  using (
    bucket_id = 'email-attachments' 
    and auth.uid()::text = (
      select u.clerk_id 
      from public.users u
      where u.id::text = (string_to_array(name, '/'))[1]
    )
  );

create policy "Service role can manage all attachments"
  on storage.objects
  for all
  using (bucket_id = 'email-attachments' and auth.role() = 'service_role');

-- Function to automatically set attachment expiry to match email expiry
create or replace function set_attachment_expiry()
returns trigger as $$
begin
  -- Set expires_at to match the parent email's expires_at
  new.expires_at := (
    select expires_at 
    from public.emails 
    where id = new.email_id
  );
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically set expiry
create trigger set_attachment_expiry_trigger
  before insert on public.email_attachments
  for each row
  execute function set_attachment_expiry();

-- Function to cleanup expired attachments (to be called by a scheduled job)
create or replace function cleanup_expired_attachments()
returns void as $$
declare
  attachment record;
begin
  -- Loop through expired attachments
  for attachment in 
    select storage_path 
    from public.email_attachments 
    where expires_at < now()
  loop
    -- Delete from storage (this will be handled by the edge function)
    -- Just mark for deletion here
    raise notice 'Attachment expired: %', attachment.storage_path;
  end loop;
  
  -- Delete expired attachment records
  delete from public.email_attachments
  where expires_at < now();
end;
$$ language plpgsql;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant select on public.email_attachments to anon, authenticated;
grant all on public.email_attachments to service_role;

-- Add comment for documentation
comment on table public.email_attachments is 'Stores metadata for email attachments. Actual files are stored in Supabase Storage.';
comment on column public.email_attachments.storage_path is 'Path in Supabase Storage: {user_id}/{email_id}/{timestamp}-{filename}';
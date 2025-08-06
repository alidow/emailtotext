-- Database Audit Script
-- This script checks which migrations have been applied

-- Check if tables exist
SELECT 'Checking tables...' as status;

SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN tablename = 'users' THEN 'Base table'
        WHEN tablename = 'phone_verifications' THEN 'Base table'
        WHEN tablename = 'consent_logs' THEN 'Base table'
        WHEN tablename = 'emails' THEN 'Base table'
        WHEN tablename = 'sms_quota_alerts' THEN 'Base table'
        WHEN tablename = 'verification_logs' THEN 'Base table'
        WHEN tablename = 'billing_events' THEN 'From 20250101_add_billing_columns.sql'
        WHEN tablename = 'email_attachments' THEN 'From 20250108_add_attachment_support.sql'
        WHEN tablename = 'sms_logs' THEN 'From 20250805_add_sms_logs_and_test_mode.sql'
        WHEN tablename = 'payment_logs' THEN 'From 20250805_add_sms_logs_and_test_mode.sql'
        ELSE 'Unknown'
    END as migration_source
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check columns in users table
SELECT '
Checking users table columns...' as status;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name IN ('id', 'clerk_id', 'phone', 'phone_verified', 'email', 'plan_type', 'usage_count', 'usage_reset_at', 'accepts_24hr_texts', 'created_at', 'stripe_customer_id') THEN 'Base schema'
        WHEN column_name = 'stripe_subscription_id' THEN 'From 20250101_add_billing_columns.sql'
        WHEN column_name = 'billing_cycle' THEN 'From 20250101_add_billing_columns.sql'
        WHEN column_name = 'trial_ends_at' THEN 'From 20250101_add_billing_columns.sql'
        WHEN column_name = 'additional_texts_purchased' THEN 'From 20250101_add_billing_columns.sql'
        WHEN column_name = 'stripe_payment_method_id' THEN 'From 20250102_add_stripe_payment_method.sql'
        WHEN column_name = 'is_test_user' THEN 'From 20250805_add_sms_logs_and_test_mode.sql'
        ELSE 'Unknown'
    END as added_by_migration
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Check indexes
SELECT '
Checking indexes...' as status;

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('sms_logs', 'payment_logs', 'email_attachments', 'billing_events', 'users')
ORDER BY tablename, indexname;

-- Check constraints
SELECT '
Checking constraints...' as status;

SELECT 
    conname as constraint_name,
    contype as constraint_type,
    conrelid::regclass as table_name,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE connamespace = 'public'::regnamespace
AND conrelid::regclass::text IN ('public.sms_logs', 'public.payment_logs', 'public.email_attachments', 'public.billing_events')
ORDER BY conrelid::regclass::text, conname;

-- Check RLS policies
SELECT '
Checking RLS policies...' as status;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('sms_logs', 'payment_logs', 'email_attachments', 'billing_events')
ORDER BY tablename, policyname;

-- Summary
SELECT '
MIGRATION STATUS SUMMARY' as status;

SELECT 
    '20250101_add_billing_columns.sql' as migration,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'billing_events')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'stripe_subscription_id')
        THEN '✅ Applied'
        ELSE '❌ Not Applied'
    END as status
UNION ALL
SELECT 
    '20250102_add_stripe_payment_method.sql',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'stripe_payment_method_id')
        THEN '✅ Applied'
        ELSE '❌ Not Applied'
    END
UNION ALL
SELECT 
    '20250108_add_attachment_support.sql',
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'email_attachments')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'emails' AND column_name = 'attachment_count')
        THEN '✅ Applied'
        ELSE '❌ Not Applied'
    END
UNION ALL
SELECT 
    '20250805_add_sms_logs_and_test_mode.sql',
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sms_logs')
        AND EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_logs')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_test_user')
        THEN '✅ Applied'
        ELSE '❌ Not Applied'
    END;
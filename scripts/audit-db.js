const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.production
require('dotenv').config({ path: '.env.production' });

async function auditDatabase() {
  console.log('🔍 Database Migration Audit\n');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.production');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Check tables
    console.log('📊 Checking tables...\n');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info');
    
    // Since we can't run raw SQL via Supabase client, let's check each migration manually
    
    // Check 20250101_add_billing_columns.sql
    console.log('Checking migration: 20250101_add_billing_columns.sql');
    const { data: billingEvents, error: billingEventsError } = await supabase
      .from('billing_events')
      .select('id')
      .limit(1);
    
    const { data: usersBilling, error: usersBillingError } = await supabase
      .from('users')
      .select('stripe_subscription_id, billing_cycle, trial_ends_at, additional_texts_purchased')
      .limit(1);
    
    if (!billingEventsError && !usersBillingError) {
      console.log('✅ Applied - billing_events table and user columns exist\n');
    } else {
      console.log('❌ Not Applied - Missing billing_events table or user columns');
      if (billingEventsError) console.log('   Error:', billingEventsError.message);
      if (usersBillingError) console.log('   Error:', usersBillingError.message);
      console.log('');
    }
    
    // Check 20250102_add_stripe_payment_method.sql
    console.log('Checking migration: 20250102_add_stripe_payment_method.sql');
    const { data: usersPayment, error: usersPaymentError } = await supabase
      .from('users')
      .select('stripe_payment_method_id')
      .limit(1);
    
    if (!usersPaymentError) {
      console.log('✅ Applied - stripe_payment_method_id column exists\n');
    } else {
      console.log('❌ Not Applied - Missing stripe_payment_method_id column');
      console.log('   Error:', usersPaymentError.message, '\n');
    }
    
    // Check 20250108_add_attachment_support.sql
    console.log('Checking migration: 20250108_add_attachment_support.sql');
    const { data: attachments, error: attachmentsError } = await supabase
      .from('email_attachments')
      .select('id')
      .limit(1);
    
    const { data: emailsAttachment, error: emailsAttachmentError } = await supabase
      .from('emails')
      .select('attachment_count')
      .limit(1);
    
    if (!attachmentsError && !emailsAttachmentError) {
      console.log('✅ Applied - email_attachments table and attachment_count column exist\n');
    } else {
      console.log('❌ Not Applied - Missing email_attachments table or attachment_count column');
      if (attachmentsError) console.log('   Error:', attachmentsError.message);
      if (emailsAttachmentError) console.log('   Error:', emailsAttachmentError.message);
      console.log('');
    }
    
    // Check 20250805_add_sms_logs_and_test_mode.sql
    console.log('Checking migration: 20250805_add_sms_logs_and_test_mode.sql');
    const { data: smsLogs, error: smsLogsError } = await supabase
      .from('sms_logs')
      .select('id')
      .limit(1);
    
    const { data: paymentLogs, error: paymentLogsError } = await supabase
      .from('payment_logs')
      .select('id')
      .limit(1);
    
    const { data: usersTest, error: usersTestError } = await supabase
      .from('users')
      .select('is_test_user')
      .limit(1);
    
    if (!smsLogsError && !paymentLogsError && !usersTestError) {
      console.log('✅ Applied - sms_logs, payment_logs tables and is_test_user column exist\n');
    } else {
      console.log('❌ Not Applied - Missing sms_logs, payment_logs tables or is_test_user column');
      if (smsLogsError) console.log('   Error:', smsLogsError.message);
      if (paymentLogsError) console.log('   Error:', paymentLogsError.message);
      if (usersTestError) console.log('   Error:', usersTestError.message);
      console.log('');
    }
    
    // Summary
    console.log('📋 MIGRATION SUMMARY\n');
    console.log('Migration                                | Status');
    console.log('----------------------------------------|--------');
    console.log(`20250101_add_billing_columns.sql        | ${!billingEventsError && !usersBillingError ? '✅' : '❌'}`);
    console.log(`20250102_add_stripe_payment_method.sql  | ${!usersPaymentError ? '✅' : '❌'}`);
    console.log(`20250108_add_attachment_support.sql     | ${!attachmentsError && !emailsAttachmentError ? '✅' : '❌'}`);
    console.log(`20250805_add_sms_logs_and_test_mode.sql | ${!smsLogsError && !paymentLogsError && !usersTestError ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
  }
}

// Run the audit
auditDatabase();
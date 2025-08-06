-- SQL query to clear test Stripe customer IDs
-- Run this in your Supabase SQL editor

-- Clear test customer ID for your test phone number
UPDATE users 
SET stripe_customer_id = NULL 
WHERE phone = '+16096476161' 
  AND stripe_customer_id LIKE 'cus_test_%';

-- Optional: View affected records before running the update
-- SELECT id, phone, stripe_customer_id, is_test_phone 
-- FROM users 
-- WHERE phone = '+16096476161' 
--   AND stripe_customer_id LIKE 'cus_test_%';

-- Optional: Clear ALL test customer IDs (be careful with this)
-- UPDATE users 
-- SET stripe_customer_id = NULL 
-- WHERE stripe_customer_id LIKE 'cus_test_%';
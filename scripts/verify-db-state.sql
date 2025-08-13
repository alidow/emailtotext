-- ============================================
-- DATABASE STATE VERIFICATION SCRIPT
-- ============================================

-- 1. Check phone_verifications table structure
\echo '=== PHONE_VERIFICATIONS TABLE STRUCTURE ==='
\d phone_verifications

-- 2. Check recent verification attempts for a specific phone
\echo ''
\echo '=== RECENT VERIFICATION ATTEMPTS ==='
SELECT 
  id,
  phone,
  code,
  attempts,
  ip_address,
  is_test_phone,
  expires_at,
  created_at
FROM phone_verifications 
WHERE phone = '+16096476161' 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Check consent_logs table structure
\echo ''
\echo '=== CONSENT_LOGS TABLE STRUCTURE ==='
\d consent_logs

-- 4. Check consent logs for the phone
\echo ''
\echo '=== CONSENT LOGS ==='
SELECT 
  id,
  phone,
  consent_24hr_texts,
  ip_address,
  consented_at,
  created_at
FROM consent_logs 
WHERE phone = '+16096476161' 
ORDER BY COALESCE(created_at, consented_at) DESC 
LIMIT 5;

-- 5. Check if user exists
\echo ''
\echo '=== USER RECORD ==='
SELECT 
  id,
  phone,
  email,
  plan_type,
  usage_count,
  is_test_phone,
  is_test_user,
  created_at
FROM users 
WHERE phone = '+16096476161';

-- 6. Verify all critical columns exist
\echo ''
\echo '=== VERIFICATION: CRITICAL COLUMNS ==='
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'phone_verifications' 
  AND column_name IN ('ip_address', 'user_agent', 'is_test_phone', 'attempts')
ORDER BY column_name;

-- 7. Clean up old/expired verifications
\echo ''
\echo '=== CLEANUP: Removing expired verifications ==='
DELETE FROM phone_verifications 
WHERE expires_at < NOW() 
RETURNING phone, code, expires_at;
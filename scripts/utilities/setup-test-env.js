#!/usr/bin/env node

/**
 * Quick setup script for test environment
 * Creates a .env.local file with test values
 */

const fs = require('fs')
const path = require('path')

const testEnvContent = `# Test Environment Configuration
# This file was auto-generated for testing

# Enable test mode
ENABLE_TEST_MODE=true
NEXT_PUBLIC_ENABLE_TEST_MODE=true

# Supabase (test values)
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZXN0In0.test
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZXN0LXNlcnZpY2UifQ.test

# Clerk (test values)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bWVycnktZ29sZGZpc2gtOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_placeholder

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional services (empty in test mode)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
CLOUDFLARE_TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
`

console.log('📝 Creating test environment file...')

// Check if .env.local already exists
if (fs.existsSync('.env.local')) {
  console.log('⚠️  .env.local already exists!')
  console.log('   Backing up to .env.local.backup')
  fs.copyFileSync('.env.local', '.env.local.backup')
}

// Write test env file
fs.writeFileSync('.env.local', testEnvContent)

console.log('✅ Test environment created!')
console.log('   File: .env.local')
console.log('')
console.log('🚀 You can now run:')
console.log('   npm run dev')
console.log('')
console.log('⚠️  Remember: This is for testing only!')
console.log('   Set up real environment variables for production.')
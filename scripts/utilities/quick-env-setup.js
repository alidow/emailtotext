#!/usr/bin/env node

/**
 * Quick environment setup helper
 * Run this to quickly set up a working environment
 */

const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

async function main() {
  console.log('🚀 Email to Text Notifier - Quick Setup')
  console.log('=====================================\n')

  // Check if .env.local exists
  if (fs.existsSync('.env.local')) {
    const overwrite = await question('.env.local already exists. Overwrite? (y/N): ')
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.')
      process.exit(0)
    }
    // Backup existing file
    fs.copyFileSync('.env.local', '.env.local.backup')
    console.log('Backed up existing .env.local to .env.local.backup')
  }

  console.log('\nChoose setup mode:')
  console.log('1. Test Mode (no external services required)')
  console.log('2. Production Mode (requires API keys)')
  
  const mode = await question('\nSelect mode (1 or 2): ')

  if (mode === '1') {
    // Test mode setup
    const testEnv = `# Test Mode Configuration
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
`
    fs.writeFileSync('.env.local', testEnv)
    console.log('\n✅ Test environment created!')
    console.log('You can now run: npm run dev')
    console.log('\n⚠️  Note: This is for testing only. No real services will work.')
  } else {
    // Production mode setup
    console.log('\nProduction Setup')
    console.log('================')
    console.log('Please have your API keys ready.\n')

    const env = {}

    // Supabase
    console.log('Supabase Configuration:')
    env.NEXT_PUBLIC_SUPABASE_URL = await question('Supabase URL: ')
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY = await question('Supabase Anon Key: ')
    env.SUPABASE_SERVICE_ROLE_KEY = await question('Supabase Service Role Key: ')

    // Clerk
    console.log('\nClerk Configuration:')
    env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = await question('Clerk Publishable Key: ')
    env.CLERK_SECRET_KEY = await question('Clerk Secret Key: ')

    // App URL
    console.log('\nApplication Configuration:')
    env.NEXT_PUBLIC_APP_URL = await question('App URL (e.g., https://yourapp.com): ')

    // Optional services
    console.log('\nOptional Services (press Enter to skip):')
    env.STRIPE_SECRET_KEY = await question('Stripe Secret Key: ')
    env.TWILIO_ACCOUNT_SID = await question('Twilio Account SID: ')
    env.TWILIO_AUTH_TOKEN = await question('Twilio Auth Token: ')
    env.TWILIO_PHONE_NUMBER = await question('Twilio Phone Number: ')

    // Build .env.local file
    let envContent = '# Production Configuration\n'
    envContent += 'ENABLE_TEST_MODE=false\n\n'

    for (const [key, value] of Object.entries(env)) {
      if (value) {
        envContent += `${key}=${value}\n`
      }
    }

    fs.writeFileSync('.env.local', envContent)
    console.log('\n✅ Production environment created!')
    console.log('Run "npm run qa:check" to verify your configuration.')
  }

  rl.close()
}

main().catch(console.error)
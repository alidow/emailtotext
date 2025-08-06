#!/usr/bin/env node

/**
 * Pre-deployment checks to ensure the app is ready for production
 * Run this before deploying to catch configuration issues
 */

const fs = require('fs')
const path = require('path')

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(message, type = 'info') {
  const color = 
    type === 'success' ? colors.green : 
    type === 'error' ? colors.red : 
    type === 'warning' ? colors.yellow :
    colors.blue
  console.log(`${color}${message}${colors.reset}`)
}

// Define critical environment variables
const CRITICAL_ENV_VARS = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', description: 'Supabase URL' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', description: 'Supabase Anon Key' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', description: 'Supabase Service Role Key' },
  { name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', description: 'Clerk Publishable Key' },
  { name: 'CLERK_SECRET_KEY', description: 'Clerk Secret Key' },
  { name: 'NEXT_PUBLIC_APP_URL', description: 'Application URL' }
]

// Optional but important environment variables
const OPTIONAL_ENV_VARS = [
  { name: 'STRIPE_SECRET_KEY', description: 'Stripe Secret Key' },
  { name: 'TWILIO_ACCOUNT_SID', description: 'Twilio Account SID' },
  { name: 'MAILGUN_API_KEY', description: 'Mailgun API Key' },
  { name: 'CLOUDFLARE_TURNSTILE_SECRET_KEY', description: 'Turnstile Secret' }
]

// Critical files that should exist
const CRITICAL_FILES = [
  'middleware.ts',
  'app/layout.tsx',
  'app/page.tsx',
  'package.json',
  'next.config.js'
]

// Check functions
function checkEnvFile() {
  log('\n🔍 Checking environment files...', 'info')
  
  const envFiles = ['.env', '.env.local', '.env.production']
  let foundEnvFile = false
  
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      log(`✓ Found ${file}`, 'success')
      foundEnvFile = true
    }
  }
  
  if (!foundEnvFile) {
    log('✗ No environment file found!', 'error')
    log('  Create .env.local with your environment variables', 'warning')
    return false
  }
  
  return true
}

function checkCriticalEnvVars() {
  log('\n🔑 Checking critical environment variables...', 'info')
  let allPresent = true
  
  for (const envVar of CRITICAL_ENV_VARS) {
    if (process.env[envVar.name]) {
      log(`✓ ${envVar.name} is set`, 'success')
    } else {
      log(`✗ ${envVar.name} is missing - ${envVar.description}`, 'error')
      allPresent = false
    }
  }
  
  return allPresent
}

function checkOptionalEnvVars() {
  log('\n📋 Checking optional environment variables...', 'info')
  
  for (const envVar of OPTIONAL_ENV_VARS) {
    if (process.env[envVar.name]) {
      log(`✓ ${envVar.name} is set`, 'success')
    } else {
      log(`○ ${envVar.name} is not set - ${envVar.description}`, 'warning')
    }
  }
}

function checkCriticalFiles() {
  log('\n📁 Checking critical files...', 'info')
  let allPresent = true
  
  for (const file of CRITICAL_FILES) {
    if (fs.existsSync(file)) {
      log(`✓ ${file} exists`, 'success')
    } else {
      log(`✗ ${file} is missing!`, 'error')
      allPresent = false
    }
  }
  
  return allPresent
}

function checkDependencies() {
  log('\n📦 Checking dependencies...', 'info')
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const deps = packageJson.dependencies || {}
    
    const criticalDeps = [
      '@clerk/nextjs',
      '@supabase/supabase-js',
      'next',
      'react',
      'react-dom'
    ]
    
    let allPresent = true
    for (const dep of criticalDeps) {
      if (deps[dep]) {
        log(`✓ ${dep} is installed`, 'success')
      } else {
        log(`✗ ${dep} is missing!`, 'error')
        allPresent = false
      }
    }
    
    return allPresent
  } catch (error) {
    log('✗ Failed to read package.json', 'error')
    return false
  }
}

function checkBuildOutput() {
  log('\n🏗️  Checking build output...', 'info')
  
  if (fs.existsSync('.next')) {
    log('✓ .next directory exists', 'success')
    
    // Check if build is recent (within last hour)
    const stats = fs.statSync('.next')
    const hourAgo = Date.now() - (60 * 60 * 1000)
    
    if (stats.mtimeMs > hourAgo) {
      log('✓ Build is recent', 'success')
    } else {
      log('⚠ Build might be outdated', 'warning')
    }
    
    return true
  } else {
    log('✗ No build output found - run "npm run build"', 'error')
    return false
  }
}

function checkTestMode() {
  log('\n🧪 Checking test mode...', 'info')
  
  if (process.env.ENABLE_TEST_MODE === 'true') {
    log('⚠ TEST MODE IS ENABLED!', 'warning')
    log('  Make sure to disable test mode for production', 'warning')
    return false
  } else {
    log('✓ Test mode is disabled', 'success')
    return true
  }
}

// Main check function
async function runChecks() {
  log('🚀 Running pre-deployment checks...', 'info')
  log('================================', 'info')
  
  const results = {
    envFile: checkEnvFile(),
    criticalEnvVars: checkCriticalEnvVars(),
    criticalFiles: checkCriticalFiles(),
    dependencies: checkDependencies(),
    buildOutput: checkBuildOutput(),
    testMode: checkTestMode()
  }
  
  // Check optional env vars (doesn't affect pass/fail)
  checkOptionalEnvVars()
  
  // Summary
  log('\n📊 Summary', 'info')
  log('==========', 'info')
  
  const passed = Object.values(results).every(r => r === true)
  const passedCount = Object.values(results).filter(r => r === true).length
  const totalCount = Object.values(results).length
  
  log(`Passed: ${passedCount}/${totalCount} checks`, passed ? 'success' : 'error')
  
  if (!passed) {
    log('\n❌ Deployment checks failed!', 'error')
    log('Fix the issues above before deploying.', 'warning')
    process.exit(1)
  } else {
    log('\n✅ All deployment checks passed!', 'success')
    log('Your app is ready to deploy.', 'success')
  }
}

// Load environment variables if .env.local exists
if (fs.existsSync('.env.local')) {
  require('dotenv').config({ path: '.env.local' })
}

// Run the checks
runChecks().catch(error => {
  log(`\n❌ Error running checks: ${error.message}`, 'error')
  process.exit(1)
})
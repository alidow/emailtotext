#!/usr/bin/env node

/**
 * Manual test script for onboarding flow
 * Run with: node scripts/test-onboarding.js
 */

const https = require('https')

const BASE_URL = 'https://www.emailtotextnotify.com'
const TEST_PHONE = '+15555551234'
const TEST_CODE = '123456'

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
}

function log(message, type = 'info') {
  const color = type === 'success' ? colors.green : type === 'error' ? colors.red : colors.yellow
  console.log(`${color}${message}${colors.reset}`)
}

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL)
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data))
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          }
          resolve(response)
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          })
        }
      })
    })

    req.on('error', reject)
    
    if (data) {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

async function testOnboarding() {
  log('Starting onboarding test...', 'info')
  
  try {
    // Step 1: Test send verification
    log('\n1. Testing send verification endpoint...')
    const sendVerificationResponse = await makeRequest('/api/send-verification', 'POST', {
      phone: TEST_PHONE,
      captchaToken: 'test-token' // In test mode, this should be accepted
    })
    
    if (sendVerificationResponse.status === 200) {
      log('✓ Verification code sent successfully', 'success')
      log(`Response: ${JSON.stringify(sendVerificationResponse.body)}`)
    } else {
      log(`✗ Failed to send verification: ${sendVerificationResponse.status}`, 'error')
      log(`Response: ${JSON.stringify(sendVerificationResponse.body)}`)
      return
    }
    
    // Step 2: Test verify phone
    log('\n2. Testing verify phone endpoint...')
    const verifyPhoneResponse = await makeRequest('/api/verify-phone', 'POST', {
      phone: TEST_PHONE,
      code: TEST_CODE
    })
    
    if (verifyPhoneResponse.status === 200) {
      log('✓ Phone verified successfully', 'success')
      log(`Response: ${JSON.stringify(verifyPhoneResponse.body)}`)
    } else {
      log(`✗ Failed to verify phone: ${verifyPhoneResponse.status}`, 'error')
      log(`Response: ${JSON.stringify(verifyPhoneResponse.body)}`)
      return
    }
    
    // Step 3: Test create user (this will fail without proper auth)
    log('\n3. Testing create user endpoint...')
    log('Note: This will fail without proper Clerk authentication', 'info')
    const createUserResponse = await makeRequest('/api/create-user', 'POST', {
      planType: 'free'
    })
    
    if (createUserResponse.status === 200) {
      log('✓ User created successfully', 'success')
      log(`Response: ${JSON.stringify(createUserResponse.body)}`)
    } else {
      log(`✗ Expected failure (no auth): ${createUserResponse.status}`, 'info')
      log(`Response: ${JSON.stringify(createUserResponse.body)}`)
    }
    
    log('\n✓ Onboarding test completed!', 'success')
    log('\nNotes:', 'info')
    log('- Test mode must be enabled (ENABLE_TEST_MODE=true)')
    log('- Full onboarding requires Clerk authentication')
    log('- Use Playwright tests for complete E2E testing')
    
  } catch (error) {
    log(`\n✗ Test failed with error: ${error.message}`, 'error')
    console.error(error)
  }
}

// Run the test
testOnboarding()
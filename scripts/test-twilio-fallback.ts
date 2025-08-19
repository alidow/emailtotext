#!/usr/bin/env tsx

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function testTwilioFallback() {
  console.log('Testing Twilio Fallback Configuration\n')
  console.log('=' . repeat(50))
  
  // Check environment variables
  const primaryNumber = process.env.TWILIO_PHONE_NUMBER
  const backupNumbers = process.env.TWILIO_BACKUP_NUMBERS
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  
  console.log('Configuration:')
  console.log(`- Account SID: ${accountSid ? accountSid.substring(0, 10) + '...' : 'NOT SET'}`)
  console.log(`- Auth Token: ${authToken ? '***SET***' : 'NOT SET'}`)
  console.log(`- Primary Number: ${primaryNumber || 'NOT SET'}`)
  
  if (backupNumbers) {
    const backupList = backupNumbers.split(',').map(num => num.trim()).filter(Boolean)
    console.log(`- Backup Numbers (${backupList.length}):`)
    backupList.forEach((num, i) => {
      console.log(`  ${i + 1}. ${num}`)
    })
  } else {
    console.log('- Backup Numbers: NOT SET')
  }
  
  console.log('\n' + '=' . repeat(50))
  
  // Test sending (only if explicitly requested)
  const testPhone = process.argv[2]
  if (testPhone) {
    console.log(`\nTesting SMS send to: ${testPhone}`)
    console.log('Note: This will use your real Twilio account!\n')
    
    const { smsProvider } = await import('../lib/sms-provider')
    
    try {
      const result = await smsProvider.sendSMS({
        to: testPhone,
        body: 'Test message from Email to Text - Testing Twilio fallback configuration',
        type: 'notification',
        metadata: {
          test: true,
          timestamp: new Date().toISOString()
        }
      })
      
      console.log('✅ SMS sent successfully!')
      console.log('Result:', result)
    } catch (error) {
      console.error('❌ Failed to send SMS:', error)
    }
  } else {
    console.log('\nTo test sending, run:')
    console.log('npm run test:twilio-fallback +1234567890')
    console.log('(Replace with your phone number)')
  }
}

testTwilioFallback().catch(console.error)
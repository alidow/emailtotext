#!/usr/bin/env node

/**
 * Test script to send a single SMS via Infobip
 * Usage: node scripts/test-infobip-sms.js
 */

require('dotenv').config({ path: '.env.local' })
const axios = require('axios')

async function sendTestSMS() {
  // Configuration from environment
  const baseUrl = process.env.INFOBIP_BASE_URL
  const apiKey = process.env.INFOBIP_API_KEY
  const senderName = process.env.INFOBIP_SENDER_NAME
  
  // Test parameters
  const phoneNumber = '+16096476161'
  const message = 'Hello world - this is a test message from Email to Text Notifier using Infobip'
  
  if (!baseUrl || !apiKey) {
    console.error('❌ Missing Infobip credentials in environment variables')
    console.error('Please ensure INFOBIP_BASE_URL and INFOBIP_API_KEY are set in .env.local')
    process.exit(1)
  }
  
  console.log('📱 Sending test SMS via Infobip...')
  console.log('   To:', phoneNumber)
  console.log('   From:', senderName || 'Default')
  console.log('   Message:', message)
  console.log('   Base URL:', baseUrl)
  console.log('')
  
  try {
    // Infobip API endpoint - note: baseUrl should not include https:// or .api.infobip.com
    const url = `https://${baseUrl.replace('https://', '').replace('.api.infobip.com', '')}.api.infobip.com/sms/2/text/advanced`
    
    const requestBody = {
      messages: [{
        destinations: [{
          to: phoneNumber.replace(/^\+/, '') // Remove + prefix for Infobip
        }],
        from: senderName || 'EmailToText',
        text: message,
        applicationId: process.env.INFOBIP_APPLICATION_ID || 'emailtotextnotify',
        entityId: process.env.INFOBIP_ENTITY_ID || undefined
      }],
      sendingSpeedLimit: {
        amount: 10,
        timeUnit: 'MINUTE'
      }
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `App ${apiKey}`,
        'Accept': 'application/json'
      }
    }
    
    console.log('🔄 Sending request to:', url)
    
    const response = await axios.post(url, requestBody, config)
    
    if (response.data && response.data.messages && response.data.messages[0]) {
      const messageInfo = response.data.messages[0]
      console.log('✅ SMS sent successfully!')
      console.log('   Message ID:', messageInfo.messageId)
      console.log('   Status:', messageInfo.status.name)
      console.log('   Description:', messageInfo.status.description)
      console.log('')
      console.log('Full response:', JSON.stringify(response.data, null, 2))
    } else {
      console.log('⚠️ Unexpected response format:', response.data)
    }
    
  } catch (error) {
    console.error('❌ Failed to send SMS')
    
    if (error.response) {
      console.error('   Status:', error.response.status)
      console.error('   Status Text:', error.response.statusText)
      console.error('   Response:', JSON.stringify(error.response.data, null, 2))
      
      // Check for specific Infobip error messages
      if (error.response.data?.requestError) {
        const reqError = error.response.data.requestError
        console.error('   Error Type:', reqError.serviceException?.messageId)
        console.error('   Error Message:', reqError.serviceException?.text)
      }
    } else if (error.request) {
      console.error('   No response received from Infobip')
      console.error('   Request details:', error.request)
    } else {
      console.error('   Error:', error.message)
    }
    
    process.exit(1)
  }
}

// Run the test
console.log('🚀 Infobip SMS Test Script')
console.log('========================')
console.log('')

sendTestSMS().catch(error => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
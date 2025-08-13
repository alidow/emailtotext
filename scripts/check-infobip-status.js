#!/usr/bin/env node

/**
 * Script to check SMS delivery status via Infobip
 * Usage: node scripts/check-infobip-status.js [messageId]
 */

require('dotenv').config({ path: '.env.local' })
const axios = require('axios')

async function checkMessageStatus(messageId) {
  // Configuration from environment
  const baseUrl = process.env.INFOBIP_BASE_URL
  const apiKey = process.env.INFOBIP_API_KEY
  
  if (!baseUrl || !apiKey) {
    console.error('❌ Missing Infobip credentials in environment variables')
    process.exit(1)
  }
  
  console.log('🔍 Checking SMS delivery status...')
  console.log('   Message ID:', messageId)
  console.log('')
  
  try {
    // Infobip delivery reports endpoint
    const url = `https://${baseUrl.replace('https://', '').replace('.api.infobip.com', '')}.api.infobip.com/sms/1/reports`
    
    const config = {
      headers: {
        'Authorization': `App ${apiKey}`,
        'Accept': 'application/json'
      },
      params: {
        messageId: messageId,
        limit: 10
      }
    }
    
    console.log('🔄 Fetching delivery report from:', url)
    
    const response = await axios.get(url, config)
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      console.log('✅ Delivery report found!')
      console.log('')
      
      response.data.results.forEach((report, index) => {
        console.log(`📱 Message ${index + 1}:`)
        console.log('   Message ID:', report.messageId)
        console.log('   To:', report.to)
        console.log('   From:', report.from)
        console.log('   Sent At:', report.sentAt)
        console.log('   Done At:', report.doneAt || 'Still processing...')
        console.log('   Status:')
        console.log('     - Group:', report.status.groupName)
        console.log('     - Name:', report.status.name)
        console.log('     - Description:', report.status.description)
        console.log('   Message Count:', report.smsCount)
        console.log('   Price:', report.price?.pricePerMessage, report.price?.currency || '')
        console.log('')
        
        // Interpret the status
        if (report.status.groupName === 'DELIVERED') {
          console.log('   ✅ MESSAGE DELIVERED SUCCESSFULLY!')
        } else if (report.status.groupName === 'PENDING') {
          console.log('   ⏳ Message still in transit...')
        } else if (report.status.groupName === 'UNDELIVERABLE' || report.status.groupName === 'REJECTED') {
          console.log('   ❌ Message failed to deliver')
          if (report.error) {
            console.log('   Error:', report.error.description)
          }
        }
        console.log('   ---')
      })
      
      console.log('\nFull response:', JSON.stringify(response.data, null, 2))
    } else {
      console.log('⚠️ No delivery report found yet. The message might still be processing.')
      console.log('   Try again in a few seconds.')
    }
    
  } catch (error) {
    console.error('❌ Failed to check status')
    
    if (error.response) {
      console.error('   Status:', error.response.status)
      console.error('   Response:', JSON.stringify(error.response.data, null, 2))
    } else {
      console.error('   Error:', error.message)
    }
    
    process.exit(1)
  }
}

// Get message ID from command line or use the most recent one
const messageId = process.argv[2] || '4549260661594335349113'

console.log('🚀 Infobip SMS Status Check')
console.log('===========================')
console.log('')

checkMessageStatus(messageId).catch(error => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
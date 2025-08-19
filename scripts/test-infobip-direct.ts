#!/usr/bin/env npx tsx

// Direct Infobip SMS test with provided credentials

const INFOBIP_API_KEY = '0512f401b045e5aef0e6f90997abb2bf-b5f9e877-d7be-4246-9935-db04c21b47b9'
const INFOBIP_BASE_URL = 'm3q9rw.api.infobip.com'
const INFOBIP_PHONE_NUMBER = '18338596750'

async function sendInfobipSMS() {
  const phoneNumber = process.argv[2]
  
  if (!phoneNumber) {
    console.error('Please provide a phone number as argument')
    console.log('Usage: npx tsx scripts/test-infobip-direct.ts +1234567890')
    process.exit(1)
  }
  
  const message = `Email to Text Notification: New email from "alidow@gmail.com", subject "heyo".

View full message at:

https://emailtotextnotify.com/messages`
  
  console.log('Sending Infobip SMS...')
  console.log('To:', phoneNumber)
  console.log('From:', INFOBIP_PHONE_NUMBER)
  console.log('Message:', message)
  console.log('-'.repeat(50))
  
  const url = `https://${INFOBIP_BASE_URL}/sms/2/text/advanced`
  
  const requestBody = {
    messages: [{
      destinations: [{
        to: phoneNumber.replace(/^\+/, '') // Infobip expects numbers without + prefix
      }],
      from: INFOBIP_PHONE_NUMBER,
      text: message
    }]
  }
  
  try {
    console.log('Making request to:', url)
    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `App ${INFOBIP_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    const responseText = await response.text()
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    console.log('Response body:', responseText)
    
    if (!response.ok) {
      console.error('❌ Failed to send SMS')
      console.error('Status:', response.status)
      console.error('Response:', responseText)
      
      try {
        const errorJson = JSON.parse(responseText)
        if (errorJson.requestError?.serviceException?.text) {
          console.error('Error message:', errorJson.requestError.serviceException.text)
        }
      } catch {
        // Not JSON
      }
      
      process.exit(1)
    }
    
    const result = JSON.parse(responseText)
    console.log('\n✅ SMS sent successfully!')
    console.log('Result:', JSON.stringify(result, null, 2))
    
    if (result.messages?.[0]) {
      const msg = result.messages[0]
      console.log('\nMessage details:')
      console.log('- Message ID:', msg.messageId)
      console.log('- Status:', msg.status?.name || 'Unknown')
      console.log('- To:', msg.to)
    }
    
  } catch (error) {
    console.error('❌ Error sending SMS:', error)
    process.exit(1)
  }
}

sendInfobipSMS().catch(console.error)
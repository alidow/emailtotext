/**
 * Test GA4 Events using Measurement Protocol
 * This sends test events directly to GA4 to verify configuration
 * 
 * Usage: npx tsx scripts/test-ga4-events.ts
 */

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-CB0Q6E7ND3'
const GA4_API_SECRET = process.env.GA4_API_SECRET || '' // You need to create this in GA4

interface GA4Event {
  name: string
  params: Record<string, any>
}

async function sendGA4Event(clientId: string, events: GA4Event[]) {
  if (!GA4_API_SECRET) {
    console.error('❌ GA4_API_SECRET not set. Get it from GA4 Admin > Data Streams > Your Stream > Measurement Protocol API secrets')
    console.log('Create one at: https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/streams/table/3884180847')
    return false
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`
  
  const payload = {
    client_id: clientId,
    events: events
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      console.log('✅ Event sent successfully')
      return true
    } else {
      console.error('❌ Failed to send event:', response.status, await response.text())
      return false
    }
  } catch (error) {
    console.error('❌ Error sending event:', error)
    return false
  }
}

async function testAllEvents() {
  const clientId = `test_user_${Date.now()}`
  console.log(`\n🧪 Testing GA4 Events for client: ${clientId}\n`)

  // Test events in order of user flow
  const testEvents: { event: GA4Event, description: string }[] = [
    {
      description: 'Page view - Landing',
      event: {
        name: 'start_page_view',
        params: {
          page_location: '/start',
          page_title: 'Start Landing Page',
          engagement_time_msec: 1000
        }
      }
    },
    {
      description: 'User initiates signup',
      event: {
        name: 'start_flow_initiated',
        params: {
          page_location: 'hero_section',
          button: 'primary_cta',
          value: 3.0,
          currency: 'USD'
        }
      }
    },
    {
      description: 'Account created',
      event: {
        name: 'account_created',
        params: {
          method: 'email',
          page_location: '/start/account',
          value: 2.0,
          currency: 'USD'
        }
      }
    },
    {
      description: 'Phone verification code sent',
      event: {
        name: 'phone_code_sent',
        params: {
          phone: '+1555TEST0001',
          page_location: '/start/verify',
          value: 4.0,
          currency: 'USD'
        }
      }
    },
    {
      description: 'Phone verified successfully',
      event: {
        name: 'phone_verified',
        params: {
          phone: '+1555TEST0001',
          page_location: '/start/verify',
          value: 5.0,
          currency: 'USD'
        }
      }
    },
    {
      description: 'Plan selected',
      event: {
        name: 'plan_selected',
        params: {
          plan: 'pro',
          price: 9.99,
          page_location: '/start/plan'
        }
      }
    },
    {
      description: 'Payment completed',
      event: {
        name: 'payment_completed',
        params: {
          plan: 'pro',
          amount: 9.99,
          currency: 'USD',
          page_location: '/start/payment'
        }
      }
    }
  ]

  console.log('Sending test events to GA4...\n')
  
  for (const { event, description } of testEvents) {
    console.log(`📤 Sending: ${description}`)
    console.log(`   Event: ${event.name}`)
    console.log(`   Params:`, event.params)
    
    const success = await sendGA4Event(clientId, [event])
    
    if (!success && !GA4_API_SECRET) {
      break // Stop if API secret is not configured
    }
    
    // Wait a bit between events to simulate real user behavior
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('')
  }

  console.log('\n✨ Test complete!')
  console.log('\n📊 Check your events at:')
  console.log('Realtime: https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/reports/realtime')
  console.log('DebugView: https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/debugview')
  console.log('\nNote: Events may take a few seconds to appear in Realtime reports')
}

// Run the test
testAllEvents().catch(console.error)
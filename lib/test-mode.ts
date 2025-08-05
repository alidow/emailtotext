import { supabaseAdmin } from "./supabase"

// Check if test mode is enabled
export const isTestMode = () => {
  return process.env.ENABLE_TEST_MODE === 'true'
}

// Log SMS message to database instead of sending
export async function logSMS({
  userId,
  phone,
  message,
  type,
  metadata = {}
}: {
  userId?: string
  phone: string
  message: string
  type: 'verification' | 'notification' | 'email_forward'
  metadata?: Record<string, any>
}) {
  try {
    const { error } = await supabaseAdmin
      .from('sms_logs')
      .insert({
        user_id: userId,
        phone,
        message,
        type,
        status: 'test_mode',
        metadata
      })
    
    if (error) {
      console.error('Failed to log SMS:', error)
      throw error
    }
    
    console.log(`[TEST MODE] SMS logged:`, {
      to: phone,
      message: message.substring(0, 50) + '...',
      type
    })
  } catch (error) {
    console.error('Error logging SMS:', error)
    throw error
  }
}

// Log payment attempt to database
export async function logPayment({
  userId,
  type,
  stripeSessionId,
  amount,
  currency = 'usd',
  planType,
  billingCycle,
  metadata = {}
}: {
  userId: string
  type: 'checkout' | 'subscription' | 'payment' | 'refund'
  stripeSessionId?: string
  amount?: number
  currency?: string
  planType?: string
  billingCycle?: string
  metadata?: Record<string, any>
}) {
  try {
    const { error } = await supabaseAdmin
      .from('payment_logs')
      .insert({
        user_id: userId,
        type,
        status: 'test_mode',
        stripe_session_id: stripeSessionId,
        amount,
        currency,
        plan_type: planType,
        billing_cycle: billingCycle,
        metadata
      })
    
    if (error) {
      console.error('Failed to log payment:', error)
      throw error
    }
    
    console.log(`[TEST MODE] Payment logged:`, {
      userId,
      type,
      amount: amount ? `$${(amount / 100).toFixed(2)}` : 'N/A'
    })
  } catch (error) {
    console.error('Error logging payment:', error)
    throw error
  }
}

// Generate mock Stripe session ID
export function generateMockStripeSessionId() {
  return `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Generate mock Twilio message SID
export function generateMockTwilioSid() {
  return `MM${Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`
}

// Mock Stripe checkout session response
export function createMockCheckoutSession(params: {
  customerId: string
  mode: 'payment' | 'subscription' | 'setup'
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, any>
}) {
  const sessionId = generateMockStripeSessionId()
  
  return {
    id: sessionId,
    object: 'checkout.session',
    success_url: params.successUrl.replace('{CHECKOUT_SESSION_ID}', sessionId),
    cancel_url: params.cancelUrl,
    mode: params.mode,
    customer: params.customerId,
    metadata: params.metadata || {},
    url: `/test-checkout/${sessionId}`, // Mock checkout URL
    created: Math.floor(Date.now() / 1000),
    expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
    status: 'open'
  }
}

// Mock Twilio message response
export function createMockTwilioMessage(params: {
  to: string
  from: string
  body: string
}) {
  return {
    sid: generateMockTwilioSid(),
    date_created: new Date().toISOString(),
    date_updated: new Date().toISOString(),
    date_sent: new Date().toISOString(),
    account_sid: 'ACtest',
    to: params.to,
    from: params.from,
    body: params.body,
    status: 'sent',
    num_segments: '1',
    direction: 'outbound-api',
    api_version: '2010-04-01',
    price: '-0.0075',
    price_unit: 'USD',
    error_code: null,
    error_message: null
  }
}

// Get test mode indicator message
export function getTestModeMessage() {
  return "TEST MODE ACTIVE - No real payments or SMS messages will be processed"
}

// Check if a user is a test user
export async function isTestUser(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('is_test_user')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error checking test user status:', error)
    return false
  }
  
  return data?.is_test_user || false
}
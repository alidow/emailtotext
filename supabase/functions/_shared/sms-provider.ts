// Deno-compatible SMS provider for Supabase Edge Functions
// Supports both Twilio and Infobip with automatic failover

import { captureSMSError } from "./sentry.ts"

interface SendSMSParams {
  to: string
  body: string
  userId?: string
  type?: 'verification' | 'notification' | 'email_forward'
  metadata?: Record<string, any>
}

interface SMSResult {
  success: boolean
  messageId?: string
  provider?: string
  error?: string
}

// Check if we're in test mode
const isTestMode = () => Deno.env.get('ENABLE_TEST_MODE') === 'true'

// Check if a phone number is a test phone
const isTestPhone = (phone: string): boolean => {
  const testNumbers = (Deno.env.get('TEST_PHONE_NUMBERS') || '').split(',')
  return testNumbers.some(testNum => {
    const cleanTestNum = testNum.trim().replace(/\D/g, '')
    const cleanPhone = phone.replace(/\D/g, '')
    return cleanPhone.endsWith(cleanTestNum) || cleanTestNum.endsWith(cleanPhone)
  })
}

// Check Twilio message status
async function checkTwilioMessageStatus(messageSid: string): Promise<{ status: string, errorCode?: number }> {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages/${messageSid}.json`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`)
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to check message status: ${response.status}`)
  }
  
  const message = await response.json()
  return {
    status: message.status,
    errorCode: message.error_code
  }
}

// Get all configured Twilio phone numbers
function getTwilioNumbers(): string[] {
  const numbers: string[] = []
  const primaryNumber = Deno.env.get('TWILIO_PHONE_NUMBER')
  const backupNumbers = Deno.env.get('TWILIO_BACKUP_NUMBERS')
  
  if (primaryNumber) {
    numbers.push(primaryNumber)
  }
  
  if (backupNumbers) {
    const backupList = backupNumbers.split(',').map(num => num.trim()).filter(Boolean)
    numbers.push(...backupList)
  }
  
  return numbers
}

// Send SMS via Twilio with filtering detection and multiple number support
async function sendViaTwilio(to: string, body: string, isRetry: boolean = false): Promise<SMSResult> {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const phoneNumbers = getTwilioNumbers()
  
  if (!accountSid || !authToken || phoneNumbers.length === 0) {
    throw new Error('Twilio credentials or phone numbers not configured')
  }
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  
  // Try each phone number until one succeeds
  let lastError: any = null
  let successfulNumber: string | null = null
  let messageSid: string | null = null
  
  for (let i = 0; i < phoneNumbers.length; i++) {
    const fromNumber = phoneNumbers[i]
    console.log(`Attempting to send SMS from ${fromNumber} (${i + 1}/${phoneNumbers.length})`)
    
    const formData = new URLSearchParams({
      To: to,
      From: fromNumber,
      Body: body
    })
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        
        // Check for specific error codes
        try {
          const errorData = JSON.parse(errorText)
          // Check for filtering, blocking, and undelivered error codes
          // 30007: Message filtered, 30008: Unknown error (undelivered), 21610: Blocked
          if (errorData.code === 30007 || errorData.code === 30008 || errorData.code === 21610) {
            // Message was filtered, blocked, or undelivered
            console.error(`Message delivery failed from ${fromNumber}:`, errorData)
            
            // If this is already a retry with safe template, don't retry again
            if (isRetry) {
              lastError = new Error(`Message delivery failed (error ${errorData.code}): ${errorData.message}`)
              // Try next number if available
              if (i < phoneNumbers.length - 1) {
                continue
              }
              // All numbers failed with safe template
              await triggerSentryAlert('Message delivery failed even with safe template on all numbers', {
                phone: to,
                originalBody: body,
                errorCode: errorData.code,
                errorMessage: errorData.message,
                numbers_tried: phoneNumbers
              })
              throw lastError
            }
            
            // First attempt failed, try with safe template using ALL numbers
            if (!isRetry && i === phoneNumbers.length - 1) {
              // All numbers failed with original message, try safe template
              console.log('All numbers failed with original message, attempting with safe template...')
              const safeBody = createSafeMessageTemplate(body)
              return await sendViaTwilio(to, safeBody, true)
            }
            
            // Continue to next number
            lastError = new Error(`Message delivery failed from ${fromNumber} (error ${errorData.code}): ${errorData.message}`)
            if (i < phoneNumbers.length - 1) {
              continue
            }
          } else {
            // Other error, try next number
            lastError = new Error(`Twilio API error from ${fromNumber}: ${errorData.code} - ${errorData.message}`)
            if (i < phoneNumbers.length - 1) {
              continue
            }
          }
        } catch (e) {
          // Not JSON error response
          lastError = new Error(`Twilio API error from ${fromNumber}: ${response.status} - ${errorText}`)
          if (i < phoneNumbers.length - 1) {
            continue
          }
        }
      } else {
        // Success!
        const message = await response.json()
        messageSid = message.sid || message.Sid
        successfulNumber = fromNumber
        console.log(`SMS sent successfully from ${fromNumber}`)
        break
      }
    } catch (error) {
      console.error(`Failed to send from ${fromNumber}:`, error)
      lastError = error
      if (i < phoneNumbers.length - 1) {
        continue
      }
    }
  }
  
  // Check if we succeeded
  if (!messageSid || !successfulNumber) {
    throw lastError || new Error(`Failed to send SMS from all ${phoneNumbers.length} configured numbers`)
  }
  
  // Wait a bit longer to give Twilio time to process the message
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  try {
    const status = await checkTwilioMessageStatus(messageSid)
    
    // Check for all failure statuses
    if (status.errorCode === 30007 || status.errorCode === 30008 || 
        status.status === 'undelivered' || status.status === 'failed') {
      console.error(`Message delivery failed from ${successfulNumber}:`, status)
      
      if (!isRetry) {
        // Try with safe template
        console.log('Message failed after sending, attempting with safe template...')
        const safeBody = createSafeMessageTemplate(body)
        return await sendViaTwilio(to, safeBody, true)
      } else {
        // Safe template also failed
        await triggerSentryAlert('Message delivery failed even with safe template', {
          phone: to,
          messageSid,
          status: status.status,
          errorCode: status.errorCode,
          from_number: successfulNumber
        })
        // Throw error so it doesn't count against quota
        throw new Error(`Message delivery failed from ${successfulNumber} (status: ${status.status}, error: ${status.errorCode}): Message was not delivered`)
      }
    }
  } catch (statusError) {
    // If this is an error we threw (message failed), re-throw it
    if (statusError.message && statusError.message.includes('Message delivery failed')) {
      throw statusError
    }
    // For actual status check failures, log but continue
    console.error('Failed to check message status:', statusError)
    // Continue anyway - message might have been sent
  }
  
  return {
    success: true,
    messageId: messageSid,
    provider: 'twilio',
    metadata: {
      from_number: successfulNumber,
      numbers_available: phoneNumbers.length
    }
  } as SMSResult
}

// Create a safe message template that should pass filters
function createSafeMessageTemplate(originalBody: string): string {
  // Always use static messages URL (no shortener)
  const messagesUrl = 'https://emailtotextnotify.com/messages'
  
  // Ultra-safe template with service identifier and proper line breaks
  return `Email to Text Notification: New email received.\n\nView at:\n\n${messagesUrl}`
}

// Trigger Sentry alert
async function triggerSentryAlert(message: string, extra: Record<string, any>) {
  console.error('[SENTRY ALERT]', message, extra)
  
  // If Sentry is configured, send alert
  const sentryDsn = Deno.env.get('SENTRY_DSN')
  if (sentryDsn) {
    try {
      // Simple Sentry error reporting
      await fetch(sentryDsn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          level: 'error',
          extra,
          tags: {
            service: 'sms-provider',
            issue: 'message-filtering'
          }
        })
      })
    } catch (error) {
      console.error('Failed to send Sentry alert:', error)
    }
  }
}

// Send SMS via Infobip
async function sendViaInfobip(to: string, body: string): Promise<SMSResult> {
  const baseUrl = Deno.env.get('INFOBIP_BASE_URL')
  const apiKey = Deno.env.get('INFOBIP_API_KEY')
  const senderName = Deno.env.get('INFOBIP_SENDER_NAME') || 
                     Deno.env.get('TWILIO_PHONE_NUMBER') || 
                     'EmailToText'
  
  if (!baseUrl || !apiKey) {
    throw new Error('Infobip credentials not configured')
  }
  
  const url = `https://${baseUrl}.api.infobip.com/sms/2/text/advanced`
  
  const requestBody = {
    messages: [{
      destinations: [{
        to: to.replace(/^\+/, '') // Infobip expects numbers without + prefix
      }],
      from: senderName,
      text: body
    }]
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `App ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `Infobip API error: ${response.status}`
    try {
      const errorJson = JSON.parse(errorText)
      if (errorJson.requestError?.serviceException?.text) {
        errorMessage = errorJson.requestError.serviceException.text
      }
    } catch {
      errorMessage += ` - ${errorText}`
    }
    throw new Error(errorMessage)
  }
  
  const result = await response.json()
  const messageResponse = result.messages?.[0]
  
  if (!messageResponse) {
    throw new Error('Invalid Infobip response')
  }
  
  return {
    success: true,
    messageId: messageResponse.messageId,
    provider: 'infobip'
  }
}

// Check which providers are configured
function hasProvider(provider: 'twilio' | 'infobip'): boolean {
  if (provider === 'twilio') {
    const hasCredentials = !!(Deno.env.get('TWILIO_ACCOUNT_SID') && 
                              Deno.env.get('TWILIO_AUTH_TOKEN'))
    const hasNumbers = getTwilioNumbers().length > 0
    return hasCredentials && hasNumbers
  } else if (provider === 'infobip') {
    return !!(Deno.env.get('INFOBIP_BASE_URL') && 
              Deno.env.get('INFOBIP_API_KEY'))
  }
  return false
}

// Main SMS sending function with provider fallback
export async function sendSMS(params: SendSMSParams, supabase?: any): Promise<SMSResult> {
  const { to, body, userId, type = 'notification', metadata = {} } = params
  
  // Check if this is a test phone or test mode
  if (isTestMode() || isTestPhone(to)) {
    // Log the SMS instead of sending
    if (supabase && userId) {
      await supabase
        .from('sms_logs')
        .insert({
          user_id: userId,
          phone: to,
          message: body,
          type,
          status: 'test_mode',
          metadata: {
            ...metadata,
            test_phone: isTestPhone(to),
            test_mode: isTestMode()
          }
        })
    }
    
    console.log(`[${isTestPhone(to) ? 'TEST PHONE' : 'TEST MODE'}] SMS logged for ${to}`)
    
    return {
      success: true,
      messageId: 'test-' + Date.now(),
      provider: 'test'
    }
  }
  
  // Determine provider strategy
  const smsProvider = Deno.env.get('SMS_PROVIDER')?.toLowerCase() || 'auto'
  
  // If a specific provider is configured, use it
  if (smsProvider !== 'auto') {
    if (!hasProvider(smsProvider as 'twilio' | 'infobip')) {
      throw new Error(`SMS provider ${smsProvider} is not configured`)
    }
    
    try {
      let result: SMSResult
      if (smsProvider === 'twilio') {
        result = await sendViaTwilio(to, body)
      } else if (smsProvider === 'infobip') {
        result = await sendViaInfobip(to, body)
      } else {
        throw new Error(`Unknown provider: ${smsProvider}`)
      }
      
      // Log successful SMS
      if (supabase && userId) {
        await supabase
          .from('sms_logs')
          .insert({
            user_id: userId,
            phone: to,
            message: body,
            type,
            status: 'sent',
            provider: result.provider,
            provider_message_id: result.messageId,
            metadata
          })
      }
      
      return result
    } catch (error) {
      // Log failed SMS
      if (supabase && userId) {
        await supabase
          .from('sms_logs')
          .insert({
            user_id: userId,
            phone: to,
            message: body,
            type,
            status: 'failed',
            provider: smsProvider,
            error_message: error.message,
            metadata
          })
      }
      
      throw error
    }
  }
  
  // Auto mode: Try providers in order
  const providers: ('twilio' | 'infobip')[] = []
  
  // Try Twilio first if available (it's been our primary)
  if (hasProvider('twilio')) {
    providers.push('twilio')
  }
  
  // Add Infobip as fallback
  if (hasProvider('infobip')) {
    providers.push('infobip')
  }
  
  if (providers.length === 0) {
    throw new Error('No SMS providers configured')
  }
  
  let lastError: Error | null = null
  
  for (const provider of providers) {
    try {
      console.log(`Attempting to send SMS via ${provider}...`)
      
      let result: SMSResult
      if (provider === 'twilio') {
        result = await sendViaTwilio(to, body)
      } else {
        result = await sendViaInfobip(to, body)
      }
      
      // Log successful SMS
      if (supabase && userId) {
        await supabase
          .from('sms_logs')
          .insert({
            user_id: userId,
            phone: to,
            message: body,
            type,
            status: 'sent',
            provider: result.provider,
            provider_message_id: result.messageId,
            metadata: {
              ...metadata,
              provider_attempt: providers.indexOf(provider) + 1,
              provider_total: providers.length
            }
          })
      }
      
      console.log(`Successfully sent SMS via ${provider}`)
      return result
    } catch (error) {
      console.error(`Failed to send SMS via ${provider}:`, error.message)
      lastError = error
      
      // If this was not the last provider, continue to the next
      if (providers.indexOf(provider) < providers.length - 1) {
        console.log(`Falling back to next provider...`)
        continue
      }
    }
  }
  
  // All providers failed - log the failure
  if (supabase && userId) {
    await supabase
      .from('sms_logs')
      .insert({
        user_id: userId,
        phone: to,
        message: body,
        type,
        status: 'failed',
        error_message: lastError?.message || 'All providers failed',
        metadata: {
          ...metadata,
          providers_tried: providers
        }
      })
  }
  
  throw new Error(`All SMS providers failed. Last error: ${lastError?.message || 'Unknown error'}`)
}
import axios from 'axios'
import { isTestMode, isTestPhoneNumber, isTestPhoneUser, logSMS, createMockTwilioMessage } from "./test-mode"
import { supabaseAdmin } from "./supabase"

// Types
interface SendSMSParams {
  to: string
  body: string
  userId?: string
  type?: 'verification' | 'notification' | 'email_forward'
  metadata?: Record<string, any>
}

interface InfobipMessage {
  messageId: string
  to: string
  from: string
  text: string
  status: {
    groupId: number
    groupName: string
    id: number
    name: string
    description: string
  }
}

class InfobipClient {
  private useSDK: boolean = false // Always use direct API calls since SDK is not available
  
  // Direct API implementation (fallback or primary method)
  private async sendViaAPI(to: string, body: string): Promise<InfobipMessage> {
    if (!process.env.INFOBIP_BASE_URL || !process.env.INFOBIP_API_KEY) {
      throw new Error('Infobip credentials not configured')
    }
    
    const url = `https://${process.env.INFOBIP_BASE_URL}.api.infobip.com/sms/2/text/advanced`
    
    const requestBody = {
      messages: [{
        destinations: [{
          to: to.replace(/^\+/, '') // Infobip expects numbers without + prefix
        }],
        from: process.env.INFOBIP_SENDER_NAME || process.env.TWILIO_PHONE_NUMBER || 'EmailToText',
        text: body,
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
        'Authorization': `App ${process.env.INFOBIP_API_KEY}`
      }
    }
    
    try {
      const response = await axios.post(url, requestBody, config)
      const messageResponse = response.data.messages[0]
      
      return {
        messageId: messageResponse.messageId,
        to: messageResponse.to,
        from: requestBody.messages[0].from,
        text: body,
        status: messageResponse.status
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data?.requestError?.serviceException?.text || 
                           error.response.data?.requestError?.message || 
                           'Unknown Infobip API error'
        throw new Error(`Infobip API Error: ${errorMessage}`)
      }
      throw error
    }
  }
  
  async sendSMS({ to, body, userId, type = 'notification', metadata = {} }: SendSMSParams) {
    // Check if this is a test phone number or test user
    const isTestPhone = isTestPhoneNumber(to)
    const isTestUser = userId ? await isTestPhoneUser(userId) : false
    
    // If test phone or test user, log instead of sending
    if (isTestPhone || isTestUser || isTestMode()) {
      await logSMS({
        userId,
        phone: to,
        message: body,
        type,
        metadata: {
          ...metadata,
          from: process.env.INFOBIP_SENDER_NAME || process.env.TWILIO_PHONE_NUMBER || 'TEST_NUMBER',
          provider: 'infobip',
          test_phone: isTestPhone,
          test_user: isTestUser
        }
      })
      
      console.log(`[TEST ${isTestPhone ? 'PHONE' : isTestUser ? 'USER' : 'MODE'}] SMS logged for ${to} (Infobip)`)
      
      // Return mock response compatible with Twilio format
      return createMockTwilioMessage({
        to,
        from: process.env.INFOBIP_SENDER_NAME || process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        body
      })
    }
    
    // In production, send real SMS
    try {
      // Always use direct API since SDK is not available
      const message = await this.sendViaAPI(to, body)
      
      // Log successful SMS to database for tracking
      if (userId) {
        await supabaseAdmin
          .from('sms_logs')
          .insert({
            user_id: userId,
            phone: to,
            message: body,
            type,
            status: 'sent',
            provider: 'infobip',
            provider_message_id: message.messageId,
            metadata: {
              ...metadata,
              infobip_status: message.status
            }
          })
      }
      
      // Return in Twilio-compatible format for backward compatibility
      return {
        sid: message.messageId,
        to: message.to,
        from: message.from,
        body: message.text,
        status: message.status.name,
        // Additional Infobip-specific data
        _provider: 'infobip',
        _infobipStatus: message.status
      }
    } catch (error: any) {
      // Log failed SMS attempt
      if (userId) {
        await supabaseAdmin
          .from('sms_logs')
          .insert({
            user_id: userId,
            phone: to,
            message: body,
            type,
            status: 'failed',
            provider: 'infobip',
            error_message: error.message,
            metadata
          })
      }
      
      throw error
    }
  }
  
  // Check if phone number can receive SMS
  async validatePhoneNumber(phone: string): Promise<boolean> {
    // Test phones are always valid
    if (isTestPhoneNumber(phone)) {
      return true
    }
    
    if (isTestMode()) {
      // In test mode, accept all phone numbers except obviously fake ones
      const fakePatterns = [
        /^[+]?1?5{10}$/,
        /^[+]?1?0{10}$/,
        /^[+]?1?1234567890$/,
        /^[+]?1?(\d)\1{9}$/
      ]
      
      return !fakePatterns.some(pattern => pattern.test(phone.replace(/\D/g, '')))
    }
    
    // For Infobip, we'll do basic validation since they don't have a lookup API in the same way
    // Accept E.164 formatted numbers
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }
}

// Export singleton instance
export const infobipClient = new InfobipClient()

// Helper function for backward compatibility
export async function sendSMSViaInfobip(params: SendSMSParams) {
  return infobipClient.sendSMS(params)
}
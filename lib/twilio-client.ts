import twilio from "twilio"
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

class TwilioClient {
  private client: twilio.Twilio | null = null
  
  private getClient(): twilio.Twilio | null {
    // Lazy initialize Twilio client to avoid build-time errors
    if (!this.client && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
      } catch (error) {
        console.error('Failed to initialize Twilio client:', error)
        return null
      }
    }
    return this.client
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
          from: process.env.TWILIO_PHONE_NUMBER || 'TEST_NUMBER',
          test_phone: isTestPhone,
          test_user: isTestUser
        }
      })
      
      console.log(`[TEST ${isTestPhone ? 'PHONE' : isTestUser ? 'USER' : 'MODE'}] SMS logged for ${to}`)
      
      // Return mock response
      return createMockTwilioMessage({
        to,
        from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        body
      })
    }
    
    // In production, send real SMS
    const client = this.getClient()
    if (!client) {
      throw new Error('Twilio client not initialized')
    }
    
    try {
      const message = await client.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE_NUMBER!
      })
      
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
            twilio_sid: message.sid,
            metadata
          })
      }
      
      return message
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
    
    // In production, use Twilio's lookup API
    const client = this.getClient()
    if (!client) {
      // If Twilio is not configured, accept all valid-looking numbers
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      return phoneRegex.test(phone.replace(/\D/g, ''))
    }
    
    try {
      await client.lookups.v1.phoneNumbers(phone).fetch()
      return true
    } catch (error) {
      return false
    }
  }
}

// Export singleton instance
export const twilioClient = new TwilioClient()

// Helper function for backward compatibility
export async function sendSMS(params: SendSMSParams) {
  return twilioClient.sendSMS(params)
}
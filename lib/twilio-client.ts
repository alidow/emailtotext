import twilio from "twilio"
import { isTestMode, logSMS, createMockTwilioMessage } from "./test-mode"
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
  private client: twilio.Twilio | null
  
  constructor() {
    // Only initialize real Twilio client if not in test mode and credentials exist
    if (!isTestMode() && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    } else {
      this.client = null
    }
  }
  
  async sendSMS({ to, body, userId, type = 'notification', metadata = {} }: SendSMSParams) {
    // In test mode, log the SMS instead of sending
    if (isTestMode()) {
      await logSMS({
        userId,
        phone: to,
        message: body,
        type,
        metadata: {
          ...metadata,
          from: process.env.TWILIO_PHONE_NUMBER || 'TEST_NUMBER'
        }
      })
      
      // Return mock response
      return createMockTwilioMessage({
        to,
        from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        body
      })
    }
    
    // In production, send real SMS
    if (!this.client) {
      throw new Error('Twilio client not initialized')
    }
    
    try {
      const message = await this.client.messages.create({
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
    if (!this.client) {
      throw new Error('Twilio client not initialized')
    }
    
    try {
      await this.client.lookups.v1.phoneNumbers(phone).fetch()
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
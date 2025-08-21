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
  private phoneNumbers: string[] = []
  
  constructor() {
    // Initialize phone numbers list
    this.initializePhoneNumbers()
  }
  
  private initializePhoneNumbers() {
    const primaryNumber = process.env.TWILIO_PHONE_NUMBER
    const backupNumbers = process.env.TWILIO_BACKUP_NUMBERS
    
    if (primaryNumber) {
      this.phoneNumbers.push(primaryNumber)
    }
    
    if (backupNumbers) {
      const backupList = backupNumbers.split(',').map(num => num.trim()).filter(Boolean)
      this.phoneNumbers.push(...backupList)
    }
    
    if (this.phoneNumbers.length > 0) {
      console.log(`Configured with ${this.phoneNumbers.length} Twilio number(s)`)
    }
  }
  
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
    
    if (this.phoneNumbers.length === 0) {
      throw new Error('No Twilio phone numbers configured')
    }
    
    // Try each phone number in order until one succeeds
    let lastError: any = null
    let successfulNumber: string | null = null
    
    for (let i = 0; i < this.phoneNumbers.length; i++) {
      const fromNumber = this.phoneNumbers[i]
      
      try {
        console.log(`Attempting to send SMS from ${fromNumber} (${i + 1}/${this.phoneNumbers.length})`)
        
        const message = await client.messages.create({
          body,
          to,
          from: fromNumber
        })
        
        // Wait a moment and check message status
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Fetch message status to verify delivery
        const messageStatus = await client.messages(message.sid).fetch()
        
        // Check for delivery failures
        if (messageStatus.status === 'failed' || messageStatus.status === 'undelivered' || 
            messageStatus.errorCode === 30007 || messageStatus.errorCode === 30008) {
          console.error(`Message failed with status ${messageStatus.status}, error code ${messageStatus.errorCode}`)
          lastError = new Error(`Message delivery failed: ${messageStatus.errorMessage || messageStatus.status}`)
          
          // If this isn't the last number, try the next one
          if (i < this.phoneNumbers.length - 1) {
            console.log(`Trying backup number ${i + 2}...`)
            continue
          }
        }
        
        // Success!
        successfulNumber = fromNumber
        console.log(`SMS sent successfully from ${fromNumber}`)
        
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
              metadata: {
                ...metadata,
                from_number: fromNumber,
                attempt_number: i + 1,
                total_numbers: this.phoneNumbers.length
              }
            })
        }
        
        return message
      } catch (error: any) {
        console.error(`Failed to send from ${fromNumber}: ${error.message}`)
        lastError = error
        
        // Continue to next number if available
        if (i < this.phoneNumbers.length - 1) {
          continue
        }
      }
    }
    
    // All numbers failed - log the failure
    if (userId) {
      await supabaseAdmin
        .from('sms_logs')
        .insert({
          user_id: userId,
          phone: to,
          message: body,
          type,
          status: 'failed',
          error_message: lastError?.message || 'All Twilio numbers failed',
          metadata: {
            ...metadata,
            numbers_tried: this.phoneNumbers,
            all_failed: true
          }
        })
    }
    
    throw new Error(`Failed to send SMS from all ${this.phoneNumbers.length} configured numbers. Last error: ${lastError?.message}`)
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
  
  // Check if phone number is a landline using Twilio Lookup API with line type intelligence
  async isLandline(phone: string): Promise<boolean | null> {
    // Test phones are never landlines
    if (isTestPhoneNumber(phone)) {
      return false
    }
    
    if (isTestMode()) {
      // In test mode, don't check for landlines
      return false
    }
    
    const client = this.getClient()
    if (!client) {
      // If Twilio is not configured, can't determine line type
      return null
    }
    
    try {
      // Use Twilio Lookup API with line type intelligence addon
      // Note: This requires the Line Type Intelligence addon to be enabled in your Twilio account
      const phoneNumber = await client.lookups.v2
        .phoneNumbers(phone)
        .fetch({ fields: 'line_type_intelligence' })
      
      // Check if line type intelligence data is available
      if (phoneNumber.lineTypeIntelligence && phoneNumber.lineTypeIntelligence.type) {
        const lineTypeData = phoneNumber.lineTypeIntelligence.type as any
        const lineType = typeof lineTypeData === 'string' ? lineTypeData : lineTypeData?.type
        // Landline types include: 'landline', 'fixedVoip' (some VoIP lines can't receive SMS)
        return lineType === 'landline' || lineType === 'fixedVoip'
      }
      
      // If line type intelligence is not available, return null (unknown)
      return null
    } catch (error: any) {
      console.error('Error checking line type:', error.message)
      // If lookup fails, return null (unknown)
      return null
    }
  }
}

// Export singleton instance
export const twilioClient = new TwilioClient()

// Helper function for backward compatibility
export async function sendSMS(params: SendSMSParams) {
  return twilioClient.sendSMS(params)
}
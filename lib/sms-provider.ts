import { twilioClient } from "./twilio-client"
import { infobipClient } from "./infobip-client"

// SMS Provider selection
export type SMSProvider = 'twilio' | 'infobip' | 'auto'

// Types
interface SendSMSParams {
  to: string
  body: string
  userId?: string
  type?: 'verification' | 'notification' | 'email_forward'
  metadata?: Record<string, any>
}

class SMSProviderManager {
  private primaryProvider: SMSProvider = 'auto'
  private lastSuccessfulProvider: SMSProvider | null = null
  
  constructor() {
    // Set primary provider from environment variable
    const configuredProvider = process.env.SMS_PROVIDER?.toLowerCase() as SMSProvider
    if (configuredProvider && ['twilio', 'infobip', 'auto'].includes(configuredProvider)) {
      this.primaryProvider = configuredProvider
    }
  }
  
  private hasProvider(provider: 'twilio' | 'infobip'): boolean {
    if (provider === 'twilio') {
      const hasCredentials = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
      const hasPrimaryNumber = !!process.env.TWILIO_PHONE_NUMBER
      const hasBackupNumbers = !!process.env.TWILIO_BACKUP_NUMBERS?.trim()
      return hasCredentials && (hasPrimaryNumber || hasBackupNumbers)
    } else if (provider === 'infobip') {
      return !!(process.env.INFOBIP_BASE_URL && process.env.INFOBIP_API_KEY)
    }
    return false
  }
  
  private async sendWithProvider(provider: 'twilio' | 'infobip', params: SendSMSParams) {
    if (provider === 'twilio') {
      return await twilioClient.sendSMS(params)
    } else if (provider === 'infobip') {
      return await infobipClient.sendSMS(params)
    }
    throw new Error(`Unknown provider: ${provider}`)
  }
  
  async sendSMS(params: SendSMSParams) {
    const { metadata = {} } = params
    
    // Add provider info to metadata
    const enrichedParams = {
      ...params,
      metadata: {
        ...metadata,
        sms_provider_strategy: this.primaryProvider
      }
    }
    
    // If a specific provider is configured, use it
    if (this.primaryProvider !== 'auto') {
      if (!this.hasProvider(this.primaryProvider)) {
        throw new Error(`SMS provider ${this.primaryProvider} is not configured`)
      }
      
      try {
        const result = await this.sendWithProvider(this.primaryProvider, {
          ...enrichedParams,
          metadata: {
            ...enrichedParams.metadata,
            sms_provider: this.primaryProvider
          }
        })
        this.lastSuccessfulProvider = this.primaryProvider
        return result
      } catch (error: any) {
        console.error(`Failed to send SMS via ${this.primaryProvider}:`, error)
        // Preserve the error with its code
        throw error
      }
    }
    
    // Auto mode: Try providers in order of preference
    const providers: ('twilio' | 'infobip')[] = []
    
    // Build provider list based on availability and last success
    if (this.lastSuccessfulProvider && this.lastSuccessfulProvider !== 'auto' && this.hasProvider(this.lastSuccessfulProvider)) {
      providers.push(this.lastSuccessfulProvider)
    }
    
    // Add Twilio first if available (it's been our primary)
    if (this.hasProvider('twilio') && !providers.includes('twilio')) {
      providers.push('twilio')
    }
    
    // Add Infobip as fallback
    if (this.hasProvider('infobip') && !providers.includes('infobip')) {
      providers.push('infobip')
    }
    
    if (providers.length === 0) {
      throw new Error('No SMS providers configured. Please configure either Twilio or Infobip.')
    }
    
    // Try each provider in order
    let lastError: any = null
    
    for (const provider of providers) {
      try {
        console.log(`Attempting to send SMS via ${provider}...`)
        const result = await this.sendWithProvider(provider, {
          ...enrichedParams,
          metadata: {
            ...enrichedParams.metadata,
            sms_provider: provider,
            sms_provider_attempt: providers.indexOf(provider) + 1,
            sms_provider_total: providers.length
          }
        })
        
        this.lastSuccessfulProvider = provider
        console.log(`Successfully sent SMS via ${provider}`)
        return result
      } catch (error: any) {
        console.error(`Failed to send SMS via ${provider}:`, error.message)
        // Preserve the original error with its code for better error handling
        lastError = error
        
        // If this was not the last provider, continue to the next
        if (providers.indexOf(provider) < providers.length - 1) {
          console.log(`Falling back to next provider...`)
          continue
        }
      }
    }
    
    // All providers failed - throw the last error to preserve error codes
    if (lastError) {
      throw lastError
    }
    throw new Error(`All SMS providers failed. Last error: Unknown error`)
  }
  
  async validatePhoneNumber(phone: string): Promise<boolean> {
    // Try validation with the primary provider first
    if (this.primaryProvider !== 'auto') {
      if (this.primaryProvider === 'twilio' && this.hasProvider('twilio')) {
        return await twilioClient.validatePhoneNumber(phone)
      } else if (this.primaryProvider === 'infobip' && this.hasProvider('infobip')) {
        return await infobipClient.validatePhoneNumber(phone)
      }
    }
    
    // In auto mode, try Twilio first (it has better validation)
    if (this.hasProvider('twilio')) {
      try {
        return await twilioClient.validatePhoneNumber(phone)
      } catch (error) {
        console.error('Twilio validation failed:', error)
      }
    }
    
    // Fall back to Infobip
    if (this.hasProvider('infobip')) {
      return await infobipClient.validatePhoneNumber(phone)
    }
    
    // If no providers available, do basic validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }
  
  async isLandline(phone: string): Promise<boolean | null> {
    // Check if number is a landline using Twilio's line type intelligence
    if (this.hasProvider('twilio')) {
      try {
        return await twilioClient.isLandline(phone)
      } catch (error) {
        console.error('Error checking line type:', error)
        return null
      }
    }
    
    // If Twilio is not available, we can't determine line type
    return null
  }
  
  getConfiguredProviders(): string[] {
    const providers: string[] = []
    if (this.hasProvider('twilio')) providers.push('twilio')
    if (this.hasProvider('infobip')) providers.push('infobip')
    return providers
  }
  
  getCurrentStrategy(): string {
    return this.primaryProvider
  }
}

// Export singleton instance
export const smsProvider = new SMSProviderManager()

// Export main function for backward compatibility
export async function sendSMS(params: SendSMSParams) {
  return smsProvider.sendSMS(params)
}
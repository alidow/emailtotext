import { validateEnvVars, logEnvStatus } from './env-validation'

/**
 * Run startup checks and log warnings for missing configuration
 */
export function runStartupChecks() {
  if (typeof window === 'undefined') {
    // Server-side checks
    console.log('🚀 Starting Email to Text Notifier (Server)')
    
    const isTestMode = process.env.ENABLE_TEST_MODE === 'true'
    if (isTestMode) {
      console.log('⚠️  TEST MODE ENABLED - Using mock services')
    }
    
    // Check for missing env vars
    const missing = validateEnvVars(false)
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:')
      missing.forEach(name => console.error(`   - ${name}`))
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Missing required environment variables in production')
      }
    }
    
    // Log env status in development
    if (process.env.NODE_ENV === 'development') {
      logEnvStatus()
    }
  } else {
    // Client-side checks
    console.log('🚀 Starting Email to Text Notifier (Client)')
    
    const isTestMode = process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true'
    if (isTestMode) {
      console.log('⚠️  TEST MODE ENABLED - UI indicators active')
    }
    
    // Check for missing client-side env vars
    const missing = validateEnvVars(true)
    if (missing.length > 0) {
      console.warn('⚠️  Missing client-side environment variables:')
      missing.forEach(name => console.warn(`   - ${name}`))
    }
  }
}
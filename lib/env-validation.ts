/**
 * Environment Variable Validation
 * Ensures all required environment variables are set before the app starts
 */

export interface EnvVar {
  name: string
  required: boolean
  clientSide?: boolean
  description?: string
  testValue?: string // Value to use in test mode
}

// Define all environment variables used in the app
export const ENV_VARS: EnvVar[] = [
  // Supabase
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    clientSide: true,
    description: 'Supabase project URL',
    testValue: 'https://test.supabase.co'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    clientSide: true,
    description: 'Supabase anonymous key',
    testValue: 'test-anon-key'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    clientSide: false,
    description: 'Supabase service role key for server-side operations'
  },
  
  // Clerk
  {
    name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    required: true,
    clientSide: true,
    description: 'Clerk publishable key',
    testValue: 'pk_test_placeholder'
  },
  {
    name: 'CLERK_SECRET_KEY',
    required: true,
    clientSide: false,
    description: 'Clerk secret key'
  },
  
  // Stripe
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    required: false,
    clientSide: true,
    description: 'Stripe publishable key'
  },
  {
    name: 'STRIPE_SECRET_KEY',
    required: false,
    clientSide: false,
    description: 'Stripe secret key'
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    required: false,
    clientSide: false,
    description: 'Stripe webhook endpoint secret'
  },
  
  // Twilio
  {
    name: 'TWILIO_ACCOUNT_SID',
    required: false,
    clientSide: false,
    description: 'Twilio account SID'
  },
  {
    name: 'TWILIO_AUTH_TOKEN',
    required: false,
    clientSide: false,
    description: 'Twilio auth token'
  },
  {
    name: 'TWILIO_PHONE_NUMBER',
    required: false,
    clientSide: false,
    description: 'Twilio phone number for sending SMS'
  },
  
  // Mailgun
  {
    name: 'MAILGUN_API_KEY',
    required: false,
    clientSide: false,
    description: 'Mailgun API key'
  },
  {
    name: 'MAILGUN_DOMAIN',
    required: false,
    clientSide: false,
    description: 'Mailgun domain'
  },
  
  // Cloudflare Turnstile
  {
    name: 'NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY',
    required: false,
    clientSide: true,
    description: 'Cloudflare Turnstile site key'
  },
  {
    name: 'CLOUDFLARE_TURNSTILE_SECRET_KEY',
    required: false,
    clientSide: false,
    description: 'Cloudflare Turnstile secret key'
  },
  
  // Upstash Redis
  {
    name: 'UPSTASH_REDIS_REST_URL',
    required: false,
    clientSide: false,
    description: 'Upstash Redis REST URL'
  },
  {
    name: 'UPSTASH_REDIS_REST_TOKEN',
    required: false,
    clientSide: false,
    description: 'Upstash Redis REST token'
  },
  
  // App Configuration
  {
    name: 'NEXT_PUBLIC_APP_URL',
    required: true,
    clientSide: true,
    description: 'Application URL',
    testValue: 'http://localhost:3000'
  },
  {
    name: 'ENABLE_TEST_MODE',
    required: false,
    clientSide: false,
    description: 'Enable test mode for development'
  },
  {
    name: 'NEXT_PUBLIC_ENABLE_TEST_MODE',
    required: false,
    clientSide: true,
    description: 'Enable test mode indicators in UI'
  }
]

/**
 * Validate that all required environment variables are set
 * @param isClientSide - Whether to validate client-side or server-side vars
 * @returns Array of missing required variables
 */
export function validateEnvVars(isClientSide = false): string[] {
  const missing: string[] = []
  
  for (const envVar of ENV_VARS) {
    // Skip server-side vars when validating client-side
    if (isClientSide && !envVar.clientSide) continue
    
    // Skip client-side vars when validating server-side
    if (!isClientSide && envVar.clientSide) continue
    
    const value = process.env[envVar.name]
    
    if (envVar.required && !value) {
      missing.push(envVar.name)
    }
  }
  
  return missing
}

/**
 * Get environment variable value with fallback for test mode
 */
export function getEnvVar(name: string): string | undefined {
  const value = process.env[name]
  
  // If value exists, return it
  if (value) return value
  
  // In test mode, return test value if available
  if (process.env.ENABLE_TEST_MODE === 'true' || process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true') {
    const envVar = ENV_VARS.find(v => v.name === name)
    if (envVar?.testValue) return envVar.testValue
  }
  
  return undefined
}

/**
 * Log environment configuration status
 */
export function logEnvStatus() {
  const isTestMode = process.env.ENABLE_TEST_MODE === 'true'
  
  console.log('=== Environment Configuration ===')
  console.log(`Mode: ${isTestMode ? 'TEST' : 'PRODUCTION'}`)
  console.log(`Node Environment: ${process.env.NODE_ENV}`)
  console.log('')
  
  // Group by category
  const categories = {
    'Supabase': ['SUPABASE'],
    'Clerk': ['CLERK'],
    'Stripe': ['STRIPE'],
    'Twilio': ['TWILIO'],
    'Mailgun': ['MAILGUN'],
    'Cloudflare': ['CLOUDFLARE'],
    'Upstash': ['UPSTASH'],
    'App': ['APP_URL', 'TEST_MODE']
  }
  
  for (const [category, keywords] of Object.entries(categories)) {
    console.log(`${category}:`)
    
    const categoryVars = ENV_VARS.filter(v => 
      keywords.some(k => v.name.includes(k))
    )
    
    for (const envVar of categoryVars) {
      const value = process.env[envVar.name]
      const status = value ? '✓' : envVar.required ? '✗' : '○'
      const displayValue = value ? 
        (envVar.clientSide ? value.substring(0, 10) + '...' : '[SET]') : 
        '[NOT SET]'
      
      console.log(`  ${status} ${envVar.name}: ${displayValue}`)
    }
    console.log('')
  }
}

/**
 * Generate .env.example file content
 */
export function generateEnvExample(): string {
  let content = '# Environment Variables\n'
  content += '# Copy this file to .env.local and fill in the values\n\n'
  
  const categories = {
    'Supabase Configuration': ['SUPABASE'],
    'Clerk Authentication': ['CLERK'],
    'Stripe Payments': ['STRIPE'],
    'Twilio SMS': ['TWILIO'],
    'Mailgun Email': ['MAILGUN'],
    'Cloudflare Turnstile': ['CLOUDFLARE'],
    'Upstash Redis': ['UPSTASH'],
    'Application Configuration': ['APP_URL', 'TEST_MODE']
  }
  
  for (const [category, keywords] of Object.entries(categories)) {
    content += `# ${category}\n`
    
    const categoryVars = ENV_VARS.filter(v => 
      keywords.some(k => v.name.includes(k))
    )
    
    for (const envVar of categoryVars) {
      if (envVar.description) {
        content += `# ${envVar.description}\n`
      }
      content += `# Required: ${envVar.required ? 'Yes' : 'No'}\n`
      content += `${envVar.name}=\n\n`
    }
  }
  
  return content
}
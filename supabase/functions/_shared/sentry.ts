// Deno-compatible Sentry client for Supabase Edge Functions
// Properly captures and reports errors to Sentry

interface SentryEvent {
  event_id: string
  timestamp: number
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
  platform: string
  environment?: string
  message?: string
  exception?: {
    values: Array<{
      type: string
      value: string
      stacktrace?: {
        frames: Array<{
          filename: string
          function: string
          lineno: number
          colno: number
        }>
      }
    }>
  }
  tags?: Record<string, string>
  extra?: Record<string, any>
  user?: {
    id?: string
    email?: string
    username?: string
  }
  request?: {
    url?: string
    method?: string
    headers?: Record<string, string>
    data?: any
  }
}

class SentryClient {
  private dsn: string
  private projectId: string
  private publicKey: string
  private sentryUrl: string
  private environment: string

  constructor(dsn: string) {
    this.dsn = dsn
    
    // Parse DSN
    const match = dsn.match(/^https:\/\/([^@]+)@([^\/]+)\/(\d+)$/)
    if (!match) {
      throw new Error('Invalid Sentry DSN format')
    }
    
    this.publicKey = match[1]
    const host = match[2]
    this.projectId = match[3]
    this.sentryUrl = `https://${host}/api/${this.projectId}/store/`
    this.environment = Deno.env.get('SENTRY_ENVIRONMENT') || 'production'
  }

  private generateEventId(): string {
    return crypto.randomUUID().replace(/-/g, '')
  }

  private async sendEvent(event: SentryEvent): Promise<void> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Sentry-Auth': [
        'Sentry sentry_version=7',
        `sentry_client=deno-edge/1.0`,
        `sentry_key=${this.publicKey}`,
      ].join(', '),
    }

    try {
      const response = await fetch(this.sentryUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        console.error('Failed to send event to Sentry:', response.status, await response.text())
      }
    } catch (error) {
      console.error('Failed to send event to Sentry:', error)
    }
  }

  async captureException(
    error: Error | string,
    context?: {
      tags?: Record<string, string>
      extra?: Record<string, any>
      user?: { id?: string; email?: string }
      level?: 'fatal' | 'error' | 'warning'
    }
  ): Promise<void> {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    
    const event: SentryEvent = {
      event_id: this.generateEventId(),
      timestamp: Date.now() / 1000,
      level: context?.level || 'error',
      platform: 'javascript',
      environment: this.environment,
      exception: {
        values: [{
          type: errorObj.name || 'Error',
          value: errorObj.message,
          stacktrace: this.parseStackTrace(errorObj.stack || ''),
        }],
      },
      tags: {
        runtime: 'deno',
        function_type: 'edge',
        ...context?.tags,
      },
      extra: context?.extra,
      user: context?.user,
    }

    await this.sendEvent(event)
  }

  async captureMessage(
    message: string,
    context?: {
      level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
      tags?: Record<string, string>
      extra?: Record<string, any>
      user?: { id?: string; email?: string }
    }
  ): Promise<void> {
    const event: SentryEvent = {
      event_id: this.generateEventId(),
      timestamp: Date.now() / 1000,
      level: context?.level || 'info',
      platform: 'javascript',
      environment: this.environment,
      message,
      tags: {
        runtime: 'deno',
        function_type: 'edge',
        ...context?.tags,
      },
      extra: context?.extra,
      user: context?.user,
    }

    await this.sendEvent(event)
  }

  private parseStackTrace(stack: string): any {
    // Simple stack trace parsing for Deno
    const frames = stack.split('\n')
      .slice(1) // Skip the error message
      .map(line => {
        const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) ||
                     line.match(/at\s+(.+?):(\d+):(\d+)/)
        
        if (match) {
          if (match.length === 5) {
            return {
              function: match[1].trim(),
              filename: match[2],
              lineno: parseInt(match[3]),
              colno: parseInt(match[4]),
            }
          } else {
            return {
              function: '<anonymous>',
              filename: match[1],
              lineno: parseInt(match[2]),
              colno: parseInt(match[3]),
            }
          }
        }
        return null
      })
      .filter(Boolean)
      .reverse() // Sentry expects frames in reverse order

    return { frames }
  }
}

// SMS-specific error capturing with enhanced context
export async function captureSMSError(
  error: Error | string,
  context: {
    phone: string
    provider?: string
    messageBody?: string
    userId?: string
    emailId?: string
    errorCode?: number
    attemptNumber?: number
    totalAttempts?: number
    fromNumber?: string
    metadata?: Record<string, any>
  }
): Promise<void> {
  const sentryDsn = Deno.env.get('SENTRY_DSN') || Deno.env.get('NEXT_PUBLIC_SENTRY_DSN')
  
  if (!sentryDsn) {
    console.error('[SMS Error - No Sentry]', error, context)
    return
  }

  try {
    const client = new SentryClient(sentryDsn)
    
    // Determine severity based on error type
    let level: 'fatal' | 'error' | 'warning' = 'error'
    let tags: Record<string, string> = {
      service: 'sms-delivery',
      provider: context.provider || 'unknown',
    }

    // Check for specific error codes that indicate filtering/blocking
    if (context.errorCode) {
      tags.error_code = String(context.errorCode)
      
      // Critical errors that need immediate attention
      if ([30007, 30008, 21610].includes(context.errorCode)) {
        level = 'fatal'
        tags.issue_type = 'message_filtered'
      } else if (context.errorCode >= 30000) {
        tags.issue_type = 'delivery_failed'
      }
    }

    // Add attempt information
    if (context.attemptNumber && context.totalAttempts) {
      tags.attempt = `${context.attemptNumber}/${context.totalAttempts}`
    }

    await client.captureException(error, {
      level,
      tags,
      extra: {
        phone: context.phone,
        message_preview: context.messageBody?.substring(0, 100),
        from_number: context.fromNumber,
        email_id: context.emailId,
        ...context.metadata,
      },
      user: context.userId ? { id: context.userId } : undefined,
    })
  } catch (sentryError) {
    console.error('Failed to capture SMS error in Sentry:', sentryError)
  }
}

// Edge function error capturing with request context
export async function captureEdgeFunctionError(
  error: Error | string,
  request?: Request,
  context?: Record<string, any>
): Promise<void> {
  const sentryDsn = Deno.env.get('SENTRY_DSN') || Deno.env.get('NEXT_PUBLIC_SENTRY_DSN')
  
  if (!sentryDsn) {
    console.error('[Edge Function Error - No Sentry]', error, context)
    return
  }

  try {
    const client = new SentryClient(sentryDsn)
    
    const extra: Record<string, any> = {
      ...context,
    }

    // Add request information if available
    if (request) {
      extra.request = {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
      }
    }

    await client.captureException(error, {
      level: 'error',
      tags: {
        service: 'edge-function',
        function_name: Deno.env.get('FUNCTION_NAME') || 'unknown',
      },
      extra,
    })
  } catch (sentryError) {
    console.error('Failed to capture edge function error in Sentry:', sentryError)
  }
}

// Initialize Sentry for edge functions
export function initSentry(): SentryClient | null {
  const sentryDsn = Deno.env.get('SENTRY_DSN') || Deno.env.get('NEXT_PUBLIC_SENTRY_DSN')
  
  if (!sentryDsn) {
    console.log('Sentry DSN not configured, error reporting disabled')
    return null
  }

  try {
    return new SentryClient(sentryDsn)
  } catch (error) {
    console.error('Failed to initialize Sentry:', error)
    return null
  }
}

export default SentryClient
/**
 * Unified Analytics Tracking System with Comprehensive Logging
 * Tracks events to multiple providers and logs everything for debugging
 */

type AnalyticsEvent = {
  name: string
  parameters?: Record<string, any>
  value?: number
  currency?: string
}

type ConversionEvent = {
  conversionId?: string
  conversionLabel?: string
  value?: number
  currency?: string
}

// Event names for consistency
export const ANALYTICS_EVENTS = {
  // Page views
  START_PAGE_VIEW: 'start_page_view',
  START_ACCOUNT_VIEW: 'start_account_view',
  START_VERIFY_VIEW: 'start_verify_view', 
  START_PLAN_VIEW: 'start_plan_view',
  START_PAYMENT_VIEW: 'start_payment_view',
  
  // User actions
  START_FLOW_INITIATED: 'start_flow_initiated',
  ACCOUNT_CREATED: 'account_created',
  PHONE_CODE_SENT: 'phone_code_sent',
  PHONE_VERIFIED: 'phone_verified',
  PLAN_SELECTED: 'plan_selected',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  
  // Errors
  VERIFICATION_ERROR: 'verification_error',
  PAYMENT_ERROR: 'payment_error',
  
  // Conversions
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  SIGN_UP: 'sign_up'
} as const

class Analytics {
  private debug = true // Always log in development
  private logPrefix = '[ANALYTICS]'
  
  constructor() {
    if (typeof window !== 'undefined') {
      // Add debugging info to window for inspection
      (window as any).__analyticsDebug = {
        events: [],
        errors: [],
        lastEvent: null
      }
    }
  }

  /**
   * Log to console with consistent formatting
   */
  private log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logMessage = `${this.logPrefix} [${timestamp}] ${message}`
    
    if (level === 'error') {
      console.error(logMessage, data || '')
    } else if (level === 'warn') {
      console.warn(logMessage, data || '')
    } else {
      console.log(logMessage, data || '')
    }
    
    // Store in window for debugging
    if (typeof window !== 'undefined' && (window as any).__analyticsDebug) {
      const debugLog = {
        timestamp,
        level,
        message,
        data
      }
      
      if (level === 'error') {
        (window as any).__analyticsDebug.errors.push(debugLog)
      } else {
        (window as any).__analyticsDebug.events.push(debugLog)
      }
      
      (window as any).__analyticsDebug.lastEvent = debugLog
    }
  }

  /**
   * Send event to server for logging
   */
  private async logToServer(event: AnalyticsEvent & { source: string }) {
    try {
      const response = await fetch('/api/analytics/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer
        })
      })
      
      if (!response.ok) {
        this.log('error', 'Failed to log event to server', { 
          status: response.status,
          event 
        })
      }
    } catch (error) {
      this.log('error', 'Error logging to server', error)
    }
  }

  /**
   * Track an event across all configured analytics providers
   */
  track(event: AnalyticsEvent) {
    this.log('info', `Tracking event: ${event.name}`, event)
    
    // Always log to server for debugging
    if (typeof window !== 'undefined') {
      this.logToServer({ ...event, source: 'client' })
    }
    
    // Google Analytics (gtag)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', event.name, {
          ...event.parameters,
          value: event.value,
          currency: event.currency || 'USD',
          debug_mode: this.debug
        })
        this.log('info', `✓ Event sent to Google Analytics: ${event.name}`)
      } catch (error) {
        this.log('error', `Failed to send event to Google Analytics: ${event.name}`, error)
      }
    } else {
      this.log('warn', 'gtag not available - event not sent to GA')
    }
    
    // Google Tag Manager (dataLayer)
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      try {
        (window as any).dataLayer.push({
          event: event.name,
          ...event.parameters,
          eventValue: event.value,
          eventCurrency: event.currency || 'USD'
        })
        this.log('info', `✓ Event sent to GTM dataLayer: ${event.name}`)
      } catch (error) {
        this.log('error', `Failed to push event to dataLayer: ${event.name}`, error)
      }
    } else {
      this.log('warn', 'dataLayer not available - event not sent to GTM')
    }
    
    // Bing UET
    if (typeof window !== 'undefined' && (window as any).uetq) {
      try {
        (window as any).uetq.push('event', event.name, {
          event_category: 'engagement',
          event_label: event.name,
          event_value: event.value,
          ...event.parameters
        })
        this.log('info', `✓ Event sent to Bing UET: ${event.name}`)
      } catch (error) {
        this.log('error', `Failed to send event to Bing UET: ${event.name}`, error)
      }
    }
    
    return true
  }

  /**
   * Track a page view
   */
  pageView(page: string, title?: string) {
    this.log('info', `Page view: ${page}`)
    
    const event: AnalyticsEvent = {
      name: 'page_view',
      parameters: {
        page_location: page,
        page_title: title || document.title,
        page_path: page
      }
    }
    
    this.track(event)
  }

  /**
   * Track a conversion event
   */
  conversion(conversionEvent: ConversionEvent & { name: string }) {
    this.log('info', `Conversion: ${conversionEvent.name}`, conversionEvent)
    
    // Send as regular event
    this.track({
      name: conversionEvent.name,
      value: conversionEvent.value,
      currency: conversionEvent.currency,
      parameters: {
        conversion_id: conversionEvent.conversionId,
        conversion_label: conversionEvent.conversionLabel
      }
    })
    
    // Also trigger Google Ads conversion if available
    if (typeof window !== 'undefined' && (window as any).gtag && conversionEvent.conversionId) {
      try {
        (window as any).gtag('event', 'conversion', {
          send_to: conversionEvent.conversionId,
          value: conversionEvent.value,
          currency: conversionEvent.currency || 'USD'
        })
        this.log('info', `✓ Conversion sent to Google Ads: ${conversionEvent.conversionId}`)
      } catch (error) {
        this.log('error', 'Failed to send Google Ads conversion', error)
      }
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>) {
    this.log('info', 'Setting user properties', properties)
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('set', 'user_properties', properties)
        this.log('info', '✓ User properties set in GA')
      } catch (error) {
        this.log('error', 'Failed to set user properties', error)
      }
    }
  }

  /**
   * Initialize analytics and verify configuration
   */
  async initialize() {
    this.log('info', 'Initializing analytics...')
    
    // Check what's available
    const available = {
      gtag: typeof window !== 'undefined' && !!(window as any).gtag,
      dataLayer: typeof window !== 'undefined' && !!(window as any).dataLayer,
      uetq: typeof window !== 'undefined' && !!(window as any).uetq
    }
    
    this.log('info', 'Available analytics providers:', available)
    
    // Send initialization event
    this.track({
      name: 'analytics_initialized',
      parameters: available
    })
    
    return available
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Export convenience functions
export function trackEvent(name: string, parameters?: Record<string, any>, value?: number) {
  return analytics.track({ name, parameters, value })
}

export function trackPageView(page: string, title?: string) {
  return analytics.pageView(page, title)
}

export function trackConversion(name: string, value?: number, conversionId?: string) {
  return analytics.conversion({ name, value, conversionId })
}

export function initializeAnalytics() {
  return analytics.initialize()
}
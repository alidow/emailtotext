import Stripe from "stripe"
import { isTestMode, logPayment, createMockCheckoutSession, generateMockStripeSessionId } from "./test-mode"

// Types
interface CreateCheckoutParams {
  customerId: string
  userId: string
  priceId?: string
  mode: 'payment' | 'subscription' | 'setup'
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, any>
  lineItems?: Array<{
    price: string
    quantity: number
  }>
  planType?: string
  billingCycle?: string
}

interface CreateSubscriptionParams {
  customerId: string
  userId: string
  priceId: string
  metadata?: Record<string, any>
}

class StripeClient {
  private client: Stripe | null
  
  constructor() {
    // Only initialize real Stripe client if not in test mode and credentials exist
    if (!isTestMode() && process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock') {
      this.client = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-07-30.basil"
      })
    } else {
      this.client = null
    }
  }
  
  async createCheckoutSession(params: CreateCheckoutParams) {
    // In test mode, create mock session and log
    if (isTestMode()) {
      const mockSession = createMockCheckoutSession({
        customerId: params.customerId,
        mode: params.mode,
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
        metadata: params.metadata
      })
      
      // Log the payment attempt
      await logPayment({
        userId: params.userId,
        type: 'checkout',
        stripeSessionId: mockSession.id,
        planType: params.planType,
        billingCycle: params.billingCycle,
        metadata: {
          ...params.metadata,
          mode: params.mode,
          priceId: params.priceId
        }
      })
      
      return mockSession
    }
    
    // In production, create real checkout session
    if (!this.client) {
      throw new Error('Stripe client not initialized')
    }
    
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: params.customerId,
      mode: params.mode,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata
    }
    
    if (params.mode === 'setup') {
      sessionParams.payment_method_types = ['card']
    } else if (params.lineItems) {
      sessionParams.line_items = params.lineItems
      if (params.mode === 'subscription') {
        sessionParams.subscription_data = {
          metadata: params.metadata
        }
      }
    }
    
    return await this.client.checkout.sessions.create(sessionParams)
  }
  
  async createSubscription(params: CreateSubscriptionParams) {
    // In test mode, create mock subscription
    if (isTestMode()) {
      const mockSubscription = {
        id: `sub_test_${Date.now()}`,
        object: 'subscription',
        customer: params.customerId,
        items: {
          data: [{
            price: { id: params.priceId }
          }]
        },
        status: 'active',
        created: Math.floor(Date.now() / 1000),
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000),
        metadata: params.metadata
      }
      
      // Log the subscription
      await logPayment({
        userId: params.userId,
        type: 'subscription',
        metadata: {
          ...params.metadata,
          subscriptionId: mockSubscription.id,
          priceId: params.priceId
        }
      })
      
      return mockSubscription
    }
    
    // In production, create real subscription
    if (!this.client) {
      throw new Error('Stripe client not initialized')
    }
    
    return await this.client.subscriptions.create({
      customer: params.customerId,
      items: [{ price: params.priceId }],
      metadata: params.metadata
    })
  }
  
  async createCustomer(params: {
    email?: string
    metadata?: Record<string, any>
  }) {
    // In test mode, create mock customer
    if (isTestMode()) {
      return {
        id: `cus_test_${Date.now()}`,
        object: 'customer',
        email: params.email,
        created: Math.floor(Date.now() / 1000),
        metadata: params.metadata || {}
      }
    }
    
    // In production, create real customer
    if (!this.client) {
      throw new Error('Stripe client not initialized')
    }
    
    return await this.client.customers.create(params)
  }
  
  async createCharge(params: {
    amount: number
    currency: string
    customer: string
    description?: string
    metadata?: Record<string, any>
    userId: string
  }) {
    // In test mode, create mock charge
    if (isTestMode()) {
      const mockCharge = {
        id: `ch_test_${Date.now()}`,
        object: 'charge',
        amount: params.amount,
        currency: params.currency,
        customer: params.customer,
        description: params.description,
        created: Math.floor(Date.now() / 1000),
        paid: true,
        status: 'succeeded',
        metadata: params.metadata || {}
      }
      
      // Log the charge
      await logPayment({
        userId: params.userId,
        type: 'payment',
        amount: params.amount,
        currency: params.currency,
        metadata: {
          ...params.metadata,
          chargeId: mockCharge.id,
          description: params.description
        }
      })
      
      return mockCharge
    }
    
    // In production, create real charge
    if (!this.client) {
      throw new Error('Stripe client not initialized')
    }
    
    return await this.client.charges.create({
      amount: params.amount,
      currency: params.currency,
      customer: params.customer,
      description: params.description,
      metadata: params.metadata
    })
  }
  
  // Retrieve a checkout session
  async retrieveCheckoutSession(sessionId: string) {
    // In test mode, return mock session
    if (isTestMode()) {
      return {
        id: sessionId,
        object: 'checkout.session',
        payment_status: 'paid',
        status: 'complete',
        customer: 'cus_test_123',
        metadata: {}
      }
    }
    
    // In production, retrieve real session
    if (!this.client) {
      throw new Error('Stripe client not initialized')
    }
    
    return await this.client.checkout.sessions.retrieve(sessionId)
  }
  
  // Check if Stripe is properly configured
  isConfigured(): boolean {
    return !isTestMode() && this.client !== null
  }
}

// Export singleton instance
export const stripeClient = new StripeClient()

// Re-export Stripe types
export type { Stripe }
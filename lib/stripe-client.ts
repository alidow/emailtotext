import Stripe from "stripe"

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
  paymentMethodCollection?: 'always' | 'if_required'
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
    // Initialize Stripe client if credentials exist
    if (process.env.STRIPE_SECRET_KEY) {
      this.client = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-07-30.basil"
      })
    } else {
      this.client = null
    }
  }
  
  async createCheckoutSession(params: CreateCheckoutParams) {
    if (!this.client) {
      throw new Error('Stripe client not initialized')
    }
    
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: params.customerId,
      mode: params.mode,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
      payment_method_collection: params.paymentMethodCollection
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
    if (!this.client) {
      throw new Error('Stripe client not initialized')
    }
    
    return await this.client.checkout.sessions.retrieve(sessionId)
  }
  
  // Check if Stripe is properly configured
  isConfigured(): boolean {
    return this.client !== null
  }
}

// Export singleton instance
export const stripeClient = new StripeClient()

// Re-export Stripe types
export type { Stripe }
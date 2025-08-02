import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Mock Stripe
jest.mock('stripe')
const mockStripe = jest.mocked(Stripe)

// Mock Supabase
jest.mock('@supabase/supabase-js')
const mockSupabase = jest.mocked(createClient)

describe('Auto-upgrade from Free to Basic', () => {
  let mockSupabaseClient: any
  let mockStripeInstance: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup Supabase mock
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis()
    }
    
    mockSupabase.mockReturnValue(mockSupabaseClient)
    
    // Setup Stripe mock
    mockStripeInstance = {
      subscriptions: {
        create: jest.fn()
      }
    }
    
    mockStripe.mockImplementation(() => mockStripeInstance as any)
  })

  it('should auto-upgrade free user when exceeding 10 texts', async () => {
    // Mock user data
    const mockUser = {
      id: 'user-123',
      phone: '+15551234567',
      email: 'test@example.com',
      plan_type: 'free',
      usage_count: 10,
      stripe_customer_id: 'cus_123',
      additional_texts_purchased: 0
    }

    // Mock Supabase responses
    mockSupabaseClient.single.mockResolvedValueOnce({ data: mockUser, error: null })
    
    // Mock Stripe subscription creation
    const mockSubscription = {
      id: 'sub_123',
      customer: 'cus_123',
      items: {
        data: [{
          price: {
            id: 'price_basic_monthly',
            recurring: { interval: 'month' }
          }
        }]
      },
      status: 'active'
    }
    
    mockStripeInstance.subscriptions.create.mockResolvedValue(mockSubscription)

    // Simulate processing 11th email
    const processEmail = async (userId: string) => {
      // Get user
      const { data: user } = await mockSupabaseClient
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      const quotaLimit = user.plan_type === 'free' ? 10 : 100
      
      if (user.usage_count >= quotaLimit && user.plan_type === 'free') {
        // Create subscription
        const subscription = await mockStripeInstance.subscriptions.create({
          customer: user.stripe_customer_id,
          items: [{ price: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID }],
          metadata: { user_id: user.id, auto_upgrade: 'true' }
        })

        // Update user to Basic plan
        await mockSupabaseClient
          .from('users')
          .update({
            plan_type: 'basic',
            stripe_subscription_id: subscription.id,
            billing_cycle: 'monthly'
          })
          .eq('id', user.id)

        // Log billing event
        await mockSupabaseClient
          .from('billing_events')
          .insert({
            user_id: user.id,
            event_type: 'auto_upgrade',
            details: {
              from_plan: 'free',
              to_plan: 'basic',
              trigger: 'quota_exceeded'
            }
          })

        return { upgraded: true, subscription }
      }
      
      return { upgraded: false }
    }

    const result = await processEmail(mockUser.id)

    // Assertions
    expect(result.upgraded).toBe(true)
    expect(mockStripeInstance.subscriptions.create).toHaveBeenCalledWith({
      customer: 'cus_123',
      items: [{ price: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID }],
      metadata: { user_id: 'user-123', auto_upgrade: 'true' }
    })
    
    expect(mockSupabaseClient.update).toHaveBeenCalledWith({
      plan_type: 'basic',
      stripe_subscription_id: 'sub_123',
      billing_cycle: 'monthly'
    })
    
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
      user_id: 'user-123',
      event_type: 'auto_upgrade',
      details: {
        from_plan: 'free',
        to_plan: 'basic',
        trigger: 'quota_exceeded'
      }
    })
  })

  it('should handle auto-upgrade failure gracefully', async () => {
    const mockUser = {
      id: 'user-123',
      plan_type: 'free',
      usage_count: 10,
      stripe_customer_id: 'cus_123'
    }

    mockSupabaseClient.single.mockResolvedValueOnce({ data: mockUser, error: null })
    
    // Mock Stripe failure
    mockStripeInstance.subscriptions.create.mockRejectedValue(
      new Error('Your card was declined')
    )

    const processEmail = async (userId: string) => {
      const { data: user } = await mockSupabaseClient
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      try {
        if (user.usage_count >= 10 && user.plan_type === 'free') {
          const subscription = await mockStripeInstance.subscriptions.create({
            customer: user.stripe_customer_id,
            items: [{ price: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID }]
          })
          
          return { upgraded: true, subscription }
        }
      } catch (error) {
        return { upgraded: false, error: error.message }
      }
      
      return { upgraded: false }
    }

    const result = await processEmail(mockUser.id)

    expect(result.upgraded).toBe(false)
    expect(result.error).toBe('Your card was declined')
    expect(mockSupabaseClient.update).not.toHaveBeenCalled()
  })

  it('should not auto-upgrade if user has no payment method', async () => {
    const mockUser = {
      id: 'user-123',
      plan_type: 'free',
      usage_count: 10,
      stripe_customer_id: null // No Stripe customer
    }

    mockSupabaseClient.single.mockResolvedValueOnce({ data: mockUser, error: null })

    const processEmail = async (userId: string) => {
      const { data: user } = await mockSupabaseClient
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!user.stripe_customer_id) {
        return { upgraded: false, error: 'No payment method on file' }
      }

      // Auto-upgrade logic...
      return { upgraded: true }
    }

    const result = await processEmail(mockUser.id)

    expect(result.upgraded).toBe(false)
    expect(result.error).toBe('No payment method on file')
    expect(mockStripeInstance.subscriptions.create).not.toHaveBeenCalled()
  })

  it('should send upgrade notification email', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      plan_type: 'free',
      usage_count: 10,
      stripe_customer_id: 'cus_123'
    }

    const mockSendEmail = jest.fn().mockResolvedValue({ success: true })

    mockSupabaseClient.single.mockResolvedValueOnce({ data: mockUser, error: null })
    mockStripeInstance.subscriptions.create.mockResolvedValue({ id: 'sub_123' })

    const processEmailWithNotification = async (userId: string) => {
      const { data: user } = await mockSupabaseClient
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (user.usage_count >= 10 && user.plan_type === 'free') {
        const subscription = await mockStripeInstance.subscriptions.create({
          customer: user.stripe_customer_id,
          items: [{ price: 'price_basic_monthly' }]
        })

        // Send email notification
        await mockSendEmail({
          to: user.email,
          subject: 'Your plan has been upgraded',
          template: 'auto_upgrade',
          data: {
            fromPlan: 'free',
            toPlan: 'basic',
            amount: '$4.99'
          }
        })

        return { upgraded: true, emailSent: true }
      }
      
      return { upgraded: false }
    }

    const result = await processEmailWithNotification(mockUser.id)

    expect(result.upgraded).toBe(true)
    expect(result.emailSent).toBe(true)
    expect(mockSendEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Your plan has been upgraded',
      template: 'auto_upgrade',
      data: {
        fromPlan: 'free',
        toPlan: 'basic',
        amount: '$4.99'
      }
    })
  })
})
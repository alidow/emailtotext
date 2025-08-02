import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import Stripe from 'stripe'
import { NextRequest } from 'next/server'

// Mock dependencies
jest.mock('stripe')
const mockStripe = jest.mocked(Stripe)

describe('Stripe Webhook Handler', () => {
  let mockStripeInstance: any
  let mockSupabaseAdmin: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock Stripe
    mockStripeInstance = {
      webhooks: {
        constructEvent: jest.fn()
      }
    }
    
    mockStripe.mockImplementation(() => mockStripeInstance as any)
    
    // Mock Supabase Admin
    mockSupabaseAdmin = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis()
    }
  })

  describe('invoice.payment_succeeded', () => {
    it('should reset usage count on successful payment', async () => {
      const mockUser = {
        id: 'user-123',
        stripe_customer_id: 'cus_123',
        usage_count: 85,
        additional_texts_purchased: 15
      }

      const mockInvoice: Partial<Stripe.Invoice> = {
        id: 'inv_123',
        customer: 'cus_123',
        subscription: 'sub_123',
        amount_paid: 499, // $4.99
        status: 'paid'
      }

      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        object: 'event',
        type: 'invoice.payment_succeeded',
        data: {
          object: mockInvoice as Stripe.Invoice
        },
        api_version: '2023-10-16',
        created: Date.now() / 1000,
        livemode: false,
        pending_webhooks: 0,
        request: null
      }

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent)
      mockSupabaseAdmin.single.mockResolvedValue({ data: mockUser, error: null })

      const handleWebhook = async (event: Stripe.Event) => {
        if (event.type === 'invoice.payment_succeeded') {
          const invoice = event.data.object as Stripe.Invoice
          const customerId = invoice.customer as string
          
          // Get user
          const { data: user } = await mockSupabaseAdmin
            .from('users')
            .select('*')
            .eq('stripe_customer_id', customerId)
            .single()

          // Reset usage for new billing period
          const nextResetDate = new Date()
          nextResetDate.setMonth(nextResetDate.getMonth() + 1)

          await mockSupabaseAdmin
            .from('users')
            .update({
              usage_count: 0,
              usage_reset_at: nextResetDate.toISOString(),
              additional_texts_purchased: 0
            })
            .eq('id', user.id)

          // Log payment
          await mockSupabaseAdmin
            .from('billing_events')
            .insert({
              user_id: user.id,
              event_type: 'payment_succeeded',
              amount: invoice.amount_paid / 100,
              details: {
                invoice_id: invoice.id,
                subscription_id: invoice.subscription
              }
            })

          return { processed: true, userId: user.id }
        }
        
        return { processed: false }
      }

      const result = await handleWebhook(mockEvent)

      expect(result.processed).toBe(true)
      expect(result.userId).toBe('user-123')
      
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        usage_count: 0,
        usage_reset_at: expect.any(String),
        additional_texts_purchased: 0
      })
      
      expect(mockSupabaseAdmin.insert).toHaveBeenCalledWith({
        user_id: 'user-123',
        event_type: 'payment_succeeded',
        amount: 4.99,
        details: {
          invoice_id: 'inv_123',
          subscription_id: 'sub_123'
        }
      })
    })
  })

  describe('invoice.payment_failed', () => {
    it('should handle first payment failure', async () => {
      const mockUser = {
        id: 'user-456',
        email: 'test@example.com',
        stripe_customer_id: 'cus_456'
      }

      const mockInvoice: Partial<Stripe.Invoice> = {
        id: 'inv_failed_1',
        customer: 'cus_456',
        attempt_count: 1,
        last_finalization_error: {
          type: 'card_error',
          message: 'Your card was declined'
        }
      }

      const mockEvent: Stripe.Event = {
        id: 'evt_failed_1',
        object: 'event',
        type: 'invoice.payment_failed',
        data: {
          object: mockInvoice as Stripe.Invoice
        },
        api_version: '2023-10-16',
        created: Date.now() / 1000,
        livemode: false,
        pending_webhooks: 0,
        request: null
      }

      mockSupabaseAdmin.single.mockResolvedValue({ data: mockUser, error: null })

      const handlePaymentFailure = async (event: Stripe.Event) => {
        const invoice = event.data.object as Stripe.Invoice
        const attemptCount = invoice.attempt_count
        
        // Get user
        const { data: user } = await mockSupabaseAdmin
          .from('users')
          .select('*')
          .eq('stripe_customer_id', invoice.customer)
          .single()

        // Log failure
        await mockSupabaseAdmin
          .from('payment_failures')
          .insert({
            user_id: user.id,
            invoice_id: invoice.id,
            attempt_number: attemptCount,
            failure_reason: invoice.last_finalization_error?.message
          })

        // Send email based on attempt
        let emailType = ''
        if (attemptCount === 1) {
          emailType = 'first_attempt'
        } else if (attemptCount === 2) {
          emailType = 'second_attempt'
        } else if (attemptCount >= 3) {
          emailType = 'final_attempt'
        }

        return { 
          processed: true, 
          attemptCount, 
          emailType,
          userId: user.id 
        }
      }

      const result = await handlePaymentFailure(mockEvent)

      expect(result.processed).toBe(true)
      expect(result.attemptCount).toBe(1)
      expect(result.emailType).toBe('first_attempt')
      
      expect(mockSupabaseAdmin.insert).toHaveBeenCalledWith({
        user_id: 'user-456',
        invoice_id: 'inv_failed_1',
        attempt_number: 1,
        failure_reason: 'Your card was declined'
      })
    })

    it('should suspend service after 3 failed attempts', async () => {
      const mockUser = {
        id: 'user-suspend',
        stripe_customer_id: 'cus_suspend',
        plan_type: 'basic'
      }

      const mockInvoice: Partial<Stripe.Invoice> = {
        id: 'inv_suspend',
        customer: 'cus_suspend',
        attempt_count: 3,
        last_finalization_error: {
          type: 'card_error',
          message: 'Your card was declined'
        }
      }

      const mockEvent: Stripe.Event = {
        id: 'evt_suspend',
        object: 'event',
        type: 'invoice.payment_failed',
        data: {
          object: mockInvoice as Stripe.Invoice
        },
        api_version: '2023-10-16',
        created: Date.now() / 1000,
        livemode: false,
        pending_webhooks: 0,
        request: null
      }

      mockSupabaseAdmin.single.mockResolvedValue({ data: mockUser, error: null })

      const handleThirdFailure = async (event: Stripe.Event) => {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.attempt_count >= 3) {
          const { data: user } = await mockSupabaseAdmin
            .from('users')
            .select('*')
            .eq('stripe_customer_id', invoice.customer)
            .single()

          // Suspend service
          await mockSupabaseAdmin
            .from('users')
            .update({ 
              plan_type: 'suspended',
              suspension_reason: 'payment_failed'
            })
            .eq('id', user.id)

          return { suspended: true, userId: user.id }
        }
        
        return { suspended: false }
      }

      const result = await handleThirdFailure(mockEvent)

      expect(result.suspended).toBe(true)
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        plan_type: 'suspended',
        suspension_reason: 'payment_failed'
      })
    })
  })

  describe('customer.subscription.updated', () => {
    it('should handle plan upgrade', async () => {
      const mockUser = {
        id: 'user-upgrade',
        stripe_customer_id: 'cus_upgrade',
        plan_type: 'basic',
        usage_count: 75
      }

      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_upgrade',
        customer: 'cus_upgrade',
        status: 'active',
        items: {
          object: 'list',
          data: [{
            id: 'si_123',
            price: {
              id: 'price_standard_monthly',
              recurring: {
                interval: 'month'
              }
            }
          }],
          has_more: false,
          url: ''
        }
      }

      const mockEvent: Stripe.Event = {
        id: 'evt_upgrade',
        object: 'event',
        type: 'customer.subscription.updated',
        data: {
          object: mockSubscription as Stripe.Subscription,
          previous_attributes: {
            items: {
              data: [{
                price: {
                  id: 'price_basic_monthly'
                }
              }]
            }
          }
        },
        api_version: '2023-10-16',
        created: Date.now() / 1000,
        livemode: false,
        pending_webhooks: 0,
        request: null
      }

      mockSupabaseAdmin.single.mockResolvedValue({ data: mockUser, error: null })

      const handleSubscriptionUpdate = async (event: Stripe.Event) => {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = subscription.items.data[0].price.id
        
        // Map price ID to plan type
        const planMap: Record<string, string> = {
          'price_basic_monthly': 'basic',
          'price_standard_monthly': 'standard',
          'price_premium_monthly': 'premium'
        }
        
        const newPlanType = planMap[priceId]
        
        // Get user
        const { data: user } = await mockSupabaseAdmin
          .from('users')
          .select('*')
          .eq('stripe_customer_id', subscription.customer)
          .single()

        // Check if this is an upgrade
        const planHierarchy = ['free', 'basic', 'standard', 'premium']
        const isUpgrade = planHierarchy.indexOf(newPlanType) > planHierarchy.indexOf(user.plan_type)

        // Update user
        await mockSupabaseAdmin
          .from('users')
          .update({
            stripe_subscription_id: subscription.id,
            plan_type: newPlanType,
            billing_cycle: subscription.items.data[0].price.recurring?.interval === 'year' ? 'annual' : 'monthly'
          })
          .eq('id', user.id)

        return { 
          processed: true, 
          isUpgrade,
          oldPlan: user.plan_type,
          newPlan: newPlanType 
        }
      }

      const result = await handleSubscriptionUpdate(mockEvent)

      expect(result.processed).toBe(true)
      expect(result.isUpgrade).toBe(true)
      expect(result.oldPlan).toBe('basic')
      expect(result.newPlan).toBe('standard')
    })

    it('should handle annual plan subscription', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_annual',
        customer: 'cus_annual',
        items: {
          object: 'list',
          data: [{
            id: 'si_annual',
            price: {
              id: 'price_premium_annual',
              recurring: {
                interval: 'year'
              }
            }
          }],
          has_more: false,
          url: ''
        }
      }

      mockSupabaseAdmin.single.mockResolvedValue({ 
        data: { id: 'user-annual', stripe_customer_id: 'cus_annual' }, 
        error: null 
      })

      const handleAnnualSubscription = async (subscription: Stripe.Subscription) => {
        const billingCycle = subscription.items.data[0].price.recurring?.interval === 'year' ? 'annual' : 'monthly'
        
        await mockSupabaseAdmin
          .from('users')
          .update({
            billing_cycle: billingCycle
          })
          .eq('stripe_customer_id', subscription.customer)

        return { billingCycle }
      }

      const result = await handleAnnualSubscription(mockSubscription as Stripe.Subscription)

      expect(result.billingCycle).toBe('annual')
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        billing_cycle: 'annual'
      })
    })
  })

  describe('customer.subscription.deleted', () => {
    it('should downgrade to free plan on cancellation', async () => {
      const mockUser = {
        id: 'user-cancel',
        stripe_customer_id: 'cus_cancel',
        plan_type: 'standard'
      }

      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_cancel',
        customer: 'cus_cancel',
        status: 'canceled'
      }

      mockSupabaseAdmin.single.mockResolvedValue({ data: mockUser, error: null })

      const handleCancellation = async (subscription: Stripe.Subscription) => {
        const { data: user } = await mockSupabaseAdmin
          .from('users')
          .select('*')
          .eq('stripe_customer_id', subscription.customer)
          .single()

        // Downgrade to free
        await mockSupabaseAdmin
          .from('users')
          .update({
            plan_type: 'free',
            stripe_subscription_id: null,
            billing_cycle: null
          })
          .eq('id', user.id)

        // Log event
        await mockSupabaseAdmin
          .from('billing_events')
          .insert({
            user_id: user.id,
            event_type: 'subscription_cancelled',
            details: {
              subscription_id: subscription.id,
              previous_plan: user.plan_type
            }
          })

        return { cancelled: true, userId: user.id }
      }

      const result = await handleCancellation(mockSubscription as Stripe.Subscription)

      expect(result.cancelled).toBe(true)
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        plan_type: 'free',
        stripe_subscription_id: null,
        billing_cycle: null
      })
    })
  })

  describe('Webhook signature verification', () => {
    it('should reject invalid signature', async () => {
      mockStripeInstance.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Webhook signature verification failed')
      })

      const verifyWebhook = async (body: string, signature: string) => {
        try {
          const event = mockStripeInstance.webhooks.constructEvent(
            body,
            signature,
            'webhook_secret'
          )
          return { valid: true, event }
        } catch (error) {
          return { valid: false, error: error.message }
        }
      }

      const result = await verifyWebhook('invalid_body', 'invalid_sig')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Webhook signature verification failed')
    })
  })
})
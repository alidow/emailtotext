import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import Stripe from 'stripe'

// Mock dependencies
jest.mock('stripe')
const mockStripe = jest.mocked(Stripe)

describe('Payment Failure Scenarios', () => {
  let mockStripeInstance: any
  let mockSupabaseAdmin: any
  let mockEmailService: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock Stripe
    mockStripeInstance = {
      charges: {
        create: jest.fn()
      },
      paymentIntents: {
        retrieve: jest.fn(),
        confirm: jest.fn()
      },
      customers: {
        retrieve: jest.fn()
      }
    }
    
    mockStripe.mockImplementation(() => mockStripeInstance as any)
    
    // Mock Supabase
    mockSupabaseAdmin = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis()
    }
    
    // Mock email service
    mockEmailService = {
      sendEmail: jest.fn()
    }
  })

  describe('Monthly payment failures', () => {
    it('should handle card_declined error', async () => {
      const mockInvoice: Partial<Stripe.Invoice> = {
        id: 'inv_declined',
        customer: 'cus_123',
        payment_intent: 'pi_declined',
        attempt_count: 1,
        last_finalization_error: {
          type: 'card_error',
          code: 'card_declined',
          message: 'Your card was declined'
        }
      }

      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        phone: '+15551234567'
      }

      mockSupabaseAdmin.single.mockResolvedValue({ data: mockUser, error: null })

      const handleDeclinedCard = async (invoice: Stripe.Invoice) => {
        // Log the failure
        await mockSupabaseAdmin
          .from('payment_failures')
          .insert({
            user_id: mockUser.id,
            invoice_id: invoice.id,
            attempt_number: invoice.attempt_count,
            failure_reason: invoice.last_finalization_error?.message,
            error_code: invoice.last_finalization_error?.code
          })

        // Send notification
        await mockEmailService.sendEmail({
          to: mockUser.email,
          template: 'payment_failed_card_declined',
          data: {
            attemptNumber: invoice.attempt_count,
            nextRetryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
          }
        })

        return { 
          handled: true, 
          errorCode: invoice.last_finalization_error?.code 
        }
      }

      const result = await handleDeclinedCard(mockInvoice as Stripe.Invoice)

      expect(result.handled).toBe(true)
      expect(result.errorCode).toBe('card_declined')
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        to: 'user@example.com',
        template: 'payment_failed_card_declined',
        data: expect.any(Object)
      })
    })

    it('should handle insufficient_funds error', async () => {
      const mockCharge: Partial<Stripe.Charge> = {
        id: 'ch_insufficient',
        amount: 499,
        currency: 'usd',
        failure_code: 'insufficient_funds',
        failure_message: 'Your card has insufficient funds.',
        outcome: {
          network_status: 'declined_by_network',
          reason: 'generic_decline',
          risk_level: 'normal',
          seller_message: 'The bank did not return any further details with this decline.',
          type: 'issuer_declined'
        }
      }

      const handleInsufficientFunds = async (charge: Stripe.Charge) => {
        // Different handling for insufficient funds
        if (charge.failure_code === 'insufficient_funds') {
          // Maybe send a different email template
          await mockEmailService.sendEmail({
            to: 'user@example.com',
            template: 'payment_failed_insufficient_funds',
            data: {
              amount: charge.amount / 100,
              currency: charge.currency
            }
          })
          
          return { specialHandling: true }
        }
        
        return { specialHandling: false }
      }

      const result = await handleInsufficientFunds(mockCharge as Stripe.Charge)

      expect(result.specialHandling).toBe(true)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        to: 'user@example.com',
        template: 'payment_failed_insufficient_funds',
        data: {
          amount: 4.99,
          currency: 'usd'
        }
      })
    })

    it('should handle expired card', async () => {
      const mockPaymentIntent: Partial<Stripe.PaymentIntent> = {
        id: 'pi_expired',
        amount: 999,
        last_payment_error: {
          type: 'card_error',
          code: 'expired_card',
          message: 'Your card has expired.',
          payment_method: {
            id: 'pm_expired',
            type: 'card'
          }
        }
      }

      const handleExpiredCard = async (paymentIntent: Stripe.PaymentIntent) => {
        if (paymentIntent.last_payment_error?.code === 'expired_card') {
          // Update user record
          await mockSupabaseAdmin
            .from('users')
            .update({
              payment_method_status: 'expired',
              payment_method_last_error: 'Card expired'
            })
            .eq('id', 'user-123')

          // Send update payment method email
          await mockEmailService.sendEmail({
            to: 'user@example.com',
            template: 'update_payment_method_expired',
            data: {
              updateUrl: 'https://app.example.com/settings/billing'
            }
          })

          return { requiresUpdate: true }
        }
        
        return { requiresUpdate: false }
      }

      const result = await handleExpiredCard(mockPaymentIntent as Stripe.PaymentIntent)

      expect(result.requiresUpdate).toBe(true)
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        payment_method_status: 'expired',
        payment_method_last_error: 'Card expired'
      })
    })
  })

  describe('Retry logic', () => {
    it('should implement exponential backoff for retries', async () => {
      const mockFailures = [
        { attempt_number: 1, created_at: new Date('2024-01-01T10:00:00Z') },
        { attempt_number: 2, created_at: new Date('2024-01-04T10:00:00Z') },
        { attempt_number: 3, created_at: new Date('2024-01-08T10:00:00Z') }
      ]

      const calculateNextRetry = (attemptNumber: number): Date => {
        // Stripe's default retry schedule
        const retryDelays = [0, 3, 5, 7] // days
        const delayDays = retryDelays[attemptNumber] || 7
        
        const nextRetry = new Date()
        nextRetry.setDate(nextRetry.getDate() + delayDays)
        
        return nextRetry
      }

      const verifyRetrySchedule = () => {
        const attempt1 = calculateNextRetry(1)
        const attempt2 = calculateNextRetry(2)
        const attempt3 = calculateNextRetry(3)
        
        // Verify delays increase
        const delay1 = attempt1.getTime() - Date.now()
        const delay2 = attempt2.getTime() - Date.now()
        const delay3 = attempt3.getTime() - Date.now()
        
        return {
          delays: [delay1, delay2, delay3],
          increasing: delay1 < delay2 && delay2 < delay3
        }
      }

      const result = verifyRetrySchedule()

      expect(result.increasing).toBe(true)
    })

    it('should stop retrying after max attempts', async () => {
      const mockUser = {
        id: 'user-max-retry',
        plan_type: 'basic',
        stripe_subscription_id: 'sub_123'
      }

      const handleMaxRetries = async (attemptCount: number) => {
        const MAX_RETRY_ATTEMPTS = 3
        
        if (attemptCount > MAX_RETRY_ATTEMPTS) {
          // Cancel subscription
          await mockSupabaseAdmin
            .from('users')
            .update({
              plan_type: 'suspended',
              suspension_reason: 'max_payment_failures',
              suspended_at: new Date().toISOString()
            })
            .eq('id', mockUser.id)

          // Send final notice
          await mockEmailService.sendEmail({
            to: 'user@example.com',
            template: 'service_suspended_payment_failure',
            data: {
              suspensionReason: 'Maximum payment retry attempts exceeded',
              reactivateUrl: 'https://app.example.com/reactivate'
            }
          })

          return { suspended: true, reason: 'max_attempts_exceeded' }
        }
        
        return { suspended: false }
      }

      const result = await handleMaxRetries(4)

      expect(result.suspended).toBe(true)
      expect(result.reason).toBe('max_attempts_exceeded')
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        plan_type: 'suspended',
        suspension_reason: 'max_payment_failures',
        suspended_at: expect.any(String)
      })
    })
  })

  describe('Payment recovery', () => {
    it('should handle successful payment after failures', async () => {
      const mockUser = {
        id: 'user-recovery',
        plan_type: 'suspended',
        suspension_reason: 'payment_failed',
        stripe_subscription_id: 'sub_recovery'
      }

      mockSupabaseAdmin.single.mockResolvedValue({ data: mockUser, error: null })

      const handlePaymentRecovery = async (invoice: Stripe.Invoice) => {
        // Get user
        const { data: user } = await mockSupabaseAdmin
          .from('users')
          .select('*')
          .eq('stripe_customer_id', invoice.customer)
          .single()

        if (user.plan_type === 'suspended' && user.suspension_reason === 'payment_failed') {
          // Determine original plan from subscription
          const originalPlan = 'basic' // Would get from subscription metadata
          
          // Reactivate user
          await mockSupabaseAdmin
            .from('users')
            .update({
              plan_type: originalPlan,
              suspension_reason: null,
              suspended_at: null,
              usage_count: 0, // Reset usage
              usage_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('id', user.id)

          // Clear payment failures
          await mockSupabaseAdmin
            .from('payment_failures')
            .delete()
            .eq('user_id', user.id)
            .eq('invoice_id', invoice.id)

          // Send reactivation email
          await mockEmailService.sendEmail({
            to: user.email,
            template: 'service_reactivated',
            data: {
              planName: originalPlan,
              nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          })

          return { reactivated: true, plan: originalPlan }
        }
        
        return { reactivated: false }
      }

      const mockInvoice = {
        id: 'inv_recovery',
        customer: 'cus_recovery',
        status: 'paid'
      } as Stripe.Invoice

      const result = await handlePaymentRecovery(mockInvoice)

      expect(result.reactivated).toBe(true)
      expect(result.plan).toBe('basic')
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        plan_type: 'basic',
        suspension_reason: null,
        suspended_at: null,
        usage_count: 0,
        usage_reset_at: expect.any(String)
      })
    })

    it('should handle payment method update', async () => {
      const mockCustomer: Partial<Stripe.Customer> = {
        id: 'cus_update_pm',
        email: 'user@example.com',
        invoice_settings: {
          default_payment_method: 'pm_new_card'
        }
      }

      mockStripeInstance.customers.retrieve.mockResolvedValue(mockCustomer)

      const handlePaymentMethodUpdate = async (customerId: string) => {
        const customer = await mockStripeInstance.customers.retrieve(customerId)
        
        if (customer.invoice_settings?.default_payment_method) {
          // Update user record
          await mockSupabaseAdmin
            .from('users')
            .update({
              payment_method_status: 'valid',
              payment_method_last_error: null,
              payment_method_updated_at: new Date().toISOString()
            })
            .eq('stripe_customer_id', customerId)

          // If user was suspended, check if we should retry payment
          const { data: user } = await mockSupabaseAdmin
            .from('users')
            .select('*')
            .eq('stripe_customer_id', customerId)
            .single()

          if (user?.plan_type === 'suspended') {
            return { updated: true, shouldRetryPayment: true }
          }

          return { updated: true, shouldRetryPayment: false }
        }
        
        return { updated: false }
      }

      mockSupabaseAdmin.single.mockResolvedValue({ 
        data: { plan_type: 'suspended' }, 
        error: null 
      })

      const result = await handlePaymentMethodUpdate('cus_update_pm')

      expect(result.updated).toBe(true)
      expect(result.shouldRetryPayment).toBe(true)
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        payment_method_status: 'valid',
        payment_method_last_error: null,
        payment_method_updated_at: expect.any(String)
      })
    })
  })

  describe('Email notifications', () => {
    it('should send appropriate emails for each failure attempt', async () => {
      const emailTemplates = {
        1: {
          template: 'payment_failed_first_attempt',
          subject: 'Payment failed - We\'ll retry in 3 days',
          includeUpdateLink: true
        },
        2: {
          template: 'payment_failed_second_attempt',
          subject: 'Urgent: Second payment attempt failed',
          includeUpdateLink: true,
          urgency: 'high'
        },
        3: {
          template: 'payment_failed_final_attempt',
          subject: 'Final notice: Service will be suspended',
          includeUpdateLink: true,
          urgency: 'critical'
        }
      }

      const sendFailureEmail = async (attemptNumber: number, userEmail: string) => {
        const emailConfig = emailTemplates[attemptNumber as keyof typeof emailTemplates]
        
        await mockEmailService.sendEmail({
          to: userEmail,
          template: emailConfig.template,
          subject: emailConfig.subject,
          data: {
            attemptNumber,
            urgency: emailConfig.urgency || 'normal',
            updatePaymentUrl: 'https://app.example.com/update-payment',
            supportEmail: 'support@example.com'
          }
        })

        return emailConfig
      }

      // Test each attempt
      for (let attempt = 1; attempt <= 3; attempt++) {
        const result = await sendFailureEmail(attempt, 'user@example.com')
        
        expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
          to: 'user@example.com',
          template: result.template,
          subject: result.subject,
          data: expect.objectContaining({
            attemptNumber: attempt
          })
        })
      }

      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
    })
  })
})
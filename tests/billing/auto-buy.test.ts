import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Mock Stripe
jest.mock('stripe')
const mockStripe = jest.mocked(Stripe)

// Mock Supabase
jest.mock('@supabase/supabase-js')
const mockSupabase = jest.mocked(createClient)

describe('Auto-buy Additional Texts', () => {
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
      charges: {
        create: jest.fn()
      }
    }
    
    mockStripe.mockImplementation(() => mockStripeInstance as any)
  })

  it('should auto-buy 100 texts for Basic user exceeding quota', async () => {
    const mockUser = {
      id: 'user-123',
      plan_type: 'basic',
      usage_count: 100,
      stripe_customer_id: 'cus_123',
      additional_texts_purchased: 0
    }

    mockSupabaseClient.single.mockResolvedValueOnce({ data: mockUser, error: null })
    
    const mockCharge = {
      id: 'ch_123',
      amount: 550, // $5.50 for 100 texts at $0.055 each
      currency: 'usd',
      status: 'succeeded'
    }
    
    mockStripeInstance.charges.create.mockResolvedValue(mockCharge)

    const processAutoBuy = async (user: any) => {
      const quotaLimit = 100 // Basic plan limit
      const totalLimit = quotaLimit + user.additional_texts_purchased
      
      if (user.usage_count >= totalLimit) {
        const basePricePerText = 0.05 // $0.05 for basic plan
        const pricePerText = basePricePerText * 1.1 // 10% markup
        const totalAmount = Math.round(pricePerText * 100 * 100) // 100 texts in cents

        const charge = await mockStripeInstance.charges.create({
          amount: totalAmount,
          currency: 'usd',
          customer: user.stripe_customer_id,
          description: 'Auto-purchase 100 additional text messages',
          metadata: {
            user_id: user.id,
            type: 'auto_buy_texts',
            texts_purchased: '100'
          }
        })

        await mockSupabaseClient
          .from('users')
          .update({
            additional_texts_purchased: user.additional_texts_purchased + 100
          })
          .eq('id', user.id)

        await mockSupabaseClient
          .from('billing_events')
          .insert({
            user_id: user.id,
            event_type: 'auto_buy_texts',
            amount: totalAmount / 100,
            details: {
              texts_purchased: 100,
              price_per_text: pricePerText,
              charge_id: charge.id
            }
          })

        return { success: true, charge, textsPurchased: 100 }
      }
      
      return { success: false }
    }

    const result = await processAutoBuy(mockUser)

    expect(result.success).toBe(true)
    expect(result.textsPurchased).toBe(100)
    expect(mockStripeInstance.charges.create).toHaveBeenCalledWith({
      amount: 550,
      currency: 'usd',
      customer: 'cus_123',
      description: 'Auto-purchase 100 additional text messages',
      metadata: {
        user_id: 'user-123',
        type: 'auto_buy_texts',
        texts_purchased: '100'
      }
    })
    
    expect(mockSupabaseClient.update).toHaveBeenCalledWith({
      additional_texts_purchased: 100
    })
  })

  it('should auto-buy 100 texts for Standard user with lower rate', async () => {
    const mockUser = {
      id: 'user-456',
      plan_type: 'standard',
      usage_count: 500,
      stripe_customer_id: 'cus_456',
      additional_texts_purchased: 0
    }

    mockSupabaseClient.single.mockResolvedValueOnce({ data: mockUser, error: null })
    
    const mockCharge = {
      id: 'ch_456',
      amount: 220, // $2.20 for 100 texts at $0.022 each
      currency: 'usd',
      status: 'succeeded'
    }
    
    mockStripeInstance.charges.create.mockResolvedValue(mockCharge)

    const processAutoBuy = async (user: any) => {
      const quotaLimits: Record<string, number> = {
        basic: 100,
        standard: 500,
        premium: 1000
      }
      
      const baseLimit = quotaLimits[user.plan_type]
      const totalLimit = baseLimit + user.additional_texts_purchased
      
      if (user.usage_count >= totalLimit) {
        const basePricePerText = user.plan_type === 'basic' ? 0.05 : 0.02
        const pricePerText = basePricePerText * 1.1 // 10% markup
        const totalAmount = Math.round(pricePerText * 100 * 100) // 100 texts in cents

        const charge = await mockStripeInstance.charges.create({
          amount: totalAmount,
          currency: 'usd',
          customer: user.stripe_customer_id
        })

        return { success: true, charge, amount: totalAmount }
      }
      
      return { success: false }
    }

    const result = await processAutoBuy(mockUser)

    expect(result.success).toBe(true)
    expect(result.amount).toBe(220) // $2.20 in cents
  })

  it('should track cumulative additional texts purchased', async () => {
    const mockUser = {
      id: 'user-789',
      plan_type: 'basic',
      usage_count: 300,
      stripe_customer_id: 'cus_789',
      additional_texts_purchased: 200 // Already bought 200 extra
    }

    mockSupabaseClient.single
      .mockResolvedValueOnce({ data: mockUser, error: null })
      .mockResolvedValueOnce({ data: { ...mockUser, additional_texts_purchased: 300 }, error: null })

    mockStripeInstance.charges.create.mockResolvedValue({ id: 'ch_789' })

    const processMultipleAutoBuys = async (user: any) => {
      const baseLimit = 100 // Basic plan
      const totalLimit = baseLimit + user.additional_texts_purchased
      
      if (user.usage_count >= totalLimit) {
        // Auto-buy logic
        await mockSupabaseClient
          .from('users')
          .update({
            additional_texts_purchased: user.additional_texts_purchased + 100
          })
          .eq('id', user.id)

        // Get updated user
        const { data: updatedUser } = await mockSupabaseClient
          .from('users')
          .select('additional_texts_purchased')
          .eq('id', user.id)
          .single()

        return { 
          success: true, 
          totalAdditionalTexts: updatedUser.additional_texts_purchased 
        }
      }
      
      return { success: false }
    }

    const result = await processMultipleAutoBuys(mockUser)

    expect(result.success).toBe(true)
    expect(result.totalAdditionalTexts).toBe(300) // 200 + 100
  })

  it('should handle auto-buy charge failure', async () => {
    const mockUser = {
      id: 'user-fail',
      plan_type: 'basic',
      usage_count: 100,
      stripe_customer_id: 'cus_fail',
      additional_texts_purchased: 0
    }

    mockSupabaseClient.single.mockResolvedValueOnce({ data: mockUser, error: null })
    
    // Mock Stripe charge failure
    mockStripeInstance.charges.create.mockRejectedValue(
      new Error('Your card has insufficient funds')
    )

    const processAutoBuyWithError = async (user: any) => {
      try {
        const charge = await mockStripeInstance.charges.create({
          amount: 550,
          currency: 'usd',
          customer: user.stripe_customer_id
        })
        
        return { success: true, charge }
      } catch (error) {
        // Log failed auto-buy attempt
        await mockSupabaseClient
          .from('billing_events')
          .insert({
            user_id: user.id,
            event_type: 'auto_buy_failed',
            details: {
              error: error.message,
              attempted_texts: 100
            }
          })
        
        return { success: false, error: error.message }
      }
    }

    const result = await processAutoBuyWithError(mockUser)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Your card has insufficient funds')
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
      user_id: 'user-fail',
      event_type: 'auto_buy_failed',
      details: {
        error: 'Your card has insufficient funds',
        attempted_texts: 100
      }
    })
    
    // Ensure additional texts were not updated
    expect(mockSupabaseClient.update).not.toHaveBeenCalled()
  })

  it('should send auto-buy notification email', async () => {
    const mockUser = {
      id: 'user-email',
      email: 'test@example.com',
      plan_type: 'standard',
      usage_count: 500,
      stripe_customer_id: 'cus_email',
      additional_texts_purchased: 0
    }

    const mockSendEmail = jest.fn().mockResolvedValue({ success: true })

    mockSupabaseClient.single.mockResolvedValueOnce({ data: mockUser, error: null })
    mockStripeInstance.charges.create.mockResolvedValue({ 
      id: 'ch_email',
      amount: 220
    })

    const processAutoBuyWithNotification = async (user: any) => {
      // Auto-buy logic...
      const charge = await mockStripeInstance.charges.create({
        amount: 220,
        currency: 'usd',
        customer: user.stripe_customer_id
      })

      // Send notification
      await mockSendEmail({
        to: user.email,
        subject: 'Additional texts purchased',
        template: 'auto_buy_notification',
        data: {
          texts_purchased: 100,
          amount: '$2.20',
          new_limit: 600
        }
      })

      return { success: true, emailSent: true }
    }

    const result = await processAutoBuyWithNotification(mockUser)

    expect(result.success).toBe(true)
    expect(result.emailSent).toBe(true)
    expect(mockSendEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Additional texts purchased',
      template: 'auto_buy_notification',
      data: {
        texts_purchased: 100,
        amount: '$2.20',
        new_limit: 600
      }
    })
  })
})
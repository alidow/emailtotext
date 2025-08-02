import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import Stripe from 'stripe'

// Mock dependencies
jest.mock('stripe')
const mockStripe = jest.mocked(Stripe)

describe('Annual Billing Scenarios', () => {
  let mockStripeInstance: any
  let mockSupabaseAdmin: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock Stripe
    mockStripeInstance = {
      prices: {
        create: jest.fn(),
        retrieve: jest.fn()
      },
      subscriptions: {
        create: jest.fn(),
        update: jest.fn()
      },
      checkout: {
        sessions: {
          create: jest.fn()
        }
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
  })

  describe('Annual subscription creation', () => {
    it('should create annual subscription with correct pricing', async () => {
      const mockUser = {
        id: 'user-annual',
        stripe_customer_id: 'cus_annual',
        plan_type: 'free'
      }

      const annualPrices = {
        basic: { monthly: 4.99, annual: 47.88 }, // $4/month
        standard: { monthly: 9.99, annual: 95.88 }, // $8/month
        premium: { monthly: 19.99, annual: 191.88 } // $16/month
      }

      const createAnnualSubscription = async (customerId: string, plan: string) => {
        const annualPrice = annualPrices[plan as keyof typeof annualPrices].annual
        const monthlyEquivalent = annualPrice / 12
        
        const subscription = await mockStripeInstance.subscriptions.create({
          customer: customerId,
          items: [{
            price: `price_${plan}_annual`
          }],
          metadata: {
            billing_cycle: 'annual',
            plan_type: plan,
            monthly_equivalent: monthlyEquivalent.toFixed(2)
          }
        })

        return {
          subscription,
          annualPrice,
          monthlyEquivalent,
          savings: (annualPrices[plan as keyof typeof annualPrices].monthly * 12 - annualPrice).toFixed(2)
        }
      }

      mockStripeInstance.subscriptions.create.mockResolvedValue({
        id: 'sub_annual_basic',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
      })

      const result = await createAnnualSubscription('cus_annual', 'basic')

      expect(result.annualPrice).toBe(47.88)
      expect(result.monthlyEquivalent).toBe(3.99)
      expect(result.savings).toBe('12.00')
      expect(mockStripeInstance.subscriptions.create).toHaveBeenCalledWith({
        customer: 'cus_annual',
        items: [{ price: 'price_basic_annual' }],
        metadata: {
          billing_cycle: 'annual',
          plan_type: 'basic',
          monthly_equivalent: '3.99'
        }
      })
    })

    it('should display annual pricing correctly in checkout', async () => {
      const createCheckoutSession = async (priceId: string, billingCycle: 'monthly' | 'annual') => {
        const priceMap = {
          'price_standard_monthly': { amount: 999, interval: 'month' },
          'price_standard_annual': { amount: 9588, interval: 'year' }
        }

        const price = priceMap[priceId as keyof typeof priceMap]
        const displayAmount = billingCycle === 'annual' 
          ? `$${(price.amount / 1200).toFixed(2)}/month (billed annually)`
          : `$${(price.amount / 100).toFixed(2)}/month`

        const session = await mockStripeInstance.checkout.sessions.create({
          line_items: [{
            price: priceId,
            quantity: 1
          }],
          mode: 'subscription',
          metadata: {
            billing_cycle: billingCycle,
            display_amount: displayAmount
          }
        })

        return {
          sessionId: session.id,
          displayAmount,
          totalAnnualCost: billingCycle === 'annual' ? price.amount / 100 : (price.amount * 12) / 100
        }
      }

      mockStripeInstance.checkout.sessions.create.mockResolvedValue({
        id: 'cs_test_annual'
      })

      const monthlyResult = await createCheckoutSession('price_standard_monthly', 'monthly')
      const annualResult = await createCheckoutSession('price_standard_annual', 'annual')

      expect(monthlyResult.displayAmount).toBe('$9.99/month')
      expect(monthlyResult.totalAnnualCost).toBe(119.88)
      
      expect(annualResult.displayAmount).toBe('$7.99/month (billed annually)')
      expect(annualResult.totalAnnualCost).toBe(95.88)
    })
  })

  describe('Annual renewal and auto-buy', () => {
    it('should reset usage and additional texts on annual renewal', async () => {
      const mockUser = {
        id: 'user-renewal',
        usage_count: 450,
        additional_texts_purchased: 200,
        billing_cycle: 'annual'
      }

      const handleAnnualRenewal = async (invoice: Stripe.Invoice) => {
        // Annual renewal logic
        const nextResetDate = new Date()
        nextResetDate.setFullYear(nextResetDate.getFullYear() + 1)

        await mockSupabaseAdmin
          .from('users')
          .update({
            usage_count: 0,
            usage_reset_at: nextResetDate.toISOString(),
            additional_texts_purchased: 0 // Reset additional texts for new year
          })
          .eq('id', mockUser.id)

        return {
          renewed: true,
          nextResetDate,
          resetItems: ['usage_count', 'additional_texts_purchased']
        }
      }

      const mockInvoice = {
        subscription: 'sub_annual',
        billing_reason: 'subscription_cycle'
      } as Stripe.Invoice

      const result = await handleAnnualRenewal(mockInvoice)

      expect(result.renewed).toBe(true)
      expect(result.resetItems).toContain('additional_texts_purchased')
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        usage_count: 0,
        usage_reset_at: expect.any(String),
        additional_texts_purchased: 0
      })
    })

    it('should handle auto-buy for annual plans', async () => {
      const mockUser = {
        id: 'user-annual-autobuy',
        plan_type: 'standard',
        billing_cycle: 'annual',
        usage_count: 500,
        additional_texts_purchased: 0,
        stripe_customer_id: 'cus_annual_autobuy'
      }

      const processAnnualAutoBuy = async (user: any) => {
        // Annual plans get same auto-buy rates as monthly
        const basePricePerText = user.plan_type === 'basic' ? 0.05 : 0.02
        const pricePerText = basePricePerText * 1.1 // 10% markup
        const totalAmount = Math.round(pricePerText * 100 * 100) // 100 texts in cents

        const charge = await mockStripeInstance.charges.create({
          amount: totalAmount,
          currency: 'usd',
          customer: user.stripe_customer_id,
          description: 'Auto-purchase 100 additional text messages (Annual plan)',
          metadata: {
            user_id: user.id,
            billing_cycle: 'annual',
            type: 'auto_buy_texts',
            texts_purchased: '100'
          }
        })

        return {
          success: true,
          charge,
          annualPlanBonus: 'Same per-text rate as monthly plans'
        }
      }

      mockStripeInstance.charges = { create: jest.fn() }
      mockStripeInstance.charges.create.mockResolvedValue({
        id: 'ch_annual_autobuy',
        amount: 220 // $2.20 for standard plan
      })

      const result = await processAnnualAutoBuy(mockUser)

      expect(result.success).toBe(true)
      expect(mockStripeInstance.charges.create).toHaveBeenCalledWith({
        amount: 220,
        currency: 'usd',
        customer: 'cus_annual_autobuy',
        description: 'Auto-purchase 100 additional text messages (Annual plan)',
        metadata: expect.objectContaining({
          billing_cycle: 'annual'
        })
      })
    })
  })

  describe('Switching between monthly and annual', () => {
    it('should calculate proration when switching monthly to annual mid-cycle', async () => {
      const mockMonthlyUsage = {
        daysIntoCycle: 10,
        totalDays: 30,
        monthlyPrice: 9.99,
        annualPrice: 95.88
      }

      const calculateMonthlyToAnnualSwitch = (usage: typeof mockMonthlyUsage) => {
        // Calculate unused monthly credit
        const unusedDays = usage.totalDays - usage.daysIntoCycle
        const dailyRate = usage.monthlyPrice / usage.totalDays
        const credit = unusedDays * dailyRate

        // Immediate charge for annual
        const immediateCharge = usage.annualPrice - credit

        return {
          credit: parseFloat(credit.toFixed(2)),
          annualCharge: usage.annualPrice,
          immediateCharge: parseFloat(immediateCharge.toFixed(2)),
          nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          monthlySavings: (usage.monthlyPrice * 12 - usage.annualPrice) / 12
        }
      }

      const result = calculateMonthlyToAnnualSwitch(mockMonthlyUsage)

      expect(result.credit).toBe(6.66) // 20 days * $0.333/day
      expect(result.annualCharge).toBe(95.88)
      expect(result.immediateCharge).toBe(89.22) // 95.88 - 6.66
      expect(result.monthlySavings).toBeCloseTo(2, 1) // ~$2/month savings
    })

    it('should handle annual to monthly switch at renewal only', async () => {
      const mockAnnualSub = {
        id: 'sub_annual_to_monthly',
        current_period_end: Math.floor(Date.now() / 1000) + 200 * 24 * 60 * 60,
        items: {
          data: [{
            price: {
              id: 'price_premium_annual',
              recurring: { interval: 'year' }
            }
          }]
        }
      }

      const scheduleAnnualToMonthly = async (subscription: any) => {
        // Annual to monthly can only happen at renewal
        const daysRemaining = Math.ceil(
          (subscription.current_period_end - Date.now() / 1000) / (24 * 60 * 60)
        )

        if (daysRemaining > 0) {
          // Schedule the change
          await mockSupabaseAdmin
            .from('billing_events')
            .insert({
              user_id: 'user-123',
              event_type: 'billing_cycle_change_scheduled',
              details: {
                from: 'annual',
                to: 'monthly',
                effective_date: new Date(subscription.current_period_end * 1000).toISOString(),
                days_remaining: daysRemaining
              }
            })

          return {
            scheduled: true,
            changeType: 'annual_to_monthly',
            effectiveDate: new Date(subscription.current_period_end * 1000),
            daysRemaining,
            refund: 0, // No refund for annual to monthly
            note: 'Change will take effect at the end of your annual billing period'
          }
        }

        return { scheduled: false }
      }

      const result = await scheduleAnnualToMonthly(mockAnnualSub)

      expect(result.scheduled).toBe(true)
      expect(result.changeType).toBe('annual_to_monthly')
      expect(result.refund).toBe(0)
      expect(result.daysRemaining).toBeGreaterThan(0)
      expect(mockSupabaseAdmin.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: 'billing_cycle_change_scheduled'
        })
      )
    })
  })

  describe('Annual pricing display', () => {
    it('should format annual pricing for UI display', () => {
      const plans = [
        { name: 'basic', monthly: 4.99, annual: 47.88 },
        { name: 'standard', monthly: 9.99, annual: 95.88 },
        { name: 'premium', monthly: 19.99, annual: 191.88 }
      ]

      const formatPricingDisplay = (plan: typeof plans[0]) => {
        const monthlyEquivalent = plan.annual / 12
        const savings = (plan.monthly * 12) - plan.annual
        const savingsPercent = (savings / (plan.monthly * 12)) * 100

        return {
          monthlyPrice: `$${plan.monthly}/month`,
          annualPrice: `$${monthlyEquivalent.toFixed(2)}/month billed annually`,
          annualTotal: `$${plan.annual}/year`,
          savings: `Save $${savings.toFixed(2)}/year (${savingsPercent.toFixed(0)}%)`,
          badge: savingsPercent >= 20 ? 'SAVE 20%' : `SAVE ${savingsPercent.toFixed(0)}%`
        }
      }

      const basicDisplay = formatPricingDisplay(plans[0])
      expect(basicDisplay.monthlyPrice).toBe('$4.99/month')
      expect(basicDisplay.annualPrice).toBe('$3.99/month billed annually')
      expect(basicDisplay.annualTotal).toBe('$47.88/year')
      expect(basicDisplay.savings).toBe('Save $12.00/year (20%)')
      expect(basicDisplay.badge).toBe('SAVE 20%')

      const standardDisplay = formatPricingDisplay(plans[1])
      expect(standardDisplay.annualPrice).toBe('$7.99/month billed annually')
      
      const premiumDisplay = formatPricingDisplay(plans[2])
      expect(premiumDisplay.annualPrice).toBe('$15.99/month billed annually')
    })

    it('should handle price comparison for decision making', () => {
      const calculateBreakEven = (monthlyPrice: number, annualPrice: number) => {
        const monthlyTotal = monthlyPrice * 12
        const savings = monthlyTotal - annualPrice
        const breakEvenMonths = Math.ceil(annualPrice / monthlyPrice)
        
        return {
          breakEvenMonths,
          worthIt: breakEvenMonths < 12,
          savingsPerMonth: savings / 12,
          totalAnnualSavings: savings
        }
      }

      const basicAnalysis = calculateBreakEven(4.99, 47.88)
      expect(basicAnalysis.breakEvenMonths).toBe(10) // Need 10 months to break even
      expect(basicAnalysis.worthIt).toBe(true)
      expect(basicAnalysis.savingsPerMonth).toBeCloseTo(1, 1)
      expect(basicAnalysis.totalAnnualSavings).toBeCloseTo(12, 1)
    })
  })
})
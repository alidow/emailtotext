"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { isTestMode } from "@/lib/test-mode"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

const plans = [
  {
    name: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
    description: "Perfect for trying out the service",
    features: [
      "10 texts per month",
      "7-day message history",
      "Auto-upgrade to Basic when exceeded",
      "Email support"
    ],
    stripePriceId: null,
    requiresCard: true // Free plan requires card for auto-upgrade
  },
  {
    name: "Basic",
    monthlyPrice: "$4.99",
    annualPrice: "$4",
    annualTotal: "$47.88",
    description: "Great for personal use",
    features: [
      "100 texts per month",
      "30-day message history",
      "Auto-buy: $0.055/text after quota",
      "Priority support",
      "SMS delivery reports"
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID || "price_basic_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID || "price_basic_annual"
  },
  {
    name: "Standard",
    monthlyPrice: "$9.99",
    annualPrice: "$8",
    annualTotal: "$95.88",
    description: "For active users",
    features: [
      "500 texts per month",
      "90-day message history",
      "Auto-buy: $0.022/text after quota",
      "Advanced analytics",
      "Priority support"
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID || "price_standard_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_ANNUAL_PRICE_ID || "price_standard_annual"
  },
  {
    name: "Premium",
    monthlyPrice: "$19.99",
    annualPrice: "$16",
    annualTotal: "$191.88",
    description: "For power users",
    features: [
      "1,000 texts per month",
      "Unlimited message history",
      "Auto-buy: $0.022/text after quota",
      "API access",
      "Dedicated support"
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID || "price_premium_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID || "price_premium_annual"
  }
]

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  
  // Get plan from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const planParam = urlParams.get('plan')
    const billingParam = urlParams.get('billing')
    
    if (planParam) {
      // Auto-select the plan if passed from pricing page
      const matchingPlan = plans.find(p => p.name.toLowerCase() === planParam.toLowerCase())
      if (matchingPlan) {
        setSelectedPlan(matchingPlan.name)
        if (billingParam === 'annual' || billingParam === 'monthly') {
          setBillingCycle(billingParam as 'monthly' | 'annual')
        }
        // Auto-submit after a short delay to show selection
        setTimeout(() => {
          handlePlanSelect(matchingPlan)
        }, 500)
      }
    }
  }, [])

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in")
    }
  }, [isLoaded, user, router])

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    setLoading(true)
    setSelectedPlan(plan.name)
    
    try {
      // Create user in database
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: plan.name.toLowerCase() })
      })
      
      if (!response.ok) throw new Error("Failed to create user")
      
      // Determine which price ID to use based on billing cycle
      let priceId = null
      if (plan.name !== "Free") {
        priceId = billingCycle === 'annual' 
          ? (plan as any).annualPriceId 
          : (plan as any).monthlyPriceId
      }
      
      if (priceId || plan.requiresCard) {
        // Create Stripe checkout session
        const checkoutResponse = await fetch("/api/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            priceId: priceId,
            planType: plan.name.toLowerCase(),
            collectCardOnly: plan.requiresCard && !priceId,
            billingCycle: billingCycle
          })
        })
        
        const checkoutData = await checkoutResponse.json()
        
        // In test mode or if Stripe not configured, handle differently
        if (isTestMode() || !stripePromise) {
          // Extract the test checkout URL from the session
          if (checkoutData.url) {
            window.location.href = checkoutData.url
          } else if (checkoutData.sessionId) {
            // Fallback for test mode - redirect to test checkout page
            router.push(`/test-checkout/${checkoutData.sessionId}`)
          }
        } else {
          // Production mode with real Stripe
          const stripe = await stripePromise
          if (stripe && checkoutData.sessionId) {
            await stripe.redirectToCheckout({ sessionId: checkoutData.sessionId })
          }
        }
      } else {
        // This shouldn't happen anymore since all plans require card
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error selecting plan:", error)
      alert("Failed to select plan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the plan that works best for you. You can change anytime.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Credit card required for all plans to enable automatic upgrades when you exceed your free limit.
          </p>
          
          {/* Billing cycle toggle */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-gray-700">Billing:</span>
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingCycle === 'annual' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual <span className="text-green-600 font-semibold">(Save 20%)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.name === "Basic" ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.name === "Basic" && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="space-y-1">
                  {billingCycle === 'monthly' ? (
                    <div className="text-3xl font-bold">
                      {plan.monthlyPrice}
                      <span className="text-sm font-normal">/month</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">
                        {plan.annualPrice}
                        <span className="text-sm font-normal">/mo</span>
                      </div>
                      {plan.annualTotal && (
                        <p className="text-sm text-green-600 font-medium">
                          {plan.annualTotal} billed annually
                        </p>
                      )}
                    </>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.name === "Basic" ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={loading}
                >
                  {loading && selectedPlan === plan.name ? "Processing..." : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground max-w-3xl mx-auto">
          <p className="font-medium mb-2">How our pricing works:</p>
          <ul className="space-y-1 text-left">
            <li>• <strong>Free Plan:</strong> Automatically upgrades to Basic when you exceed 10 texts</li>
            <li>• <strong>Paid Plans:</strong> Auto-purchase 100 additional texts when you exceed your quota</li>
            <li>• <strong>Annual Billing:</strong> Save 20% when you pay annually</li>
          </ul>
          <p className="mt-4">All plans include TCPA compliance and secure message delivery. Cancel anytime.</p>
        </div>
      </div>
    </div>
  )
}
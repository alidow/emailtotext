"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Check, ChevronLeft, Zap, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

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
    requiresCard: true,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_FREE_PLAN_PRICE_ID || "price_free_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_FREE_PLAN_PRICE_ID || "price_free_monthly"
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
      "Email attachments",
      "Priority support",
      "SMS delivery reports"
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID || "price_basic_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID || "price_basic_annual",
    popular: true
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
      "Email attachments",
      "24/7 delivery option",
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
      "Email attachments",
      "24/7 delivery",
      "Dedicated support"
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID || "price_premium_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID || "price_premium_annual"
  }
]

export default function PlanSelectionPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [selectedPlan, setSelectedPlan] = useState<string>("Basic")
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/start/account')
    }

    // Track page view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'plan_selection_viewed', {
        page_location: '/start/plan'
      })
    }
  }, [isLoaded, user, router])

  const handleContinue = () => {
    const plan = plans.find(p => p.name === selectedPlan)
    if (!plan) return

    // Track conversion
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'plan_selected', {
        plan_name: selectedPlan,
        billing_cycle: billingCycle,
        value: selectedPlan === 'Free' ? 0 : parseFloat(plan.monthlyPrice.replace('$', ''))
      })
    }

    // Store plan selection
    sessionStorage.setItem('selectedPlan', selectedPlan)
    sessionStorage.setItem('billingCycle', billingCycle)
    
    // Go to payment page
    router.push('/start/payment')
  }

  if (!isLoaded || !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <Link href="/start/verify" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="text-sm text-gray-600">Step 3 of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-3">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">
            Select the plan that works best for you. Change anytime.
          </p>
          
          {/* Success message */}
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Phone verified successfully!</span>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
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
              Annual
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.name 
                  ? 'ring-2 ring-blue-600 shadow-lg' 
                  : 'hover:shadow-md'
              } ${plan.popular ? 'scale-105' : ''}`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              {selectedPlan === plan.name && (
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.name === "Standard" && <TrendingUp className="h-4 w-4 text-orange-500" />}
                  {plan.name === "Premium" && <Zap className="h-4 w-4 text-purple-500" />}
                </CardTitle>
                <div className="space-y-1">
                  {billingCycle === 'monthly' ? (
                    <div className="text-3xl font-bold">
                      {plan.monthlyPrice}
                      <span className="text-sm font-normal text-gray-600">/month</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">
                        {plan.annualPrice}
                        <span className="text-sm font-normal text-gray-600">/mo</span>
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
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">Flexible & Fair Pricing</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Free plan auto-upgrades to Basic when you exceed 10 texts</li>
                  <li>• Paid plans: Additional texts purchased automatically as needed</li>
                  <li>• Email alerts at 80% quota before any charges</li>
                  <li>• Cancel or change plans anytime</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={loading}
            className="h-12 px-8 font-semibold"
          >
            Continue to Payment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            {selectedPlan === "Free" 
              ? "Card required for automatic upgrade protection"
              : `You'll be charged ${billingCycle === 'annual' ? 'annually' : 'monthly'} after your trial`}
          </p>
        </div>
      </div>
    </div>
  )
}
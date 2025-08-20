"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, CreditCard, Lock, Shield, ChevronLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

const plans: Record<string, any> = {
  "Free": {
    name: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
    requiresCard: true,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_FREE_PLAN_PRICE_ID || "price_free_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_FREE_PLAN_PRICE_ID || "price_free_monthly"
  },
  "Basic": {
    name: "Basic",
    monthlyPrice: "$4.99",
    annualPrice: "$47.88",
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID || "price_basic_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID || "price_basic_annual"
  },
  "Standard": {
    name: "Standard",
    monthlyPrice: "$9.99",
    annualPrice: "$95.88",
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID || "price_standard_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_ANNUAL_PRICE_ID || "price_standard_annual"
  },
  "Premium": {
    name: "Premium",
    monthlyPrice: "$19.99",
    annualPrice: "$191.88",
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID || "price_premium_monthly",
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID || "price_premium_annual"
  }
}

export default function PaymentPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [billingCycle, setBillingCycle] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/start/account')
    }

    // Get selected plan from session
    const planName = sessionStorage.getItem('selectedPlan')
    const billing = sessionStorage.getItem('billingCycle')
    
    if (!planName || !billing) {
      // If no plan selected, go back to plan selection
      router.push('/start/plan')
    } else {
      setSelectedPlan(planName)
      setBillingCycle(billing)
    }

    // Track page view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'payment_page_viewed', {
        page_location: '/start/payment',
        plan_name: planName,
        billing_cycle: billing
      })
    }
  }, [isLoaded, user, router])

  const handlePayment = async () => {
    setLoading(true)
    setError("")

    try {
      const plan = plans[selectedPlan]
      if (!plan) {
        throw new Error("Invalid plan selected")
      }

      // Create user in database
      const userResponse = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: plan.name.toLowerCase() })
      })
      
      if (!userResponse.ok) {
        throw new Error("Failed to create user account")
      }

      // Determine price ID
      let priceId = null
      if (plan.name !== "Free") {
        priceId = billingCycle === 'annual' ? plan.annualPriceId : plan.monthlyPriceId
      }

      // Create Stripe checkout session
      const checkoutResponse = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          priceId: priceId,
          planType: plan.name.toLowerCase(),
          collectCardOnly: plan.requiresCard && !priceId,
          billingCycle: billingCycle,
          successUrl: `${window.location.origin}/dashboard?welcome=true`,
          cancelUrl: `${window.location.origin}/start/payment`
        })
      })
      
      const checkoutData = await checkoutResponse.json()
      
      if (!checkoutResponse.ok) {
        throw new Error(checkoutData.error || "Failed to create checkout session")
      }

      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'payment_initiated', {
          plan_name: selectedPlan,
          billing_cycle: billingCycle,
          value: plan.name === "Free" ? 0 : parseFloat(
            billingCycle === 'annual' 
              ? plan.annualPrice.replace(/[^0-9.]/g, '')
              : plan.monthlyPrice.replace(/[^0-9.]/g, '')
          )
        })
      }

      // Redirect to Stripe checkout
      if (!stripePromise) {
        throw new Error("Payment system not configured")
      }
      
      const stripe = await stripePromise
      if (stripe && checkoutData.sessionId) {
        await stripe.redirectToCheckout({ sessionId: checkoutData.sessionId })
      }
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "Failed to process payment. Please try again.")
      setLoading(false)
    }
  }

  if (!isLoaded || !user || !selectedPlan) {
    return <div>Loading...</div>
  }

  const plan = plans[selectedPlan]
  const displayPrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <Link href="/start/plan" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="text-sm text-gray-600">Step 4 of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Order Summary */}
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-display font-bold mb-4">
              Order Summary
            </h2>
            
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold">{plan.name} Plan</p>
                    <p className="text-sm text-gray-600 capitalize">{billingCycle} billing</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{displayPrice}</p>
                    <p className="text-xs text-gray-600">
                      {billingCycle === 'annual' ? 'per year' : 'per month'}
                    </p>
                  </div>
                </div>
                
                {billingCycle === 'annual' && plan.name !== "Free" && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    You're saving 20% with annual billing
                  </Badge>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Cancel or change plans anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Secure payment via Stripe</span>
              </div>
            </div>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <p className="text-xs text-gray-600">
                  <strong>What happens next:</strong> You'll be redirected to our secure payment 
                  processor (Stripe) to complete your subscription. After payment, you'll have 
                  immediate access to your account and can start forwarding emails right away.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Payment Form */}
          <div className="order-1 md:order-2">
            <Card>
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 mx-auto">
                  <CreditCard className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Complete Your Setup</CardTitle>
                <CardDescription>
                  {plan.name === "Free" 
                    ? "Add a payment method for upgrade protection"
                    : "Secure payment powered by Stripe"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600">SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600">PCI Compliant</span>
                  </div>
                </div>

                {/* Stripe notice */}
                <Alert className="mb-6">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    You'll be redirected to Stripe's secure checkout to enter your payment details. 
                    We never store your card information.
                  </AlertDescription>
                </Alert>

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  size="lg"
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-12 font-semibold"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      {plan.name === "Free" 
                        ? "Add Payment Method" 
                        : `Subscribe for ${displayPrice}`}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                {/* Stripe logo */}
                <div className="mt-6 pt-6 border-t flex justify-center">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-xs">Powered by</span>
                    <svg className="h-6" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#6772E5" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-3.06 9.75v9.39H21.05V5.57h3.79l.08 1.02a4.52 4.52 0 0 1 3.17-1.29c1.64 0 2.72.83 2.72 3.46-.02 2.63-1.1 7.48-5.65 7.48zm-2.92-1.55v5.55a2.83 2.83 0 0 0 1.85.79c1.52 0 2.6-1.65 2.6-3.87 0-2.15-1.1-3.84-2.6-3.84a2.83 2.83 0 0 0-1.85.79zM13.06 1.05l-4.13.88v4.5h-2.5v3.34h2.5v5.94c0 2.65 1.3 4.29 4.3 4.29 1.1 0 2.18-.2 2.9-.47v-3.31c-.55.15-1.5.33-2.04.33-1.04 0-1.52-.57-1.52-1.67v-5.11h3.57V5.57h-3.57V1.05h-.01zM1.74 20.3c-1.12 0-2.05-.9-2.05-2.03 0-1.13.93-2.02 2.05-2.02 1.14 0 2.05.9 2.05 2.02 0 1.14-.91 2.03-2.05 2.03z"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
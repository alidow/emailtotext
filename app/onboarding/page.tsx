"use client"

import { useEffect, useState } from "react"
// import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out the service",
    features: [
      "10 texts per month",
      "7-day message history",
      "Email support"
    ],
    stripePriceId: null,
    requiresCard: true // Free plan requires card for auto-upgrade
  },
  {
    name: "Basic",
    price: "$4.99",
    description: "Great for personal use",
    features: [
      "100 texts per month",
      "30-day message history",
      "Priority support",
      "SMS delivery reports"
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || "price_basic_monthly"
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "For power users",
    features: [
      "500 texts per month",
      "90-day message history",
      "Email support",
      "Unlimited message history"
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_pro_monthly"
  }
]

export default function OnboardingPage() {
  // const { user, isLoaded } = useUser()
  const router = useRouter()
  const isLoaded = true // Mock mode
  const user = { id: "mock-user" } // Mock user
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

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
      
      if (plan.stripePriceId || plan.requiresCard) {
        // Create Stripe checkout session (even for free plan to collect card)
        const checkoutResponse = await fetch("/api/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            priceId: plan.stripePriceId,
            planType: plan.name.toLowerCase(),
            collectCardOnly: plan.requiresCard && !plan.stripePriceId
          })
        })
        
        const { sessionId } = await checkoutResponse.json()
        const stripe = await stripePromise
        
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId })
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
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                <div className="text-3xl font-bold">{plan.price}<span className="text-sm font-normal">/month</span></div>
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

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>All plans include TCPA compliance and secure message delivery.</p>
          <p>Cancel anytime. No hidden fees.</p>
          <p className="mt-2 font-medium">If you exceed your free plan limit, you'll be automatically upgraded to Basic ($4.99/month).</p>
          <p>We'll email you before charging your card.</p>
        </div>
      </div>
    </div>
  )
}
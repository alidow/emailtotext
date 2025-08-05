"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Turnstile } from "@/components/Turnstile"
import { ArrowLeft, Check, Shield, MessageSquare } from "lucide-react"
import Link from "next/link"

// Use test key if environment variable is not properly loaded
const TURNSTILE_SITE_KEY = typeof process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY === 'string' 
  ? process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY 
  : "1x00000000000000000000AA"

const plans = {
  free: {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "10 texts per month",
      "7-day message history",
      "Auto-upgrade to Basic when exceeded",
      "Email support"
    ]
  },
  basic: {
    name: "Basic",
    price: "$4.99",
    yearlyPrice: "$3.99",
    period: "/month",
    features: [
      "100 texts per month",
      "30-day message history",
      "Auto-buy: $0.055/text after quota",
      "SMS delivery reports",
      "Priority support"
    ]
  },
  standard: {
    name: "Standard",
    price: "$9.99",
    yearlyPrice: "$7.99",
    period: "/month",
    features: [
      "500 texts per month",
      "90-day message history",
      "Auto-buy: $0.022/text after quota",
      "Advanced analytics",
      "Priority support"
    ]
  },
  premium: {
    name: "Premium",
    price: "$19.99",
    yearlyPrice: "$15.99",
    period: "/month",
    features: [
      "1,000 texts per month",
      "Unlimited message history",
      "Auto-buy: $0.022/text after quota",
      "API access",
      "Dedicated support"
    ]
  }
}

function GetStartedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get("plan") as keyof typeof plans || "free"
  const billingCycle = searchParams.get("billing") || "monthly"
  
  const [phone, setPhone] = useState("")
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [error, setError] = useState("")

  const plan = plans[selectedPlan] || plans.free
  const isYearly = billingCycle === "annual"
  const displayPrice = isYearly && 'yearlyPrice' in plan ? plan.yearlyPrice : plan.price

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "")
    const phoneNumberLength = phoneNumber.length
    
    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent || !captchaToken) {
      setError("Please complete all required fields")
      return
    }

    setLoading(true)
    setError("")
    
    const cleanPhone = phone.replace(/[^\d]/g, "")
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: cleanPhone,
          turnstileToken: captchaToken,
          plan: selectedPlan,
          billingCycle
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code")
      }

      // Store plan info in session storage for the verify page
      sessionStorage.setItem("selectedPlan", selectedPlan)
      sessionStorage.setItem("billingCycle", billingCycle)
      
      router.push(`/verify?plan=${selectedPlan}&billing=${billingCycle}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setCaptchaToken(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-3xl">💬</span>
            <span className="font-display font-bold text-xl">Email to Text Notifier</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Plan Summary */}
          <div className="order-2 md:order-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Selected Plan</span>
                  <span className="text-2xl font-bold text-blue-600">{plan.name}</span>
                </CardTitle>
                <CardDescription>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">{displayPrice}</span>
                    <span className="text-gray-600">{plan.period}</span>
                    {isYearly && <span className="text-sm text-green-600 ml-2">(Save 20%)</span>}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700">Plan includes:</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">30-Day Money Back Guarantee</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Not satisfied? Get a full refund within 30 days, no questions asked.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Link 
                    href={`/?billing=${billingCycle}#pricing`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Change plan
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sign Up Form */}
          <div className="order-1 md:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Complete Your Sign Up</CardTitle>
                <CardDescription>
                  Enter your phone number to create your email forwarding address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Phone input */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="pl-10 h-12 text-lg"
                        required
                        disabled={loading}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      We'll send a verification code to this number
                    </p>
                  </div>

                  {/* Consent checkbox */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(checked) => setConsent(checked as boolean)}
                      disabled={loading}
                    />
                    <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                      I consent to receive SMS messages at this number. Message and data rates may apply. 
                      Reply STOP to opt out at any time. View our{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>.
                    </Label>
                  </div>

                  {/* CAPTCHA */}
                  <div className="flex justify-center">
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      onVerify={(token) => setCaptchaToken(token)}
                      onError={() => setError("Security check failed. Please try again.")}
                      onExpire={() => setCaptchaToken(null)}
                      theme="auto"
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit button */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg"
                    disabled={!phone || !consent || !captchaToken || loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending verification code...
                      </>
                    ) : (
                      "Continue to Verification"
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-600">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function GetStarted() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <GetStartedContent />
    </Suspense>
  )
}
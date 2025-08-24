"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Phone, Shield, CheckCircle, ChevronLeft, MessageSquare, AlertCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { formatPhoneNumberInput } from "@/lib/utils"
import { analytics, ANALYTICS_EVENTS } from "@/lib/analytics"
import * as Sentry from "@sentry/nextjs"

export default function VerifyPhonePage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [resending, setResending] = useState(false)
  const [phoneUsageInfo, setPhoneUsageInfo] = useState<{sms_sent: number; sms_quota: number} | null>(null)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/start/account')
    }

    // Track page view
    analytics.track({
      name: ANALYTICS_EVENTS.START_VERIFY_VIEW,
      parameters: {
        page_location: '/start/verify',
        page_path: '/start/verify'
      }
    })
  }, [isLoaded, user, router])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clean phone number (remove formatting)
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    setLoading(true)
    setError("")

    try {
      // First check if this phone has existing usage
      const usageResponse = await fetch("/api/check-phone-usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: `+1${cleanPhone}` })
      })
      
      if (usageResponse.ok) {
        const usageData = await usageResponse.json()
        if (usageData.hasUsage) {
          setPhoneUsageInfo(usageData)
        }
      }
      
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+1${cleanPhone}` })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code")
      }

      setCodeSent(true)
      
      // Track event
      analytics.track({
        name: ANALYTICS_EVENTS.PHONE_CODE_SENT,
        parameters: {
          phone: `+1${cleanPhone}`,
          page_location: '/start/verify'
        },
        value: 4.0
      })
    } catch (err: any) {
      setError(err.message || "Failed to send verification code")
      
      // Capture to Sentry for monitoring
      Sentry.captureException(err, {
        tags: {
          flow: "signup_verification",
          step: "send_code"
        },
        extra: {
          phone: `+1${cleanPhone}`,
          errorMessage: err.message,
          user: user?.id,
          email: user?.primaryEmailAddress?.emailAddress
        }
      })
      
      // Track error
      analytics.track({
        name: ANALYTICS_EVENTS.VERIFICATION_ERROR,
        parameters: {
          error: err.message,
          step: 'send_code',
          page_location: '/start/verify'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit code")
      return
    }

    setLoading(true)
    setError("")
    
    let response: Response | undefined

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '')
      response = await fetch("/api/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: `+1${cleanPhone}`,  // Fixed: Changed from phoneNumber to phone to match API
          code: verificationCode 
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code")
      }

      // Track conversion
      analytics.track({
        name: ANALYTICS_EVENTS.PHONE_VERIFIED,
        parameters: {
          phone: `+1${cleanPhone}`,
          page_location: '/start/verify'
        },
        value: 5.0
      })

      // Go to plan selection
      router.push('/start/plan')
    } catch (err: any) {
      setError(err.message || "Failed to verify phone number")
      
      // CRITICAL: Capture verification failures to Sentry
      Sentry.captureException(err, {
        level: "error",
        tags: {
          flow: "signup_verification",
          step: "verify_code",
          critical: "true"
        },
        extra: {
          phone: `+1${cleanPhone}`,
          codeEntered: verificationCode,
          errorMessage: err.message,
          responseStatus: response?.status,
          user: user?.id,
          email: user?.primaryEmailAddress?.emailAddress
        }
      })
      
      // Track error
      analytics.track({
        name: ANALYTICS_EVENTS.VERIFICATION_ERROR,
        parameters: {
          error: err.message,
          step: 'verify_code',
          page_location: '/start/verify'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResending(true)
    setError("")

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '')
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+1${cleanPhone}` })
      })

      if (!response.ok) {
        throw new Error("Failed to resend code")
      }

      // Show success message
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg z-50'
      alertDiv.textContent = 'Verification code resent!'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 3000)
    } catch (err: any) {
      setError("Failed to resend verification code")
    } finally {
      setResending(false)
    }
  }

  if (!isLoaded || !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <Link href="/start/account" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="text-sm text-gray-600">Step 2 of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Trust Building */}
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-display font-bold mb-4">
              Why Verify Your Phone?
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Required by Carriers</p>
                  <p className="text-sm text-gray-600">Phone carriers require verification to prevent spam and ensure legitimate use</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">One-Time Verification</p>
                  <p className="text-sm text-gray-600">You only need to do this once to activate SMS delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium">Your Number is Protected</p>
                  <p className="text-sm text-gray-600">We never share your phone number or send marketing messages</p>
                </div>
              </div>
            </div>

            {phoneUsageInfo && phoneUsageInfo.sms_sent > 0 && (
              <Card className="bg-amber-50 border-amber-200 mb-4">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Welcome back! This phone number has been used before.
                      </p>
                      <p className="text-sm text-gray-700">
                        You've already sent <strong>{phoneUsageInfo.sms_sent}</strong> text{phoneUsageInfo.sms_sent !== 1 ? 's' : ''} this month. 
                        {phoneUsageInfo.sms_quota - phoneUsageInfo.sms_sent > 0 ? (
                          <> You have <strong>{phoneUsageInfo.sms_quota - phoneUsageInfo.sms_sent}</strong> text{phoneUsageInfo.sms_quota - phoneUsageInfo.sms_sent !== 1 ? 's' : ''} remaining in your monthly quota.</>
                        ) : (
                          <> You've reached your monthly quota. Upgrade to a paid plan for more texts.</>
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Your previous usage counts toward your monthly limit to ensure fair use for all users.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-700">
                  <strong>Your Privacy Matters:</strong> By verifying your phone number, you consent to receive SMS messages 
                  containing your forwarded emails. We will <strong>never</strong> use your phone number for marketing, 
                  share it with third parties, or send you anything other than your requested email forwards. 
                  Your communications are private and encrypted. Reply STOP anytime to opt out. Standard messaging rates may apply.
                </p>
              </CardContent>
            </Card>

            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                Powered by Twilio • Carrier-grade security
              </Badge>
            </div>
          </div>

          {/* Right: Verification Form */}
          <div className="order-1 md:order-2">
            <Card>
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 mx-auto">
                  <Phone className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Verify Your Phone Number</CardTitle>
                <CardDescription>
                  {!codeSent 
                    ? "Enter your phone number to receive SMS messages"
                    : "Enter the verification code we sent you"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!codeSent ? (
                  <form onSubmit={handleSendCode} className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhoneNumberInput(e.target.value))}
                        required
                        disabled={loading}
                        maxLength={14}
                        className="mt-1"
                        autoComplete="tel"
                        autoFocus
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        US or Canadian mobile phone numbers only (landlines not supported)
                      </p>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <div>{error}</div>
                            {error.includes("landline") && (
                              <div className="text-xs mt-1">Please use a mobile phone number that can receive text messages.</div>
                            )}
                            {error.includes("format") && (
                              <div className="text-xs mt-1">Example: (555) 123-4567</div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={loading || phoneNumber.replace(/\D/g, '').length !== 10}
                    >
                      {loading ? "Sending Code..." : "Send Verification Code"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div>
                      <Label htmlFor="code">Verification Code</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        required
                        disabled={loading}
                        maxLength={6}
                        pattern="[0-9]{6}"
                        className="mt-1 text-center text-2xl font-mono tracking-widest"
                        autoComplete="one-time-code"
                        autoFocus
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        We sent a code to {phoneNumber}
                      </p>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <div>{error}</div>
                            {error.includes("landline") && (
                              <div className="text-xs mt-1">Please use a mobile phone number that can receive text messages.</div>
                            )}
                            {error.includes("format") && (
                              <div className="text-xs mt-1">Example: (555) 123-4567</div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={loading || verificationCode.length !== 6}
                    >
                      {loading ? "Verifying..." : "Verify Phone Number"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={handleResendCode}
                        disabled={resending}
                        className="text-blue-600"
                      >
                        {resending ? "Sending..." : "Resend code"}
                      </Button>
                      <span className="text-gray-400 mx-2">•</span>
                      <Button
                        variant="link"
                        onClick={() => {
                          setCodeSent(false)
                          setVerificationCode("")
                          setError("")
                        }}
                        className="text-blue-600"
                      >
                        Change number
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Mail, ChevronLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [resending, setResending] = useState(false)

  useEffect(() => {
    // Get email from session storage
    const pendingEmail = sessionStorage.getItem('pendingEmail')
    if (pendingEmail) {
      setEmail(pendingEmail)
    } else {
      // If no email in session, redirect back to account creation
      router.push('/start/account')
    }

    // Track page view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'verify_email_viewed', {
        page_location: '/start/account/verify-email'
      })
    }
  }, [router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    
    setLoading(true)
    setError("")

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })
        
        // Track conversion
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'email_verified', {
            value: 3.0
          })
        }

        // Clear session storage
        sessionStorage.removeItem('pendingEmail')
        
        // Go to phone verification
        router.push('/start/verify')
      } else {
        setError("Unable to verify email. Please try again.")
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid verification code")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!isLoaded) return
    
    setResending(true)
    setError("")

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setError("") // Clear any errors
      // Show success message
      const alertDiv = document.createElement('div')
      alertDiv.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg z-50'
      alertDiv.textContent = 'Verification code resent! Check your email.'
      document.body.appendChild(alertDiv)
      setTimeout(() => alertDiv.remove(), 3000)
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <Link href="/start/account" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="text-sm text-gray-600">Step 1 of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 mx-auto">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We sent a verification code to<br />
              <strong className="text-gray-900">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={loading}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="mt-1 text-center text-2xl font-mono tracking-widest"
                  autoComplete="one-time-code"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Check your email for the 6-digit verification code
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12"
                disabled={loading || code.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Email"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?
              </p>
              <Button
                variant="link"
                onClick={handleResendCode}
                disabled={resending}
                className="text-blue-600"
              >
                {resending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend verification code"
                )}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-xs text-gray-500">
                Wrong email?{" "}
                <Link href="/start/account" className="text-blue-600 hover:underline">
                  Go back to change it
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
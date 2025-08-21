"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Mail, Lock, Shield, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { analytics, ANALYTICS_EVENTS } from "@/lib/analytics"

export default function StartAccountPage() {
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Track page view and initialize analytics
  useEffect(() => {
    // Initialize analytics on mount
    analytics.initialize().then((providers) => {
      console.log('[START_ACCOUNT] Analytics initialized:', providers)
    })
    
    // Track page view
    analytics.track({
      name: ANALYTICS_EVENTS.START_ACCOUNT_VIEW,
      parameters: {
        page_location: '/start/account',
        page_path: '/start/account'
      },
      value: 1.0
    })
  }, [])

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    
    setLoading(true)
    setError("")

    try {
      // Create the user
      await signUp.create({
        emailAddress: email,
        password: password,
      })

      // Track account creation
      analytics.track({
        name: ANALYTICS_EVENTS.ACCOUNT_CREATED,
        parameters: {
          method: 'email',
          page_location: '/start/account'
        },
        value: 2.0
      })

      // Store email for next step
      sessionStorage.setItem('pendingEmail', email)
      
      // Skip email verification, go directly to phone verification
      router.push('/start/verify')
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to create account")
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return
    
    setLoading(true)
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/start/account/sso-callback",
        redirectUrlComplete: "/start/verify"
      })
      
      // Track account creation
      analytics.track({
        name: ANALYTICS_EVENTS.ACCOUNT_CREATED,
        parameters: {
          method: 'google',
          page_location: '/start/account'
        },
        value: 2.0
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to sign up with Google")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <Link href="/start" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="text-sm text-gray-600">Step 1 of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Trust Building */}
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-display font-bold mb-4">
              Why Create an Account?
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Your Data is Safe</p>
                  <p className="text-sm text-gray-600">We never sell your information or send spam</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Email for Account Access Only</p>
                  <p className="text-sm text-gray-600">Used to secure your account and send receipts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium">Encrypted & Secure</p>
                  <p className="text-sm text-gray-600">Your password is encrypted and never stored in plain text</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Sign Up Form */}
          <div className="order-1 md:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create Your Account</CardTitle>
                <CardDescription>
                  Choose your preferred sign-up method
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Google Sign Up */}
                <Button
                  variant="outline"
                  className="w-full h-12 mb-4"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>

                {/* Email Sign Up */}
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={8}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function VerifyContent() {
  const searchParams = useSearchParams()
  const phone = searchParams.get("phone") || ""
  
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const sendVerificationCode = useCallback(async () => {
    try {
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send verification code")
      }
    } catch (err: any) {
      setError(err.message)
    }
  }, [phone])

  useEffect(() => {
    if (phone) {
      sendVerificationCode()
    }
  }, [phone, sendVerificationCode])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch("/api/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Invalid verification code")
      }
      
      // Redirect to sign up page
      window.location.href = "/sign-up"
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setCanResend(false)
    setResendTimer(60)
    setError("")
    await sendVerificationCode()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Verify Your Phone Number</CardTitle>
          <CardDescription>
            We sent a 6-digit code to {phone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                required
                className="w-full px-8 h-24 text-3xl md:text-3xl text-center font-bold tracking-wider border-4 border-gray-200 bg-white rounded-2xl shadow-lg placeholder:text-gray-400 placeholder:text-3xl placeholder:font-normal focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:shadow-xl focus:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:border-gray-300 focus:outline-none"
                style={{
                  letterSpacing: '0.25em',
                  fontFamily: 'system-ui, -apple-system, "SF Pro Display", sans-serif',
                  fontSize: '1.875rem'
                }}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
              {loading ? "Verifying..." : "Verify Phone Number"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={!canResend}
                className="text-sm"
              >
                {canResend 
                  ? "Resend code" 
                  : `Resend in ${resendTimer}s`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
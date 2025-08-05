"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, CreditCard, AlertCircle } from "lucide-react"

export default function TestCheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  // Only show in test mode
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_TEST_MODE !== 'true') {
      router.push('/dashboard')
    }
  }, [router])

  const handleComplete = () => {
    // Redirect to success URL with session ID
    router.push(`/dashboard?session_id=${sessionId}`)
  }

  const handleCancel = () => {
    // Redirect to cancel URL
    router.push('/onboarding')
  }

  if (process.env.NEXT_PUBLIC_ENABLE_TEST_MODE !== 'true') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            <CardTitle>Test Checkout</CardTitle>
          </div>
          <CardDescription>
            This is a simulated checkout page for testing purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>TEST MODE</strong> - No real payment will be processed.
              This simulates a successful Stripe checkout.
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium">Session Details</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Session ID: {sessionId}</div>
              <div>Mode: Subscription</div>
              <div>Status: Ready for completion</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleComplete} 
              className="w-full"
              size="lg"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete Test Payment
            </Button>
            
            <Button 
              onClick={handleCancel} 
              variant="outline" 
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            This test checkout will mark your subscription as active without processing any payment.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function SSOCallbackPage() {
  const router = useRouter()
  const { signUp, setActive } = useSignUp()

  useEffect(() => {
    async function handleCallback() {
      try {
        // The OAuth flow should have been handled by Clerk
        // Check if we have a completed sign-up
        if (signUp?.status === "complete" && setActive) {
          await setActive({ session: signUp.createdSessionId })
          
          // Track conversion
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'sso_account_created', {
              method: 'google',
              value: 3.0
            })
          }
          
          // Redirect to phone verification
          router.push('/start/verify')
        } else {
          // If not complete, redirect back to account creation
          router.push('/start/account')
        }
      } catch (error) {
        console.error("SSO callback error:", error)
        router.push('/start/account')
      }
    }

    handleCallback()
  }, [signUp, setActive, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-lg font-medium">Completing sign-up...</p>
            <p className="text-sm text-gray-600">Please wait while we set up your account</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
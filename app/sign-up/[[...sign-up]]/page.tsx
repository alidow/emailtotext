"use client"

import { SignUp } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || ""
  const billing = searchParams.get("billing") || "monthly"
  
  useEffect(() => {
    // Check if phone was verified (in production, this would check a cookie or session)
    const verifiedPhone = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    
    if (!verifiedPhone) {
      // In production, redirect to home if no verified phone
      // router.push("/")
    }
  }, [router])
  
  // Build the redirect URL with plan parameters
  let afterSignUpUrl = "/onboarding"
  if (plan) {
    afterSignUpUrl += `?plan=${plan}&billing=${billing}`
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <SignUp 
        path="/sign-up"
        afterSignUpUrl={afterSignUpUrl}
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
      />
    </div>
  )
}
"use client"

import { SignIn } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SignInPage() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard"
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("SignIn Page State:", { isLoaded, userId, redirectUrl })
    
    // If user is already signed in, redirect them
    if (isLoaded && userId) {
      console.log("User is signed in, redirecting to:", redirectUrl)
      router.push(redirectUrl)
    }
  }, [isLoaded, userId, redirectUrl, router])

  // Add timeout for loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.error("Clerk failed to load after 10 seconds")
        setError("Authentication service failed to load. Please refresh the page.")
      }
    }, 10000)
    
    return () => clearTimeout(timeout)
  }, [isLoaded])

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // If user is already signed in, show redirecting message
  if (userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to {redirectUrl}...</p>
        </div>
      </div>
    )
  }

  console.log("Rendering SignIn component")
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <SignIn 
        path="/sign-in"
        afterSignInUrl={redirectUrl}
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
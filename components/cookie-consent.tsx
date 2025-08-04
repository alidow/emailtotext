"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }

    // Auto-accept on scroll (legitimate interest)
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 100) {
        setHasScrolled(true)
        acceptCookies()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasScrolled])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg animate-in slide-in-from-bottom-0 duration-500">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-gray-600">
            <p>
              We use essential cookies to make our site work. With your consent, we may also use 
              non-essential cookies to improve user experience and analyze website traffic. By clicking 
              "Accept", you agree to our website's cookie use as described in our{" "}
              <Link href="/cookies" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/cookies"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Learn More
            </Link>
            <Button
              onClick={acceptCookies}
              size="sm"
              className="whitespace-nowrap"
            >
              Accept
            </Button>
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
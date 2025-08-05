"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
}

declare global {
  interface Window {
    turnstile: any
  }
}

export function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = "auto",
  size = "normal",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // Debug logging
    console.log('Turnstile: Received siteKey:', siteKey, 'Type:', typeof siteKey)
    
    // Ensure siteKey is a string and convert if needed
    let validSiteKey = siteKey
    
    if (typeof siteKey === 'object' && siteKey !== null) {
      console.warn('Turnstile: siteKey was provided as an object, attempting to extract string value')
      console.log('Object keys:', Object.keys(siteKey))
      console.log('Object values:', Object.values(siteKey))
      // Try to extract the actual value if it's wrapped in an object
      validSiteKey = (siteKey as any).toString() || String(siteKey)
    }
    
    if (typeof validSiteKey !== 'string' || !validSiteKey) {
      console.error('Turnstile: Invalid siteKey provided:', siteKey, 'Type:', typeof siteKey)
      if (onError) onError()
      return
    }
    
    console.log('Turnstile: Using validSiteKey:', validSiteKey)

    if (!scriptLoaded || !window.turnstile || !containerRef.current) return

    // Clean up any existing widget
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current)
      } catch (e) {
        console.error('Error removing turnstile widget:', e)
      }
    }

    try {
      // Create new widget
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: validSiteKey,
        callback: onVerify,
        "error-callback": onError,
        "expired-callback": onExpire,
        theme,
        size,
      })
    } catch (e) {
      console.error('Error rendering turnstile widget:', e)
      if (onError) onError()
    }

    return () => {
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (e) {
          console.error('Error removing turnstile widget:', e)
        }
      }
    }
  }, [siteKey, onVerify, onError, onExpire, theme, size, scriptLoaded])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Script loaded successfully
          setScriptLoaded(true)
        }}
      />
      <div ref={containerRef} className="cf-turnstile" />
    </>
  )
}
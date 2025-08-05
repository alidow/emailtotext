"use client"

import { useEffect, useRef, useState, memo, useCallback } from "react"
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

function TurnstileComponent({
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
  const isRendering = useRef(false)

  useEffect(() => {
    if (!scriptLoaded || !window.turnstile || !containerRef.current) return
    
    // Skip if widget already exists
    if (widgetIdRef.current) return
    
    // Prevent multiple simultaneous renders
    if (isRendering.current) return
    isRendering.current = true

    // Small delay to ensure container is ready
    const timer = setTimeout(() => {
      if (!containerRef.current || widgetIdRef.current) {
        isRendering.current = false
        return
      }

      try {
        // Create new widget
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerify(token)
          },
          "error-callback": () => {
            if (onError) onError()
          },
          "expired-callback": () => {
            if (onExpire) onExpire()
          },
          theme,
          size,
        })
      } catch (e) {
        console.error('Error rendering turnstile widget:', e)
        if (onError) onError()
      } finally {
        isRendering.current = false
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      // Don't remove widget on every cleanup, only on unmount
    }
  }, [siteKey, theme, size, scriptLoaded]) // Remove callbacks from dependencies

  // Separate cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        } catch (e) {
          // Widget might already be removed
        }
      }
    }
  }, [])

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
      <div 
        ref={containerRef} 
        key={`turnstile-${siteKey}`}
      />
    </>
  )
}

export const Turnstile = memo(TurnstileComponent)
"use client"

import { useEffect, useRef } from "react"
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

  useEffect(() => {
    if (!window.turnstile || !containerRef.current) return

    // Clean up any existing widget
    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current)
    }

    // Create new widget
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      "error-callback": onError,
      "expired-callback": onExpire,
      theme,
      size,
    })

    return () => {
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [siteKey, onVerify, onError, onExpire, theme, size])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div ref={containerRef} className="cf-turnstile" />
    </>
  )
}
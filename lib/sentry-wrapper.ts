import { NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"

type ApiHandler = (req: NextRequest) => Promise<NextResponse>

export function withSentry(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      // Capture the error in Sentry
      Sentry.captureException(error, {
        extra: {
          url: req.url,
          method: req.method,
          headers: Object.fromEntries(req.headers.entries()),
        },
      })

      // Log error in development
      if (process.env.NODE_ENV === "development") {
        console.error("API Error:", error)
      }

      // Return a generic error response
      return NextResponse.json(
        { 
          error: "Internal server error",
          message: process.env.NODE_ENV === "development" 
            ? (error instanceof Error ? error.message : "Unknown error")
            : "An unexpected error occurred"
        },
        { status: 500 }
      )
    }
  }
}

// Helper to add Sentry context
export function setSentryUser(userId: string, email?: string, phone?: string) {
  Sentry.setUser({
    id: userId,
    email,
    phone,
  })
}

// Helper to add custom context
export function addSentryContext(key: string, context: Record<string, any>) {
  Sentry.setContext(key, context)
}

// Helper to add breadcrumb
export function addSentryBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    level: "info",
    data,
    timestamp: Date.now() / 1000,
  })
}
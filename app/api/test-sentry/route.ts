import { NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  try {
    // This will throw an error that Sentry will capture
    throw new Error("Test Sentry error - this is intentional!")
  } catch (error) {
    // Capture the error with additional context
    Sentry.captureException(error, {
      tags: {
        test: true,
        endpoint: "test-sentry"
      },
      extra: {
        timestamp: new Date().toISOString(),
        purpose: "Testing Sentry integration"
      }
    })
    
    return NextResponse.json({ 
      message: "Error sent to Sentry! Check your Sentry dashboard.",
      timestamp: new Date().toISOString()
    })
  }
}
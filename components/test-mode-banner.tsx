"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function TestModeBanner() {
  // Only show in test mode
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_MODE !== 'true') {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/10 backdrop-blur-sm border-b border-yellow-500/20">
      <Alert className="rounded-none border-none bg-transparent">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 font-semibold">
          TEST MODE ACTIVE - No real payments or SMS messages will be processed. 
          <a 
            href="/admin/sms-logs" 
            className="underline ml-2 hover:text-yellow-900"
          >
            View SMS logs
          </a>
        </AlertDescription>
      </Alert>
    </div>
  )
}
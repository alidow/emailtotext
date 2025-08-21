"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

/**
 * Analytics Debugger Component
 * Shows analytics events in real-time for debugging
 * Only visible in development mode or with ?debug=analytics query param
 */
export function AnalyticsDebugger() {
  const [isVisible, setIsVisible] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [isMinimized, setIsMinimized] = useState(false)
  
  useEffect(() => {
    // Check if we should show the debugger
    const isDev = process.env.NODE_ENV === 'development'
    const hasDebugParam = typeof window !== 'undefined' && 
      new URLSearchParams(window.location.search).get('debug') === 'analytics'
    
    if (isDev || hasDebugParam) {
      setIsVisible(true)
      
      // Poll for events from window.__analyticsDebug
      const interval = setInterval(() => {
        if ((window as any).__analyticsDebug) {
          const debugData = (window as any).__analyticsDebug
          setEvents(debugData.events.slice(-10)) // Keep last 10 events
        }
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [])
  
  if (!isVisible) return null
  
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg"
        >
          📊 Analytics ({events.length})
        </Button>
      </div>
    )
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-auto bg-white border border-gray-300 rounded-lg shadow-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Analytics Debugger</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setEvents([])}
            size="sm"
            variant="ghost"
          >
            Clear
          </Button>
          <Button
            onClick={() => setIsMinimized(true)}
            size="sm"
            variant="ghost"
          >
            _
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 text-xs">
        {events.length === 0 ? (
          <p className="text-gray-500">No events tracked yet...</p>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-blue-600">{event.message}</span>
                <span className="text-gray-400 text-[10px]">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {event.data && (
                <pre className="mt-1 text-[10px] text-gray-600 overflow-x-auto">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-[10px] text-gray-500">
          Tip: Add ?debug=analytics to URL to show in production
        </p>
      </div>
    </div>
  )
}
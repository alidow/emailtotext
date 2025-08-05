'use client'

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // In production, you might want to send this to an error tracking service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      })
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Optionally reload the page
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      const error = this.state.error
      const isConfigError = error?.message?.includes('required') || 
                           error?.message?.includes('not configured')

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isConfigError ? 'Configuration Error' : 'Something went wrong'}
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              {isConfigError ? (
                <>
                  <p>The application is missing required configuration.</p>
                  <p className="text-sm font-mono bg-destructive/10 p-2 rounded">
                    {error?.message}
                  </p>
                  <p className="text-sm">
                    Please ensure all environment variables are properly configured.
                  </p>
                </>
              ) : (
                <>
                  <p>An unexpected error occurred while rendering this page.</p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-sm font-mono bg-destructive/10 p-2 rounded">
                      {error?.message}
                    </p>
                  )}
                </>
              )}
            </AlertDescription>
            <div className="mt-4">
              <Button onClick={this.handleReset} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for using error boundary
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return setError
}
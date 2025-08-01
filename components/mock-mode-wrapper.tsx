"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, ReactNode } from "react"

// Check if we're in mock mode
const isMockMode = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

interface MockModeWrapperProps {
  children: ReactNode
  requireAuth?: boolean
}

export function MockModeWrapper({ children, requireAuth = false }: MockModeWrapperProps) {
  const { isLoaded, user } = useUser()
  
  // In mock mode, render children directly
  if (isMockMode && requireAuth) {
    return <>{children}</>
  }
  
  // In production mode, wait for auth
  if (requireAuth && !isLoaded) {
    return <div>Loading...</div>
  }
  
  return <>{children}</>
}
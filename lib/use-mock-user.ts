"use client"

import { useUser as useClerkUser } from "@clerk/nextjs"

// Mock user for development
const mockUser = {
  id: "user_mock123",
  firstName: "Demo",
  lastName: "User",
  primaryEmailAddress: {
    emailAddress: "demo@example.com"
  }
}

// Check if we're in mock mode
const isMockMode = typeof window !== 'undefined' && 
  !window.location.hostname.includes('vercel') &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

// Custom hook that returns mock user in development
export function useUser() {
  try {
    // Try to use Clerk's useUser hook
    const clerkUser = useClerkUser()
    return clerkUser
  } catch (error) {
    // If Clerk fails (no provider), return mock data in development
    if (isMockMode) {
      return {
        isLoaded: true,
        isSignedIn: true,
        user: mockUser
      }
    }
    // In production, re-throw the error
    throw error
  }
}
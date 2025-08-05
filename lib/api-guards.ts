/**
 * API route guards for common checks
 */

import { NextResponse } from 'next/server'
import { isSupabaseAdminConfigured } from './supabase'

/**
 * Guard that ensures Supabase is configured
 * Returns an error response if not configured
 */
export function requireDatabase() {
  if (!isSupabaseAdminConfigured()) {
    console.error('API route called but Supabase is not configured')
    
    // In test mode, return a more helpful error
    if (process.env.ENABLE_TEST_MODE === 'true') {
      return NextResponse.json(
        { 
          error: 'Database not configured',
          message: 'This operation requires database access. Please configure Supabase environment variables.',
          testMode: true
        },
        { status: 503 }
      )
    }
    
    // In production, return a generic error
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
  
  return null // No error, proceed
}

/**
 * Guard for test mode operations
 * Allows bypassing certain checks in test mode
 */
export function isTestModeActive(): boolean {
  return process.env.ENABLE_TEST_MODE === 'true'
}
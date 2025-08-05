import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabase'

/**
 * Helper to ensure supabaseAdmin is available for API routes
 * Returns early with error response if not configured
 */
export function requireSupabaseAdmin(context: string = 'This operation') {
  if (!isSupabaseAdminConfigured()) {
    console.error(`Supabase Admin not configured for: ${context}`)
    return {
      error: true,
      response: NextResponse.json(
        { 
          error: 'Database configuration error', 
          message: 'The application is not properly configured. Please contact support.'
        },
        { status: 503 }
      )
    }
  }
  
  return { error: false, admin: supabaseAdmin! }
}

/**
 * Wrapper for Supabase admin operations in API routes
 */
export async function withSupabaseAdmin<T>(
  context: string,
  operation: (admin: typeof supabaseAdmin) => Promise<T>
): Promise<{ data?: T; error?: any; response?: NextResponse }> {
  const check = requireSupabaseAdmin(context)
  if (check.error) {
    return { response: check.response }
  }
  
  try {
    const data = await operation(check.admin)
    return { data }
  } catch (error) {
    console.error(`Supabase operation failed for ${context}:`, error)
    return { error }
  }
}
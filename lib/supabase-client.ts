import { createClient } from '@supabase/supabase-js'
import { getEnvVar } from './env-validation'

// Get environment variables with fallbacks
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Create a Supabase client for client-side operations
// This will throw an error if the required env vars are missing in production
// In test mode, it will use placeholder values
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!supabase
}

// Wrapper for Supabase operations that handles missing configuration
export async function safeSupabaseOperation<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - operation skipped')
    if (fallback !== undefined) return fallback
    throw new Error('Supabase not configured')
  }
  
  return operation()
}
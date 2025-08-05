import { createClient } from '@supabase/supabase-js'
import { getEnvVar } from './env-validation'

// Get environment variables with fallbacks
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY')

// Create client-side Supabase client (for browser)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side client with service role key (for admin operations)
// Type assertion to avoid null checks in existing code
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey
  ? createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null) as ReturnType<typeof createClient>

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!supabase && !!supabaseAdmin
}

// Helper to check if only admin is configured (for server-side only operations)
export function isSupabaseAdminConfigured(): boolean {
  return !!supabaseServiceKey && !!supabaseUrl
}
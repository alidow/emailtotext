/**
 * Safe wrappers for Supabase operations that handle null clients
 * Use these in API routes to avoid null check errors
 */

import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabase'

/**
 * Safe wrapper for Supabase admin operations
 * Returns a mock response in test mode or when not configured
 */
export async function safeSupabaseQuery<T = any>(
  operation: () => any,
  mockData?: T
): Promise<{ data: T | null; error: any }> {
  if (!isSupabaseAdminConfigured()) {
    console.warn('Supabase not configured - returning mock data')
    return { data: mockData || null, error: null }
  }
  
  try {
    return await operation()
  } catch (error) {
    console.error('Supabase operation failed:', error)
    return { data: null, error }
  }
}

/**
 * Get supabaseAdmin with null check
 * Throws error if not configured - use in routes that absolutely require DB
 */
export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase Admin not configured')
  }
  return supabaseAdmin
}

/**
 * Check if we should skip database operations
 * Returns true in test mode or when Supabase is not configured
 */
export function shouldSkipDatabase(): boolean {
  return !isSupabaseAdminConfigured() || process.env.ENABLE_TEST_MODE === 'true'
}
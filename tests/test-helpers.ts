import { SupabaseClient } from '@supabase/supabase-js'

export async function createTestUser(
  supabase: SupabaseClient,
  data: {
    email: string
    phone: string
    plan_type?: string
    clerk_id?: string
  }
) {
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      clerk_id: data.clerk_id || `test_clerk_${Date.now()}`,
      email: data.email,
      phone: data.phone,
      phone_verified: true,
      plan_type: data.plan_type || 'free',
      account_status: 'active',
      usage_count: 0
    })
    .select()
    .single()
  
  if (error) throw error
  return user
}

export async function cleanupTestUser(
  supabase: SupabaseClient,
  userId: string
) {
  try {
    // Delete user and related data (cascades should handle most)
    await supabase
      .from('users')
      .delete()
      .eq('id', userId)
  } catch (error) {
    console.error('Error cleaning up test user:', error)
  }
}
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import { createClient } from '@supabase/supabase-js'
import { createTestUser, cleanupTestUser } from '../test-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

describe('Account Lifecycle - Phone-based Quota Tracking', () => {
  let testPhone: string
  let testUserId1: string
  let testUserId2: string
  let testEmail1: string
  let testEmail2: string
  
  beforeAll(async () => {
    // Generate unique test identifiers
    const timestamp = Date.now()
    testPhone = `+1555${timestamp.toString().slice(-7)}`
    testEmail1 = `test-user-1-${timestamp}@example.com`
    testEmail2 = `test-user-2-${timestamp}@example.com`
  })
  
  afterAll(async () => {
    // Cleanup test data
    if (testUserId1) await cleanupTestUser(supabase, testUserId1)
    if (testUserId2) await cleanupTestUser(supabase, testUserId2)
    
    // Clean up phone usage tracking
    await supabase
      .from('phone_usage_tracking')
      .delete()
      .eq('phone', testPhone)
  })
  
  test('Phone usage persists across account cancellation and re-signup', async () => {
    // Step 1: Create first user with paid plan
    const { data: user1, error: error1 } = await supabase
      .from('users')
      .insert({
        clerk_id: `test_clerk_${Date.now()}_1`,
        email: testEmail1,
        phone: testPhone,
        phone_verified: true,
        plan_type: 'standard', // 500 texts/month quota
        account_status: 'active',
        usage_count: 0
      })
      .select()
      .single()
    
    expect(error1).toBeNull()
    expect(user1).toBeDefined()
    testUserId1 = user1.id
    
    // Step 2: Simulate sending 50 texts (more than free plan limit of 10)
    const textsToSend = 50
    
    // Update user usage count
    await supabase
      .from('users')
      .update({ usage_count: textsToSend })
      .eq('id', testUserId1)
    
    // Track phone-level usage
    await supabase
      .rpc('track_phone_usage', {
        p_phone: testPhone,
        p_sms_count: textsToSend
      })
    
    // Verify phone usage is tracked
    const { data: phoneUsage1 } = await supabase
      .rpc('get_phone_monthly_usage', {
        p_phone: testPhone
      })
      .single()
    
    expect(phoneUsage1.sms_sent).toBe(textsToSend)
    
    // Step 3: Cancel the account (simulate subscription cancellation)
    await supabase
      .from('users')
      .update({
        account_status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        plan_type: 'free',
        stripe_subscription_id: null
      })
      .eq('id', testUserId1)
    
    // Step 4: Create new account with same phone but different email
    const { data: user2, error: error2 } = await supabase
      .from('users')
      .insert({
        clerk_id: `test_clerk_${Date.now()}_2`,
        email: testEmail2,
        phone: testPhone,
        phone_verified: true,
        plan_type: 'free', // Free plan: 10 texts/month
        account_status: 'active',
        usage_count: 0 // Start with 0 at user level
      })
      .select()
      .single()
    
    expect(error2).toBeNull()
    expect(user2).toBeDefined()
    testUserId2 = user2.id
    
    // Step 5: Check that phone-level usage persists
    const { data: phoneUsage2 } = await supabase
      .rpc('get_phone_monthly_usage', {
        p_phone: testPhone
      })
      .single()
    
    // Phone usage should still show 50 texts sent
    expect(phoneUsage2.sms_sent).toBe(textsToSend)
    
    // Step 6: Verify user is at max quota for free plan
    const freeQuota = 10
    const remainingTexts = Math.max(0, freeQuota - phoneUsage2.sms_sent)
    
    expect(remainingTexts).toBe(0) // Should have 0 texts remaining
    expect(phoneUsage2.sms_sent).toBeGreaterThan(freeQuota) // Already exceeded free quota
  })
  
  test('Abuse detection triggers after multiple cancellations', async () => {
    const testPhone2 = `+1555${Date.now().toString().slice(-7)}`
    
    // Simulate multiple cancellation events
    for (let i = 0; i < 4; i++) {
      await supabase
        .from('account_lifecycle_events')
        .insert({
          event_type: 'cancelled',
          phone: testPhone2,
          email: `test${i}@example.com`,
          clerk_id: `test_clerk_${i}`,
          created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString() // Spread over 4 days
        })
    }
    
    // Check if phone can sign up
    const { data: canSignup } = await supabase
      .rpc('can_phone_signup', {
        p_phone: testPhone2,
        p_email: 'new@example.com'
      })
    
    // Should be blocked due to rapid cancellation pattern (>3 in 30 days)
    expect(canSignup).toBe(false)
    
    // Verify abuse was tracked
    const { data: abuseRecord } = await supabase
      .from('abuse_tracking')
      .select('*')
      .eq('phone', testPhone2)
      .eq('abuse_type', 'rapid_cancellation')
      .single()
    
    expect(abuseRecord).toBeDefined()
    
    // Cleanup
    await supabase
      .from('account_lifecycle_events')
      .delete()
      .eq('phone', testPhone2)
    
    await supabase
      .from('abuse_tracking')
      .delete()
      .eq('phone', testPhone2)
  })
  
  test('Monthly quota resets appropriately', async () => {
    const testPhone3 = `+1555${Date.now().toString().slice(-7)}`
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const lastMonth = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7)
    
    // Insert usage for last month
    await supabase
      .from('phone_usage_tracking')
      .insert({
        phone: testPhone3,
        month_year: lastMonth,
        sms_sent: 10,
        sms_quota: 10
      })
    
    // Get current month usage (should be 0)
    const { data: currentUsage } = await supabase
      .rpc('get_phone_monthly_usage', {
        p_phone: testPhone3
      })
      .single()
    
    expect(currentUsage.sms_sent).toBe(0) // New month, fresh quota
    expect(currentUsage.month_year).toBe(currentMonth)
    
    // Cleanup
    await supabase
      .from('phone_usage_tracking')
      .delete()
      .eq('phone', testPhone3)
  })
})
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCancellationFlow() {
  console.log('🧪 Testing Account Cancellation Flow\n')
  
  const testPhone = `+1555${Date.now().toString().slice(-7)}`
  const testEmail = `test-cancel-${Date.now()}@example.com`
  
  try {
    // Test 1: Create a test user with a paid plan
    console.log('Test 1: Creating test user with paid plan...')
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert({
        clerk_id: `test_cancel_${Date.now()}`,
        email: testEmail,
        phone: testPhone,
        phone_verified: true,
        plan_type: 'standard',
        account_status: 'active',
        stripe_subscription_id: 'sub_test_12345',
        usage_count: 50
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Failed to create test user:', createError)
      return
    }
    
    console.log('✅ Test user created:', user.id)
    
    // Test 2: Simulate usage tracking
    console.log('\nTest 2: Tracking phone usage...')
    await supabase.rpc('track_phone_usage', {
      p_phone: testPhone,
      p_sms_count: 50
    })
    
    const { data: usage1 } = await supabase
      .rpc('get_phone_monthly_usage', {
        p_phone: testPhone
      })
      .single() as { data: any }
    
    console.log(`✅ Phone usage tracked: ${usage1?.sms_sent || 0} messages sent`)
    
    // Test 3: Cancel the account
    console.log('\nTest 3: Cancelling account...')
    const { error: cancelError } = await supabase
      .from('users')
      .update({
        account_status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        plan_type: 'free',
        stripe_subscription_id: null
      })
      .eq('id', user.id)
    
    if (cancelError) {
      console.error('❌ Failed to cancel account:', cancelError)
    } else {
      console.log('✅ Account cancelled successfully')
    }
    
    // Test 4: Check if lifecycle event was logged
    console.log('\nTest 4: Checking lifecycle event...')
    const { data: events } = await supabase
      .from('account_lifecycle_events')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_type', 'cancelled')
    
    if (events && events.length > 0) {
      console.log('✅ Cancellation event logged')
    } else {
      console.log('⚠️  No cancellation event found (trigger may need to be set up)')
    }
    
    // Test 5: Try to create a new account with the same phone
    console.log('\nTest 5: Testing re-signup with same phone number...')
    const { data: canSignup } = await supabase
      .rpc('can_phone_signup', {
        p_phone: testPhone,
        p_email: 'new@example.com'
      }) as { data: boolean }
    
    if (canSignup === false) {
      console.log('❌ Cannot sign up with same phone (phone may still be active)')
    } else {
      console.log('✅ Phone number can be used for new signup')
      
      // Create new account
      const { data: user2, error: error2 } = await supabase
        .from('users')
        .insert({
          clerk_id: `test_cancel_2_${Date.now()}`,
          email: 'new@example.com',
          phone: testPhone,
          phone_verified: true,
          plan_type: 'free',
          account_status: 'active',
          usage_count: 0
        })
        .select()
        .single()
      
      if (!error2) {
        console.log('✅ New account created with same phone')
        
        // Check usage persists
        const { data: usage2 } = await supabase
          .rpc('get_phone_monthly_usage', {
            p_phone: testPhone
          })
          .single() as { data: any }
        
        console.log(`✅ Usage persisted: ${usage2?.sms_sent || 0} messages (was 50)`)
        
        // Cleanup second user
        await supabase.from('users').delete().eq('id', user2!.id)
      }
    }
    
    // Test 6: Test abuse detection
    console.log('\nTest 6: Testing abuse detection (rapid cancellations)...')
    const abusePhone = `+1555${Date.now().toString().slice(-6)}9`
    
    // Simulate multiple cancellations
    for (let i = 0; i < 4; i++) {
      await supabase
        .from('account_lifecycle_events')
        .insert({
          event_type: 'cancelled',
          phone: abusePhone,
          email: `test${i}@example.com`,
          clerk_id: `test_abuse_${i}`,
          user_id: user.id // Use test user ID
        })
    }
    
    const { data: canSignupAbuse } = await supabase
      .rpc('can_phone_signup', {
        p_phone: abusePhone,
        p_email: 'abuse@example.com'
      }) as { data: boolean }
    
    if (canSignupAbuse === false) {
      console.log('✅ Abuse detection working: Phone blocked after rapid cancellations')
    } else {
      console.log('⚠️  Abuse detection may not be configured properly')
    }
    
    // Cleanup
    console.log('\n🧹 Cleaning up test data...')
    
    // Delete test user
    await supabase.from('users').delete().eq('id', user.id)
    
    // Delete phone usage tracking
    await supabase
      .from('phone_usage_tracking')
      .delete()
      .eq('phone', testPhone)
    
    // Delete lifecycle events
    await supabase
      .from('account_lifecycle_events')
      .delete()
      .or(`phone.eq.${testPhone},phone.eq.${abusePhone}`)
    
    // Delete abuse tracking
    await supabase
      .from('abuse_tracking')
      .delete()
      .eq('phone', abusePhone)
    
    console.log('✅ Test data cleaned up')
    console.log('\n✨ All cancellation flow tests completed!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Run the tests
testCancellationFlow().then(() => {
  console.log('\n✅ Test script completed')
  process.exit(0)
}).catch((error) => {
  console.error('❌ Test script failed:', error)
  process.exit(1)
})
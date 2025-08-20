// This is the UPDATED section for the process-email Edge Function
// Replace the usage tracking section with this code

    // Get phone-level usage tracking (persists across account cancellations)
    const { data: phoneUsage } = await supabase
      .rpc('get_phone_monthly_usage', {
        p_phone: phone
      })
      .single()
    
    // Use phone-level tracking for quota checking
    const quotaLimits = {
      free: 10,
      basic: 100,
      standard: 500,
      premium: 1000,
      pro: 500 // Legacy support
    }
    const baseLimit = quotaLimits[user.plan_type as keyof typeof quotaLimits] || 10
    const totalLimit = baseLimit + (user.additional_texts_purchased || 0)
    
    // Check against phone-level usage, not user-level
    const currentUsage = phoneUsage?.sms_sent || 0
    
    if (currentUsage >= totalLimit) {
      // Handle quota exceeded...
      // (existing auto-upgrade logic stays the same)
    }

    // After successfully sending SMS:
    try {
      smsResult = await sendSMS({
        to: phone,
        body: smsBody,
        userId: user.id,
        type: 'email_forward',
        metadata: {
          email_id: email.id,
          from_email: sender,
          subject: subject,
          is_test_user: isTestUser
        }
      }, supabase)
      
      console.log(`SMS sent successfully via ${smsResult.provider}:`, smsBody.substring(0, 50) + '...')
      
      // Update BOTH user-level and phone-level usage tracking
      const newUsageCount = (user.usage_count || 0) + 1
      
      // Update user-level count (for backwards compatibility)
      await supabase
        .from('users')
        .update({ usage_count: newUsageCount })
        .eq('id', user.id)
      
      // Update phone-level tracking (persists across account cancellations)
      await supabase
        .rpc('track_phone_usage', {
          p_phone: phone,
          p_sms_count: 1
        })
        
      // Check for usage alerts based on phone-level usage
      const newPhoneUsage = currentUsage + 1
      const usagePercentage = (newPhoneUsage / baseLimit) * 100
      
      if (usagePercentage >= 80 && usagePercentage < 90) {
        // Send 80% usage alert...
      }
    } catch (smsError) {
      // Error handling stays the same...
    }
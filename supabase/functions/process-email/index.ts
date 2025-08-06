import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import * as twilio from "https://esm.sh/twilio@4.19.0"

// Test mode check
const isTestMode = () => Deno.env.get('ENABLE_TEST_MODE') === 'true'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'https://emailtotextnotify.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify Mailgun webhook signature
    const signature = req.headers.get('X-Mailgun-Signature')
    if (!signature) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Parse form data from Mailgun
    const formData = await req.formData()
    const recipient = formData.get('recipient') as string
    const sender = formData.get('sender') as string
    const subject = formData.get('subject') as string
    const bodyPlain = formData.get('body-plain') as string
    const bodyHtml = formData.get('body-html') as string
    const timestamp = formData.get('timestamp') as string
    const token = formData.get('token') as string

    // Verify webhook signature using proper HMAC
    const crypto = await import('https://deno.land/std@0.168.0/crypto/mod.ts')
    
    // Check timestamp to prevent replay attacks (must be within 5 minutes)
    const timestampNum = parseInt(timestamp)
    const currentTime = Math.floor(Date.now() / 1000)
    if (Math.abs(currentTime - timestampNum) > 300) {
      console.error('Webhook timestamp too old:', { timestamp, currentTime })
      return new Response('Request timestamp too old', { status: 401 })
    }
    
    // Verify HMAC signature
    const signingKey = Deno.env.get('MAILGUN_WEBHOOK_SIGNING_KEY')!
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(signingKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )
    
    const signatureData = encoder.encode(timestamp + token)
    const expectedSignature = await crypto.subtle.sign('HMAC', key, signatureData)
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    if (expectedHex !== signature) {
      console.error('Invalid webhook signature')
      return new Response('Invalid signature', { status: 401 })
    }

    // Extract phone number from recipient email
    const phoneMatch = recipient.match(/(\d{10})@/)
    if (!phoneMatch) {
      return new Response('Invalid recipient format', { status: 400 })
    }
    const phone = `+1${phoneMatch[1]}`

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Look up user by phone
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (userError || !user) {
      // Send bounce email
      await sendBounceEmail(sender, recipient)
      return new Response('User not found', { status: 404 })
    }

    // Check usage quota (existing logic)
    const quotaLimits = {
      free: 10,
      basic: 100,
      standard: 500,
      premium: 1000,
      pro: 500 // Legacy support
    }
    const baseLimit = quotaLimits[user.plan_type as keyof typeof quotaLimits] || 10
    const totalLimit = baseLimit + (user.additional_texts_purchased || 0)
    
    if (user.usage_count >= totalLimit) {
      // Handle based on plan type
      if (user.plan_type === 'free') {
        // Auto-upgrade free users to basic
        console.log('Free user exceeded limit, auto-upgrading to Basic')
        
        try {
          let subscription: any
          
          if (isTestMode()) {
            // In test mode, simulate subscription creation
            const mockSubscriptionId = `sub_test_${Date.now()}`
            
            // Log the payment attempt
            await supabase
              .from('payment_logs')
              .insert({
                user_id: user.id,
                type: 'subscription',
                status: 'test_mode',
                stripe_session_id: mockSubscriptionId,
                plan_type: 'basic',
                billing_cycle: 'monthly',
                metadata: {
                  auto_upgrade: true,
                  trigger: 'quota_exceeded'
                }
              })
            
            console.log('[TEST MODE] Auto-upgrade to Basic plan logged')
            
            // Simulate the subscription
            subscription = { id: mockSubscriptionId }
          } else {
            // Create real Stripe subscription
            const stripe = await import('https://esm.sh/stripe@13.10.0')
            const stripeClient = new stripe.default(Deno.env.get('STRIPE_SECRET_KEY')!, {
              apiVersion: '2023-10-16'
            })
            
            // Create subscription
            subscription = await stripeClient.subscriptions.create({
              customer: user.stripe_customer_id,
              items: [{
                price: Deno.env.get('STRIPE_BASIC_MONTHLY_PRICE_ID')!
              }],
              metadata: {
                user_id: user.id,
                auto_upgrade: 'true'
              }
            })
          }
          
          // Update user to Basic plan
          await supabase
            .from('users')
            .update({
              plan_type: 'basic',
              stripe_subscription_id: subscription.id,
              billing_cycle: 'monthly'
            })
            .eq('id', user.id)
          
          // Send upgrade notification email
          if (user.email) {
            await fetch(`${Deno.env.get('NEXT_PUBLIC_APP_URL')}/api/emails/send`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: user.email,
                template: 'autoUpgraded',
                data: []
              })
            })
          }
          
          // Log the auto-upgrade
          await supabase
            .from('billing_events')
            .insert({
              user_id: user.id,
              event_type: 'auto_upgrade',
              details: {
                from_plan: 'free',
                to_plan: 'basic',
                trigger: 'quota_exceeded'
              }
            })
          
          // Continue processing the message
          console.log('Auto-upgrade successful, continuing with message delivery')
          
        } catch (error) {
          console.error('Auto-upgrade failed:', error)
          // If auto-upgrade fails, bounce the email
          await sendQuotaBounceEmail(sender, recipient, user.plan_type)
          return new Response('Auto-upgrade failed', { status: 500 })
        }
        
      } else if (['basic', 'standard', 'premium'].includes(user.plan_type)) {
        // Auto-buy additional texts for paid plans
        console.log(`${user.plan_type} user exceeded limit, auto-buying 100 texts`)
        
        try {
          const stripe = await import('https://esm.sh/stripe@13.10.0')
          const stripeClient = new stripe.default(Deno.env.get('STRIPE_SECRET_KEY')!, {
            apiVersion: '2023-10-16'
          })
          
          // Calculate price per text with 10% markup
          const basePricePerText = user.plan_type === 'basic' ? 0.05 : 0.02
          const pricePerText = basePricePerText * 1.1
          const totalAmount = Math.round(pricePerText * 100 * 100) // 100 texts in cents
          
          // Create one-time charge
          const charge = await stripeClient.charges.create({
            amount: totalAmount,
            currency: 'usd',
            customer: user.stripe_customer_id,
            description: 'Auto-purchase 100 additional text messages',
            metadata: {
              user_id: user.id,
              type: 'auto_buy_texts',
              texts_purchased: '100'
            }
          })
          
          // Update user's additional texts
          await supabase
            .from('users')
            .update({
              additional_texts_purchased: (user.additional_texts_purchased || 0) + 100
            })
            .eq('id', user.id)
          
          // Send auto-buy notification
          if (user.email) {
            await fetch(`${Deno.env.get('NEXT_PUBLIC_APP_URL')}/api/emails/send`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: user.email,
                template: 'quotaOverage',
                data: [100, (totalAmount / 100).toFixed(2)]
              })
            })
          }
          
          // Log the auto-buy
          await supabase
            .from('billing_events')
            .insert({
              user_id: user.id,
              event_type: 'auto_buy_texts',
              amount: totalAmount / 100,
              details: {
                texts_purchased: 100,
                price_per_text: pricePerText,
                charge_id: charge.id
              }
            })
          
          // Continue processing the message
          console.log('Auto-buy successful, continuing with message delivery')
          
        } catch (error) {
          console.error('Auto-buy failed:', error)
          // If auto-buy fails, bounce the email
          await sendQuotaBounceEmail(sender, recipient, user.plan_type)
          return new Response('Auto-buy failed', { status: 500 })
        }
      } else {
        // For other plan types, send bounce email
        await sendQuotaBounceEmail(sender, recipient, user.plan_type)
        return new Response('Quota exceeded', { status: 429 })
      }
    }

    // Parse attachments from Mailgun
    const attachmentCount = parseInt(formData.get('attachment-count') || '0')
    const attachments = []
    
    // Mailgun sends attachment info but not the actual files in the webhook
    // We need to fetch them using the provided URLs
    const attachmentInfos = []
    for (let i = 1; i <= attachmentCount; i++) {
      // Mailgun provides attachment info in these fields
      const attachmentUrl = formData.get(`attachment-${i}`) as string
      if (attachmentUrl) {
        attachmentInfos.push({
          url: attachmentUrl,
          name: formData.get(`attachment-name-${i}`) || `attachment-${i}`,
          contentType: formData.get(`attachment-content-type-${i}`) || 'application/octet-stream',
          size: parseInt(formData.get(`attachment-size-${i}`) || '0')
        })
      }
    }

    // Generate short URL
    const shortUrl = generateShortUrl()
    
    // Store email with attachment count
    const { data: email, error: emailError } = await supabase
      .from('emails')
      .insert({
        user_id: user.id,
        from_email: sender,
        subject: subject || '(no subject)',
        body: bodyPlain || stripHtml(bodyHtml || ''),
        raw_mime: formData.get('body-mime') as string,
        short_url: shortUrl,
        attachment_count: attachmentCount,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })
      .select()
      .single()

    if (emailError) {
      throw emailError
    }

    // Process attachments if any
    if (attachmentInfos.length > 0) {
      // Process attachments asynchronously to not block SMS delivery
      processAttachments(email.id, user.id, attachmentInfos, email.expires_at).catch(error => {
        console.error('Failed to process attachments:', error)
      })
    }

    // Check if user has opted out of SMS
    if (user.sms_opted_out) {
      console.log(`User ${user.id} has opted out of SMS, not sending`)
      return new Response('User opted out of SMS', { status: 200 })
    }

    // Format SMS message with attachment count
    const smsBody = formatSMS(
      sender, 
      subject || '(no subject)', 
      bodyPlain || stripHtml(bodyHtml || ''), 
      shortUrl,
      attachmentCount
    )

    // Check time restrictions (existing logic)
    const userTimezone = 'America/New_York' // TODO: Store user timezone
    const currentHour = new Date().toLocaleString('en-US', { 
      hour: 'numeric', 
      hour12: false, 
      timeZone: userTimezone 
    })
    const hour = parseInt(currentHour)

    if (!user.accepts_24hr_texts && (hour < 8 || hour >= 21)) {
      // Queue for later delivery
      console.log('Message queued for delivery during allowed hours')
      return new Response('Queued for delivery', { status: 202 })
    }

    // Check if user has a test phone
    const isTestPhone = user.is_test_phone || (Deno.env.get('TEST_PHONE_NUMBERS') || '').split(',').some(testNum => {
      const cleanTestNum = testNum.trim().replace(/\D/g, '')
      const cleanPhone = phone.replace(/\D/g, '')
      return cleanPhone.endsWith(cleanTestNum) || cleanTestNum.endsWith(cleanPhone)
    })
    
    // Send SMS via Twilio or log for test phones/mode
    if (isTestMode() || isTestPhone) {
      // Log the SMS instead of sending for test phones or test mode
      await supabase
        .from('sms_logs')
        .insert({
          user_id: user.id,
          phone: phone,
          message: smsBody,
          type: 'email_forward',
          status: isTestPhone ? 'test_phone' : 'test_mode',
          metadata: {
            email_id: email.id,
            from_email: sender,
            subject: subject,
            attachment_count: attachmentCount,
            short_url: shortUrl,
            test_phone: isTestPhone
          }
        })
      
      console.log(`[${isTestPhone ? 'TEST PHONE' : 'TEST MODE'}] SMS logged for ${phone}:`, smsBody.substring(0, 50) + '...')
    } else {
      // In production, send real SMS
      const twilioClient = twilio.default(
        Deno.env.get('TWILIO_ACCOUNT_SID')!,
        Deno.env.get('TWILIO_AUTH_TOKEN')!
      )

      const message = await twilioClient.messages.create({
        body: smsBody,
        to: phone,
        from: Deno.env.get('TWILIO_PHONE_NUMBER')!
      })
      
      // Log the sent SMS
      await supabase
        .from('sms_logs')
        .insert({
          user_id: user.id,
          phone: phone,
          message: smsBody,
          type: 'email_forward',
          status: 'sent',
          twilio_sid: message.sid,
          metadata: {
            email_id: email.id,
            from_email: sender,
            subject: subject,
            attachment_count: attachmentCount,
            short_url: shortUrl
          }
        })
    }

    // Update usage count
    const newUsageCount = user.usage_count + 1
    await supabase
      .from('users')
      .update({ usage_count: newUsageCount })
      .eq('id', user.id)
      
    // Check if we should send usage alert (at 80% of limit)
    const usagePercentage = (newUsageCount / baseLimit) * 100
    if (usagePercentage >= 80 && usagePercentage < 90) {
      // Check if we already sent an alert for this billing period
      const { data: existingAlert } = await supabase
        .from('billing_events')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_type', 'usage_alert_80')
        .gte('created_at', user.usage_reset_at)
        .single()
        
      if (!existingAlert && user.email) {
        // Send usage alert email
        await fetch(`${Deno.env.get('NEXT_PUBLIC_APP_URL')}/api/emails/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user.email,
            template: 'usageAlert',
            data: [80, newUsageCount, baseLimit]
          })
        })
        
        // Log that we sent the alert
        await supabase
          .from('billing_events')
          .insert({
            user_id: user.id,
            event_type: 'usage_alert_80',
            details: {
              usage_count: newUsageCount,
              limit: baseLimit,
              percentage: 80
            }
          })
      }
    }

    return new Response('Email processed successfully', { status: 200 })
  } catch (error) {
    console.error('Error processing email:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

async function processAttachments(
  emailId: string,
  userId: string,
  attachmentInfos: Array<{url: string, name: string, contentType: string, size: number}>,
  expiresAt: string
) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  for (const attachmentInfo of attachmentInfos) {
    try {
      // Skip if attachment is too large (10MB limit)
      if (attachmentInfo.size > 10 * 1024 * 1024) {
        console.log(`Skipping attachment ${attachmentInfo.name}: too large (${attachmentInfo.size} bytes)`)
        continue
      }

      // Fetch attachment from Mailgun URL with authentication
      const attachmentResponse = await fetch(attachmentInfo.url, {
        headers: {
          'Authorization': 'Basic ' + btoa(`api:${Deno.env.get('MAILGUN_API_KEY')}`)
        }
      })

      if (!attachmentResponse.ok) {
        throw new Error(`Failed to fetch attachment: ${attachmentResponse.status}`)
      }

      const attachmentData = await attachmentResponse.arrayBuffer()

      // Generate unique storage path
      const timestamp = Date.now()
      const safeName = attachmentInfo.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `${userId}/${emailId}/${timestamp}-${safeName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('email-attachments')
        .upload(storagePath, attachmentData, {
          contentType: attachmentInfo.contentType,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Generate thumbnail for images
      let thumbnailPath = null
      if (attachmentInfo.contentType.startsWith('image/')) {
        thumbnailPath = await generateThumbnail(supabase, storagePath, attachmentData, attachmentInfo.contentType)
      }

      // Store attachment metadata
      const { error: insertError } = await supabase
        .from('email_attachments')
        .insert({
          email_id: emailId,
          user_id: userId,
          filename: attachmentInfo.name,
          content_type: attachmentInfo.contentType,
          size_bytes: attachmentInfo.size,
          storage_path: storagePath,
          thumbnail_path: thumbnailPath,
          mailgun_url: attachmentInfo.url,
          expires_at: expiresAt
        })

      if (insertError) throw insertError

      console.log(`Successfully processed attachment: ${attachmentInfo.name}`)
    } catch (error) {
      console.error(`Failed to process attachment ${attachmentInfo.name}:`, error)
      // Continue processing other attachments
    }
  }
}

async function generateThumbnail(
  supabase: any,
  originalPath: string,
  imageData: ArrayBuffer,
  contentType: string
): Promise<string | null> {
  try {
    // For now, we'll store a flag that this is an image
    // In production, you'd use an image processing library
    // to generate actual thumbnails
    const thumbnailPath = originalPath.replace(/\.([^.]+)$/, '_thumb.$1')
    
    // For MVP, just use the same image as thumbnail
    // Later, implement proper thumbnail generation
    const { error } = await supabase.storage
      .from('email-attachments')
      .upload(thumbnailPath, imageData, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error
    
    return thumbnailPath
  } catch (error) {
    console.error('Failed to generate thumbnail:', error)
    return null
  }
}

function generateShortUrl(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

function formatSMS(from: string, subject: string, body: string, shortUrl: string, attachmentCount: number): string {
  const baseUrl = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'https://emailtotextnotify.com'
  const fullUrl = `${baseUrl}/e/${shortUrl}`
  
  // Extract sender name or email
  const senderMatch = from.match(/^"?([^"<]+)"?\s*<(.+)>$/)
  const senderName = senderMatch ? senderMatch[1].trim() : from.split('@')[0]
  
  // Clean and truncate body
  const cleanBody = body.replace(/\s+/g, ' ').trim()
  
  // Build SMS with attachment indicator
  let sms = `From: ${senderName}\n${subject}\n`
  
  // Add attachment indicator if present
  if (attachmentCount > 0) {
    const attachmentText = attachmentCount === 1 
      ? '📎 1 attachment' 
      : `📎 ${attachmentCount} attachments`
    sms += `${attachmentText}\n`
  }
  
  // Calculate remaining space for body
  const remaining = 140 - sms.length - fullUrl.length - 2 // 2 for "\n\n"
  
  if (cleanBody.length > remaining && remaining > 3) {
    sms += cleanBody.substring(0, remaining - 3) + '...'
  } else if (remaining > 0) {
    sms += cleanBody.substring(0, remaining)
  }
  
  sms += `\n\n${fullUrl}`
  
  return sms.substring(0, 140)
}

async function sendBounceEmail(to: string, originalRecipient: string) {
  // TODO: Implement email sending via Mailgun
  console.log(`Bounce email to ${to}: No account found for ${originalRecipient}`)
}

async function sendQuotaBounceEmail(to: string, originalRecipient: string, planType: string) {
  // TODO: Implement email sending via Mailgun
  console.log(`Quota bounce to ${to}: Monthly limit reached for ${planType} plan`)
}
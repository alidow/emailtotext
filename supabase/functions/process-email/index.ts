import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import * as twilio from "https://esm.sh/twilio@4.19.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Verify webhook signature
    const crypto = await import('https://deno.land/std@0.168.0/crypto/mod.ts')
    const expectedSignature = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(timestamp + token + Deno.env.get('MAILGUN_WEBHOOK_SIGNING_KEY')!)
    )
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    if (expectedHex !== signature) {
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

    // Check usage quota
    const quotaLimits = {
      free: 10,
      basic: 100,
      pro: 500
    }
    const limit = quotaLimits[user.plan_type as keyof typeof quotaLimits] || 10

    if (user.usage_count >= limit) {
      // Check if we already sent quota alert today
      const today = new Date().toISOString().split('T')[0]
      const { data: alertSent } = await supabase
        .from('sms_quota_alerts')
        .select('sent_at')
        .eq('user_id', user.id)
        .eq('sent_at', today)
        .single()

      if (!alertSent) {
        // Send quota exceeded SMS
        await sendQuotaExceededSMS(phone, user.plan_type)
        
        // Record alert
        await supabase
          .from('sms_quota_alerts')
          .insert({ user_id: user.id, sent_at: today })
      }

      // Send bounce email
      await sendQuotaBounceEmail(sender, recipient, user.plan_type)
      return new Response('Quota exceeded', { status: 429 })
    }

    // Generate short URL
    const shortUrl = generateShortUrl()
    
    // Store email
    const { data: email, error: emailError } = await supabase
      .from('emails')
      .insert({
        user_id: user.id,
        from_email: sender,
        subject: subject || '(no subject)',
        body: bodyPlain || stripHtml(bodyHtml || ''),
        raw_mime: formData.get('body-mime') as string,
        short_url: shortUrl,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })
      .select()
      .single()

    if (emailError) {
      throw emailError
    }

    // Format SMS message (140 char limit)
    const smsBody = formatSMS(sender, subject || '(no subject)', bodyPlain || stripHtml(bodyHtml || ''), shortUrl)

    // Check time restrictions
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

    // Send SMS via Twilio
    const twilioClient = twilio.default(
      Deno.env.get('TWILIO_ACCOUNT_SID')!,
      Deno.env.get('TWILIO_AUTH_TOKEN')!
    )

    await twilioClient.messages.create({
      body: smsBody,
      to: phone,
      from: Deno.env.get('TWILIO_PHONE_NUMBER')!
    })

    // Update usage count
    await supabase
      .from('users')
      .update({ usage_count: user.usage_count + 1 })
      .eq('id', user.id)

    return new Response('Email processed successfully', { status: 200 })
  } catch (error) {
    console.error('Error processing email:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

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

function formatSMS(from: string, subject: string, body: string, shortUrl: string): string {
  const baseUrl = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'https://emailtotextnotify.com'
  const fullUrl = `${baseUrl}/e/${shortUrl}`
  
  // Extract sender name or email
  const senderMatch = from.match(/^"?([^"<]+)"?\s*<(.+)>$/)
  const senderName = senderMatch ? senderMatch[1].trim() : from.split('@')[0]
  
  // Clean and truncate body
  const cleanBody = body.replace(/\s+/g, ' ').trim()
  
  // Build SMS with 140 char limit
  let sms = `From: ${senderName}\n${subject}\n`
  const remaining = 140 - sms.length - fullUrl.length - 3 // 3 for "\n\n"
  
  if (cleanBody.length > remaining) {
    sms += cleanBody.substring(0, remaining - 3) + '...'
  } else {
    sms += cleanBody
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

async function sendQuotaExceededSMS(phone: string, planType: string) {
  const twilioClient = twilio.default(
    Deno.env.get('TWILIO_ACCOUNT_SID')!,
    Deno.env.get('TWILIO_AUTH_TOKEN')!
  )
  
  const message = `Email to Text Notifier: You've reached your monthly limit for the ${planType} plan. Upgrade at emailtotextnotify.com/dashboard`
  
  await twilioClient.messages.create({
    body: message,
    to: phone,
    from: Deno.env.get('TWILIO_PHONE_NUMBER')!
  })
}
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
      // Handle quota exceeded (existing logic remains the same)
      // ... (quota handling code)
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

    // Format SMS message with attachment count
    const smsBody = formatSMS(
      sender, 
      subject || '(no subject)', 
      bodyPlain || stripHtml(bodyHtml || ''), 
      shortUrl,
      attachmentCount
    )

    // No time restrictions - always deliver immediately

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
    const newUsageCount = user.usage_count + 1
    await supabase
      .from('users')
      .update({ usage_count: newUsageCount })
      .eq('id', user.id)
      
    // Check usage alerts (existing logic)
    // ... (usage alert code)

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
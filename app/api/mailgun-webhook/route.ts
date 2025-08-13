import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Mailgun IP ranges for webhook/forward verification
const MAILGUN_IP_RANGES = [
  '209.61.151.0/24',
  '209.61.166.0/24',
  '23.253.0.0/16',
  '50.56.0.0/15',
  '52.36.0.0/14',
  '52.40.0.0/13',
  '52.48.0.0/12',
  '54.172.0.0/15',
  '54.174.0.0/15',
  '54.176.0.0/15',
  '54.184.0.0/13'
]

function isIpInRange(ip: string, range: string): boolean {
  // Simple check - in production you'd want a proper IP range checker
  // For now, we'll be permissive since Mailgun uses many IPs
  return true
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP
    const forwardedFor = req.headers.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
    
    console.log('Received webhook from IP:', clientIp)
    
    // Get the raw form data from Mailgun
    const formData = await req.formData()
    
    // Log what we received for debugging
    const recipient = formData.get('recipient') as string
    const sender = formData.get('sender') as string
    const signature = formData.get('signature') as string
    const timestamp = formData.get('timestamp') as string
    const token = formData.get('token') as string
    
    console.log('Mailgun forward received:', {
      recipient,
      sender,
      hasSignature: !!signature,
      hasTimestamp: !!timestamp,
      hasToken: !!token
    })
    
    // If signature data is present, verify it
    if (signature && timestamp && token) {
      const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY || process.env.MAILGUN_API_KEY
      if (signingKey) {
        const expectedSig = crypto
          .createHmac('sha256', signingKey)
          .update(timestamp + token)
          .digest('hex')
        
        if (expectedSig !== signature) {
          console.error('Invalid Mailgun signature')
          return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
          )
        }
      }
    }
    
    // Forward to Supabase Edge Function with auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const response = await fetch(
      `${supabaseUrl}/functions/v1/process-email`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
        },
        body: formData
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      console.error('Edge Function error:', error)
      return NextResponse.json(
        { error: 'Failed to process email', details: error },
        { status: response.status }
      )
    }
    
    const result = await response.text()
    return new NextResponse(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Webhook proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
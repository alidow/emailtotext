import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"
import twilio from "twilio"

export const dynamic = 'force-dynamic'

// Verify webhook signature from Twilio
async function verifyTwilioSignature(req: NextRequest): Promise<boolean> {
  const headersList = headers()
  const twilioSignature = headersList.get('x-twilio-signature')
  
  if (!twilioSignature) return false
  
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken) return false
  
  // Get the full URL
  const url = `${process.env.NEXT_PUBLIC_APP_URL}${req.nextUrl.pathname}`
  
  // Get form data as object
  const formData = await req.formData()
  const params: Record<string, string> = {}
  formData.forEach((value, key) => {
    params[key] = value.toString()
  })
  
  // Verify signature
  return twilio.validateRequest(
    authToken,
    twilioSignature,
    url,
    params
  )
}

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const isValid = await verifyTwilioSignature(req)
    if (!isValid) {
      console.error("Invalid Twilio webhook signature")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Parse webhook data
    const formData = await req.formData()
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })
    
    console.log("Twilio webhook received:", data)
    
    // Handle different types of webhooks
    if (data.SmsStatus) {
      // Delivery status webhook
      await handleDeliveryStatus(data)
    } else if (data.Body) {
      // Incoming message webhook (STOP, HELP, etc.)
      await handleIncomingMessage(data)
    }
    
    // Twilio expects a 200 OK with empty body or TwiML
    return new NextResponse('', { status: 200 })
    
  } catch (error) {
    console.error("Twilio webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleDeliveryStatus(data: Record<string, string>) {
  const { MessageSid, SmsStatus, To, ErrorCode, ErrorMessage } = data
  
  console.log(`SMS delivery status: ${MessageSid} - ${SmsStatus}`)
  
  // Update message status in database
  const { error } = await supabaseAdmin
    .from('sms_logs')
    .update({
      status: SmsStatus,
      error_message: ErrorCode ? `${ErrorCode}: ${ErrorMessage}` : null,
      delivered_at: SmsStatus === 'delivered' ? new Date().toISOString() : null
    })
    .eq('twilio_sid', MessageSid)
  
  if (error) {
    console.error("Error updating message status:", error)
  }
}

async function handleIncomingMessage(data: Record<string, string>) {
  const { From, Body, MessageSid } = data
  const cleanPhone = From.replace(/^\+1/, '') // Remove +1 prefix
  const messageBody = Body.trim().toUpperCase()
  
  console.log(`Incoming SMS from ${From}: ${Body}`)
  
  // Find user by phone number
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('phone', cleanPhone)
    .single() as { data: { id: string; phone: string; sms_opted_out?: boolean } | null; error: any }
  
  if (!user) {
    console.log(`No user found for phone: ${cleanPhone}`)
    return
  }
  
  // Handle STOP command
  if (messageBody === 'STOP' || messageBody === 'UNSUBSCRIBE' || messageBody === 'CANCEL') {
    // Mark user as opted out
    await supabaseAdmin
      .from('users')
      .update({ 
        sms_opted_out: true,
        sms_opted_out_at: new Date().toISOString()
      })
      .eq('id', user.id)
    
    console.log(`User ${user.id} opted out via SMS`)
    
    // Log the opt-out event
    await supabaseAdmin
      .from('sms_events')
      .insert({
        user_id: user.id,
        event_type: 'opt_out',
        phone: cleanPhone,
        message_body: Body,
        twilio_message_sid: MessageSid
      })
  }
  
  // Handle START command (re-opt in)
  else if (messageBody === 'START' || messageBody === 'SUBSCRIBE') {
    // Re-enable SMS
    await supabaseAdmin
      .from('users')
      .update({ 
        sms_opted_out: false,
        sms_opted_out_at: null
      })
      .eq('id', user.id)
    
    console.log(`User ${user.id} re-opted in via SMS`)
    
    // Log the opt-in event
    await supabaseAdmin
      .from('sms_events')
      .insert({
        user_id: user.id,
        event_type: 'opt_in',
        phone: cleanPhone,
        message_body: Body,
        twilio_message_sid: MessageSid
      })
  }
  
  // Handle HELP command
  else if (messageBody === 'HELP' || messageBody === 'INFO') {
    // Log help request
    await supabaseAdmin
      .from('sms_events')
      .insert({
        user_id: user.id,
        event_type: 'help_request',
        phone: cleanPhone,
        message_body: Body,
        twilio_message_sid: MessageSid
      })
    
    // Note: Twilio automatically sends help message based on your campaign settings
  }
  
  // Log any other incoming messages
  else {
    await supabaseAdmin
      .from('sms_events')
      .insert({
        user_id: user.id,
        event_type: 'incoming_message',
        phone: cleanPhone,
        message_body: Body,
        twilio_message_sid: MessageSid
      })
  }
}
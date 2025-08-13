import { NextResponse } from "next/server"

export async function GET() {
  // Only show in development or for debugging
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER
  const twilioNumberLength = twilioNumber?.length
  const twilioNumberChars = twilioNumber?.split('').map((char, i) => `[${i}]: '${char}' (${char.charCodeAt(0)})`).join(', ')
  
  return NextResponse.json({
    TWILIO_PHONE_NUMBER: twilioNumber,
    TWILIO_PHONE_NUMBER_LENGTH: twilioNumberLength,
    TWILIO_PHONE_NUMBER_CHARS: twilioNumberChars,
    TWILIO_CONFIGURED: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
    SMS_PROVIDER: process.env.SMS_PROVIDER,
    INFOBIP_SENDER: process.env.INFOBIP_SENDER_NAME,
    NODE_ENV: process.env.NODE_ENV
  })
}
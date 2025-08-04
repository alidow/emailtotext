import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/mailgun"

export async function GET() {
  try {
    // Test sending an email
    const result = await sendEmail({
      to: "test@example.com", // TODO: Change this to your email for testing
      subject: "Test Email from Email to Text Notifier",
      text: "This is a test email to verify Mailgun is working correctly.",
      html: "<p>This is a test email to verify <strong>Mailgun</strong> is working correctly.</p>"
    })
    
    return NextResponse.json({ 
      message: "Email send attempted",
      result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json({ 
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
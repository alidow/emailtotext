import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sendEmail } from "@/lib/mailgun"

// Admin emails allowed to use test endpoint
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean)

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const userEmail = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json()).then(data => data.email_addresses?.[0]?.email_address)

    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return NextResponse.json({ error: "Forbidden - Admin access only" }, { status: 403 })
    }

    // Test sending an email
    const result = await sendEmail({
      to: userEmail, // Send to admin's own email
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
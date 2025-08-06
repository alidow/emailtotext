import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/mailgun"
import { rateLimiters, getClientIp } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    // Rate limit contact form submissions
    const ip = getClientIp(req)
    const { success } = await rateLimiters.contactForm.limit(ip)
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const { name, email, subject, message } = await req.json()

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Send email to support
    const result = await sendEmail({
      to: "support@emailtotextnotify.com",
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email
    })

    if (!result.success) {
      console.error("Failed to send contact email:", result.error)
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      )
    }

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: "We received your message",
      text: `Hi ${name},\n\nThank you for contacting Email to Text Notifier. We've received your message and will get back to you within 24 hours.\n\nBest regards,\nEmail to Text Notifier Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for contacting us!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Your message:</h4>
            <p><strong>Subject:</strong> ${subject}</p>
            <p>${message}</p>
          </div>
          <p>Best regards,<br>Email to Text Notifier Team</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
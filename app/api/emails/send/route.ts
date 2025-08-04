import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { sendEmail } from '@/lib/mailgun'
import { emailTemplates } from '@/lib/email-templates'
import * as Sentry from "@sentry/nextjs"

export async function POST(request: NextRequest) {
  try {
    // This endpoint should only be called by internal services
    // For production, you might want to add API key authentication
    const { userId } = await auth()
    
    const body = await request.json()
    const { 
      to, 
      template, 
      data,
      subject: customSubject,
      text: customText,
      html: customHtml
    } = body

    // If custom content is provided, use it
    if (customSubject && customText && customHtml) {
      const result = await sendEmail({
        to,
        subject: customSubject,
        text: customText,
        html: customHtml
      })
      
      return NextResponse.json(result)
    }

    // Otherwise, use a template
    if (!template || !emailTemplates[template as keyof typeof emailTemplates]) {
      return NextResponse.json(
        { error: 'Invalid template specified' },
        { status: 400 }
      )
    }

    // Generate email from template
    const templateFn = emailTemplates[template as keyof typeof emailTemplates] as Function
    const emailContent = templateFn(...(data || []))

    const result = await sendEmail({
      to,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html
    })

    if (!result.success) {
      Sentry.captureException(new Error(`Failed to send email: ${result.error}`), {
        extra: { to, template, error: result.error }
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    Sentry.captureException(error)
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// Helper function to send emails from server-side code
export async function sendTransactionalEmail(
  to: string,
  template: keyof typeof emailTemplates,
  data?: any[]
) {
  try {
    const templateFn = emailTemplates[template] as Function
    const emailContent = templateFn(...(data || []))

    return await sendEmail({
      to,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html
    })
  } catch (error) {
    Sentry.captureException(error, {
      extra: { to, template }
    })
    console.error('Failed to send transactional email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
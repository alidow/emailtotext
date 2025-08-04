import { sendEmail } from './mailgun'
import { emailTemplates } from './email-templates'
import * as Sentry from "@sentry/nextjs"

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
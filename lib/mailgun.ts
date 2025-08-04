import FormData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(FormData)

// Initialize Mailgun client
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
  url: 'https://api.mailgun.net' // or 'https://api.eu.mailgun.net' for EU
})

export async function sendEmail({
  to,
  subject,
  text,
  html,
  from = 'Email to Text Notifier <noreply@emailtotextnotify.com>',
  replyTo = 'support@emailtotextnotify.com'
}: {
  to: string
  subject: string
  text: string
  html: string
  from?: string
  replyTo?: string
}) {
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN || 'emailtotextnotify.com', {
      from,
      to: [to],
      subject,
      text,
      html,
      'h:Reply-To': replyTo,
    })
    
    return { success: true, id: result.id }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
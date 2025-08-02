import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Email templates
const emailTemplates = {
  auto_upgrade: {
    subject: "Your Email to Text Notifier plan has been upgraded",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Plan Upgrade Notification</h2>
        <p>Hello,</p>
        <p>You've exceeded your free plan limit of 10 messages this month. As per our terms of service, we've automatically upgraded your account to the Basic plan.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What this means:</h3>
          <ul>
            <li>Your new plan: <strong>Basic ($4.99/month)</strong></li>
            <li>You now have: <strong>100 messages per month</strong></li>
            <li>Extended message history: <strong>30 days</strong></li>
            <li>Priority support</li>
          </ul>
        </div>
        
        <p>Your card will be charged $4.99 within the next 24 hours. This will then recur monthly on the same date.</p>
        
        <h3>Want to change your plan?</h3>
        <p>You can upgrade to a higher plan or cancel at any time from your <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings">account settings</a>.</p>
        
        <p>If you have any questions, please don't hesitate to <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">contact us</a>.</p>
        
        <p>Thank you for using Email to Text Notifier!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          Email to Text Notifier by Celestial Platform, LLC<br>
          This is an automated message regarding your account.<br>
          To manage email preferences, visit your account settings.
        </p>
      </div>
    `
  },
  
  auto_buy_notification: {
    subject: "Additional text messages purchased",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Additional Texts Purchased</h2>
        <p>Hello,</p>
        <p>You've exceeded your monthly text message quota. We've automatically purchased additional messages for you.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Purchase Details:</h3>
          <ul>
            <li>Additional texts purchased: <strong>${data.texts_purchased}</strong></li>
            <li>Cost: <strong>$${data.amount}</strong></li>
            <li>New total available: <strong>${data.new_limit || 'Updated quota'}</strong></li>
          </ul>
        </div>
        
        <p>This charge will appear on your next invoice. The additional texts are available immediately.</p>
        
        <p>To avoid automatic purchases in the future, consider <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings">upgrading your plan</a>.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          Email to Text Notifier<br>
          Manage your billing settings at ${process.env.NEXT_PUBLIC_APP_URL}/settings
        </p>
      </div>
    `
  },
  
  payment_failed_first_attempt: {
    subject: "Payment failed - We'll retry in 3 days",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Payment Failed</h2>
        <p>Hello,</p>
        <p>We were unable to process your payment for Email to Text Notifier. This can happen for various reasons including insufficient funds or an expired card.</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
          <strong>What happens next:</strong>
          <ul style="margin-top: 10px;">
            <li>We'll automatically retry your payment in 3 days</li>
            <li>Your service continues uninterrupted during this time</li>
            <li>You can update your payment method anytime</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.updatePaymentUrl || process.env.NEXT_PUBLIC_APP_URL + '/settings'}" 
             style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Update Payment Method
          </a>
        </div>
        
        <p>If you have any questions, please contact our support team.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          Email to Text Notifier<br>
          This is an automated billing notification.
        </p>
      </div>
    `
  },
  
  payment_failed_second_attempt: {
    subject: "Urgent: Second payment attempt failed",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Urgent: Second Payment Attempt Failed</h2>
        <p>Hello,</p>
        <p>Our second attempt to process your payment has failed. To avoid service interruption, please update your payment method as soon as possible.</p>
        
        <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffcdd2;">
          <strong style="color: #d32f2f;">Important:</strong>
          <ul style="margin-top: 10px;">
            <li>We'll make one final attempt in 3 days</li>
            <li>If the final attempt fails, your service will be suspended</li>
            <li>Update your payment method now to avoid interruption</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.updatePaymentUrl || process.env.NEXT_PUBLIC_APP_URL + '/settings'}" 
             style="background-color: #d32f2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Update Payment Method Now
          </a>
        </div>
        
        <p>Need help? Contact our support team at ${data.supportEmail || 'support@emailtotextnotify.com'}</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          Email to Text Notifier<br>
          This is an urgent billing notification.
        </p>
      </div>
    `
  },
  
  service_suspended: {
    subject: "Service suspended due to payment failure",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Service Suspended</h2>
        <p>Hello,</p>
        <p>After multiple failed payment attempts, we've had to suspend your Email to Text Notifier service.</p>
        
        <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffcdd2;">
          <strong>What this means:</strong>
          <ul style="margin-top: 10px;">
            <li>Emails sent to your forwarding address will not be delivered as texts</li>
            <li>Your email address and data remain saved</li>
            <li>Service will resume immediately once payment is successful</li>
          </ul>
        </div>
        
        <h3>How to reactivate your service:</h3>
        <ol>
          <li>Update your payment method</li>
          <li>We'll automatically retry the payment</li>
          <li>Your service will resume immediately</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.reactivateUrl || process.env.NEXT_PUBLIC_APP_URL + '/settings'}" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reactivate Service
          </a>
        </div>
        
        <p>If you need assistance, please contact our support team.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          Email to Text Notifier<br>
          Your service is currently suspended.
        </p>
      </div>
    `
  },
  
  service_reactivated: {
    subject: "Your service has been reactivated!",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Service Reactivated!</h2>
        <p>Hello,</p>
        <p>Great news! Your payment has been processed successfully and your Email to Text Notifier service is now active again.</p>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c8e6c9;">
          <strong>Service Details:</strong>
          <ul style="margin-top: 10px;">
            <li>Plan: <strong>${data.planName}</strong></li>
            <li>Next billing date: <strong>${new Date(data.nextBillingDate).toLocaleDateString()}</strong></li>
            <li>Monthly quota reset: <strong>Complete</strong></li>
          </ul>
        </div>
        
        <p>Your email forwarding address is working again and any emails sent to it will be delivered as texts.</p>
        
        <p>Thank you for your continued support!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          Email to Text Notifier<br>
          Your service is active.
        </p>
      </div>
    `
  },
  
  subscription_cancelled: {
    subject: "Your subscription has been cancelled",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Subscription Cancelled</h2>
        <p>Hello,</p>
        <p>Your Email to Text Notifier subscription has been cancelled as requested.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <strong>What happens next:</strong>
          <ul style="margin-top: 10px;">
            <li>You've been downgraded to the Free plan (10 texts/month)</li>
            <li>Your email forwarding address remains active</li>
            <li>Message history will be limited to 7 days</li>
            <li>You can upgrade again anytime</li>
          </ul>
        </div>
        
        <p>We're sorry to see you go! If there's anything we could have done better, please let us know.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Dashboard
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          Email to Text Notifier<br>
          You can reactivate your subscription anytime.
        </p>
      </div>
    `
  },
  
  plan_changed: {
    subject: "Your plan has been changed",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Plan Change Confirmation</h2>
        <p>Hello,</p>
        <p>Your Email to Text Notifier plan has been successfully changed.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Plan Details:</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 5px 0;"><strong>Previous Plan:</strong></td>
              <td>${data.fromPlan} (${data.fromBillingCycle || 'monthly'})</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>New Plan:</strong></td>
              <td>${data.toPlan} (${data.toBillingCycle || 'monthly'})</td>
            </tr>
            ${data.immediateCharge ? `
            <tr>
              <td style="padding: 5px 0;"><strong>Prorated charge:</strong></td>
              <td>$${data.immediateCharge}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <p>The change has been applied immediately to your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Dashboard
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          Email to Text Notifier<br>
          Manage your account at ${process.env.NEXT_PUBLIC_APP_URL}/settings
        </p>
      </div>
    `
  }
}

export async function POST(req: NextRequest) {
  try {
    const { to, template, subject: customSubject, data } = await req.json()
    
    const emailTemplate = emailTemplates[template as keyof typeof emailTemplates]
    if (!emailTemplate) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 })
    }
    
    const subject = customSubject || emailTemplate.subject
    const html = emailTemplate.html(data || {})
    
    // In production, this would send via SendGrid/Mailgun
    // For now, we'll log it and return success
    console.log("Sending email:", {
      to,
      subject,
      template,
      data
    })
    
    // Log email event
    if (data?.userId) {
      await supabaseAdmin
        .from("usage_logs")
        .insert({
          user_id: data.userId,
          event_type: `email_sent_${template}`,
          details: {
            to,
            template,
            subject
          }
        })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Email sent successfully" 
    })
    
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ 
      error: "Failed to send email" 
    }, { status: 500 })
  }
}
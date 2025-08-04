interface EmailTemplate {
  subject: string
  text: string
  html: string
}

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 30px; }
  .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
  .content { padding: 20px 0; }
  .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
  .plan-details { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
  .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 15px 0; }
  .success { background-color: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 15px 0; }
`

function createHtmlEmail(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">💬 Email to Text Notifier</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Email to Text Notifier by Celestial Platform, LLC</p>
      <p>
        <a href="https://emailtotextnotify.com/dashboard" style="color: #2563eb;">Dashboard</a> • 
        <a href="https://emailtotextnotify.com/settings" style="color: #2563eb;">Settings</a> • 
        <a href="https://emailtotextnotify.com/contact" style="color: #2563eb;">Support</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af;">
        You're receiving this email because you have an account with Email to Text Notifier.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

export const emailTemplates = {
  welcome: (userPhone: string): EmailTemplate => ({
    subject: 'Welcome to Email to Text Notifier! 🎉',
    text: `Welcome to Email to Text Notifier!

Your phone number ${userPhone} has been verified successfully.

Your unique email address is: ${userPhone}@txt.emailtotextnotify.com

You can now start forwarding emails to this address and receive them as SMS messages!

Getting Started:
1. Send a test email to ${userPhone}@txt.emailtotextnotify.com
2. You'll receive it as an SMS within seconds
3. Visit your dashboard to track usage and manage settings

You're on the Free plan with 10 texts per month. Upgrade anytime for more messages.

Need help? Reply to this email or visit https://emailtotextnotify.com/contact

Best regards,
The Email to Text Notifier Team`,
    html: createHtmlEmail(`
      <h1>Welcome to Email to Text Notifier! 🎉</h1>
      <p>Your phone number <strong>${userPhone}</strong> has been verified successfully.</p>
      
      <div class="success">
        <p><strong>Your unique email address:</strong><br/>
        <span style="font-size: 18px; font-family: monospace;">${userPhone}@txt.emailtotextnotify.com</span></p>
      </div>
      
      <p>You can now start forwarding emails to this address and receive them as SMS messages!</p>
      
      <h2>Getting Started</h2>
      <ol>
        <li>Send a test email to <strong>${userPhone}@txt.emailtotextnotify.com</strong></li>
        <li>You'll receive it as an SMS within seconds</li>
        <li>Visit your dashboard to track usage and manage settings</li>
      </ol>
      
      <p>You're on the <strong>Free plan</strong> with 10 texts per month. Upgrade anytime for more messages.</p>
      
      <a href="https://emailtotextnotify.com/dashboard" class="button">Go to Dashboard</a>
      
      <p>Need help? Reply to this email or visit our <a href="https://emailtotextnotify.com/contact">support page</a>.</p>
    `)
  }),

  subscriptionConfirmed: (plan: string, monthlyLimit: number, isAnnual: boolean): EmailTemplate => ({
    subject: `Subscription Confirmed: ${plan} Plan`,
    text: `Your subscription to the ${plan} plan has been confirmed!

Plan Details:
- Plan: ${plan}
- Billing: ${isAnnual ? 'Annual' : 'Monthly'}
- Monthly SMS Limit: ${monthlyLimit}
- Auto-buy: ${plan === 'Free' ? 'Auto-upgrade to Basic when exceeded' : '100 additional texts at your plan rate + 10%'}

You can manage your subscription anytime from your dashboard.

Thank you for choosing Email to Text Notifier!`,
    html: createHtmlEmail(`
      <h1>Subscription Confirmed! ✅</h1>
      <p>Your subscription to the <strong>${plan} plan</strong> has been confirmed.</p>
      
      <div class="plan-details">
        <h3>Plan Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li>📱 <strong>Plan:</strong> ${plan}</li>
          <li>💳 <strong>Billing:</strong> ${isAnnual ? 'Annual' : 'Monthly'}</li>
          <li>📨 <strong>Monthly SMS Limit:</strong> ${monthlyLimit}</li>
          <li>🔄 <strong>Auto-buy:</strong> ${plan === 'Free' ? 'Auto-upgrade to Basic when exceeded' : '100 additional texts at your plan rate + 10%'}</li>
        </ul>
      </div>
      
      <p>You can manage your subscription anytime from your dashboard.</p>
      
      <a href="https://emailtotextnotify.com/dashboard" class="button">View Dashboard</a>
      
      <p>Thank you for choosing Email to Text Notifier!</p>
    `)
  }),

  planUpgraded: (oldPlan: string, newPlan: string, newLimit: number): EmailTemplate => ({
    subject: `Plan Upgraded to ${newPlan}`,
    text: `Great news! Your plan has been upgraded from ${oldPlan} to ${newPlan}.

New Plan Benefits:
- Monthly SMS Limit: ${newLimit} (previously ${oldPlan === 'Free' ? '10' : oldPlan === 'Basic' ? '100' : '500'})
- Better per-message rate
- All premium features included

Your new plan is effective immediately. Any unused messages from your previous plan have been carried over.

View your updated plan details in your dashboard.`,
    html: createHtmlEmail(`
      <h1>Plan Upgraded Successfully! 🚀</h1>
      <p>Great news! Your plan has been upgraded from <strong>${oldPlan}</strong> to <strong>${newPlan}</strong>.</p>
      
      <div class="success">
        <h3>New Plan Benefits</h3>
        <ul>
          <li>Monthly SMS Limit: <strong>${newLimit}</strong> (previously ${oldPlan === 'Free' ? '10' : oldPlan === 'Basic' ? '100' : '500'})</li>
          <li>Better per-message rate</li>
          <li>All premium features included</li>
        </ul>
      </div>
      
      <p>Your new plan is effective immediately. Any unused messages from your previous plan have been carried over.</p>
      
      <a href="https://emailtotextnotify.com/dashboard" class="button">View Plan Details</a>
    `)
  }),

  autoUpgraded: (): EmailTemplate => ({
    subject: 'Account Auto-Upgraded to Basic Plan',
    text: `Your account has been automatically upgraded to the Basic plan.

This happened because you exceeded your Free plan limit of 10 texts this month. To ensure uninterrupted service, we've upgraded you to our Basic plan ($4.99/month).

What's included in Basic:
- 100 texts per month
- Lower per-text rate for overages
- Priority delivery
- 24/7 delivery option

You can change or cancel your plan anytime from your dashboard.

If you have any questions, please don't hesitate to contact us.`,
    html: createHtmlEmail(`
      <h1>Account Auto-Upgraded to Basic Plan</h1>
      
      <div class="warning">
        <p><strong>Why did this happen?</strong></p>
        <p>You exceeded your Free plan limit of 10 texts this month. To ensure uninterrupted service, we've automatically upgraded you to our Basic plan ($4.99/month).</p>
      </div>
      
      <div class="plan-details">
        <h3>What's included in Basic:</h3>
        <ul>
          <li>✅ 100 texts per month</li>
          <li>✅ Lower per-text rate for overages</li>
          <li>✅ Priority delivery</li>
          <li>✅ 24/7 delivery option</li>
        </ul>
      </div>
      
      <p>You can change or cancel your plan anytime from your dashboard.</p>
      
      <a href="https://emailtotextnotify.com/settings#billing" class="button">Manage Subscription</a>
      
      <p>If you have any questions, please don't hesitate to <a href="https://emailtotextnotify.com/contact">contact us</a>.</p>
    `)
  }),

  quotaOverage: (additionalTexts: number, cost: string): EmailTemplate => ({
    subject: 'Additional Texts Purchased',
    text: `You've exceeded your monthly SMS quota and we've automatically purchased ${additionalTexts} additional texts for $${cost}.

This charge will appear on your next billing statement. These additional texts are available for use immediately and don't expire.

To avoid overages, consider upgrading to a higher plan with more included texts.

View your current usage and upgrade options in your dashboard.`,
    html: createHtmlEmail(`
      <h1>Additional Texts Purchased</h1>
      
      <div class="warning">
        <p>You've exceeded your monthly SMS quota. We've automatically purchased <strong>${additionalTexts} additional texts</strong> for <strong>$${cost}</strong>.</p>
      </div>
      
      <p>This charge will appear on your next billing statement. These additional texts are available for use immediately and don't expire.</p>
      
      <p><strong>Tip:</strong> To avoid overages, consider upgrading to a higher plan with more included texts.</p>
      
      <a href="https://emailtotextnotify.com/dashboard" class="button">View Usage & Upgrade</a>
    `)
  }),

  paymentFailed: (): EmailTemplate => ({
    subject: 'Payment Failed - Action Required',
    text: `We were unable to process your payment for Email to Text Notifier.

Please update your payment method within 7 days to avoid service interruption. 

You can update your payment information in your account settings.

If you're experiencing issues or have questions, please contact our support team.`,
    html: createHtmlEmail(`
      <h1>Payment Failed - Action Required</h1>
      
      <div class="warning">
        <p><strong>We were unable to process your payment.</strong></p>
        <p>Please update your payment method within 7 days to avoid service interruption.</p>
      </div>
      
      <p>You can update your payment information in your account settings.</p>
      
      <a href="https://emailtotextnotify.com/settings#billing" class="button">Update Payment Method</a>
      
      <p>If you're experiencing issues or have questions, please <a href="https://emailtotextnotify.com/contact">contact our support team</a>.</p>
    `)
  }),

  paymentMethodUpdated: (): EmailTemplate => ({
    subject: 'Payment Method Updated Successfully',
    text: `Your payment method has been updated successfully.

Your subscription will continue without interruption using your new payment method.

Thank you for keeping your account up to date!`,
    html: createHtmlEmail(`
      <h1>Payment Method Updated ✅</h1>
      
      <p>Your payment method has been updated successfully.</p>
      
      <div class="success">
        <p>Your subscription will continue without interruption using your new payment method.</p>
      </div>
      
      <p>Thank you for keeping your account up to date!</p>
      
      <a href="https://emailtotextnotify.com/dashboard" class="button">Go to Dashboard</a>
    `)
  }),

  usageAlert: (percentage: number, used: number, limit: number): EmailTemplate => ({
    subject: `Usage Alert: ${percentage}% of Monthly SMS Used`,
    text: `You've used ${used} of your ${limit} monthly SMS messages (${percentage}%).

At your current usage rate, you may exceed your monthly limit. When that happens:
${limit === 10 
  ? '- Your account will auto-upgrade to the Basic plan ($4.99/month)' 
  : '- We\'ll automatically purchase 100 additional texts at your plan rate + 10%'}

To avoid overages, consider upgrading to a higher plan now.

View your detailed usage in your dashboard.`,
    html: createHtmlEmail(`
      <h1>Usage Alert: ${percentage}% Used</h1>
      
      <div class="warning">
        <p>You've used <strong>${used} of your ${limit}</strong> monthly SMS messages (${percentage}%).</p>
      </div>
      
      <p>At your current usage rate, you may exceed your monthly limit. When that happens:</p>
      <ul>
        <li>${limit === 10 
          ? 'Your account will auto-upgrade to the Basic plan ($4.99/month)' 
          : 'We\'ll automatically purchase 100 additional texts at your plan rate + 10%'}</li>
      </ul>
      
      <p>To avoid overages, consider upgrading to a higher plan now.</p>
      
      <a href="https://emailtotextnotify.com/dashboard" class="button">View Usage & Upgrade</a>
    `)
  })
}
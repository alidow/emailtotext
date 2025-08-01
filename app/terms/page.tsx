export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: January 1, 2025</p>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By using Email to Text Notifier, you agree to these Terms of Service. If you do not agree, please do not use our service.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">2. Service Description</h2>
          <p>Email to Text Notifier provides email-to-SMS forwarding services. We assign you a unique email address that forwards incoming emails to your verified phone number as text messages.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">3. Account Registration</h2>
          <ul>
            <li>You must provide a valid phone number</li>
            <li>You must verify ownership of the phone number via SMS</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>One account per phone number</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">4. Usage Limits and Billing</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">Free Plan</h3>
          <ul>
            <li>10 SMS messages per month</li>
            <li>7-day message history</li>
            <li>Automatic upgrade to Basic plan upon exceeding limits</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Paid Plans</h3>
          <ul>
            <li>Basic: $4.99/month for 100 messages</li>
            <li>Pro: $9.99/month for 500 messages</li>
            <li>Unused messages do not roll over</li>
            <li>Billing occurs monthly on the same date</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Automatic Upgrade Policy</h3>
          <p>If you exceed your free plan limit, you will be automatically upgraded to the Basic plan. We will:</p>
          <ul>
            <li>Send an email notification before charging your card</li>
            <li>Charge the provided credit card $4.99/month</li>
            <li>Allow you to downgrade or cancel at any time</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">5. Acceptable Use Policy</h2>
          <p>You agree NOT to use our service to:</p>
          <ul>
            <li>Send spam, phishing, or fraudulent messages</li>
            <li>Violate any laws or regulations</li>
            <li>Harass or harm others</li>
            <li>Transmit malware or harmful code</li>
            <li>Exceed reasonable usage that impacts service quality</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">6. SMS Messaging Terms</h2>
          <ul>
            <li>Standard message and data rates may apply</li>
            <li>Message frequency varies based on emails received</li>
            <li>Reply STOP to opt out of all messages</li>
            <li>Reply HELP for support</li>
            <li>We are not responsible for delayed or undelivered messages</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">7. Limitations of Liability</h2>
          <p>Email to Text Notifier is provided "as is" without warranties. We are not liable for:</p>
          <ul>
            <li>Service interruptions or downtime</li>
            <li>Lost or delayed messages</li>
            <li>Unauthorized access to your account</li>
            <li>Content of forwarded messages</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">8. Termination</h2>
          <p>We may terminate or suspend your account for violations of these terms. You may cancel your account at any time from your account settings.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">9. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">10. Contact Information</h2>
          <p>For questions about these terms, contact us at support@emailtotextnotify.com</p>
        </div>
      </div>
    </div>
  )
}
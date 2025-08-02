export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: January 1, 2025</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 font-medium">
            Email to Text Notifier is a service operated by Celestial Platform, LLC.
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Information We Collect</h2>
          <p>Celestial Platform, LLC collects the following information when you use Email to Text Notifier:</p>
          <ul>
            <li>Phone number (for SMS delivery)</li>
            <li>Email address (optional, for account recovery)</li>
            <li>Email content that you forward to our service</li>
            <li>Usage data (number of messages sent, timestamps)</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>Celestial Platform, LLC uses your information solely to provide the email-to-SMS forwarding service:</p>
          <ul>
            <li>To deliver SMS messages to your verified phone number</li>
            <li>To maintain your message history (based on your plan)</li>
            <li>To enforce usage limits and prevent abuse</li>
            <li>To send service-related notifications</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Data Storage and Security</h2>
          <p>Celestial Platform, LLC takes your privacy seriously:</p>
          <ul>
            <li>All data is encrypted in transit and at rest</li>
            <li>Messages are automatically deleted after your plan's retention period</li>
            <li>We use industry-standard security measures to protect your data</li>
            <li>Celestial Platform, LLC never sells or shares your personal information with third parties</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">TCPA Compliance</h2>
          <p>By using our service, you confirm that:</p>
          <ul>
            <li>You own or have permission to use the phone number provided</li>
            <li>You consent to receive SMS messages at this number</li>
            <li>You understand message and data rates may apply</li>
            <li>You can opt out at any time by replying STOP to any message</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of SMS messages at any time</li>
            <li>Update your account information</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Contact Us</h2>
          <p>If you have questions about this privacy policy, please contact Celestial Platform, LLC at privacy@emailtotextnotify.com</p>
        </div>
      </div>
    </div>
  )
}
export default function SecurityBestPractices() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Email to SMS Security Best Practices</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8">
            Learn how to keep your forwarded messages secure and protect sensitive information when using 
            email-to-text forwarding services.
          </p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Understanding the Risks</h2>
          <p>
            When forwarding emails to SMS, it's important to understand the security implications:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>SMS messages are not end-to-end encrypted</li>
            <li>Messages may be stored on carrier servers</li>
            <li>Anyone with access to your phone can read messages</li>
            <li>SMS can be intercepted (though rare)</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">What NOT to Forward</h2>
          <p className="text-red-600 font-semibold">
            Never forward these types of sensitive information via email-to-SMS:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Passwords or authentication codes</li>
            <li>Credit card or banking information</li>
            <li>Social Security numbers</li>
            <li>Medical records or health information</li>
            <li>Confidential business data</li>
            <li>Personal identification information</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Safe Use Cases</h2>
          <p>
            Email-to-SMS is best used for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Server status alerts (up/down notifications)</li>
            <li>General appointment reminders</li>
            <li>Package delivery notifications</li>
            <li>Non-sensitive business alerts</li>
            <li>Weather or traffic alerts</li>
            <li>General notification that you have new email</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Security Features We Provide</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Message Encryption</h3>
          <p>
            While SMS itself isn't encrypted, we protect your data:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>All data is encrypted in transit to our servers</li>
            <li>Messages are encrypted at rest in our database</li>
            <li>We use TLS/SSL for all connections</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Automatic Message Expiration</h3>
          <p>
            Messages are automatically deleted based on your plan:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Free plan: Messages deleted after 7 days</li>
            <li>Basic plan: Messages deleted after 30 days</li>
            <li>Standard plan: Messages deleted after 90 days</li>
            <li>Premium plan: Unlimited message history</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Access Controls</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Phone number verification required</li>
            <li>Unique email addresses tied to verified numbers</li>
            <li>No access to messages without account login</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Best Practices for Users</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">1. Use Email Filters</h3>
          <p>
            Set up filters to only forward non-sensitive emails:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create a specific email account for alerts</li>
            <li>Use email rules to forward only from trusted senders</li>
            <li>Filter by subject keywords (e.g., "Alert", "Status")</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2. Secure Your Phone</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use a strong passcode or biometric lock</li>
            <li>Enable auto-lock with a short timeout</li>
            <li>Don't display message content on lock screen</li>
            <li>Regularly delete old SMS messages</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3. Monitor Your Usage</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Regularly check your message history</li>
            <li>Look for unexpected forwarded emails</li>
            <li>Monitor who knows your forwarding address</li>
            <li>Change your forwarding address if compromised</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Setting Up Secure Alerts</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Good Example: Server Alert</h3>
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <p className="font-mono text-sm">
              Subject: Server Status Alert<br/>
              Body: Web server is down. Status code: 503. Time: 3:45 PM
            </p>
          </div>
          <p className="text-green-600 mt-2">✓ Contains no sensitive data, just status information</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Bad Example: Password Reset</h3>
          <div className="bg-red-50 p-4 rounded border border-red-200">
            <p className="font-mono text-sm">
              Subject: Password Reset<br/>
              Body: Your new password is: Xk9$mP2@fQ1
            </p>
          </div>
          <p className="text-red-600 mt-2">✗ Never forward passwords or authentication details</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Privacy Considerations</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We don't read or analyze your message content</li>
            <li>Messages are only accessible by you</li>
            <li>We don't sell or share your data</li>
            <li>You can delete your account and all data anytime</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Compliance and Regulations</h2>
          <p>
            Our service is designed with privacy regulations in mind:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>TCPA Compliant:</strong> We require explicit consent for SMS delivery</li>
            <li><strong>Data Retention:</strong> Automatic deletion based on your plan</li>
            <li><strong>Opt-out:</strong> Reply STOP to any message to unsubscribe</li>
            <li><strong>Data Portability:</strong> Export your data anytime</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Questions or Concerns?</h2>
          <p>
            If you have security questions or need to report an issue, contact us immediately at 
            security@emailtotextnotify.com. We take all security concerns seriously and will respond 
            within 24 hours.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-3">Remember</h3>
            <p>
              Email to Text Notifier is designed for convenience, not security. For highly sensitive 
              information, use encrypted messaging apps or secure communication channels instead.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">About Email to Text Notifier</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8">
            Email to Text Notifier was created to solve a simple problem: how to stay connected to important emails when you're away from your computer.
          </p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Our Story</h2>
          <p>
            When AT&T discontinued their email-to-text gateway service, thousands of users were left without a reliable way to forward emails to their phones. We built Email to Text Notifier as a modern, secure replacement that works with all carriers and provides features that legacy services never offered.
          </p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">What Makes Us Different</h2>
          <ul>
            <li><strong>Universal Compatibility:</strong> Works with any phone number, any carrier</li>
            <li><strong>Instant Delivery:</strong> Messages delivered in under 3 seconds</li>
            <li><strong>Privacy First:</strong> Your data is encrypted and automatically deleted</li>
            <li><strong>Simple Pricing:</strong> Transparent plans with no hidden fees</li>
            <li><strong>Reliable Service:</strong> Built on modern infrastructure for maximum uptime</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Use Cases</h2>
          <p>Our service is perfect for:</p>
          <ul>
            <li>IT professionals monitoring server alerts</li>
            <li>Business owners tracking important client emails</li>
            <li>Anyone who needs instant notifications for critical emails</li>
            <li>Former AT&T email-to-text users looking for a replacement</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Our Commitment</h2>
          <p>
            We're committed to providing a reliable, affordable email-to-SMS service that respects your privacy and just works. No complicated setup, no confusing features - just simple, effective email forwarding to your phone.
          </p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            Have questions or feedback? We'd love to hear from you at support@emailtotextnotify.com
          </p>
        </div>
      </div>
    </div>
  )
}
export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Refund Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-lg mb-6">Email to Text Notifier is a service operated by Celestial Platform, LLC.</p>
          
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Our Commitment</h2>
          <p>At Celestial Platform, LLC, we want you to be completely satisfied with Email to Text Notifier. If you're not happy with our service, we'll work with you to make it right.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">30-Day Money-Back Guarantee</h2>
          <p>We offer a 30-day money-back guarantee for all new subscribers. If you're not satisfied with our service within the first 30 days of your initial subscription, contact us for a full refund of your first payment.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Refund Eligibility</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">You ARE eligible for a refund if:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>You request a refund within 30 days of your initial subscription</li>
            <li>The service is not working as described due to technical issues on our end</li>
            <li>You accidentally subscribed multiple times (we'll refund the duplicate charges)</li>
            <li>You were charged after canceling your subscription</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">You are NOT eligible for a refund if:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>You have used more than 50% of your monthly message quota</li>
            <li>You request a refund after the 30-day guarantee period</li>
            <li>Your account was suspended for violating our Terms of Service</li>
            <li>You have previously received a refund for this service</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Monthly Subscriptions</h2>
          <p>For ongoing monthly subscriptions beyond the initial 30-day period:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>No refunds are provided for partial months</li>
            <li>You can cancel anytime to prevent future charges</li>
            <li>Your service will continue until the end of your current billing period</li>
            <li>Unused messages do not roll over to the next month</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">How to Request a Refund</h2>
          <p>To request a refund, please:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Email us at support@emailtotextnotify.com</li>
            <li>Include your account email and reason for the refund request</li>
            <li>Provide your transaction ID if available</li>
          </ol>
          <p className="mt-4">We typically process refund requests within 3-5 business days. Refunds are issued to the original payment method and may take 5-10 business days to appear on your statement.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Cancellation Policy</h2>
          <p>You can cancel your subscription at any time through your dashboard:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Log in to your account</li>
            <li>Go to Settings</li>
            <li>Click "Manage Subscription"</li>
            <li>Select "Cancel Subscription"</li>
          </ul>
          <p className="mt-4">Upon cancellation, you'll retain access to the service until the end of your current billing period.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Free Tier</h2>
          <p>The free tier (10 messages per month) is provided at no cost and is not eligible for refunds. If you need more messages, you can upgrade to a paid plan at any time.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Disputes</h2>
          <p>If you have a billing dispute or believe you were incorrectly charged, please contact us immediately at support@emailtotextnotify.com. We'll investigate and resolve the issue promptly.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Changes to This Policy</h2>
          <p>We may update this refund policy from time to time. Changes will be posted on this page with an updated revision date. Your continued use of our service after any changes indicates your acceptance of the updated policy.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Contact Us</h2>
          <p>If you have questions about our refund policy or need assistance, please contact Celestial Platform, LLC:</p>
          <ul className="list-none space-y-1 mt-2">
            <li>Email: support@emailtotextnotify.com</li>
            <li>Web: <a href="/contact" className="text-blue-600 hover:underline">Contact Form</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
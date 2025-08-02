export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-lg mb-6">Email to Text Notifier is a service operated by Celestial Platform, LLC.</p>
          
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">What Are Cookies</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">How We Use Cookies</h2>
          <p>Celestial Platform, LLC uses cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website to improve our service</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Types of Cookies We Use</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">First-Party Cookies</h3>
          <p>These are cookies set by emailtotextnotify.com directly:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authentication Cookies:</strong> Keep you logged in securely (via Clerk)</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
            <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Cookies</h3>
          <p>We use services that may set their own cookies:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Clerk (Authentication):</strong> Manages secure user authentication</li>
            <li><strong>Stripe (Payments):</strong> Processes payments securely (only on payment pages)</li>
            <li><strong>Vercel Analytics:</strong> Helps us understand site performance and usage</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Managing Cookies</h2>
          <p>You can control and manage cookies in several ways:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Most browsers allow you to refuse or delete cookies through their settings</li>
            <li>You can set your browser to notify you when cookies are being set</li>
            <li>You can delete cookies that have already been set</li>
          </ul>
          
          <p className="mt-4"><strong>Note:</strong> Disabling essential cookies may prevent you from using certain features of our service, particularly those related to authentication and account management.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Cookie Settings by Browser</h2>
          <p>Here's how to manage cookies in popular browsers:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Updates to This Policy</h2>
          <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Contact Us</h2>
          <p>If you have questions about our Cookie Policy, please contact Celestial Platform, LLC at:</p>
          <ul className="list-none space-y-1 mt-2">
            <li>Email: privacy@emailtotextnotify.com</li>
            <li>Web: <a href="/contact" className="text-blue-600 hover:underline">Contact Form</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
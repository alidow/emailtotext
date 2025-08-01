export default function ATTAlternativePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">AT&T Email to Text Alternative</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8">
            AT&T discontinued their email-to-text gateway service, leaving many users searching for alternatives. 
            Email to Text Notifier is a modern, reliable replacement that works with all carriers.
          </p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">What Happened to AT&T's Service?</h2>
          <p>
            AT&T shut down their email-to-SMS gateway (previously at phonenumber@txt.att.net) as part of their 
            network modernization efforts. This left thousands of users without a way to forward emails to their phones.
          </p>
          <p>
            The service was particularly popular for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Server monitoring and alerts</li>
            <li>Business notifications</li>
            <li>Home automation systems</li>
            <li>Security camera alerts</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Why Email to Text Notifier is Better</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Works with All Carriers</h3>
          <p>
            Unlike AT&T's service which only worked for AT&T customers, Email to Text Notifier works with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>AT&T</li>
            <li>Verizon</li>
            <li>T-Mobile</li>
            <li>Sprint</li>
            <li>Any other US carrier</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">More Features</h3>
          <p>
            AT&T's service was basic - just email forwarding. We offer:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Message history and search</li>
            <li>Usage tracking</li>
            <li>Delivery confirmations</li>
            <li>Web dashboard</li>
            <li>Multiple pricing tiers</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Better Reliability</h3>
          <p>
            Built on modern cloud infrastructure with 99.9% uptime, compared to AT&T's aging system that 
            frequently experienced delays and outages.
          </p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">How to Switch from AT&T</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Step 1: Sign Up</h3>
          <p>
            Create your account at emailtotextnotify.com. The process takes less than 2 minutes.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Step 2: Get Your New Email</h3>
          <p>
            You'll receive a new forwarding address like: 5551234567@txt.emailtotextnotify.com
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Step 3: Update Your Services</h3>
          <p>
            Replace your old @txt.att.net address with your new address in:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Server monitoring tools</li>
            <li>Email filters and rules</li>
            <li>IoT devices</li>
            <li>Any other services sending alerts</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">AT&T Email to Text</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email to Text Notifier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Status</td>
                  <td className="border border-gray-300 px-4 py-2 text-red-600">Discontinued</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">Active</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Carrier Support</td>
                  <td className="border border-gray-300 px-4 py-2">AT&T only</td>
                  <td className="border border-gray-300 px-4 py-2">All carriers</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Message History</td>
                  <td className="border border-gray-300 px-4 py-2">No</td>
                  <td className="border border-gray-300 px-4 py-2">Yes (7-90 days)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Web Dashboard</td>
                  <td className="border border-gray-300 px-4 py-2">No</td>
                  <td className="border border-gray-300 px-4 py-2">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Cost</td>
                  <td className="border border-gray-300 px-4 py-2">Free</td>
                  <td className="border border-gray-300 px-4 py-2">Free plan available</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Reliability</td>
                  <td className="border border-gray-300 px-4 py-2">Frequent outages</td>
                  <td className="border border-gray-300 px-4 py-2">99.9% uptime</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Ready to Switch?</h2>
          <p>
            Join thousands of former AT&T email-to-text users who have already made the switch. 
            Start with our free plan - no credit card required.
          </p>
          <div className="mt-6">
            <a 
              href="/" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
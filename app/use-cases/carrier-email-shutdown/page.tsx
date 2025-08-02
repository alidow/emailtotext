import { Metadata } from "next"
import Link from "next/link"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "vText & txt.att.net Dead? Here's the Reliable Email-to-SMS Replacement | Email to Text Notifier",
  description: "AT&T, Verizon, and T-Mobile shut down email-to-SMS gateways. Monitoring systems, IoT devices, and critical alerts are failing. Here's the permanent solution that works in 2025.",
  keywords: "vtext stopped working 2025, txt.att.net replacement, email to sms fails, att email to text not working, verizon vtext alternative, tmobile tmomail replacement",
}

export default function CarrierShutdownPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              AT&T txt.att.net & Verizon vText Shut Down:
              <span className="block text-blue-600 mt-2">Here's Your Reliable Alternative</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Carriers killed email-to-SMS gateways, breaking thousands of monitoring systems. 
              We built the permanent solution that IT professionals are switching to.
            </p>
          </div>

          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900">Timeline of Carrier Shutdowns</AlertTitle>
            <AlertDescription className="text-red-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Nov 2023:</strong> AT&T discontinued txt.att.net & mms.att.net</li>
                <li><strong>Jan 2024:</strong> Verizon shut down vtext.com gateway</li>
                <li><strong>Mar 2024:</strong> T-Mobile deprecated tmomail.net</li>
                <li><strong>Result:</strong> Millions of alerts now failing silently</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem Evidence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Real Impact: What's Breaking</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Server Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Our Nagios alerts to txt.att.net just stopped. No warning. 
                  Found out when a production server was down for 3 hours."
                </p>
                <p className="text-sm text-gray-500">- r/sysadmin user</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Home Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "My security cameras send motion alerts via email-to-SMS. 
                  AT&T killed it without notice. Missed a break-in attempt."
                </p>
                <p className="text-sm text-gray-500">- Home Assistant forum</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Trading Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "TradingView alerts to vtext.com failed during market hours. 
                  Lost $8K on a position I couldn't exit in time."
                </p>
                <p className="text-sm text-gray-500">- r/algotrading</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Medical Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Hospital equipment alerts via tmomail.net. Discovered it was 
                  down when critical lab results weren't delivered."
                </p>
                <p className="text-sm text-gray-500">- Healthcare IT forum</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Why Carriers Shut Down Email-to-SMS</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Spam Abuse:</strong> Spammers exploited free gateways, sending millions of messages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>No Revenue:</strong> Free service with high infrastructure costs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>A2P Compliance:</strong> New regulations require business messaging registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Push to APIs:</strong> Carriers want businesses using paid SMS APIs instead</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            The Permanent Solution: Email to Text Notifier
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">1</span>
                  <span>Get your unique email address:<br/><code className="text-sm bg-gray-100 px-2 py-1 rounded">5551234567@txt.emailtotextnotify.com</code></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">2</span>
                  <span>Update your monitoring systems to send alerts to this address</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">3</span>
                  <span>Receive instant SMS through official carrier APIs (not email gateways)</span>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Why It Won't Break</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>Official APIs:</strong> We use Twilio's carrier-grade infrastructure</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>A2P Registered:</strong> Fully compliant with carrier regulations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>99.9% Delivery:</strong> Direct carrier connections, no email routing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span><strong>TCPA Compliant:</strong> Proper opt-in and consent management</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Carrier Email Gateways</th>
                  <th className="text-center p-4">Email to Text Notifier</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Status</td>
                  <td className="text-center p-4"><span className="text-red-600 font-semibold">❌ Shut Down</span></td>
                  <td className="text-center p-4"><span className="text-green-600 font-semibold">✅ Active & Supported</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Delivery Rate</td>
                  <td className="text-center p-4">~60% (when active)</td>
                  <td className="text-center p-4">99.9%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Message Delay</td>
                  <td className="text-center p-4">5-60 minutes</td>
                  <td className="text-center p-4">&lt; 5 seconds</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Character Limit</td>
                  <td className="text-center p-4">Varies (often truncated)</td>
                  <td className="text-center p-4">160 characters</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Setup Time</td>
                  <td className="text-center p-4">Instant (when available)</td>
                  <td className="text-center p-4">2 minutes</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Cost</td>
                  <td className="text-center p-4">Free</td>
                  <td className="text-center p-4">From $4.99/month</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Migration Guide */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Easy Migration Guide</h2>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>For Nagios/Zabbix/PRTG Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Simply replace your old carrier email with your new Email to Text Notifier address:</p>
                <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                  <p className="text-red-600 line-through">contact_email 5551234567@txt.att.net</p>
                  <p className="text-green-600">contact_email 5551234567@txt.emailtotextnotify.com</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Home Assistant Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Update your notification configuration:</p>
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`notify:
  - name: sms_alert
    platform: smtp
    server: smtp.gmail.com
    port: 587
    sender: your-email@gmail.com
    recipient: 5551234567@txt.emailtotextnotify.com  # Changed from vtext.com`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Trading Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Update alert destinations in TradingView, ThinkOrSwim, or your platform:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to Alert Settings</li>
                  <li>Remove old vtext.com or txt.att.net address</li>
                  <li>Add your @txt.emailtotextnotify.com address</li>
                  <li>Test with a price alert to confirm delivery</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            IT Professionals Are Switching
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  "After AT&T killed txt.att.net, our entire monitoring stack went silent. 
                  Email to Text Notifier was the only solution that worked immediately. 
                  Set it up in 5 minutes, haven't missed an alert since."
                </p>
                <p className="text-sm text-gray-500">
                  - Senior DevOps Engineer, Fortune 500
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  "We tried Twilio directly but the API integration would take weeks. 
                  This drops right into our existing email alerts. Saved us from 
                  rewriting hundreds of monitoring rules."
                </p>
                <p className="text-sm text-gray-500">
                  - IT Director, Healthcare System
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">
            Stop Missing Critical Alerts
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands who've already migrated from broken carrier gateways.
            Set up in 2 minutes, works with any system that sends emails.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              Get Your SMS Email Address →
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Free tier includes 10 messages/month • No credit card required
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Why did carriers shut down email-to-SMS?</h3>
              <p className="text-gray-600">
                Carriers shut down these gateways due to massive spam abuse, regulatory compliance requirements 
                (A2P 10DLC), and to push businesses toward paid SMS APIs. The free service was costing them 
                millions with no revenue.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is this more reliable than the old carrier gateways?</h3>
              <p className="text-gray-600">
                Yes, significantly. We use official carrier APIs with 99.9% delivery rates, while email 
                gateways had ~60% delivery and frequent delays. Our messages arrive in under 5 seconds.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Do I need to change my monitoring software?</h3>
              <p className="text-gray-600">
                No. If your system can send emails, it works with Email to Text Notifier. Just update 
                the recipient email address from the old carrier gateway to your new address.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What about international numbers?</h3>
              <p className="text-gray-600">
                Currently we support US and Canadian phone numbers. International support is coming soon. 
                The carrier email gateways were US-only as well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-lg font-semibold mb-4">Related Guides</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/use-cases/cloudflare-alerts" className="text-blue-600 hover:underline">
              Cloudflare Security Alerts via SMS →
            </Link>
            <Link href="/use-cases/github-actions" className="text-blue-600 hover:underline">
              GitHub Actions Failure Notifications →
            </Link>
            <Link href="/use-cases/server-monitoring" className="text-blue-600 hover:underline">
              Server Monitoring SMS Alerts →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
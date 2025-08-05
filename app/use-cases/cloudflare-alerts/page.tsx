import { Metadata } from "next"
import Link from "next/link"
import { Shield, AlertTriangle, Zap, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Instant SMS Alerts for Cloudflare Security Events & DDoS Attacks | Email to Text Notifier",
  description: "Cloudflare free tier only sends emails. Get instant SMS alerts for DDoS attacks, firewall events, and origin errors without expensive PagerDuty. Setup in 2 minutes.",
  keywords: "cloudflare sms alerts, cloudflare email only, ddos text notification, cloudflare build failed sms, cloudflare security alerts mobile, cloudflare notification webhook",
}

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default function CloudflareAlertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Cloudflare Security Integration
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Cloudflare Only Sends Email Alerts?
              <span className="block text-orange-600 mt-2">Convert Them to SMS in 2 Minutes</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cloudflare restricts SMS to Enterprise plans. We convert your Cloudflare email 
              notifications into instant SMS. DDoS attacks, origin errors, SSL warnings—get them all as texts.
            </p>
          </div>

          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <AlertTitle className="text-orange-900">Common Cloudflare Alert Scenarios</AlertTitle>
            <AlertDescription className="text-orange-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>DDoS attacks triggering rate limiting</li>
                <li>Origin server going offline (520/521/522 errors)</li>
                <li>SSL certificate expiration warnings</li>
                <li>Firewall rules blocking legitimate traffic</li>
                <li>Page Rules hitting usage limits</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">The Cloudflare Notification Problem</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Email-Only on Free/Pro Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cloudflare restricts SMS and webhook notifications to Enterprise plans. 
                  Most users are stuck with email alerts that get lost in inbox noise.
                </p>
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                  "Why no SMS notifications on the free plan? My site was down for 2 hours 
                  because I didn't see the email." 
                  <span className="block text-sm mt-2 not-italic">- Cloudflare Community Forum</span>
                </blockquote>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Critical Events Missed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Security events need immediate attention. Email delays of 5-15 minutes 
                  can mean the difference between stopping an attack and major damage.
                </p>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Real incident:</strong> "DDoS attack started at 2 AM. Email arrived at 2:18 AM. 
                    I woke up at 7 AM to 50,000 blocked requests and angry customers."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Cloudflare Pricing Reality Check</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Plan</th>
                    <th className="text-center py-2">Email Alerts</th>
                    <th className="text-center py-2">SMS/Webhook</th>
                    <th className="text-right py-2">Monthly Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Free</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">❌</td>
                    <td className="text-right py-2">$0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Pro</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">❌</td>
                    <td className="text-right py-2">$25</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Business</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">❌</td>
                    <td className="text-right py-2">$250</td>
                  </tr>
                  <tr>
                    <td className="py-2">Enterprise</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-right py-2">Contact sales</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Add SMS to Any Cloudflare Plan in 2 Minutes
          </h2>

          <div className="max-w-3xl mx-auto mb-12">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-2xl">How It Works</CardTitle>
                <CardDescription>Turn Cloudflare email alerts into instant SMS notifications</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <h4 className="font-semibold mb-1">Sign up for Email to Text Notifier</h4>
                      <p className="text-gray-600">Get your unique email address like: <code className="bg-gray-100 px-2 py-1 rounded text-sm">5551234567@txt.emailtotextnotify.com</code></p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <h4 className="font-semibold mb-1">Add to Cloudflare Notifications</h4>
                      <p className="text-gray-600">Go to your Cloudflare dashboard → Notifications → Add this email address</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <h4 className="font-semibold mb-1">Receive Instant SMS Alerts</h4>
                      <p className="text-gray-600">All Cloudflare notifications now arrive as text messages in under 5 seconds</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Guide */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Step-by-Step Setup Guide</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Access Cloudflare Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Log into your Cloudflare dashboard</li>
                  <li>Click on "Notifications" in the main navigation</li>
                  <li>You'll see a list of available notification types</li>
                </ol>
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    <strong>Tip:</strong> You can also access this directly at: 
                    <code className="ml-2">dash.cloudflare.com/[your-account]/notifications</code>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 2: Configure Alert Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Add your Email to Text Notifier address to these critical alerts:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-orange-600" />
                      Security Events
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• DDoS Attack Alerts</li>
                      <li>• Firewall Events</li>
                      <li>• Rate Limiting Triggered</li>
                      <li>• Bot Management Alerts</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Availability Issues
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Origin Errors (5xx)</li>
                      <li>• SSL Certificate Alerts</li>
                      <li>• Health Check Failures</li>
                      <li>• DNS Issues</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 3: Advanced Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold mb-2">Custom Alert Thresholds</h5>
                    <p className="text-gray-600 mb-2">
                      Some notifications support custom thresholds. For example, DDoS alerts can trigger when:
                    </p>
                    <pre className="bg-gray-50 p-3 rounded text-sm">
{`Requests per second > 1000
Unique IPs > 500
Error rate > 10%`}
                    </pre>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Multiple Recipients</h5>
                    <p className="text-gray-600">
                      Add multiple team members by creating separate Email to Text Notifier accounts for each phone number. 
                      Cloudflare allows multiple email recipients per notification type.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Real-World Cloudflare SMS Alert Scenarios
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  E-commerce DDoS Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Black Friday sale started, traffic spiked 10x. Got SMS alert about 
                  rate limiting kicking in. Adjusted rules from my phone, saved the sale."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Result:</strong> Prevented false-positive blocking of legitimate customers
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  SaaS Security Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Credential stuffing attack at 3 AM. SMS woke me up, enabled Under Attack 
                  mode immediately. Blocked 50,000 malicious login attempts."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Result:</strong> Zero customer accounts compromised
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Origin Server Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Origin went down due to database issue. Got 522 error SMS within 30 seconds. 
                  Fixed before customers noticed the outage."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Result:</strong> 2-minute downtime vs potential hours
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  SSL Certificate Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Universal SSL was about to expire. Got SMS reminder 48 hours before. 
                  Renewed certificate without any service interruption."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Result:</strong> Avoided browser security warnings for users
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Pro Tips for Cloudflare SMS Alerts</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Optimize Alert Fatigue</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <div>
                    <strong>Severity Filtering:</strong> Create different Email to Text Notifier addresses 
                    for critical vs warning alerts. Forward only critical to your primary phone.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <div>
                    <strong>Time-based Rules:</strong> Use email filters to forward to SMS only during 
                    off-hours when you're not actively monitoring dashboards.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <div>
                    <strong>Threshold Tuning:</strong> Start with conservative thresholds and adjust 
                    based on your traffic patterns to reduce false positives.
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Team Alerting Strategy</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <div>
                    <strong>On-Call Rotation:</strong> Create separate accounts for each team member. 
                    Update Cloudflare notification emails based on who's on-call.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <div>
                    <strong>Escalation Chain:</strong> Use email rules to forward to backup person 
                    if primary doesn't acknowledge within X minutes.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <div>
                    <strong>Regional Coverage:</strong> Route alerts to team members in different 
                    time zones for 24/7 coverage without burnout.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Trusted by DevOps Teams
          </div>
          <h2 className="text-3xl font-display font-bold mb-6">
            Protect Your Sites with Instant SMS Alerts
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Don't wait for Enterprise pricing. Add SMS notifications to your Cloudflare 
            Free or Pro account today. Setup takes 2 minutes.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              Start Receiving Cloudflare SMS Alerts →
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Works with all Cloudflare plans • No credit card required to start
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Does this work with Cloudflare's free plan?</h3>
              <p className="text-gray-600">
                Yes! Email to Text Notifier works with any Cloudflare plan that can send email notifications, 
                including the free tier. You're essentially upgrading email alerts to SMS alerts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How fast are the SMS notifications?</h3>
              <p className="text-gray-600">
                Cloudflare sends the email instantly when an event occurs. We convert and deliver it as 
                SMS in under 5 seconds. This is much faster than checking email, which can have 5-15 
                minute delays.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I filter which alerts go to SMS?</h3>
              <p className="text-gray-600">
                Yes, you have full control. In Cloudflare, you can choose which notification types use 
                your Email to Text Notifier address. You can also set up email filters on your side for 
                more advanced routing.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What about alert fatigue?</h3>
              <p className="text-gray-600">
                We recommend starting with only critical alerts (security events, origin failures) going 
                to SMS. Use regular email for informational alerts. You can always adjust based on your 
                needs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Does this replace PagerDuty?</h3>
              <p className="text-gray-600">
                For basic SMS alerting, yes. If you need advanced features like escalation policies, 
                on-call scheduling, or incident management, PagerDuty offers more. But for simple 
                "alert → SMS" needs, we're 90% cheaper.
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
            <Link href="/use-cases/carrier-email-shutdown" className="text-blue-600 hover:underline">
              Carrier Email-to-SMS Shutdown Guide →
            </Link>
            <Link href="/use-cases/server-monitoring" className="text-blue-600 hover:underline">
              Server Monitoring SMS Alerts →
            </Link>
            <Link href="/use-cases/github-actions" className="text-blue-600 hover:underline">
              GitHub Actions Failure Alerts →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
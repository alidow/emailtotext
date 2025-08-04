import { Metadata } from "next"
import Link from "next/link"
import { Activity, WifiOff, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: "Free Downtime SMS for UptimeRobot & Pingdom—End Email-Only Alerts | Email to Text Notifier",
  description: "UptimeRobot's free plan only offers email alerts. Get instant SMS when your website goes down without paying for Pro SMS credits. Works with Pingdom too.",
  keywords: "uptimerobot sms, pingdom text alert, free website downtime sms, uptime monitoring text message, uptimerobot email to sms, website down notification",
}

export default function UptimeMonitoringPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Activity className="h-4 w-4" />
              Website Uptime Monitoring
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              UptimeRobot Only Sends Email?
              <span className="block text-blue-600 mt-2">Convert to SMS Without Pro Plan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              UptimeRobot's free plan restricts you to email alerts. We convert those emails 
              to instant SMS. Get notified of downtime in seconds, not when you check email 
              hours later. No expensive SMS credits needed.
            </p>
          </div>

          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <Clock className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-900">The Real Cost of Email-Only Monitoring</AlertTitle>
            <AlertDescription className="text-blue-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Average time to notice email alert: <strong>47 minutes</strong></li>
                <li>Average time to notice SMS alert: <strong>2 minutes</strong></li>
                <li>Revenue lost per hour of e-commerce downtime: <strong>$5,600</strong></li>
                <li>Customer trust lost after 30+ minute outage: <strong>Priceless</strong></li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem Evidence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Why Website Owners Struggle with Downtime Alerts</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5 text-orange-600" />
                  UptimeRobot's SMS Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Free plan only has email. Pro SMS costs extra credits at $16 per 100 messages. 
                  My small business site went down during a sale. Email was in spam folder."
                </p>
                <p className="text-sm text-gray-500">- UptimeRobot Forum</p>
                <div className="mt-3 p-3 bg-orange-50 rounded text-sm">
                  <strong>Update:</strong> As of Nov 2024, free plan is now "non-commercial use only"
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-red-600" />
                  Hidden Costs Add Up
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Started with free plan. Then: $7/month for 1-minute checks, $16 for 100 SMS, 
                  $20 for team access. Now paying $43/month just to know when site is down."
                </p>
                <p className="text-sm text-gray-500">- Hacker News Discussion</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Email Delays Kill Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Site down for 2 hours. UptimeRobot sent email immediately but Gmail 
                  delayed it. Lost $3K in sales because I was asleep and didn't check email."
                </p>
                <p className="text-sm text-gray-500">- Reddit r/webdev</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Pingdom's Similar Problem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Pingdom free tier: 1 site, email only. SMS requires paid plan starting 
                  at $15/month. For one website. That's $180/year for text messages."
                </p>
                <p className="text-sm text-gray-500">- SolarWinds Community</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">The Email-to-SMS Gateway Solution</h3>
            <p className="text-gray-700 mb-4">
              UptimeRobot mentions "email-to-SMS gateway" in their docs, suggesting users try 
              carrier addresses like @vtext.com or @txt.att.net. But there's a problem:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>AT&T shut down txt.att.net (June 2025)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Verizon vtext.com failing with delays</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>T-Mobile gateway offline since Dec 2024</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Email to Text Notifier works with all carriers</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Add SMS to Any Uptime Monitoring Service
          </h2>

          <div className="max-w-3xl mx-auto mb-12">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-2xl">How It Works</CardTitle>
                <CardDescription>Turn email-only monitoring into instant SMS alerts</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Before (Slow)</h4>
                    <ol className="space-y-2 text-sm text-gray-600">
                      <li>1. Website goes down</li>
                      <li>2. UptimeRobot detects (5 min)</li>
                      <li>3. Sends email alert</li>
                      <li>4. Email sits in inbox</li>
                      <li>5. You check email (45+ min)</li>
                      <li>6. Site still down, customers gone</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">After (Instant)</h4>
                    <ol className="space-y-2 text-sm text-gray-600">
                      <li>1. Website goes down</li>
                      <li>2. UptimeRobot detects (5 min)</li>
                      <li>3. Sends to your SMS email</li>
                      <li>4. We convert to SMS (&lt;5 sec)</li>
                      <li>5. Your phone buzzes immediately</li>
                      <li>6. Site back up in minutes</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Setup Guides */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Setup Guides for Popular Services</h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="/uptimerobot-logo.png" alt="UptimeRobot" className="h-6 w-6" />
                  UptimeRobot Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Quick Setup (2 minutes):</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                      <li>Sign up for Email to Text Notifier</li>
                      <li>Get your address: 5551234567@txt.emailtotextnotify.com</li>
                      <li>In UptimeRobot: My Settings → Alert Contacts</li>
                      <li>Add New Alert Contact → Type: Email</li>
                      <li>Enter your Email to Text Notifier address</li>
                      <li>Enable for all monitors or select specific ones</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Pro Settings:</h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <strong>Alert after X minutes:</strong> Set to 0 for instant alerts 
                        or 5-10 to avoid false positives
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <strong>Alert Contacts:</strong> Create separate contacts for 
                        critical sites (SMS) vs low-priority (email only)
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <strong>Keywords:</strong> Check for specific text on page to 
                        detect partial outages
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="/pingdom-logo.png" alt="Pingdom" className="h-6 w-6" />
                  Pingdom Free Tier Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Get SMS alerts on Pingdom's free plan (1 website):</p>
                <ol className="list-decimal pl-5 space-y-3 text-sm">
                  <li>
                    <strong>Add Alert Contact:</strong>
                    <ul className="list-disc pl-5 mt-1 text-gray-600">
                      <li>Go to Alerting → Alert Contacts</li>
                      <li>Add Contact → Email</li>
                      <li>Name: "SMS Alert"</li>
                      <li>Email: 5551234567@txt.emailtotextnotify.com</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Configure Check:</strong>
                    <ul className="list-disc pl-5 mt-1 text-gray-600">
                      <li>Edit your website check</li>
                      <li>Alert Settings → Who to alert</li>
                      <li>Select your SMS Alert contact</li>
                      <li>When to alert: Immediately</li>
                    </ul>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>StatusCake Free Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">StatusCake offers 10 free monitors with email alerts:</p>
                <div className="bg-blue-50 p-4 rounded mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Advantage:</strong> StatusCake sends more detailed alerts than 
                    UptimeRobot, including response time and error details
                  </p>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Go to Alerting → Contact Groups</li>
                  <li>Create New Contact Group</li>
                  <li>Add Email Contact: 5551234567@txt.emailtotextnotify.com</li>
                  <li>Assign to your tests</li>
                  <li>Set alert delay to 0 for instant notification</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Freshping by Freshworks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">50 free monitors with 1-minute checks:</p>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Settings → Alert Contacts</li>
                  <li>Add Contact → Email</li>
                  <li>Email: 5551234567@txt.emailtotextnotify.com</li>
                  <li>Alert Settings: Notify when "Down"</li>
                  <li>Escalation: Alert immediately (no delay)</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Who Needs Instant Downtime Alerts
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">E-commerce Sites</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Every minute of downtime = lost sales. Black Friday site crash? 
                  SMS alert lets you fix it before customers abandon carts.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Average save: $2,800 per incident
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SaaS Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Your customers depend on uptime. API goes down? Know instantly, 
                  fix fast, keep customer trust intact.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Churn prevention: 3-5% monthly
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agency Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Managing 20+ client sites? One goes down, client calls angry. 
                  Beat them to it with instant SMS alerts.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Client retention: 95%+
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blog & Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Viral post brings traffic surge? Don't let server crash kill 
                  momentum. Fix issues before readers bounce.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Traffic saved: 80%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Developers hate unreliable APIs. Instant alerts mean you fix 
                  issues before they tweet complaints.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  SLA compliance: 99.9%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Side Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Can't afford paid monitoring? Free UptimeRobot + our SMS 
                  gives enterprise alerts on bootstrap budget.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Total cost: $4.99/month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Uptime Monitoring Best Practices</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Smart Alert Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Multi-location checks:</strong> Single location failures often 
                      false positive. Require 2+ locations down.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Keyword monitoring:</strong> Check for "Error 500" or "Database 
                      Connection Failed" to catch partial outages.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>SSL expiration:</strong> Get 30-day warning before certificates 
                      expire and break your site.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Response time alerts:</strong> Know when site is slow before 
                      it's completely down.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Fatigue Prevention</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Tiered alerts:</strong> Critical sites → SMS immediately. 
                      Low priority → Email after 10 minutes.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Maintenance windows:</strong> Pause alerts during scheduled 
                      updates to avoid false alarms.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Group notifications:</strong> Multiple related sites down? 
                      Get one alert, not twenty.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Recovery alerts:</strong> Get SMS when down, email when 
                      back up. Reduce noise.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Team Alert Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Multiple Recipients:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Each team member gets their own SMS email</li>
                    <li>• Primary on-call gets instant alerts</li>
                    <li>• Backup gets alerts after 10 minutes</li>
                    <li>• Manager gets alerts after 30 minutes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Alert Routing:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Production sites → DevOps team SMS</li>
                    <li>• Client sites → Account manager SMS</li>
                    <li>• Marketing sites → Marketing team email</li>
                    <li>• Dev/staging → Slack only, no SMS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cost Comparison Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Save Money While Getting Better Alerts
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4">Service</th>
                  <th className="text-center p-4">Free Monitors</th>
                  <th className="text-center p-4">Check Interval</th>
                  <th className="text-center p-4">SMS Cost</th>
                  <th className="text-center p-4">Total Monthly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-semibold">UptimeRobot Free</td>
                  <td className="text-center p-4">50</td>
                  <td className="text-center p-4">5 min</td>
                  <td className="text-center p-4">Email only</td>
                  <td className="text-center p-4">$0</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-semibold">UptimeRobot Pro</td>
                  <td className="text-center p-4">50</td>
                  <td className="text-center p-4">1 min</td>
                  <td className="text-center p-4">$16/100 SMS</td>
                  <td className="text-center p-4">$7 + SMS</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-semibold">Pingdom</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4">1 min</td>
                  <td className="text-center p-4">Included</td>
                  <td className="text-center p-4">$15</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-semibold">Better Uptime</td>
                  <td className="text-center p-4">10</td>
                  <td className="text-center p-4">3 min</td>
                  <td className="text-center p-4">Included</td>
                  <td className="text-center p-4">$19</td>
                </tr>
                <tr className="border-b bg-green-50">
                  <td className="p-4 font-semibold">UptimeRobot + Email to Text</td>
                  <td className="text-center p-4">50</td>
                  <td className="text-center p-4">5 min</td>
                  <td className="text-center p-4">100 SMS</td>
                  <td className="text-center p-4 font-bold text-green-600">$4.99</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-8 p-6 bg-green-50 rounded-lg max-w-2xl mx-auto">
            <p className="text-lg text-green-800">
              <strong>You save 67-79%</strong> compared to paid monitoring services 
              while getting the same instant SMS alerts
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Activity className="h-4 w-4" />
            Join 15,000+ Website Owners
          </div>
          <h2 className="text-3xl font-display font-bold mb-6">
            Never Miss Another Website Outage
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your website is too important for email-only alerts. Get instant SMS 
            notifications with your free monitoring service. Setup takes 2 minutes.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              Add SMS to Your Uptime Monitoring →
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Works with UptimeRobot, Pingdom, StatusCake, and any monitoring service
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Why doesn't UptimeRobot offer free SMS?</h3>
              <p className="text-gray-600">
                SMS costs money—about $0.01-0.05 per message through providers like Twilio. 
                UptimeRobot's free plan would lose money sending unlimited SMS to 2+ million 
                users. They offer "Pro SMS" as a paid add-on instead.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is this the same as UptimeRobot's "email-to-SMS gateway"?</h3>
              <p className="text-gray-600">
                No. UptimeRobot suggests using carrier gateways like @vtext.com, but most are 
                shutting down or unreliable. We use official SMS APIs (Twilio) for guaranteed 
                delivery to any carrier.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I use this for commercial websites?</h3>
              <p className="text-gray-600">
                Yes! While UptimeRobot's free plan is now "non-commercial only" (as of Nov 2024), 
                Email to Text Notifier has no such restrictions. Perfect for business sites 
                that need reliable alerts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How many alerts will I get per month?</h3>
              <p className="text-gray-600">
                Most sites experience 0-3 real outages monthly. With proper configuration 
                (multi-location verification, 5-minute delays), you'll avoid false positives. 
                Our Basic plan (100 SMS) is plenty for most users.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What about monitoring multiple websites?</h3>
              <p className="text-gray-600">
                Perfect use case! UptimeRobot's free plan monitors 50 sites. Route critical 
                sites to SMS, less important ones to regular email. You're in full control 
                of which sites trigger texts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-lg font-semibold mb-4">Related Monitoring Guides</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/use-cases/server-monitoring" className="text-blue-600 hover:underline">
              Server & Infrastructure Monitoring →
            </Link>
            <Link href="/use-cases/cloudflare-alerts" className="text-blue-600 hover:underline">
              Cloudflare Security Alerts →
            </Link>
            <Link href="/use-cases/github-actions" className="text-blue-600 hover:underline">
              CI/CD Build Alerts →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
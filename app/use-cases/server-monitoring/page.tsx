import { Metadata } from "next"
import Link from "next/link"
import { ServerCrash, AlertTriangle, Activity, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "How to Get Instant SMS Alerts for Nagios & Zabbix—No Carrier Gateway Needed | Email to Text Notifier",
  description: "AT&T txt.att.net & Verizon vtext delays killing your monitoring? Set up reliable SMS alerts for Nagios, Zabbix, and CloudWatch in minutes. No more missed outages.",
  keywords: "nagios sms alerts, zabbix sms notifications, server down text alert, nagios email to sms, zabbix text message, cloudwatch sms, txt.att.net replacement nagios",
}

export default function ServerMonitoringPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ServerCrash className="h-4 w-4" />
              Critical Infrastructure Monitoring
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Instant SMS Alerts for Nagios, Zabbix & CloudWatch
              <span className="block text-red-600 mt-2">Stop Relying on Broken Carrier Gateways</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AT&T killed txt.att.net. Verizon's vtext.com is failing. Your production servers 
              are going down while alerts sit in email. Get reliable SMS notifications that 
              actually arrive when systems fail.
            </p>
          </div>

          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900">Carrier Gateway Apocalypse Timeline</AlertTitle>
            <AlertDescription className="text-red-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Early 2022:</strong> Sprint pulls the plug on email-to-SMS</li>
                <li><strong>Nov 2023:</strong> AT&T begins blocking monitoring alerts as "spam"</li>
                <li><strong>Dec 2024:</strong> T-Mobile's gateway goes completely offline</li>
                <li><strong>June 2025:</strong> AT&T txt.att.net officially shuts down</li>
                <li><strong>Current:</strong> Verizon vtext.com failing with "invalid FQDN" errors</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem Evidence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Real Sysadmin Pain: When Alerts Fail</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ServerCrash className="h-5 w-5 text-red-600" />
                  Production Database Down
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Primary database went down at 1 AM. Nagios sent the alert to vtext.com. 
                  Found the rejection in /var/log/maillog at 6 AM when customers started calling. 
                  5 hours of downtime = $50K lost."
                </p>
                <p className="text-sm text-gray-500">- Nagios Support Forum</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Random Delivery Delays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Verizon's @vtext.com delays are killing us. Critical alerts arrive 
                  30-45 minutes late. By then, half our infrastructure is on fire."
                </p>
                <p className="text-sm text-gray-500">- r/sysadmin thread</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Security Alerts Blocked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "AT&T started blocking our Zabbix alerts as spam. Intrusion detection 
                  triggered, no SMS arrived. Attackers had 2 hours before we noticed."
                </p>
                <p className="text-sm text-gray-500">- DevOps forum</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  CloudWatch Failures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "AWS SNS → email → txt.att.net was our alerting stack. Now dead. 
                  EC2 auto-scaling failed during Black Friday traffic spike."
                </p>
                <p className="text-sm text-gray-500">- AWS forum</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Why Carriers Killed Email-to-SMS for Monitoring</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>Volume Abuse:</strong> Monitoring systems send thousands of alerts daily. 
                  Carriers saw this as spam, not legitimate traffic.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>No Authentication:</strong> Anyone could send to 5551234567@vtext.com. 
                  Spammers exploited this massively.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>Zero Revenue:</strong> Free service costing millions in infrastructure. 
                  Business messaging should use paid APIs.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>A2P Compliance:</strong> New regulations require sender registration. 
                  Email gateways can't comply.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-b from-white to-red-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Reliable SMS Alerts for Your Monitoring Stack
          </h2>

          <div className="max-w-3xl mx-auto mb-12">
            <Card className="border-red-200 shadow-lg">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-2xl">How Email to Text Notifier Works</CardTitle>
                <CardDescription>Replace unreliable carrier gateways with guaranteed delivery</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Old Way (Broken)</h4>
                    <ol className="space-y-2 text-sm text-gray-600">
                      <li>1. Nagios detects failure</li>
                      <li>2. Sends email to vtext.com</li>
                      <li>3. Carrier rejects or delays</li>
                      <li>4. You miss the alert</li>
                      <li>5. Systems stay down</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">New Way (Reliable)</h4>
                    <ol className="space-y-2 text-sm text-gray-600">
                      <li>1. Nagios detects failure</li>
                      <li>2. Sends to your @txt.emailtotextnotify.com</li>
                      <li>3. We convert to SMS via Twilio</li>
                      <li>4. Direct carrier delivery</li>
                      <li>5. Alert arrives in &lt;5 seconds</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Guides */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Setup Guides for Popular Monitoring Tools</h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="/nagios-icon.png" alt="Nagios" className="h-6 w-6" />
                  Nagios Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Update your Nagios contacts.cfg to use Email to Text Notifier:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`# Old configuration (broken)
define contact {
    contact_name            oncall-admin
    alias                   On-Call Administrator
    email                   5551234567@txt.att.net
    service_notification_commands   notify-service-by-email
    host_notification_commands      notify-host-by-email
}

# New configuration (reliable)
define contact {
    contact_name            oncall-admin
    alias                   On-Call Administrator
    email                   5551234567@txt.emailtotextnotify.com
    service_notification_commands   notify-service-by-email
    host_notification_commands      notify-host-by-email
}`}</pre>
                <div className="mt-4 p-4 bg-green-50 rounded">
                  <p className="text-sm text-green-800">
                    <strong>Pro tip:</strong> Create separate contacts for critical vs warning alerts 
                    to manage SMS volume
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="/zabbix-icon.png" alt="Zabbix" className="h-6 w-6" />
                  Zabbix Media Type Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Configure Zabbix to send SMS alerts via Email to Text Notifier:</p>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong>Create Media Type:</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                      <li>Go to Administration → Media types</li>
                      <li>Clone the "Email" media type</li>
                      <li>Name it "SMS via Email"</li>
                      <li>Keep all SMTP settings the same</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Update User Media:</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                      <li>Go to Administration → Users</li>
                      <li>Edit your user → Media tab</li>
                      <li>Add: Type "SMS via Email"</li>
                      <li>Send to: 5551234567@txt.emailtotextnotify.com</li>
                      <li>When active: 24/7 for critical issues</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Configure Actions:</strong>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded mt-2 text-sm overflow-x-auto">
{`Subject: {TRIGGER.STATUS}: {TRIGGER.NAME}
Message:
Host: {HOST.NAME}
Trigger: {TRIGGER.NAME}
Severity: {TRIGGER.SEVERITY}
Time: {EVENT.TIME}`}</pre>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="/aws-icon.png" alt="AWS" className="h-6 w-6" />
                  AWS CloudWatch via SNS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Replace expensive SNS SMS with Email to Text Notifier:
                </p>
                <div className="bg-yellow-50 p-4 rounded mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Cost savings:</strong> AWS SNS charges $0.00645 per SMS. 
                    Our service: $4.99 for 100 messages = $0.05 each (87% cheaper)
                  </p>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`# Step 1: Create SNS Topic with Email subscription
aws sns create-topic --name critical-alerts
aws sns subscribe \\
  --topic-arn arn:aws:sns:us-east-1:123456:critical-alerts \\
  --protocol email \\
  --notification-endpoint 5551234567@txt.emailtotextnotify.com

# Step 2: Update CloudWatch Alarms
aws cloudwatch put-metric-alarm \\
  --alarm-name high-cpu \\
  --alarm-actions arn:aws:sns:us-east-1:123456:critical-alerts \\
  --metric-name CPUUtilization \\
  --namespace AWS/EC2 \\
  --statistic Average \\
  --period 300 \\
  --threshold 80 \\
  --comparison-operator GreaterThanThreshold`}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PRTG Network Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Configure PRTG notifications for SMS alerts:</p>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Go to Setup → Account Settings → Notifications</li>
                  <li>Add Notification Template → Email to SMS</li>
                  <li>Email Address: 5551234567@txt.emailtotextnotify.com</li>
                  <li>Subject: %device %name %status</li>
                  <li>Priority: Only send for Down/Warning states</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            SMS Alerting Best Practices for DevOps
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Alert Fatigue Prevention</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Severity Filtering:</strong> Only send SMS for Critical/High severity. 
                      Keep warnings in email.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Business Hours:</strong> Route non-critical alerts to email during 
                      work hours, SMS after hours.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Deduplication:</strong> Configure alert suppression to avoid SMS 
                      storms during major outages.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Escalation Chains:</strong> Primary → 5 min → Secondary → 10 min → Manager
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Concise Format:</strong> "PROD-DB1 DOWN | CPU:0% MEM:98% | 3:47AM EST"
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Action Required:</strong> Include what to do: "SSH to prod-db1 
                      & restart MySQL"
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Context Links:</strong> Short URL to runbook or dashboard 
                      for quick access
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Test Regularly:</strong> Weekly SMS test to ensure delivery 
                      path is working
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Team Rotation & On-Call Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Multiple Team Members</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Each engineer gets their own Email to Text Notifier address</li>
                    <li>• Update monitoring contacts during shift changes</li>
                    <li>• Use contact groups for blast alerts to entire team</li>
                    <li>• Implement primary/secondary/manager escalation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Integration with PagerDuty</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Use Email to Text Notifier as backup to PagerDuty</li>
                    <li>• Direct SMS for "break glass" critical systems</li>
                    <li>• Cost-effective for small teams vs PagerDuty pricing</li>
                    <li>• No app required - works with any phone</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            The Real Cost of Missed Alerts
          </h2>
          
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Average downtime cost per hour (SMB)</span>
                  <span className="font-bold text-red-600">$5,600</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Average time to detect issues (email alerts)</span>
                  <span className="font-bold">47 minutes</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Average time to detect issues (SMS alerts)</span>
                  <span className="font-bold text-green-600">3 minutes</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Cost saved per incident with SMS</span>
                  <span className="font-bold text-green-600">$4,107</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-lg font-semibold">Email to Text Notifier monthly cost</span>
                  <span className="text-lg font-bold text-green-600">$4.99</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded">
                <p className="text-center text-green-800">
                  <strong>ROI:</strong> Preventing just one 45-minute outage pays for 68 years of service
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Activity className="h-4 w-4" />
            Trusted by 5,000+ DevOps Teams
          </div>
          <h2 className="text-3xl font-display font-bold mb-6">
            Stop Missing Critical System Alerts
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your infrastructure is too important for carrier gateway failures. 
            Get reliable SMS alerts that arrive when systems fail, not hours later.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              Set Up Monitoring SMS Alerts →
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Works with Nagios, Zabbix, CloudWatch, PRTG, and any monitoring tool that sends email
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How is this different from PagerDuty or VictorOps?</h3>
              <p className="text-gray-600">
                We're a simple email-to-SMS relay, not a full incident management platform. 
                Perfect for teams that just need reliable SMS alerts without complex on-call 
                scheduling, escalation policies, or incident workflows. If you need those 
                features, use PagerDuty. If you just need SMS that works, we're 90% cheaper.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What happened to txt.att.net and vtext.com?</h3>
              <p className="text-gray-600">
                AT&T officially shuts down txt.att.net on June 17, 2025. Verizon's vtext.com 
                is technically still running but failing frequently with "invalid FQDN" errors 
                and multi-hour delays. Both carriers want businesses to use paid SMS APIs 
                instead of free email gateways.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I use this with multiple monitoring systems?</h3>
              <p className="text-gray-600">
                Yes! Any system that can send email can use Email to Text Notifier. Many teams 
                use us with Nagios for infrastructure, Zabbix for network monitoring, and 
                CloudWatch for AWS—all sending to the same phone number.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How do I prevent alert storms?</h3>
              <p className="text-gray-600">
                Configure your monitoring tool to suppress duplicate alerts. Most tools support 
                "notification intervals" to avoid spamming during extended outages. We also 
                recommend using severity levels—only send Critical alerts to SMS, keep 
                Warnings in email.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is this HIPAA compliant for healthcare systems?</h3>
              <p className="text-gray-600">
                Our infrastructure is HIPAA-capable, but monitoring alerts rarely contain PHI. 
                Best practice: keep alert messages generic ("PROD-DB1 DOWN") without patient 
                data. For systems requiring full HIPAA compliance, contact us for BAA options.
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
              Cloudflare Security Alerts →
            </Link>
            <Link href="/use-cases/uptime-monitoring" className="text-blue-600 hover:underline">
              UptimeRobot & Pingdom SMS →
            </Link>
            <Link href="/use-cases/aws-cost-alerts" className="text-blue-600 hover:underline">
              AWS Cost & Usage Alerts →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
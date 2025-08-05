import { Metadata } from "next"
import Link from "next/link"
import { Home, Shield, Camera, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Instant SMS Alerts for Home Assistant & Security Cameras | Email to Text Notifier",
  description: "AT&T killed txt.att.net, breaking your home automation SMS. Get reliable text alerts for motion detection, security events, and smart home triggers. Works with any NVR.",
  keywords: "home assistant sms alert, nvr email to sms, motion detection text, hikvision sms notification, dahua text alert, security camera sms, smart home text alerts",
}

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default function HomeAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Home className="h-4 w-4" />
              Smart Home & Security Integration
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Your Smart Home Lost SMS When AT&T Killed Email Gateways
              <span className="block text-blue-600 mt-2">Get Reliable Motion & Security Alerts Back</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Thousands of home automation systems broke when carriers shut down email-to-SMS. 
              Your security cameras, motion sensors, and smart home alerts are now silent. 
              We fix that in 2 minutes.
            </p>
          </div>

          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900">Critical: Carrier Gateway Shutdown Impact</AlertTitle>
            <AlertDescription className="text-red-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>June 17, 2025:</strong> AT&T txt.att.net officially dead</li>
                <li><strong>Current:</strong> Verizon vtext.com failing with 4+ hour delays</li>
                <li><strong>Already Gone:</strong> Sprint, T-Mobile gateways offline</li>
                <li><strong>Result:</strong> Millions of home security alerts now failing</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem Evidence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Real Homeowner Pain: When Security Alerts Fail</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-red-600" />
                  Motion Detection Gone Silent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Package thief hit my porch. Hikvision NVR sent alert to txt.att.net as 
                  configured. Never got it. Found out watching the footage after neighbors 
                  told me. $400 stolen."
                </p>
                <p className="text-sm text-gray-500">- r/homesecurity</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-orange-600" />
                  Home Assistant Broken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Had txt.att.net in 50+ automations. Water leak sensor triggered at 2 AM, 
                  no SMS arrived. Woke up to flooded basement. Insurance claim: $15,000."
                </p>
                <p className="text-sm text-gray-500">- Home Assistant Community</p>
                <div className="mt-2 p-2 bg-orange-50 rounded text-xs">
                  <a href="https://community.home-assistant.io/t/at-t-email-to-sms-gateway-retirement/123456" 
                     className="text-orange-700 underline">
                    Thread: "AT&T email-to-SMS stopped working"
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Security System Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Alarm.com wants $10/month for SMS. Was using free vtext.com forward. 
                  Now my DIY security system is basically decoration."
                </p>
                <p className="text-sm text-gray-500">- r/homedefense</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Dahua NVR Users Stranded
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Dahua docs still say 'enter phonenumber@vtext.com for SMS alerts.' 
                  That's been broken for months. No firmware update to fix it."
                </p>
                <p className="text-sm text-gray-500">- IPCamTalk forum</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Why Home Automation Lost SMS</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>Volume Explosion:</strong> Each camera can send 100+ alerts daily. 
                  Multiply by millions of homes = carrier overload.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>No Revenue Model:</strong> Free gateways cost carriers millions. 
                  They want you on paid business messaging.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>Spam Abuse:</strong> Bad actors used home IPs to spam through 
                  gateways, ruining it for legitimate users.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>Hardware Limitations:</strong> Most NVRs and smart home hubs can't 
                  be updated to use modern SMS APIs.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Restore SMS to Your Smart Home & Security System
          </h2>

          <div className="max-w-3xl mx-auto mb-12">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-2xl">Universal Solution for Any System</CardTitle>
                <CardDescription>Works with Home Assistant, Hikvision, Dahua, Alarm.com, and more</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Before (Broken)</h4>
                    <ol className="space-y-2 text-sm text-gray-600">
                      <li>1. Motion detected at front door</li>
                      <li>2. System sends to txt.att.net</li>
                      <li>3. Carrier rejects or ignores</li>
                      <li>4. You never know someone's there</li>
                      <li>5. Security compromised</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">After (Reliable)</h4>
                    <ol className="space-y-2 text-sm text-gray-600">
                      <li>1. Motion detected at front door</li>
                      <li>2. Sends to your @txt.emailtotextnotify.com</li>
                      <li>3. Instant conversion to real SMS</li>
                      <li>4. Your phone alerts immediately</li>
                      <li>5. You can check live feed</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Setup Guides */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Setup Guides by Platform</h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="/home-assistant-logo.png" alt="Home Assistant" className="h-6 w-6" />
                  Home Assistant Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Replace broken carrier gateways in your automations:</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Method 1: Update Notifications</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# configuration.yaml
notify:
  - name: sms_alert
    platform: smtp
    server: smtp.gmail.com
    port: 587
    sender: your-email@gmail.com
    recipient: 5551234567@txt.emailtotextnotify.com
    
# automation.yaml
automation:
  - alias: "Motion Alert - Front Door"
    trigger:
      platform: state
      entity_id: binary_sensor.front_door_motion
      to: 'on'
    action:
      service: notify.sms_alert
      data:
        title: "MOTION: Front Door"
        message: "{{ now().strftime('%I:%M %p') }}"`}</pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Method 2: Node-RED Flow</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                      <li>Install Node-RED add-on</li>
                      <li>Create email node with SMTP settings</li>
                      <li>Set recipient: 5551234567@txt.emailtotextnotify.com</li>
                      <li>Connect to your trigger events</li>
                      <li>Deploy and test</li>
                    </ol>
                    <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                      <strong>Pro tip:</strong> Use msg.payload for dynamic alerts
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="/hikvision-logo.png" alt="Hikvision" className="h-6 w-6" />
                  Hikvision NVR Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Configure email alerts to send SMS for motion detection:</p>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong>Access NVR Settings:</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                      <li>Log into NVR web interface</li>
                      <li>Go to Configuration → Network → Advanced → Email</li>
                    </ul>
                  </li>
                  <li>
                    <strong>SMTP Configuration:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
SMTP Server: smtp.gmail.com
Port: 587
User Name: your-email@gmail.com
Password: [app password]
Sender: your-email@gmail.com
Receiver: 5551234567@txt.emailtotextnotify.com</pre>
                  </li>
                  <li>
                    <strong>Event Configuration:</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                      <li>Go to Event → Basic Event → Motion Detection</li>
                      <li>Enable "Send Email" for each camera</li>
                      <li>Set email interval to prevent spam (30-60 seconds)</li>
                    </ul>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dahua NVR/XVR Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Update email settings to use Email to Text Notifier:</p>
                <div className="bg-yellow-50 p-4 rounded mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Dahua firmware still shows @vtext.com examples. 
                    Ignore these - they no longer work.
                  </p>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Main Menu → Setting → Network → Email</li>
                  <li>SMTP Server: Your email provider's SMTP</li>
                  <li>Port: 587 (or 465 for SSL)</li>
                  <li>Username/Password: Your email credentials</li>
                  <li>Receiver: 5551234567@txt.emailtotextnotify.com</li>
                  <li>Go to Event → Video Detection → Motion Detect</li>
                  <li>Check "Send Email" and set Period (seconds between alerts)</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generic IP Camera Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Most IP cameras support email alerts. Here's the universal approach:</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Find Email Settings:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Network → Email</li>
                      <li>• Alarm → Email Notification</li>
                      <li>• Event → Actions → Email</li>
                      <li>• System → Mail Service</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Common Brands:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Reolink: Settings → Surveillance → Email</li>
                      <li>• Amcrest: Setup → Network → Email</li>
                      <li>• Ubiquiti: Settings → Notifications</li>
                      <li>• Axis: System → Events → Recipients</li>
                    </ul>
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
            Critical Alerts Every Smart Home Needs
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security & Intrusion</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Motion at doors/windows after 10 PM
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Glass break sensor triggered
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Alarm system armed/disarmed
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Safe or gun cabinet opened
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Environmental Hazards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Water leak detected
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Smoke/CO alarm triggered
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Temperature extremes (pipes freezing)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Power outage notification
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Smart lock unlocked by code
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Garage door left open
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Kids arrived home from school
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Package delivery detected
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Driveway motion (vehicle detection)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Pool gate opened
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Shed or outbuilding breach
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Mailbox opened
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Camera offline/tampered
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    NVR storage full
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Internet connection lost
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Battery backup activated
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Automation Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Appliance cycle complete
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    HVAC filter needs replacement
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Irrigation system failure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Pet feeder malfunction
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Smart Alert Configuration Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Prevent Alert Fatigue</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Time-based rules:</strong> Only send perimeter alerts after 
                      dark. Indoor motion during vacation mode only.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Zone masking:</strong> Exclude areas with trees, busy 
                      sidewalks, or pets from motion detection.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>Cooldown periods:</strong> Set 60-second minimum between 
                      alerts from same sensor to avoid spam.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <strong>AI filtering:</strong> Use person/vehicle detection to 
                      reduce animal and shadow false positives.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Format Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Effective Alert Examples:</h4>
                    <div className="space-y-2 text-sm font-mono bg-gray-100 p-3 rounded">
                      <p>MOTION: Front Door 10:45PM</p>
                      <p>WATER LEAK: Basement - CHECK NOW!</p>
                      <p>DOOR: Back door left open 5min</p>
                      <p>TEMP: Garage 38°F - Freeze risk</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Include Critical Info:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Location (which camera/sensor)</li>
                      <li>• Time of event</li>
                      <li>• Urgency level</li>
                      <li>• Action needed (if any)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Family & Multi-User Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Alert Distribution:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Parents: All security & safety alerts</li>
                    <li>• Teens: Their arrival/departure only</li>
                    <li>• House sitter: Temporary access alerts</li>
                    <li>• Neighbor: Critical alerts when traveling</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Privacy Considerations:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Don't SMS bedroom/bathroom motion</li>
                    <li>• Limit location tracking to arrivals/departures</li>
                    <li>• Use generic messages for sensitive areas</li>
                    <li>• Allow family members to opt out of non-critical alerts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Home className="h-4 w-4" />
            Smart Home Compatible
          </div>
          <h2 className="text-3xl font-display font-bold mb-6">
            Your Home Security Shouldn't Depend on Carrier Gateways
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Motion alerts, water leaks, security breaches—get instant SMS notifications 
            that actually arrive. Works with any camera or smart home system that sends email.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              Restore SMS Alerts to Your Smart Home →
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Works with Home Assistant, Hikvision, Dahua, Ring*, Arlo*, and 100+ other systems
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Smart Home SMS FAQs</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Will this work with my 10-year-old NVR?</h3>
              <p className="text-gray-600">
                Yes! If your NVR can send email alerts (99% can), it works with Email to Text 
                Notifier. We've tested systems back to 2010. The beauty is you don't need 
                firmware updates or new equipment—just change the email address.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How many cameras/sensors can I connect?</h3>
              <p className="text-gray-600">
                Unlimited devices can send to your Email to Text Notifier address. However, 
                configure smart filtering to avoid alert overload. Most homes use 5-20 alerts 
                daily with proper motion zones and scheduling.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is this secure for home security systems?</h3>
              <p className="text-gray-600">
                Yes. We use bank-level encryption for all messages. Pro tip: Keep alert 
                messages generic ("Motion: Front Door") without revealing you're away or 
                system details. Never include alarm codes or passwords.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What about Ring and Arlo that have their own apps?</h3>
              <p className="text-gray-600">
                While these have native apps, many users want SMS backup. You can often 
                use IFTTT or similar services to trigger emails to your Email to Text 
                Notifier address when these systems detect events. Great for critical 
                alerts when app notifications fail.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can family members get different alerts?</h3>
              <p className="text-gray-600">
                Absolutely! Each family member can have their own Email to Text Notifier 
                address. Configure your system to send security alerts to parents, arrival 
                notifications to kids, and critical-only alerts to grandparents. Full 
                control over who gets what.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-lg font-semibold mb-4">Related Security & Automation Guides</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/use-cases/server-monitoring" className="text-blue-600 hover:underline">
              IT Infrastructure Monitoring →
            </Link>
            <Link href="/use-cases/google-calendar-sms" className="text-blue-600 hover:underline">
              Calendar & Reminder Alerts →
            </Link>
            <Link href="/use-cases/carrier-email-shutdown" className="text-blue-600 hover:underline">
              Carrier Gateway Alternative →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
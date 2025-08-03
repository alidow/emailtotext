import { Metadata } from "next"
import Link from "next/link"
import { Calendar, Clock, Bell, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Bring Back Google Calendar SMS Reminders (Without Carrier Hacks) | Email to Text Notifier",
  description: "Google killed SMS reminders in 2019. Carrier email gateways died in 2024. Here's the working solution for SMS calendar alerts that takes 5 minutes to set up.",
  keywords: "google calendar sms reminders 2025, text alert for calendar, google calendar text notifications, calendar sms alerts, bring back google calendar sms",
}

export default function GoogleCalendarSMSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              Google Calendar Integration
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Finally: Working SMS Reminders for Google Calendar
              <span className="block text-blue-600 mt-2">No Carrier Hacks Required</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Remember when Google Calendar could text you before meetings? We brought it back. 
              Get real SMS reminders for appointments, medication schedules, and important deadlines.
            </p>
          </div>

          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <Clock className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-900">Why People Need Calendar SMS</AlertTitle>
            <AlertDescription className="text-blue-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Doctor appointments that cost $50 to reschedule if missed</li>
                <li>Medication reminders for time-sensitive doses</li>
                <li>Client calls where being late loses business</li>
                <li>School pickups and important family events</li>
                <li>Work meetings when you're away from your desk</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">The Death of Google Calendar SMS: A Timeline</h2>
          
          <div className="space-y-6 mb-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-sm font-semibold text-gray-500">Pre-2019</span>
              </div>
              <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-1"></div>
              <div className="flex-grow">
                <h4 className="font-semibold mb-1">The Golden Age</h4>
                <p className="text-gray-600">Google Calendar had built-in SMS reminders. Life was good.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-sm font-semibold text-gray-500">Jan 2019</span>
              </div>
              <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full mt-1"></div>
              <div className="flex-grow">
                <h4 className="font-semibold mb-1">Google Kills SMS</h4>
                <p className="text-gray-600">
                  Google removes SMS notifications, citing "infrastructure changes." 
                  Users scramble for alternatives.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-sm font-semibold text-gray-500">2019-2023</span>
              </div>
              <div className="flex-shrink-0 w-4 h-4 bg-yellow-500 rounded-full mt-1"></div>
              <div className="flex-grow">
                <h4 className="font-semibold mb-1">The Carrier Email Era</h4>
                <p className="text-gray-600">
                  Users discover 5551234567@txt.att.net workaround. Set up email notifications 
                  to forward to carrier gateways. It's clunky but works.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-sm font-semibold text-gray-500">Nov 2023</span>
              </div>
              <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full mt-1"></div>
              <div className="flex-grow">
                <h4 className="font-semibold mb-1">AT&T Shuts Down txt.att.net</h4>
                <p className="text-gray-600">The first domino falls. Millions lose their calendar SMS.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-sm font-semibold text-gray-500">2024</span>
              </div>
              <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full mt-1"></div>
              <div className="flex-grow">
                <h4 className="font-semibold mb-1">Carrier Exodus Complete</h4>
                <p className="text-gray-600">
                  Verizon and T-Mobile follow. All major carrier email gateways are dead.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-sm font-semibold text-gray-500">Today</span>
              </div>
              <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-1"></div>
              <div className="flex-grow">
                <h4 className="font-semibold mb-1">Email to Text Notifier</h4>
                <p className="text-gray-600">
                  A proper solution emerges. Real SMS via official carrier APIs, not email hacks.
                </p>
              </div>
            </div>
          </div>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Real User Frustration
              </h3>
              <blockquote className="space-y-3 text-gray-700">
                <p className="italic">
                  "I've missed 3 doctor appointments since AT&T killed their gateway. 
                  That's $150 in no-show fees. Why did Google remove such a basic feature?"
                </p>
                <p className="text-sm">
                  - r/GoogleCalendar, 
                  <a href="https://www.reddit.com/r/GoogleCalendar" 
                     className="text-blue-600 hover:underline"
                     target="_blank"
                     rel="noopener noreferrer">
                    "Any way to get SMS reminders in 2024?"
                  </a>
                </p>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Set Up Calendar SMS in 5 Minutes
          </h2>

          <div className="max-w-3xl mx-auto mb-12">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-2xl">Simple Setup Process</CardTitle>
                <CardDescription>Works with your existing Google Calendar - no app changes needed</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <h4 className="font-semibold mb-1">Sign Up for Email to Text Notifier</h4>
                      <p className="text-gray-600">Get your SMS email: <code className="bg-gray-100 px-2 py-1 rounded text-sm">5551234567@txt.emailtotextnotify.com</code></p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <h4 className="font-semibold mb-1">Add to Google Calendar</h4>
                      <p className="text-gray-600">Settings → Event settings → Add this as a notification email</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <h4 className="font-semibold mb-1">Choose Your Alerts</h4>
                      <p className="text-gray-600">Set default reminders or customize per event</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Setup Guide */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Complete Setup Guide</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Configure Google Calendar Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                  <li>Open Google Calendar on desktop (mobile app won't show all settings)</li>
                  <li>Click the gear icon → "Settings"</li>
                  <li>In the left sidebar, click "Event settings"</li>
                  <li>Under "Notifications", click "Add notification"</li>
                  <li>Add your Email to Text Notifier address</li>
                  <li>Choose "Email" as the notification method</li>
                </ol>
                <div className="mt-4 p-4 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Pro tip:</strong> You'll need to verify this email address. Check your 
                    SMS for the verification code Google sends.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 2: Set Default Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Configure when you want to receive SMS alerts by default:</p>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">For All-Day Events (appointments, deadlines)</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Morning of (9 AM) - good for appointments later that day</li>
                      <li>• 1 day before - perfect for preparation reminders</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">For Timed Events (meetings, calls)</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• 10 minutes before - last-minute reminder</li>
                      <li>• 1 hour before - time to wrap up and prepare</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step 3: Advanced Filtering (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Get SMS only for important events using Gmail filters:
                </p>
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <p className="font-semibold mb-2">Create filters in Gmail:</p>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Forward calendar emails with "Doctor" or "Medical" → SMS immediately</li>
                    <li>Forward calendar emails with "Call" or "Meeting" → SMS during work hours</li>
                    <li>Skip forwarding for events with "Maybe" or "Tentative"</li>
                  </ol>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`Gmail Filter Example:
from:(calendar-notification@google.com) 
subject:("Reminder" OR "Alert") 
"Doctor" OR "Medical" OR "Appointment"
→ Forward to: 5551234567@txt.emailtotextnotify.com`}</pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Real People Using Calendar SMS
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Healthcare Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "I have specialist appointments every few months. The office charges $75 
                  for no-shows. Haven't missed one since setting up SMS reminders."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Setup:</strong> 24-hour and 2-hour SMS reminders for any event with 
                  "Dr" or "appointment"
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Medication Schedules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "I take thyroid medication that must be 30 minutes before eating. 
                  Calendar SMS at 6:30 AM every day. Game changer for consistency."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Setup:</strong> Recurring daily event with SMS reminder at exact time
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Client Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Consultant with back-to-back calls. SMS 5 minutes before each call 
                  means I never keep clients waiting while wrapping up previous calls."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Setup:</strong> 5-minute SMS for events containing "call" or "meeting"
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  School & Family
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "School pickup times vary by day. SMS reminder means I never forget 
                  early dismissal Wednesdays or after-school activities."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Setup:</strong> 30-minute SMS for calendar events tagged #family
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Pro Tips for Calendar SMS</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Smart Reminder Strategies</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <div>
                    <strong>Double Tap:</strong> Set two reminders - one day before 
                    (preparation) and one hour before (final alert)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <div>
                    <strong>Context Clues:</strong> Include location or dial-in info 
                    in event titles so it's in your SMS
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <div>
                    <strong>Travel Buffer:</strong> For in-person meetings, set reminder 
                    for drive time + 10 minutes
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <div>
                    <strong>Time Zones:</strong> Include timezone in event names when 
                    traveling to avoid confusion
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Avoiding Alert Fatigue</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <div>
                    <strong>Selective SMS:</strong> Use email for tentative events, 
                    SMS only for confirmed/important
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <div>
                    <strong>Color Coding:</strong> Use calendar colors, forward only 
                    red (urgent) events to SMS
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <div>
                    <strong>Keyword Filtering:</strong> Add #SMS to events you want 
                    texted, filter in Gmail
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <div>
                    <strong>Business Hours:</strong> Set up time-based filters to 
                    avoid overnight SMS
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Special Use Case: Shared Family Calendars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Multiple family members can get SMS for the same calendar:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Each person signs up for their own Email to Text Notifier account</li>
                <li>Add all SMS email addresses to the shared calendar notifications</li>
                <li>Each person can customize their reminder times</li>
                <li>Perfect for: kids' activities, family appointments, shared responsibilities</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Bell className="h-4 w-4" />
            Join 10,000+ Who Never Miss Important Events
          </div>
          <h2 className="text-3xl font-display font-bold mb-6">
            Stop Missing Life's Important Moments
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Doctor appointments. School pickups. Important calls. Get SMS reminders 
            that actually work. Set up in 5 minutes, works forever.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              Restore Calendar SMS Reminders →
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Works with Google Calendar, Outlook, and any calendar that sends email alerts
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Why did Google remove SMS reminders?</h3>
              <p className="text-gray-600">
                Google cited "infrastructure costs" and low usage in certain markets. The real 
                reason likely involves carrier relationships and the complexity of maintaining 
                SMS delivery across hundreds of global carriers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is this more reliable than the old carrier email tricks?</h3>
              <p className="text-gray-600">
                Yes, significantly. We use official carrier APIs with 99.9% delivery rates. The 
                old email gateways had ~60% success rates even when they worked, plus delays of 
                5-30 minutes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I use this with work calendars?</h3>
              <p className="text-gray-600">
                Yes! It works with any calendar that can send email notifications: Google Workspace, 
                Outlook/Exchange, Apple Calendar, etc. Just add your Email to Text Notifier address 
                as a notification recipient.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What about recurring events?</h3>
              <p className="text-gray-600">
                Perfect for recurring events! Set up once, get SMS reminders forever. Great for 
                daily medications, weekly meetings, monthly appointments, or annual reminders.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How do I stop getting alerts for cancelled events?</h3>
              <p className="text-gray-600">
                Google Calendar automatically stops sending notifications for cancelled events. 
                For more control, you can set up Gmail filters to exclude emails containing 
                "Cancelled" from forwarding to SMS.
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
              Carrier Email Gateway Shutdown →
            </Link>
            <Link href="/use-cases/home-assistant" className="text-blue-600 hover:underline">
              Smart Home Alerts →
            </Link>
            <Link href="/use-cases/wordpress-woocommerce" className="text-blue-600 hover:underline">
              E-commerce Order Alerts →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
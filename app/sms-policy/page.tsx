"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, MessageSquare, CheckCircle } from "lucide-react"

export default function SMSPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-3xl">💬</span>
            <span className="font-display font-bold text-xl">Email to Text Notifier</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">SMS Messaging Policy & Opt-In</h1>
          <p className="text-xl text-muted-foreground">
            How we handle SMS messaging and protect your privacy
          </p>
        </div>

        {/* Critical Opt-In Notice */}
        <Card className="mb-8 border-amber-400 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Shield className="h-6 w-6" />
              EXPLICIT OPT-IN REQUIRED
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="font-semibold text-lg text-gray-900">
                Email to Text Notifier requires explicit, voluntary consent before sending any SMS messages.
              </p>
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <p className="font-medium mb-3">Users must:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Check a consent checkbox that clearly states they agree to receive text messages</li>
                  <li>Understand exactly what types of messages they'll receive (forwarded emails from their unique address)</li>
                  <li>Know the frequency and source of messages (toll-free number 866-942-1024)</li>
                  <li>Have the ability to opt-out at any time by replying STOP</li>
                </ol>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="font-semibold text-red-900">
                  ⚠️ IMPORTANT: Consent for SMS messaging is NEVER required to use any other features of our service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Service Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Service Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Email to Text Notifier is a service that forwards email notifications to your mobile phone via SMS. 
                When you sign up for our service, you explicitly opt-in to receive SMS messages containing your 
                email notifications.
              </p>
              <p>
                <strong>Sending Numbers:</strong> Messages are sent from our toll-free numbers including (866) 942-1024 and others. 
                All our numbers are verified toll-free SMS numbers.
              </p>
            </CardContent>
          </Card>

          {/* Opt-In Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Opt-In Process
              </CardTitle>
              <CardDescription>
                How you consent to receive SMS messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Two-Step Consent Process</h3>
                  <p className="text-gray-600 mb-2">
                    We use a comprehensive two-step consent process to ensure clear, explicit opt-in:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 text-gray-600">
                    <li>
                      <strong>Initial Consent (Website):</strong> You enter your phone number and check an explicit consent checkbox that clearly states you agree to receive text messages from Email to Text Notifier
                    </li>
                    <li>
                      <strong>First SMS Consent:</strong> The verification code SMS itself includes consent language: <em>"By requesting this code, you consent to receive SMS from us at (866) 942-1024"</em>
                    </li>
                    <li>
                      <strong>Final Confirmation:</strong> When entering the verification code on our website, you see a notice confirming: <em>"By entering this verification code, you confirm your consent to receive SMS notifications"</em>
                    </li>
                    <li>
                      <strong>Account Creation:</strong> Only after all consent steps are completed is your account created and SMS forwarding activated
                    </li>
                  </ol>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                  <p className="text-sm font-semibold mb-2">Exact Consent Statement Users See:</p>
                  <div className="bg-white p-3 rounded border border-amber-100">
                    <p className="text-sm mb-2">
                      <strong>"By checking this box, I expressly consent to receive text messages from Email to Text Notifier at the phone number provided above."</strong>
                    </p>
                    <ul className="text-xs space-y-1 ml-4">
                      <li>• I will receive SMS messages containing forwarded email content that I send to my unique @txt.emailtotextnotify.com address</li>
                      <li>• Messages will be sent from toll-free number (866) 942-1024</li>
                      <li>• Message frequency depends on how many emails I forward (typically 10-100/month)</li>
                      <li>• I will also receive account notifications (usage alerts, billing updates)</li>
                      <li>• Standard message and data rates may apply</li>
                      <li>• I can reply STOP to opt-out at any time</li>
                      <li className="font-semibold">• This consent is not required to purchase any goods or services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Types */}
          <Card>
            <CardHeader>
              <CardTitle>Types of Messages You'll Receive</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Email Notifications:</strong> Forwarded content from emails sent to your unique 
                    @txt.emailtotextnotify.com address
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Account Alerts:</strong> Important updates about your account, usage limits, 
                    and billing notifications
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Verification Codes:</strong> One-time codes for account security and phone 
                    number verification (with consent reminder in each message)
                  </div>
                </li>
              </ul>
              
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Example Verification Message:</strong><br />
                    "Email to Text Notifier: Your verification code is 123456. By requesting this code, you consent to receive SMS from us at (866) 942-1024. Reply STOP to opt-out. Msg&data rates may apply."
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Example Forwarded Email:</strong><br />
                    "New email from noreply@github.com: Your CI build #1234 passed. View at https://emailtotextnotify.com/e/abc123"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Frequency */}
          <Card>
            <CardHeader>
              <CardTitle>Message Frequency & Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The number of SMS messages you receive depends on:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• How many emails are sent to your unique forwarding address</li>
                <li>• Your subscription plan limits (10-1,000 messages per month)</li>
                <li>• Account notifications (typically 1-5 per month)</li>
              </ul>
              <p className="mt-4">
                <strong>Estimated Volume:</strong> Most users receive between 10-100 messages per month
              </p>
            </CardContent>
          </Card>

          {/* Opt-Out Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                How to Opt-Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Text Message Opt-Out</h3>
                  <p className="text-gray-600">
                    Reply <span className="font-mono bg-gray-100 px-2 py-1 rounded">STOP</span> to any 
                    message to immediately stop receiving SMS notifications
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Account Dashboard</h3>
                  <p className="text-gray-600">
                    Pause or disable SMS delivery from your account settings at any time
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Get Help</h3>
                  <p className="text-gray-600">
                    Reply <span className="font-mono bg-gray-100 px-2 py-1 rounded">HELP</span> for 
                    support information
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• We never share your phone number with third parties</li>
                <li>• Messages are sent only for emails YOU forward to our service</li>
                <li>• All data is encrypted in transit and at rest</li>
                <li>• We comply with TCPA regulations and carrier requirements</li>
                <li>• No marketing messages unless you explicitly opt-in</li>
              </ul>
              
              <div className="mt-4">
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  View our full Privacy Policy →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                By using Email to Text Notifier, you agree to:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Receive SMS messages at the phone number you provide</li>
                <li>• Standard message and data rates may apply</li>
                <li>• Messages are sent via our verified toll-free numbers</li>
                <li>• You can opt-out at any time by replying STOP</li>
              </ul>
              
              <div className="mt-4">
                <Link href="/terms" className="text-blue-600 hover:underline">
                  View full Terms of Service →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                For questions about our SMS messaging service:
              </p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> support@emailtotextnotify.com</li>
                <li><strong>SMS Help:</strong> Reply HELP to any message</li>
                <li><strong>Website:</strong> emailtotextnotify.com/support</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Link href="/get-started">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
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
                <strong>Phone Number:</strong> Messages are sent from <span className="font-mono">+1 (877) 674-4599</span>
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
                  <h3 className="font-semibold mb-2">Web Form Opt-In</h3>
                  <p className="text-gray-600 mb-2">
                    During registration at emailtotextnotify.com, you:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Enter your mobile phone number in our sign-up form</li>
                    <li>Check a consent checkbox agreeing to receive SMS messages</li>
                    <li>Receive a verification code via SMS to confirm your number</li>
                    <li>Enter the verification code to complete registration</li>
                  </ol>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Consent Statement:</strong> "I consent to receive SMS messages at this number. 
                    Message and data rates may apply. Reply STOP to opt out at any time."
                  </p>
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
                    number verification
                  </div>
                </li>
              </ul>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Example Message:</strong><br />
                  "New email from noreply@github.com: Your CI build #1234 passed successfully. 
                  View full message at emailtotextnotify.com/messages"
                </p>
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
                <li>• Messages are sent via toll-free number +1 (877) 674-4599</li>
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
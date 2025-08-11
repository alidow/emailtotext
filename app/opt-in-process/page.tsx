"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowDown, Shield, MessageSquare, CheckCircle, Phone, AlertCircle, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function OptInProcessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">💬</span>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl">Email to Text Notifier</span>
              <span className="text-xs text-gray-600">SMS Gateway Service</span>
            </div>
          </div>
          <div className="flex flex-col text-right">
            <div className="text-xs text-gray-500 font-medium">Operated by</div>
            <div className="font-bold text-lg">Celestial Platform, LLC</div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        {/* Header Section with Business Branding */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-full mb-4">
              <span className="text-2xl mr-2">💬</span>
              <span className="font-bold text-lg">Email to Text Notifier</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">A service of Celestial Platform, LLC</p>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">SMS Opt-In Process & User Consent</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Complete walkthrough of how users sign up and consent to receive text messages
          </p>
          <div className="bg-blue-50 p-4 rounded-lg max-w-3xl mx-auto border-2 border-blue-200">
            <p className="text-gray-700">
              <strong>Email to Text Notifier by Celestial Platform, LLC</strong> is a transactional email-to-SMS forwarding service. 
              Users receive a unique email address (e.g., 5551234567@txt.emailtotextnotify.com) and any 
              emails sent to that address are forwarded as SMS messages to their phone. This page documents 
              our comprehensive consent collection process for toll-free number <strong>(866) 942-1024</strong>.
            </p>
          </div>
        </div>

        {/* Step 1: Initial Consent */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold">Initial Consent on Website</h2>
          </div>
          
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle>Homepage Phone Entry Form - Email to Text Notifier</CardTitle>
              <CardDescription>
                Users visit https://emailtotextnotify.com (operated by Celestial Platform, LLC) and enter their phone number
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Phone Input Field */}
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 z-10" />
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    disabled
                    className="w-full pl-20 pr-8 h-24 text-3xl font-bold tracking-wider border-4 border-gray-200 bg-white rounded-2xl shadow-lg placeholder:text-gray-400 placeholder:text-3xl placeholder:font-normal cursor-not-allowed"
                    style={{
                      letterSpacing: '0.15em',
                      fontFamily: 'system-ui, -apple-system, "SF Pro Display", sans-serif',
                      fontSize: '1.875rem'
                    }}
                  />
                </div>

                {/* Consent Checkbox - EXACT REPLICA */}
                <div className="bg-amber-50 p-5 rounded-lg border-2 border-amber-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="demo-consent"
                      disabled
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="demo-consent" className="text-base font-medium text-gray-900 leading-relaxed block mb-3">
                        By checking this box, I expressly consent to receive text messages from Email to Text Notifier at the phone number provided above.
                      </Label>
                      <div className="text-sm text-gray-700 space-y-1.5 ml-1">
                        <p className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          I will receive SMS messages containing forwarded email content that I send to my unique @txt.emailtotextnotify.com address
                        </p>
                        <p className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Messages will be sent from toll-free number (866) 942-1024
                        </p>
                        <p className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Message frequency depends on how many emails I forward (typically 10-100/month)
                        </p>
                        <p className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          I will also receive account notifications (usage alerts, billing updates)
                        </p>
                        <p className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Standard message and data rates may apply
                        </p>
                        <p className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          I can reply STOP to opt-out at any time
                        </p>
                        <p className="flex items-start font-medium">
                          <span className="text-blue-600 mr-2">•</span>
                          This consent is not required to purchase any goods or services
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">IMPORTANT: Checkbox is NEVER pre-selected</p>
                      <p className="text-sm text-red-700 mt-1">
                        Users must actively check the consent box to proceed. Pre-checking is prohibited.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center mb-8">
          <ArrowDown className="h-8 w-8 text-gray-400" />
        </div>

        {/* Step 2: SMS Verification */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold">SMS Verification with Embedded Consent</h2>
          </div>
          
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Verification SMS Message from Celestial Platform, LLC</CardTitle>
              <CardDescription>
                User receives this exact SMS message with verification code and consent reminder from our toll-free number
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
                <div className="mb-2 text-gray-400">From: +18669421024</div>
                <div className="whitespace-pre-wrap">
Email to Text Notifier: Your verification code is 123456. By requesting this code, you consent to receive SMS from us at (866) 942-1024. Reply STOP to opt-out. Msg&data rates may apply. Expires in 10 min.
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Key Points:</strong>
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• SMS includes consent language directly in the message</li>
                  <li>• Clear identification of sender (Email to Text Notifier)</li>
                  <li>• Toll-free number displayed</li>
                  <li>• Opt-out instructions included (Reply STOP)</li>
                  <li>• Message and data rates disclosure</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center mb-8">
          <ArrowDown className="h-8 w-8 text-gray-400" />
        </div>

        {/* Step 3: Final Consent Confirmation */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="text-2xl font-bold">Final Consent Confirmation</h2>
          </div>
          
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Verification Code Entry Page</CardTitle>
              <CardDescription>
                User enters code at https://emailtotextnotify.com/verify and sees consent confirmation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Code Input */}
                <div>
                  <Label htmlFor="code">Verification Code</Label>
                  <input
                    type="text"
                    placeholder="123456"
                    disabled
                    className="w-full px-8 h-24 text-3xl text-center font-bold tracking-wider border-4 border-gray-200 bg-white rounded-2xl shadow-lg placeholder:text-gray-400 placeholder:font-normal cursor-not-allowed"
                    style={{
                      letterSpacing: '0.25em',
                      fontFamily: 'system-ui, -apple-system, "SF Pro Display", sans-serif',
                      fontSize: '1.875rem'
                    }}
                  />
                </div>

                {/* Consent confirmation notice */}
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <p className="text-sm text-gray-700">
                    <strong>By entering this verification code, you confirm your consent to receive:</strong>
                  </p>
                  <ul className="text-xs text-gray-600 mt-2 space-y-1 ml-4">
                    <li>• SMS notifications of emails forwarded to your unique @txt.emailtotextnotify.com address</li>
                    <li>• Account alerts and usage notifications</li>
                    <li>• Messages from toll-free number (866) 942-1024</li>
                    <li>• Reply STOP at any time to opt-out</li>
                  </ul>
                </div>

                <Button disabled className="w-full">
                  Verify Phone Number
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center mb-8">
          <ArrowDown className="h-8 w-8 text-gray-400" />
        </div>

        {/* Step 4: Account Creation */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-bold">Account Creation Complete</h2>
          </div>
          
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Service Activated</CardTitle>
              <CardDescription>
                Only after all consent steps are completed is the account created
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-medium text-green-900 mb-2">
                  User's unique email address is now active:
                </p>
                <code className="bg-white px-3 py-2 rounded border block text-center text-lg">
                  5551234567@txt.emailtotextnotify.com
                </code>
                <p className="text-sm text-gray-600 mt-3">
                  Emails sent to this address will be forwarded as SMS to the verified phone number.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opt-Out Methods */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              How Users Can Opt-Out
            </CardTitle>
            <CardDescription>
              Multiple methods available for immediate opt-out
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold mb-1">Method 1: Text Message</h3>
                <p className="text-gray-600">
                  Reply <span className="font-mono bg-gray-100 px-2 py-1 rounded">STOP</span> to any 
                  message to immediately stop receiving all SMS notifications
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-1">Method 2: Account Dashboard</h3>
                <p className="text-gray-600">
                  Log into your account at https://emailtotextnotify.com/dashboard and disable SMS delivery
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold mb-1">Method 3: Contact Support</h3>
                <p className="text-gray-600">
                  Email support@emailtotextnotify.com to request removal from SMS list
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Opt-Out Response:</strong> When a user replies STOP, they receive:
                </p>
                <div className="bg-gray-900 text-green-400 p-3 rounded mt-2 font-mono text-xs">
                  You have successfully been unsubscribed. You will not receive any more messages from this number. Reply START to resubscribe.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Compliance & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Voluntary Consent</p>
                    <p className="text-sm text-gray-600">Not required to use any other services</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Clear Disclosure</p>
                    <p className="text-sm text-gray-600">Message types, frequency, and costs explained</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Never Pre-Checked</p>
                    <p className="text-sm text-gray-600">User must actively check consent box</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Consent Logging</p>
                    <p className="text-sm text-gray-600">All consent tracked with timestamps & IP</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">TCPA Compliant</p>
                    <p className="text-sm text-gray-600">Follows all regulatory requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Easy Opt-Out</p>
                    <p className="text-sm text-gray-600">Multiple methods, instant processing</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-gray-600">
            For more information about our SMS practices:
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/sms-policy" className="text-blue-600 hover:underline">
              SMS Policy
            </Link>
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
          </div>
          
          <div className="mt-8">
            <Link href="/get-started">
              <Button size="lg">
                View Live Opt-In Form
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
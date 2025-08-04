"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Shield, Zap, ArrowRight, Check, Phone, Mail, Bell, Server, Clock, Star, ChevronRight, BookOpen, HelpCircle } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "")
    const phoneNumberLength = phoneNumber.length
    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value)
    setPhone(formattedPhoneNumber)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      alert("Please accept the terms to continue")
      return
    }
    setLoading(true)
    // Navigate to verification page
    window.location.href = `/verify?phone=${encodeURIComponent(phone)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">💬</span>
            <span className="text-xl font-display font-semibold tracking-tight leading-relaxed">Email to Text Notifier</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="/use-cases" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Use Cases</a>
            <a href="#resources" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Resources</a>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard'}>Sign In</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="get-started" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Forward any email
            </span>
            <br />
            <span className="text-gray-900">to your phone as SMS</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The most reliable email to text forwarding service. Get instant SMS alerts from 
            important emails, monitoring systems, and notifications.
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="max-w-xl mx-auto mb-16">
          <Card className="shadow-2xl border-0 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1"></div>
            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-display font-bold text-center mb-2">Get Started</h2>
                  <p className="text-center text-gray-600 mb-6">
                    Enter your phone number to create your email forwarding address
                  </p>
                </div>

                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 z-10" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={14}
                    required
                    className="w-full pl-20 pr-8 h-24 text-3xl md:text-3xl text-left font-bold tracking-wider border-4 border-gray-200 bg-white rounded-2xl shadow-lg placeholder:text-gray-400 placeholder:text-3xl placeholder:font-normal focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:shadow-xl focus:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:border-gray-300 focus:outline-none"
                    style={{
                      letterSpacing: '0.15em',
                      fontFamily: 'system-ui, -apple-system, "SF Pro Display", sans-serif',
                      fontSize: '1.875rem' // Force 3xl size (30px)
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500 -z-10 scale-110" />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(checked) => setConsent(checked as boolean)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="consent" className="text-sm font-normal text-gray-700 leading-relaxed">
                      I consent to receive SMS messages at this number. Message and data rates may apply. 
                      Reply STOP to opt out at any time. View our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg" 
                  disabled={loading || !consent}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Credit card required • 10 free texts per month
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Why Choose Email to Text Notifier?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most advanced email to SMS gateway with enterprise-grade features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-display">Instant Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Emails are converted to SMS and delivered to your phone in under 3 seconds. 
                  Perfect for time-sensitive alerts and notifications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-display">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your messages are encrypted and automatically expire 
                  to keep your information private and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-display">AT&T Replacement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Perfect replacement for AT&T's discontinued email-to-text service. 
                  Works with all carriers and phone numbers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-display">Multiple Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Works with Gmail, Outlook, monitoring tools, server alerts, 
                  and any service that sends email notifications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Server className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl font-display">99.9% Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enterprise-grade infrastructure ensures your critical alerts 
                  are never missed. Redundant systems across multiple regions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl font-display">Full Message History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access your complete email history online. Search, filter, 
                  and export your forwarded messages anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">How Email to SMS Forwarding Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your unique email address and start receiving texts in minutes
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200"></div>
              
              <div className="text-center relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Sign Up & Verify</h3>
                <p className="text-gray-600">
                  Enter your phone number and verify it with a simple SMS code. Takes less than 60 seconds.
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Get Your Email</h3>
                <p className="text-gray-600">
                  Receive your unique @txt.emailtotextnotify.com address instantly. It's yours forever.
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Start Forwarding</h3>
                <p className="text-gray-600">
                  Any email sent to your address is instantly converted and delivered as an SMS to your phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Perfect for Every Use Case</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From server monitoring to business alerts, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="font-display font-semibold text-xl mb-4">🖥️ IT & DevOps</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Server down alerts from monitoring tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Security breach notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Backup completion status</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">CI/CD pipeline notifications</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="font-display font-semibold text-xl mb-4">💼 Business & Sales</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">New lead notifications from CRM</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Important client emails</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Order confirmations and updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Calendar reminders and meeting alerts</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="font-display font-semibold text-xl mb-4">🏠 Personal Use</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Package delivery notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Bank transaction alerts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Travel updates and confirmations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">School or daycare notifications</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="font-display font-semibold text-xl mb-4">🔔 Monitoring & Alerts</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Website uptime monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">IoT device notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Security camera alerts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Weather and emergency alerts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees, cancel anytime.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-gray-700">Billing:</span>
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <button 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    billingCycle === 'monthly' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    billingCycle === 'annual' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setBillingCycle('annual')}
                >
                  Annual <span className="text-green-600 font-semibold">(Save 20%)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-display">Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Perfect for trying out</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>10 texts per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>7-day message history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Auto-upgrade to Basic when exceeded</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => router.push('/verify')}
                >
                  Start Free
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 relative shadow-xl scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold text-center whitespace-nowrap">
                MOST POPULAR
              </div>
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-display">Basic</CardTitle>
                <div className="mt-4">
                  {billingCycle === 'monthly' ? (
                    <>
                      <span className="text-4xl font-bold">$4.99</span>
                      <span className="text-gray-600">/month</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">$4</span>
                      <span className="text-gray-600">/month</span>
                      <p className="text-sm text-green-600 font-medium">$47.88 billed annually</p>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Great for personal use</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">100 texts per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">30-day message history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Auto-buy: $0.055/text after quota</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">SMS delivery reports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Priority support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  onClick={() => router.push(`/verify?plan=basic&billing=${billingCycle}`)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-display">Standard</CardTitle>
                <div className="mt-4">
                  {billingCycle === 'monthly' ? (
                    <>
                      <span className="text-4xl font-bold">$9.99</span>
                      <span className="text-gray-600">/month</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">$8</span>
                      <span className="text-gray-600">/month</span>
                      <p className="text-sm text-green-600 font-medium">$95.88 billed annually</p>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">For active users</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>500 texts per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>90-day message history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Auto-buy: $0.022/text after quota</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => router.push(`/verify?plan=standard&billing=${billingCycle}`)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-display">Premium</CardTitle>
                <div className="mt-4">
                  {billingCycle === 'monthly' ? (
                    <>
                      <span className="text-4xl font-bold">$19.99</span>
                      <span className="text-gray-600">/month</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">$16</span>
                      <span className="text-gray-600">/month</span>
                      <p className="text-sm text-green-600 font-medium">$191.88 billed annually</p>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">For power users</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>1,000 texts per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Unlimited message history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Auto-buy: $0.022/text after quota</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => router.push(`/verify?plan=premium&billing=${billingCycle}`)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">How our pricing works:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Free Plan:</strong> When you exceed 10 texts, we'll automatically upgrade you to Basic and notify you by email.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Paid Plans:</strong> After using your monthly quota, additional texts are automatically purchased in blocks of 100 at your plan's rate + 10%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Annual Billing:</strong> Save 20% when you pay annually. You can switch between monthly and annual billing anytime.</span>
              </li>
            </ul>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Need more than 1,000 texts per month? 
              <a href="/contact" className="text-blue-600 hover:underline ml-1">Contact us for custom pricing</a>
            </p>
          </div>
        </div>
      </section>

      {/* Popular Use Cases Section */}
      <section id="use-cases" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Popular Use Cases & Solutions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands to solve critical notification challenges
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={() => window.location.href = '/use-cases/carrier-email-shutdown'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-sm text-red-600 font-medium">CRITICAL</span>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  Carrier Email Gateway Shutdown
                </CardTitle>
                <CardDescription>
                  AT&T, Verizon, and T-Mobile have all shut down their email-to-text gateways. Get a reliable replacement that works with all carriers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-red-600 font-medium">
                  <span>Find Your Solution</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={() => window.location.href = '/use-cases/server-monitoring'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Server className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-blue-600 font-medium">DEVOPS</span>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  Server Monitoring Alerts
                </CardTitle>
                <CardDescription>
                  Get instant SMS alerts from Nagios, Zabbix, and other monitoring tools when servers go down or critical issues arise.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Learn More</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={() => window.location.href = '/use-cases/wordpress-woocommerce'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">ECOMMERCE</span>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  WooCommerce Order Alerts
                </CardTitle>
                <CardDescription>
                  Instant SMS notifications for new orders, low stock alerts, and payment issues. Never miss a sale again.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-green-600 font-medium">
                  <span>Setup Guide</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={() => window.location.href = '/use-cases/uptime-monitoring'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm text-orange-600 font-medium">MONITORING</span>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  UptimeRobot Free Plan Fix
                </CardTitle>
                <CardDescription>
                  UptimeRobot's free plan doesn't include SMS. Forward their email alerts to get instant text notifications without upgrading.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-orange-600 font-medium">
                  <span>View Solution</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={() => window.location.href = '/use-cases/trading-alerts'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-purple-600 font-medium">TRADING</span>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  TradingView & IBKR Alerts
                </CardTitle>
                <CardDescription>
                  Get instant SMS alerts for price movements, trade executions, and market conditions. Never miss a trading opportunity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-purple-600 font-medium">
                  <span>Start Now</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={() => window.location.href = '/use-cases/aws-sns-cost'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-sm text-indigo-600 font-medium">COST SAVINGS</span>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  AWS SNS Alternative
                </CardTitle>
                <CardDescription>
                  Save up to 95% compared to AWS SNS pricing. Our flat-rate plans beat AWS's $0.00645 per SMS pricing model.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-indigo-600 font-medium">
                  <span>Calculate Savings</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="group"
              onClick={() => window.location.href = '/use-cases'}
            >
              View All Use Cases
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Resources & Guides</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about email to SMS forwarding
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => window.location.href = '/guides/email-to-text'}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">GUIDE</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  Complete Guide to Email to Text Forwarding
                </CardTitle>
                <CardDescription>
                  Learn how email to SMS gateways work, best practices, and how to choose the right service 
                  for your needs. Includes comparisons with carrier-specific solutions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Read Guide</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => window.location.href = '/guides/att-alternative'}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-purple-600 font-medium">FAQ</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  AT&T Email to Text Alternative
                </CardTitle>
                <CardDescription>
                  With AT&T discontinuing their email-to-text gateway, find out how our service provides 
                  a better, more reliable replacement with additional features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-purple-600 font-medium">
                  <span>Learn More</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => window.location.href = '/guides/server-monitoring'}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <Server className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">TUTORIAL</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  Setting Up Server Monitoring Alerts
                </CardTitle>
                <CardDescription>
                  Step-by-step tutorial on forwarding critical server alerts, uptime monitoring notifications, 
                  and system logs to your phone via SMS.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-green-600 font-medium">
                  <span>View Tutorial</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => window.location.href = '/guides/security'}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">SECURITY</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-display mb-3">
                  Email to SMS Security Best Practices
                </CardTitle>
                <CardDescription>
                  Ensure your forwarded messages stay secure. Learn about encryption, authentication, 
                  and how to protect sensitive information in transit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-red-600 font-medium">
                  <span>Read More</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-display font-bold mb-6">
              What is Email to Text Message Forwarding?
            </h3>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                Email to text forwarding, also known as email to SMS gateway service, allows you to 
                automatically convert and forward email messages to your mobile phone as text messages (SMS). 
                This technology bridges the gap between email communication and instant mobile notifications.
              </p>
              <p className="mb-4">
                Unlike traditional carrier-specific email-to-text services (like the recently discontinued 
                AT&T email to text feature), modern email to SMS services offer advanced features including:
              </p>
              <ul className="mb-4 list-disc pl-6 space-y-2">
                <li>Universal compatibility with all mobile carriers</li>
                <li>Advanced filtering and routing options</li>
                <li>Message history and search capabilities</li>
                <li>API integration for automated systems</li>
                <li>Enhanced security and encryption</li>
              </ul>
              <p>
                Whether you need to forward server alerts, business notifications, or personal emails to 
                your phone, email to text forwarding ensures you never miss critical messages, even when 
                you're away from your computer.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* AT&T Notice */}
      <section id="att-notice" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-display font-bold mb-4">
              Looking for an AT&T Email-to-Text Replacement?
            </h3>
            <p className="text-gray-700 mb-6">
              AT&T recently <a href="https://lsreg.att.com/support/article/wireless/KM1061254/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">discontinued their email-to-SMS gateway service</a>, 
              leaving many users searching for alternatives. Email to Text Notifier provides a superior 
              replacement with more features, better reliability, and support for all carriers.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => {
                document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Switch from AT&T Today
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Never Miss an Important Email Again?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands who rely on Email to Text Notifier for instant SMS alerts. 
            Start your free trial today - no credit card required.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="h-14 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            onClick={() => {
              document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm opacity-75">
            10 free texts per month • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💬</span>
                <span className="text-white font-display font-semibold">Email to Text Notifier</span>
              </div>
              <p className="text-sm">
                The most reliable email to SMS forwarding service. 
                Instant delivery, bank-level security.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/use-cases" className="hover:text-white transition-colors">Use Cases</a></li>
                <li><a href="#resources" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#att-notice" className="hover:text-white transition-colors">AT&T Alternative</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="/refund" className="hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Celestial Platform, LLC. All rights reserved.</p>
            <p className="mt-2">TCPA Compliant • Secure & Private</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GoogleAdsConversion } from "@/components/GoogleAdsConversion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Shield, Mail, MessageSquare, Phone, CreditCard, Star, Lock, Send, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function StartPage() {
  const router = useRouter()
  const [messageCount, setMessageCount] = useState(10000)

  useEffect(() => {
    // Simulate growing message count
    const interval = setInterval(() => {
      setMessageCount(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Start Landing Page',
        page_location: '/start',
        page_path: '/start'
      })
    }
  }, [])

  const handleGetStarted = () => {
    // Track conversion event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'start_flow_initiated', {
        page_location: 'hero_section',
        value: 3.0
      })
    }
    
    // Report Google Ads conversion
    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion('/start/account')
    } else {
      router.push('/start/account')
    }
  }

  const features = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Universal Email Forwarding",
      description: "Forward any email to your unique @txt.emailtotextnotify.com address"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Instant SMS Delivery",
      description: "Receive important emails as text messages within seconds"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties"
    }
  ]

  const trustSignals = [
    "🔒 SSL Encrypted",
    "✓ " + messageCount.toLocaleString() + "+ Messages Delivered",
    "↻ Cancel Anytime",
    "💰 30-Day Money Back"
  ]

  return (
    <>
      <GoogleAdsConversion conversionEvent="BEGIN_CHECKOUT_1" />
      {/* Trust Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 text-center text-sm">
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-4 md:gap-8">
          {trustSignals.map((signal, idx) => (
            <span key={idx} className="whitespace-nowrap">{signal}</span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">💬</span>
            <span className="text-xl font-display font-semibold">Email to Text Notifier</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Trusted by 1000+ businesses and developers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Forward any email
              </span>
              <br />
              <span className="text-gray-900">to your phone as SMS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The most reliable email to text forwarding service. Get instant SMS alerts from 
              important emails, monitoring systems, and notifications.
            </p>
            
            {/* CTA Button - Mobile First (Above Visual on Mobile) */}
            <div className="md:hidden mb-8">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="mt-4 text-sm text-gray-600">
                Get started in 2 minutes • 10 free texts per month
              </p>
            </div>
            
            {/* Visual Flow Illustration - Clean & Simple */}
            <div className="max-w-3xl mx-auto mb-8 md:mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                <h3 className="text-center text-lg font-semibold mb-6 md:mb-8 text-gray-700">How It Works</h3>
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  {/* Step 1: Your Email */}
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Any Email</h4>
                    <p className="text-sm text-gray-600">Alerts, notifications, or important messages</p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden md:block">
                    <div className="flex items-center justify-center">
                      <div className="w-full relative">
                        <div className="h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-green-400 rounded-full"></div>
                        <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden flex justify-center">
                    <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 rotate-90" />
                  </div>
                  
                  {/* Step 2: Your Phone */}
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Your Phone</h4>
                    <p className="text-sm text-gray-600">Instant SMS notification delivered in seconds</p>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-8 bg-gray-50 rounded-xl p-3 md:p-4">
                  <p className="text-center text-sm text-gray-700">
                    <span className="font-semibold">It's that simple!</span> Forward to your unique email address and get instant texts.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button - Desktop (Below Visual) */}
            <div className="hidden md:block">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="mt-4 text-sm text-gray-600">
                Get started in 2 minutes • 10 free texts per month
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <Card className="mb-12">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Simple 4-Step Setup</CardTitle>
              <CardDescription>Get started in less than 2 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: <Mail />, step: "1", title: "Create Account", desc: "Sign up with email or Google" },
                  { icon: <Phone />, step: "2", title: "Verify Phone", desc: "One-time SMS verification" },
                  { icon: <Check />, step: "3", title: "Choose Plan", desc: "Start free or pick a plan" },
                  { icon: <CreditCard />, step: "4", title: "Activate", desc: "Secure your account" }
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full mb-3">
                      {item.icon}
                    </div>
                    <p className="font-semibold text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust Section */}
          <div className="text-center mb-12">
            <p className="text-sm text-gray-600 mb-4">Powered by industry leaders</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 font-medium">Twilio SMS</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 font-medium">Stripe Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 font-medium">SSL Encrypted</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-2">
                    "Finally, a reliable email-to-text service that just works. Perfect for server alerts and monitoring."
                  </p>
                  <p className="text-sm text-gray-600">- Developer from San Francisco</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Join hundreds of users who never miss important emails
            </p>
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Create Your Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline">Terms of Service</Link> and{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 Email to Text Notifier. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
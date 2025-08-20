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
            
            {/* Visual Flow Illustration */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  {/* Step 1: Email */}
                  <div className="text-center">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
                      <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 mb-1">Forward any email to:</p>
                      <p className="font-mono text-xs font-bold text-gray-900">5551234567@txt.</p>
                      <p className="font-mono text-xs font-bold text-gray-900">emailtotextnotify.com</p>
                    </div>
                    <p className="text-sm font-medium">Send Email</p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden md:flex justify-center">
                    <div className="relative">
                      <Send className="h-8 w-8 text-blue-600 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-0.5 w-20 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300"></div>
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden flex justify-center my-2">
                    <ArrowRight className="h-6 w-6 text-blue-600 rotate-90" />
                  </div>
                  
                  {/* Step 2: SMS */}
                  <div className="text-center">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
                      <Smartphone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="bg-gray-100 rounded p-2 text-left">
                        <p className="text-xs text-gray-500 mb-1">From: (866) 942-1024</p>
                        <p className="text-xs font-medium text-gray-900">Subject: Server Alert</p>
                        <p className="text-xs text-gray-700">Your server is down...</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">Receive SMS</p>
                  </div>
                </div>
                
                <p className="text-center mt-4 text-sm text-gray-600">
                  Works with any email sender • Instant delivery • No app required
                </p>
              </div>
            </div>

            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="mt-4 text-sm text-gray-600">
              No credit card required to browse • 10 free texts per month
            </p>
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
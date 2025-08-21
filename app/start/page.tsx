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
    "↻ Cancel Anytime"
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
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="text-gray-900">Turn any email into a</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                text message
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get started for free in 2 minutes. Perfect for server alerts, order notifications, 
              and any email you can't afford to miss.
            </p>
            
            {/* CTA Button - Mobile First (Above Visual on Mobile) */}
            <div className="md:hidden mb-8">
              <div className="relative inline-block">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="relative h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5 animate-arrow-bounce" />
                  </span>
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-50 animate-pulse-glow"></div>
                </Button>
              </div>
              
              <p className="mt-4 text-sm text-gray-600">
                Get started in 2 minutes • 10 free texts per month
              </p>
            </div>
            
            {/* Visual Flow Illustration - Animated & Polished */}
            <div className="max-w-3xl mx-auto mb-8 md:mb-12">
              <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  {/* Step 1: Your Email */}
                  <div className="text-center group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email Received</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Server alerts, orders, notifications</p>
                  </div>
                  
                  {/* Animated Gradient Flow */}
                  <div className="hidden md:block">
                    <div className="relative h-16 flex items-center">
                      {/* Base gradient track */}
                      <div className="absolute inset-x-0 h-2 bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 rounded-full overflow-hidden">
                        {/* Seamless animated waves */}
                        <div className="absolute inset-0">
                          <div className="absolute inset-y-0 -left-full w-[200%] opacity-40">
                            <div className="h-full w-full bg-gradient-to-r from-transparent via-blue-500 via-purple-500 to-transparent animate-seamless-flow"></div>
                          </div>
                          <div className="absolute inset-y-0 -left-full w-[200%] opacity-40">
                            <div className="h-full w-full bg-gradient-to-r from-transparent via-purple-500 via-green-500 to-transparent animate-seamless-flow-delayed"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Directional arrow at the end */}
                      <div className="absolute right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-500 animate-pulse-subtle">
                        <ArrowRight className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Arrow - Vertical with Animation */}
                  <div className="md:hidden flex justify-center py-4">
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      {/* Animated gradient line */}
                      <div className="absolute h-12 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 rounded-full overflow-hidden">
                        <div className="absolute inset-0 opacity-60">
                          <div className="h-[200%] w-full bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-mobile-flow"></div>
                        </div>
                      </div>
                      {/* Arrow at bottom */}
                      <div className="absolute -bottom-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-green-400">
                        <ArrowRight className="h-3 w-3 text-green-600 rotate-90" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 2: Your Phone */}
                  <div className="text-center group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 animate-phone-buzz">
                      <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">SMS Delivered</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Instant text on your phone</p>
                  </div>
                </div>
              </div>
            </div>
            
            <style jsx>{`
              @keyframes seamless-flow {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(50%);
                }
              }
              
              @keyframes pulse-subtle {
                0%, 100% {
                  opacity: 1;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.8;
                  transform: scale(0.95);
                }
              }
              
              @keyframes phone-buzz {
                0%, 100% {
                  transform: rotate(0deg);
                }
                10%, 30%, 50%, 70% {
                  transform: rotate(-2deg);
                }
                20%, 40%, 60%, 80% {
                  transform: rotate(2deg);
                }
              }
              
              
              @keyframes pulse-glow {
                0%, 100% {
                  opacity: 0.3;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.6;
                  transform: scale(1.05);
                }
              }
              
              @keyframes arrow-bounce {
                0%, 100% {
                  transform: translateX(0);
                }
                50% {
                  transform: translateX(3px);
                }
              }
              
              @keyframes mobile-flow {
                0% {
                  transform: translateY(-50%);
                }
                100% {
                  transform: translateY(50%);
                }
              }
              
              .animate-seamless-flow {
                animation: seamless-flow 4s linear infinite;
              }
              
              .animate-seamless-flow-delayed {
                animation: seamless-flow 4s linear infinite;
                animation-delay: 2s;
              }
              
              .animate-pulse-subtle {
                animation: pulse-subtle 3s ease-in-out infinite;
              }
              
              .animate-phone-buzz {
                animation: phone-buzz 4s ease-in-out infinite;
                animation-delay: 2s;
              }
              
              
              .animate-pulse-glow {
                animation: pulse-glow 2s ease-in-out infinite;
              }
              
              .animate-arrow-bounce {
                animation: arrow-bounce 1s ease-in-out infinite;
              }
              
              .animate-mobile-flow {
                animation: mobile-flow 3s linear infinite;
              }
            `}</style>

            {/* CTA Button - Desktop (Below Visual) */}
            <div className="hidden md:block">
              <div className="relative inline-block">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="relative h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <span className="relative z-10 flex items-center">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5 animate-arrow-bounce" />
                  </span>
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-50 animate-pulse-glow"></div>
                </Button>
              </div>
              
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
            <div className="relative inline-block">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="relative h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="relative z-10 flex items-center">
                  Create Your Free Account
                  <ArrowRight className="ml-2 h-5 w-5 animate-arrow-bounce" />
                </span>
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-50 animate-pulse-glow"></div>
              </Button>
            </div>
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
              © {new Date().getFullYear()} Celestial Platform, LLC. All rights reserved.
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
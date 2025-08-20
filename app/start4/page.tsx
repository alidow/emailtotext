"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GoogleAdsConversion } from "@/components/GoogleAdsConversion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowRight, Send, Smartphone, Mail, Play, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Start4Page() {
  const router = useRouter()
  const [demoEmail, setDemoEmail] = useState("")
  const [demoStep, setDemoStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userPhone, setUserPhone] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Start4 Interactive Demo Landing Page',
        page_location: '/start4',
        page_path: '/start4'
      })
    }
  }, [])

  const handleGetStarted = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'start_flow_initiated', {
        page_location: 'interactive_demo',
        value: 3.0
      })
    }
    
    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion('/start/account')
    } else {
      router.push('/start/account')
    }
  }

  const startDemo = () => {
    setIsPlaying(true)
    setDemoStep(1)
    
    // Simulate the flow
    setTimeout(() => setDemoStep(2), 1500)
    setTimeout(() => setDemoStep(3), 3000)
    setTimeout(() => setDemoStep(4), 4500)
    setTimeout(() => {
      setDemoStep(5)
      setIsPlaying(false)
    }, 6000)
  }

  const resetDemo = () => {
    setDemoStep(0)
    setIsPlaying(false)
  }

  const demoEmails = [
    {
      from: "alerts@datadog.com",
      subject: "🚨 Server CPU at 98%",
      preview: "Alert: Production server CPU usage critical..."
    },
    {
      from: "orders@shopify.com",
      subject: "New Order #1234 - $499",
      preview: "You have a new order from John Smith..."
    },
    {
      from: "stripe@notifications.com",
      subject: "Payment Received - $2,499",
      preview: "Payment successfully processed for invoice..."
    }
  ]

  return (
    <>
      <GoogleAdsConversion conversionEvent="BEGIN_CHECKOUT_1" />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Email to Text
          </Link>
          <Button onClick={handleGetStarted} variant="default">
            Get Started
          </Button>
        </nav>
      </header>

      {/* Hero with Interactive Demo */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <Play className="h-3 w-3 mr-1" />
              Interactive Demo Below
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              See It In Action
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mt-2">
                Right Now
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how emails instantly become SMS messages. 
              Try the interactive demo below—no signup required.
            </p>
          </div>

          {/* Interactive Demo Area */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Email Inbox */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Your Email Inbox
                </h3>
                
                <div className="bg-white rounded-xl shadow-lg p-4 space-y-3">
                  {demoEmails.map((email, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        demoStep === 2 && idx === 0 
                          ? 'border-purple-500 bg-purple-50 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => !isPlaying && startDemo()}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{email.from}</p>
                          <p className="text-sm font-medium text-gray-700 mt-1">{email.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">{email.preview}</p>
                        </div>
                        {demoStep === 2 && idx === 0 && (
                          <Send className="h-5 w-5 text-purple-600 animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {demoStep === 0 && (
                    <Button 
                      onClick={startDemo} 
                      className="w-full"
                      variant="outline"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Click to Start Demo
                    </Button>
                  )}
                </div>
              </div>

              {/* Right: Phone Screen */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Your Phone
                </h3>
                
                <div className="bg-gray-900 rounded-3xl p-4 shadow-xl">
                  <div className="bg-white rounded-2xl p-4 min-h-[400px] flex flex-col">
                    {/* Phone Status Bar */}
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span>9:41 AM</span>
                      <span>100% 🔋</span>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 space-y-3">
                      {demoStep >= 4 && (
                        <div className="animate-slide-up">
                          <div className="bg-green-500 text-white rounded-2xl rounded-bl-sm p-3 max-w-[80%]">
                            <p className="text-xs font-semibold mb-1">From: Email to Text</p>
                            <p className="text-sm">🚨 Server CPU at 98%</p>
                            <p className="text-xs mt-1 opacity-80">Alert: Production server CPU usage critical...</p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Delivered</p>
                        </div>
                      )}
                      
                      {demoStep === 3 && (
                        <div className="flex justify-center items-center h-full">
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                              <Send className="h-8 w-8 text-green-600 animate-pulse" />
                            </div>
                            <p className="text-sm text-gray-600">Converting email to SMS...</p>
                          </div>
                        </div>
                      )}
                      
                      {demoStep === 5 && (
                        <div className="text-center mt-8">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                          <p className="font-semibold">SMS Delivered!</p>
                          <p className="text-sm text-gray-600 mt-1">In under 3 seconds</p>
                          <Button 
                            onClick={resetDemo} 
                            size="sm" 
                            variant="outline" 
                            className="mt-4"
                          >
                            Run Demo Again
                          </Button>
                        </div>
                      )}
                      
                      {demoStep === 0 && (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-400 text-sm">
                            SMS messages will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Demo Progress Bar */}
            {isPlaying && (
              <div className="mt-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-6000"
                    style={{ width: `${(demoStep / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Try It Yourself */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">
                Try It With Your Phone Number
              </h2>
              <div className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter your phone number"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleGetStarted}>
                    Get Your Email Address
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  We'll create your unique email address instantly
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Setup Time", value: "< 2 min" },
              { label: "Delivery Speed", value: "< 3 sec" },
              { label: "Uptime", value: "99.9%" },
              { label: "Free Texts", value: "10/month" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-bold text-purple-600">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Never Miss an Email Again?
            </h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Get instant SMS alerts for your important emails.
              Start free, upgrade anytime.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleGetStarted}
              className="h-14 px-10 text-lg font-bold"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-sm opacity-80">
              Setup in 2 minutes • 10 free texts • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </>
  )
}
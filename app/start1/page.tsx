"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GoogleAdsConversion } from "@/components/GoogleAdsConversion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Server, ShoppingCart, DollarSign, Shield, Zap, Bell, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function Start1Page() {
  const router = useRouter()
  const [selectedUseCase, setSelectedUseCase] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Start1 Use Case Landing Page',
        page_location: '/start1',
        page_path: '/start1'
      })
    }
  }, [])

  const handleGetStarted = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'start_flow_initiated', {
        page_location: 'use_case_hero',
        value: 3.0
      })
    }
    
    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion('/start/account')
    } else {
      router.push('/start/account')
    }
  }

  const useCases = [
    {
      icon: <Server className="h-6 w-6" />,
      title: "Server Monitoring",
      description: "Get instant alerts when your server goes down, CPU spikes, or disk space runs low",
      example: "Apache server down on production-01",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "E-commerce Orders",
      description: "Receive SMS notifications for every new order, refund request, or inventory alert",
      example: "New order #1234: $299.99 from John D.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Payment Alerts",
      description: "Track successful payments, failed transactions, and subscription renewals",
      example: "Payment received: $1,299 from Acme Corp",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security Notifications",
      description: "Stay informed about login attempts, password changes, and security breaches",
      example: "Suspicious login attempt from 192.168.1.1",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const benefits = [
    "Works with ANY email sender",
    "No API integration needed",
    "Instant delivery (< 3 seconds)",
    "99.9% uptime guarantee",
    "Encrypted & secure",
    "Cancel anytime"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedUseCase((prev) => (prev + 1) % useCases.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <GoogleAdsConversion conversionEvent="BEGIN_CHECKOUT_1" />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <span className="text-xl font-semibold">Email to Text</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Button onClick={handleGetStarted} size="sm">
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Instant SMS alerts for critical emails
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Never Miss Critical{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {useCases[selectedUseCase].title}
              </span>
              <br />
              Alerts Again
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Forward any email to your unique address and get instant SMS notifications on your phone.
              Perfect for developers, business owners, and anyone who needs real-time alerts.
            </p>
          </div>

          {/* Use Cases Showcase */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Use Case Cards */}
              <div className="space-y-4">
                {useCases.map((useCase, idx) => (
                  <Card 
                    key={idx}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedUseCase === idx ? 'shadow-lg border-blue-500' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedUseCase(idx)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`${useCase.bgColor} p-2 rounded-lg`}>
                          <div className={useCase.color}>{useCase.icon}</div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{useCase.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{useCase.description}</p>
                          <div className="bg-gray-100 rounded p-2">
                            <p className="text-xs font-mono text-gray-700">
                              📱 SMS: {useCase.example}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Right: Live Demo */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Live Example
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-2">Step 1: Email Received</p>
                    <div className="bg-gray-900 rounded p-3">
                      <p className="text-xs text-gray-400">To: yourphone@txt.emailtotextnotify.com</p>
                      <p className="text-sm font-semibold mt-1">{useCases[selectedUseCase].example}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-blue-400 animate-bounce" />
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-4">
                    <p className="text-xs mb-2">Step 2: SMS Delivered</p>
                    <div className="bg-white/10 rounded p-3">
                      <p className="text-sm font-semibold">{useCases[selectedUseCase].example}</p>
                      <p className="text-xs mt-2 opacity-80">Delivered in &lt; 3 seconds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Why Developers Love Us</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Start Receiving SMS Alerts in 2 Minutes
              </h2>
              <p className="text-lg mb-6 opacity-90">
                No credit card required • 10 free texts per month • Cancel anytime
              </p>
              <Button 
                size="lg"
                variant="secondary"
                onClick={handleGetStarted}
                className="h-14 px-8 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="mt-4 text-sm opacity-80">
                Join 1,000+ developers and businesses already using our service
              </p>
            </CardContent>
          </Card>
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
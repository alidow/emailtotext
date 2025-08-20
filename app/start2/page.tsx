"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GoogleAdsConversion } from "@/components/GoogleAdsConversion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, X, Check, Mail, Smartphone, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function Start2Page() {
  const router = useRouter()
  const [animateProblems, setAnimateProblems] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Start2 Before After Landing Page',
        page_location: '/start2',
        page_path: '/start2'
      })
    }
    
    // Trigger animations
    const timer = setTimeout(() => setAnimateProblems(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleGetStarted = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'start_flow_initiated', {
        page_location: 'before_after_hero',
        value: 3.0
      })
    }
    
    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion('/start/account')
    } else {
      router.push('/start/account')
    }
  }

  const beforeProblems = [
    "Constantly checking email for important alerts",
    "Missing critical server downtime notifications",
    "Delayed response to customer orders",
    "Lost revenue from missed opportunities",
    "Anxiety about missing urgent messages"
  ]

  const afterBenefits = [
    "Instant SMS alerts for critical emails",
    "Never miss an important notification",
    "Respond to issues in seconds, not hours",
    "Peace of mind with reliable delivery",
    "Stay connected without email addiction"
  ]

  return (
    <>
      <GoogleAdsConversion conversionEvent="BEGIN_CHECKOUT_1" />
      
      {/* Simple Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            💬 Email to Text
          </Link>
          <Button onClick={handleGetStarted} size="sm">
            Get Started →
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Main Headline */}
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              Setup in 2 minutes
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Stop Missing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                Critical Emails
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Forward any email to your unique address. Get instant SMS alerts on your phone. 
              Never miss what matters.
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Before - The Problem */}
            <Card className="border-2 border-red-200 bg-red-50/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Before</h2>
                </div>
                
                <div className="space-y-4">
                  {beforeProblems.map((problem, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-start gap-3 ${
                        animateProblems ? 'animate-slide-in' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{problem}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600 text-center">
                    😰 The average person checks email 15 times per day
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* After - The Solution */}
            <Card className="border-2 border-green-200 bg-green-50/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">After</h2>
                </div>
                
                <div className="space-y-4">
                  {afterBenefits.map((benefit, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-start gap-3 ${
                        animateProblems ? 'animate-slide-in' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${(idx + 5) * 100}ms` }}
                    >
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 text-center">
                    🎯 Average response time: Under 3 seconds
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Simple How It Works */}
          <div className="bg-gray-100 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">How Simple Is It?</h2>
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 mx-auto mb-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-semibold">1. Forward Email</p>
                </div>
                
                <ArrowRight className="h-8 w-8 text-gray-400 mx-4" />
                
                <div className="text-center flex-1">
                  <div className="w-16 h-16 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-semibold">2. Get SMS</p>
                </div>
              </div>
              
              <p className="text-center mt-8 text-gray-600">
                That's it. No API. No coding. No complex setup.
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-8 flex-wrap justify-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">1,000+</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">99.9%</p>
                <p className="text-sm text-gray-600">Uptime</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">&lt;3s</p>
                <p className="text-sm text-gray-600">Delivery Time</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Never Miss an Important Email Again?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start free. Get started in 2 minutes. Cancel anytime.
            </p>
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="h-14 px-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-sm text-gray-500">
              10 free texts per month • Setup in 2 minutes
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  )
}
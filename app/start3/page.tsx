"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GoogleAdsConversion } from "@/components/GoogleAdsConversion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Clock, TrendingUp, Heart, Users, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function Start3Page() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Start3 Benefit Driven Landing Page',
        page_location: '/start3',
        page_path: '/start3'
      })
    }
  }, [])

  const handleGetStarted = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'start_flow_initiated', {
        page_location: 'benefit_hero',
        value: 3.0
      })
    }
    
    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion('/start/account')
    } else {
      router.push('/start/account')
    }
  }

  const mainBenefits = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      subtitle: "Average delivery under 3 seconds",
      description: "While others are still loading their inbox, you've already responded",
      stat: "3 sec",
      statLabel: "avg delivery"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Rock Solid Reliable",
      subtitle: "99.9% uptime guarantee",
      description: "Built on enterprise infrastructure that never sleeps",
      stat: "99.9%",
      statLabel: "uptime"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Scale Without Limits",
      subtitle: "From 10 to 10,000 messages",
      description: "Grows with your business without missing a beat",
      stat: "∞",
      statLabel: "scalability"
    }
  ]

  const emotionalBenefits = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Peace of Mind",
      description: "Sleep better knowing you'll never miss critical alerts"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Save Hours Daily",
      description: "Stop refreshing your inbox every 5 minutes"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Delight Customers",
      description: "Respond to issues before they even notice"
    }
  ]

  const testimonials = [
    {
      quote: "This service literally saved my business. Got alerted to a server crash at 2 AM and fixed it before any customers noticed.",
      author: "Sarah Chen",
      role: "CTO, TechStartup",
      rating: 5
    },
    {
      quote: "Finally I can disconnect from email without anxiety. Critical stuff comes to my phone, everything else can wait.",
      author: "Mike Rodriguez",
      role: "Freelance Developer",
      rating: 5
    },
    {
      quote: "Our response time to customer orders went from hours to minutes. Revenue is up 23% since we started using this.",
      author: "Jessica Park",
      role: "E-commerce Owner",
      rating: 5
    }
  ]

  return (
    <>
      <GoogleAdsConversion conversionEvent="BEGIN_CHECKOUT_1" />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">
              💬 Email to Text
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden md:flex">
                <CheckCircle className="h-3 w-3 mr-1" />
                1,000+ Happy Users
              </Badge>
              <Button onClick={handleGetStarted}>
                Get Started Free
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              Rated 5/5 by 500+ users
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Finally, Email Alerts That
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
                Actually Alert You
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Turn any email into an instant SMS. Because checking your inbox 
              50 times a day isn't productivity—it's insanity.
            </p>
            
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="mt-4 text-sm text-gray-500">
              No credit card • 10 free texts • Setup in 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Smart People Choose Us</h2>
            <p className="text-lg text-gray-600">We're not just another service. We're your competitive advantage.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {mainBenefits.map((benefit, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="text-blue-600 mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <p className="text-sm text-gray-600">{benefit.subtitle}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{benefit.description}</p>
                  <div className="pt-4 border-t">
                    <p className="text-3xl font-bold text-blue-600">{benefit.stat}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{benefit.statLabel}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emotional Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">More Than Just Technology</h2>
              <p className="text-lg text-gray-600">It's about getting your life back</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {emotionalBenefits.map((benefit, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-purple-600 mb-4">{benefit.icon}</div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join 1,000+ Happy Users</h2>
            <p className="text-lg text-gray-600">Real stories from real people</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-white to-blue-50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-sm">{testimonial.author}</p>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Your Competition Is Already Using This
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Every minute you wait is another potential missed opportunity. 
            Start your free trial now and see the difference in minutes.
          </p>
          <Button 
            size="lg"
            variant="secondary"
            onClick={handleGetStarted}
            className="h-14 px-10 text-lg font-bold bg-white text-blue-600 hover:bg-gray-100"
          >
            Claim Your Free Trial Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-6 text-sm opacity-80">
            Average setup time: 1 minute 47 seconds
          </p>
        </div>
      </section>
    </>
  )
}
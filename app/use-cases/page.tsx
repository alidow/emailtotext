"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Phone, Server, MessageSquare, Clock, Zap, Shield, Bell, Globe, CreditCard, Home, Package, Filter, Sparkles, TrendingUp, Users } from "lucide-react"

const useCases = [
  {
    title: "Carrier Email Gateway Shutdown",
    description: "AT&T, Verizon, and T-Mobile shut down their email-to-text services. Get a reliable replacement that works with all carriers.",
    href: "/use-cases/carrier-email-shutdown",
    icon: Phone,
    category: "Critical",
    color: "red",
    priority: 1,
    metrics: { users: "10K+", urgency: "High" }
  },
  {
    title: "Server Monitoring Alerts",
    description: "Get instant SMS alerts from Nagios, Zabbix, and other monitoring tools when servers go down or critical issues arise.",
    href: "/use-cases/server-monitoring",
    icon: Server,
    category: "DevOps",
    color: "blue",
    priority: 2,
    metrics: { delivery: "3 sec", uptime: "99.9%" }
  },
  {
    title: "WooCommerce Order Alerts",
    description: "Instant SMS notifications for new orders, low stock alerts, and payment issues. Never miss a sale again.",
    href: "/use-cases/wordpress-woocommerce",
    icon: MessageSquare,
    category: "E-commerce",
    color: "green",
    priority: 3,
    metrics: { revenue: "+15%", response: "< 1 min" }
  },
  {
    title: "UptimeRobot Free Plan Fix",
    description: "UptimeRobot's free plan doesn't include SMS. Forward their email alerts to get instant text notifications without upgrading.",
    href: "/use-cases/uptime-monitoring",
    icon: Clock,
    category: "Monitoring",
    color: "orange",
    priority: 4,
    metrics: { savings: "$20/mo", alerts: "24/7" }
  },
  {
    title: "TradingView & IBKR Alerts",
    description: "Get instant SMS alerts for price movements, trade executions, and market conditions. Never miss a trading opportunity.",
    href: "/use-cases/trading-alerts",
    icon: Zap,
    category: "Trading",
    color: "purple",
    priority: 5,
    metrics: { speed: "Real-time", accuracy: "100%" }
  },
  {
    title: "AWS SNS Alternative",
    description: "Better than AWS SNS for teams. Get message history, web links to full content, and simpler setup without AWS complexity.",
    href: "/use-cases/aws-sns-cost",
    icon: Shield,
    category: "DevOps",
    color: "indigo",
    priority: 6,
    metrics: { history: "∞", setup: "60 sec" }
  },
  {
    title: "Cloudflare Security Alerts",
    description: "Get instant SMS notifications for DDoS attacks, security events, and origin server issues from Cloudflare.",
    href: "/use-cases/cloudflare-alerts",
    icon: Globe,
    category: "Security",
    color: "cyan",
    priority: 7,
    metrics: { threats: "Instant", coverage: "Global" }
  },
  {
    title: "GitHub Actions Notifications",
    description: "Receive SMS alerts for failed builds, security vulnerabilities, and deployment status from GitHub Actions.",
    href: "/use-cases/github-actions",
    icon: Package,
    category: "Development",
    color: "gray",
    priority: 8,
    metrics: { builds: "CI/CD", teams: "1-100+" }
  },
  {
    title: "Google Calendar SMS Reminders",
    description: "Forward Google Calendar email reminders as SMS. Perfect for appointments, meetings, and event notifications.",
    href: "/use-cases/google-calendar-sms",
    icon: Bell,
    category: "Productivity",
    color: "yellow",
    priority: 9,
    metrics: { missed: "-90%", setup: "2 min" }
  },
  {
    title: "Salesforce CRM Alerts",
    description: "Get SMS notifications for high-value opportunities, escalated cases, and important lead activities.",
    href: "/use-cases/salesforce-crm",
    icon: CreditCard,
    category: "Sales",
    color: "pink",
    priority: 10,
    metrics: { deals: "+25%", response: "5 min" }
  },
  {
    title: "Home Assistant IoT Alerts",
    description: "Receive SMS alerts from your smart home for security events, sensor triggers, and automation notifications.",
    href: "/use-cases/home-assistant",
    icon: Home,
    category: "Smart Home",
    color: "emerald",
    priority: 11,
    metrics: { devices: "100+", latency: "< 5s" }
  },
  {
    title: "Stripe Payment Notifications",
    description: "Instant SMS alerts for successful payments, failed charges, disputes, and subscription changes.",
    href: "/use-cases/stripe-payments",
    icon: CreditCard,
    category: "Payments",
    color: "violet",
    priority: 12,
    metrics: { fraud: "-40%", revenue: "+10%" }
  }
]

const categories = ["All", "Critical", "DevOps", "E-commerce", "Monitoring", "Trading", "Cost Savings", "Security", "Development", "Productivity", "Sales", "Smart Home", "Payments"]

export default function UseCasesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredUseCases = selectedCategory === "All" 
    ? useCases 
    : useCases.filter(uc => uc.category === selectedCategory)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Email to Text Use Cases & Solutions",
    "description": "Discover proven solutions for email-to-SMS notifications across industries",
    "url": "https://emailtotext.io/use-cases",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": useCases.map((useCase, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": useCase.title,
        "description": useCase.description,
        "url": `https://emailtotext.io${useCase.href}`
      }))
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-2 group">
                <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                <span className="text-lg font-display font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Email to Text Notifier
                </span>
              </a>
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </a>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300"
                  onClick={() => window.location.href = '/'}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
          <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className={`container mx-auto px-4 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
              <Sparkles className="h-4 w-4" />
              Trusted by 10,000+ Users
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Use Cases & Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Discover how thousands of users rely on Email to Text Notifier to solve critical 
              notification challenges across industries and applications.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {[
                { icon: Package, label: `${useCases.length} Solutions`, value: "Proven" },
                { icon: TrendingUp, label: "99.9%", value: "Uptime" },
                { icon: Globe, label: "All Carriers", value: "Supported" },
                { icon: Users, label: "10K+", value: "Active Users" }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                >
                  <stat.icon className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white shadow-sm sticky top-[73px] z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 transition-all duration-300 ${
                    selectedCategory === category 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                      : "hover:border-blue-400"
                  }`}
                >
                  {category}
                  {category !== "All" && (
                    <Badge variant="secondary" className="ml-2 bg-white/20">
                      {useCases.filter(uc => uc.category === category).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredUseCases.sort((a, b) => a.priority - b.priority).map((useCase, idx) => {
                const Icon = useCase.icon
                const colorClasses: Record<string, string> = {
                  red: "bg-red-100 text-red-600 border-red-200",
                  blue: "bg-blue-100 text-blue-600 border-blue-200",
                  green: "bg-green-100 text-green-600 border-green-200",
                  orange: "bg-orange-100 text-orange-600 border-orange-200",
                  purple: "bg-purple-100 text-purple-600 border-purple-200",
                  indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
                  cyan: "bg-cyan-100 text-cyan-600 border-cyan-200",
                  gray: "bg-gray-100 text-gray-600 border-gray-200",
                  yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
                  pink: "bg-pink-100 text-pink-600 border-pink-200",
                  emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
                  violet: "bg-violet-100 text-violet-600 border-violet-200",
                }
                
                const gradientClasses: Record<string, string> = {
                  red: "from-red-500 to-pink-500",
                  blue: "from-blue-500 to-cyan-500",
                  green: "from-green-500 to-emerald-500",
                  orange: "from-orange-500 to-yellow-500",
                  purple: "from-purple-500 to-pink-500",
                  indigo: "from-indigo-500 to-purple-500",
                  cyan: "from-cyan-500 to-blue-500",
                  gray: "from-gray-500 to-slate-500",
                  yellow: "from-yellow-500 to-orange-500",
                  pink: "from-pink-500 to-rose-500",
                  emerald: "from-emerald-500 to-green-500",
                  violet: "from-violet-500 to-purple-500",
                }
                
                return (
                  <Card 
                    key={useCase.href}
                    className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ 
                      transitionDelay: `${idx * 50}ms`,
                      animation: isVisible ? `fadeInUp 0.6s ease-out ${idx * 50}ms` : 'none'
                    }}
                    onClick={() => window.location.href = useCase.href}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[useCase.color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${colorClasses[useCase.color]} border group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${colorClasses[useCase.color]} bg-opacity-20`}>
                          {useCase.category}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-display mb-3 group-hover:text-blue-600 transition-colors">
                        {useCase.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 line-clamp-2">
                        {useCase.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(useCase.metrics).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

          {/* Additional Use Cases Coming Soon */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-display font-bold mb-4">More Use Cases Coming Soon</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              We're constantly adding new use cases and integration guides based on user feedback. 
              Have a specific use case in mind? Let us know!
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/contact'}>
              Request a Use Case
            </Button>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Solve Your Notification Challenges?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands who trust Email to Text Notifier for critical alerts. 
              Start with 10 free texts per month.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              onClick={() => window.location.href = '/'}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

        {/* Footer */}
        <footer className="py-8 bg-gray-900 text-gray-400">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} Celestial Platform, LLC. All rights reserved.</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>•</span>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <span>•</span>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <span>•</span>
              <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
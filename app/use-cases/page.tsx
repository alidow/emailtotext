"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Server, MessageSquare, Clock, Zap, Shield, Bell, Globe, CreditCard, Home, Package } from "lucide-react"

const useCases = [
  {
    title: "Carrier Email Gateway Shutdown",
    description: "AT&T, Verizon, and T-Mobile shut down their email-to-text services. Get a reliable replacement that works with all carriers.",
    href: "/use-cases/carrier-email-shutdown",
    icon: Phone,
    category: "Critical",
    color: "red",
    priority: 1
  },
  {
    title: "Server Monitoring Alerts",
    description: "Get instant SMS alerts from Nagios, Zabbix, and other monitoring tools when servers go down or critical issues arise.",
    href: "/use-cases/server-monitoring",
    icon: Server,
    category: "DevOps",
    color: "blue",
    priority: 2
  },
  {
    title: "WooCommerce Order Alerts",
    description: "Instant SMS notifications for new orders, low stock alerts, and payment issues. Never miss a sale again.",
    href: "/use-cases/wordpress-woocommerce",
    icon: MessageSquare,
    category: "E-commerce",
    color: "green",
    priority: 3
  },
  {
    title: "UptimeRobot Free Plan Fix",
    description: "UptimeRobot's free plan doesn't include SMS. Forward their email alerts to get instant text notifications without upgrading.",
    href: "/use-cases/uptime-monitoring",
    icon: Clock,
    category: "Monitoring",
    color: "orange",
    priority: 4
  },
  {
    title: "TradingView & IBKR Alerts",
    description: "Get instant SMS alerts for price movements, trade executions, and market conditions. Never miss a trading opportunity.",
    href: "/use-cases/trading-alerts",
    icon: Zap,
    category: "Trading",
    color: "purple",
    priority: 5
  },
  {
    title: "AWS SNS Cost Alternative",
    description: "Save up to 95% compared to AWS SNS pricing. Our flat-rate plans beat AWS's $0.00645 per SMS pricing model.",
    href: "/use-cases/aws-sns-cost",
    icon: Shield,
    category: "Cost Savings",
    color: "indigo",
    priority: 6
  },
  {
    title: "Cloudflare Security Alerts",
    description: "Get instant SMS notifications for DDoS attacks, security events, and origin server issues from Cloudflare.",
    href: "/use-cases/cloudflare-alerts",
    icon: Globe,
    category: "Security",
    color: "cyan",
    priority: 7
  },
  {
    title: "GitHub Actions Notifications",
    description: "Receive SMS alerts for failed builds, security vulnerabilities, and deployment status from GitHub Actions.",
    href: "/use-cases/github-actions",
    icon: Package,
    category: "Development",
    color: "gray",
    priority: 8
  },
  {
    title: "Google Calendar SMS Reminders",
    description: "Forward Google Calendar email reminders as SMS. Perfect for appointments, meetings, and event notifications.",
    href: "/use-cases/google-calendar-sms",
    icon: Bell,
    category: "Productivity",
    color: "yellow",
    priority: 9
  },
  {
    title: "Salesforce CRM Alerts",
    description: "Get SMS notifications for high-value opportunities, escalated cases, and important lead activities.",
    href: "/use-cases/salesforce-crm",
    icon: CreditCard,
    category: "Sales",
    color: "pink",
    priority: 10
  },
  {
    title: "Home Assistant IoT Alerts",
    description: "Receive SMS alerts from your smart home for security events, sensor triggers, and automation notifications.",
    href: "/use-cases/home-assistant",
    icon: Home,
    category: "Smart Home",
    color: "emerald",
    priority: 11
  },
  {
    title: "Stripe Payment Notifications",
    description: "Instant SMS alerts for successful payments, failed charges, disputes, and subscription changes.",
    href: "/use-cases/stripe-payments",
    icon: CreditCard,
    category: "Payments",
    color: "violet",
    priority: 12
  }
]

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span className="text-lg font-display font-semibold">Email to Text Notifier</span>
            </a>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</a>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Use Cases & Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover how thousands of users rely on Email to Text Notifier to solve critical 
            notification challenges across industries and applications.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold">{useCases.length}</span> Proven Solutions
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold">99.9%</span> Uptime
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold">All Carriers</span> Supported
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {useCases.sort((a, b) => a.priority - b.priority).map((useCase) => {
              const Icon = useCase.icon
              const colorClasses: Record<string, string> = {
                red: "bg-red-100 text-red-600",
                blue: "bg-blue-100 text-blue-600",
                green: "bg-green-100 text-green-600",
                orange: "bg-orange-100 text-orange-600",
                purple: "bg-purple-100 text-purple-600",
                indigo: "bg-indigo-100 text-indigo-600",
                cyan: "bg-cyan-100 text-cyan-600",
                gray: "bg-gray-100 text-gray-600",
                yellow: "bg-yellow-100 text-yellow-600",
                pink: "bg-pink-100 text-pink-600",
                emerald: "bg-emerald-100 text-emerald-600",
                violet: "bg-violet-100 text-violet-600",
              }
              
              return (
                <Card 
                  key={useCase.href}
                  className="hover:shadow-xl transition-all duration-200 cursor-pointer group"
                  onClick={() => window.location.href = useCase.href}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[useCase.color]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses[useCase.color]} bg-opacity-20`}>
                        {useCase.category}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-display mb-3 group-hover:text-blue-600 transition-colors">
                      {useCase.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {useCase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
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
  )
}
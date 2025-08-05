import { Metadata } from "next"
import Link from "next/link"
import { TrendingUp, Zap, Shield, Clock, Bell, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: "Instant Trading Alerts via SMS - TradingView, IBKR & More | Email to Text",
  description: "Never miss a critical trade signal. Get instant SMS alerts from TradingView, Interactive Brokers, ThinkOrSwim and any trading platform that sends emails.",
  keywords: "trading alerts sms, tradingview text alerts, ibkr sms notifications, stock price alerts, trading signals mobile",
}

export default function TradingAlertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              For Active Traders
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Convert Email Trading Alerts
              <span className="block text-green-600">Into Instant SMS</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              TradingView, IBKR, and ThinkOrSwim only send emails. We convert them to SMS 
              quickly. Never miss a price target or trade signal again.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/">
                Start Getting Trading Alerts →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fast alert delivery. Never miss a price target or stop loss again.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Reliable Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Works when carrier gateways fail. Your alerts always get through.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Any Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  If it sends email alerts, we'll deliver them as SMS. Simple as that.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Works With Every Trading Platform
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "TradingView", desc: "Price alerts, indicator signals, strategy alerts" },
              { name: "Interactive Brokers", desc: "Price triggers, order fills, margin calls" },
              { name: "ThinkOrSwim", desc: "Study alerts, price movements, order status" },
              { name: "MetaTrader", desc: "EA notifications, price alerts, trade signals" },
              { name: "NinjaTrader", desc: "Strategy alerts, market conditions, fills" },
              { name: "Any Platform", desc: "If it emails, we'll text it to you" }
            ].map((platform) => (
              <div key={platform.name} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">{platform.name}</h3>
                <p className="text-gray-600 text-sm">{platform.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Set Up in 60 Seconds
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Get Your Email</h3>
              <p className="text-gray-600">
                Sign up and get your unique @txt.emailtotextnotify.com address
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Add to Platform</h3>
              <p className="text-gray-600">
                Enter this email in your trading platform's alert settings
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Get SMS Alerts</h3>
              <p className="text-gray-600">
                Every alert email instantly arrives as a text on your phone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Built for Serious Traders
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              "Instant delivery during market volatility",
              "Works globally with any carrier",
              "No app required - pure SMS",
              "Filter alerts by keywords",
              "24/7 reliability guarantee",
              "Complete message history online"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Stop Missing Profitable Trades
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of traders who never miss an alert. 
            Start with 10 free alerts per month.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/">
              Set Up Trading Alerts Now →
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
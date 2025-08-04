import { Metadata } from "next"
import Link from "next/link"
import { CreditCard, AlertTriangle, DollarSign, Shield, Zap, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: "Stripe Email Notifications → Instant SMS | Email to Text",
  description: "Get SMS for every Stripe payment, dispute, and failed charge. Know about chargebacks instantly. No webhooks or coding required - just add one email address.",
  keywords: "stripe sms notifications, stripe payment alerts, stripe chargeback sms, payment failed text alert, stripe dispute notification",
}

export default function StripePaymentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CreditCard className="h-4 w-4" />
              Stripe Payment Alerts
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Stripe Emails About Payments?
              <span className="block text-purple-600 mt-2">Get Them as SMS Instead</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              A chargeback just hit. Failed payment from your biggest customer. The emails are 
              sitting unread. Convert Stripe notifications to instant SMS without any code.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/">
                Get Payment SMS Alerts →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Critical Payment Events You're Missing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Disputes & Chargebacks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You have 7 days to respond. Email noticed on day 6? You've already lost. 
                  Average loss: $2,500 per dispute.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Failed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Subscription payment failed. Customer churns before you even know. 
                  23% never retry after first failure.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Large Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  $10K payment arrives at 11 PM Friday. You celebrate Monday morning. 
                  Customer wondered all weekend why no confirmation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Every Stripe Event → Instant SMS
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Payment Alerts</h3>
              <ul className="space-y-2">
                {[
                  "Successful payment received",
                  "Payment > $1,000 processed",
                  "First payment from new customer",
                  "Subscription renewed",
                  "Invoice paid"
                ].map((alert) => (
                  <li key={alert} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Critical Alerts</h3>
              <ul className="space-y-2">
                {[
                  "Payment failed (card declined)",
                  "Dispute/chargeback received",
                  "Refund requested",
                  "Subscription canceled",
                  "Payout failed"
                ].map((alert) => (
                  <li key={alert} className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-gray-700">{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Card className="border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle>2-Minute Setup (No Code Required)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <h4 className="font-semibold">Go to Stripe Dashboard</h4>
                    <p className="text-sm text-gray-600">Settings → Team and security → Email notifications</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <h4 className="font-semibold">Add SMS Email Address</h4>
                    <p className="text-sm text-gray-600">Add: 5551234567@txt.emailtotextnotify.com to notifications</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <h4 className="font-semibold">Select Event Types</h4>
                    <p className="text-sm text-gray-600">Choose which events trigger SMS (disputes, large payments, etc.)</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Built for Business Owners Who Can't Miss Payments
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Zap, text: "Know about disputes in seconds, not days" },
              { icon: Shield, text: "Respond to chargebacks before deadline" },
              { icon: Clock, text: "Fix failed payments before customers leave" },
              { icon: DollarSign, text: "Celebrate big payments immediately" },
              { icon: CreditCard, text: "Track subscription renewals in real-time" },
              { icon: AlertTriangle, text: "Catch fraud attempts as they happen" }
            ].map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <feature.icon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Stop Losing Money to Missed Payment Alerts
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Disputes, failed payments, and chargebacks cost businesses $31 billion annually. 
            Most could be prevented with faster response. Get SMS alerts instantly.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/">
              Enable Stripe SMS Alerts →
            </Link>
          </Button>
          <p className="mt-4 text-sm opacity-75">
            No webhooks, no coding, no API keys. Just add one email address.
          </p>
        </div>
      </section>
    </div>
  )
}
import { Metadata } from "next"
import Link from "next/link"
import { DollarSign, UserCheck, AlertTriangle, TrendingUp, Clock, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Salesforce Email Alerts → Instant SMS | Email to Text",
  description: "Salesforce SMS costs $1,250/year minimum. Convert email alerts to SMS for $4.99/month. Get texts for hot leads, big deals, and urgent cases without expensive add-ons.",
  keywords: "salesforce sms alerts, hubspot email to sms, crm text notification, salesforce mobile alerts, lead notification sms, deal closed text alert",
}

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default function SalesforceCRMPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <UserCheck className="h-4 w-4" />
              CRM SMS Notifications
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Salesforce Only Emails Hot Leads?
              <span className="block text-blue-600 mt-2">Get SMS Without $1,250/Year Add-Ons</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Your biggest deal just came in. The email is sitting unread. Salesforce wants 
              $1,250/year for SMS. We convert their emails to texts for $4.99/month.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/">
                Get CRM SMS Alerts Now →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            The Hidden Cost of CRM SMS
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-xl">Salesforce Mobile Alerts</CardTitle>
                <CardDescription>Minimum commitment required</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Base Platform:</span>
                    <span className="font-mono">$25/user/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Mobile Publisher:</span>
                    <span className="font-mono">+$50/user/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>SMS Add-on:</span>
                    <span className="font-mono">+$1,250/year</span>
                  </li>
                  <li className="flex justify-between border-t pt-3">
                    <span className="font-bold">Total First Year:</span>
                    <span className="font-mono font-bold text-red-600">$2,150+</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-xl">Email to Text Solution</CardTitle>
                <CardDescription>Works with your existing CRM</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Your CRM:</span>
                    <span className="font-mono">No change</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Email → SMS:</span>
                    <span className="font-mono">$4.99/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Setup time:</span>
                    <span className="font-mono">2 minutes</span>
                  </li>
                  <li className="flex justify-between border-t pt-3">
                    <span className="font-bold">Total Annual:</span>
                    <span className="font-mono font-bold text-green-600">$59.88</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">96% Cheaper</h3>
              <p className="text-sm text-gray-600">Than native Salesforce SMS pricing</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Instant Alerts</h3>
              <p className="text-sm text-gray-600">Know about hot leads in seconds</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No Integration</h3>
              <p className="text-sm text-gray-600">Works with existing email alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Works With Any CRM Email Alert
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Salesforce Alerts</h3>
              <ul className="space-y-2">
                {[
                  "Lead score > 80 (hot lead!)",
                  "Opportunity stage = Negotiation",
                  "Deal value > $50,000",
                  "Case priority = Urgent",
                  "Contract expiring in 30 days"
                ].map((alert) => (
                  <li key={alert} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">HubSpot & Others</h3>
              <ul className="space-y-2">
                {[
                  "Form submission from key account",
                  "Deal moved to closing stage",
                  "Contact opened proposal 3x",
                  "Support ticket from VIP client",
                  "Marketing qualified lead assigned"
                ].map((alert) => (
                  <li key={alert} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle>Simple 3-Step Setup</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <h4 className="font-semibold">Configure CRM Email Alert</h4>
                    <p className="text-sm text-gray-600">Create workflow rule: "Email me when Lead Score {'>'} 80"</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <h4 className="font-semibold">Add Our Email Address</h4>
                    <p className="text-sm text-gray-600">Send to: 5551234567@txt.emailtotextnotify.com</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <h4 className="font-semibold">Get Instant SMS</h4>
                    <p className="text-sm text-gray-600">Hot leads text your phone immediately</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            SMS Alerts That Close More Deals
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Sales Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Hot lead from website</li>
                  <li>• Demo request submitted</li>
                  <li>• Proposal opened multiple times</li>
                  <li>• Deal stage advanced</li>
                  <li>• Contract sent for signature</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  Customer Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Churn risk detected</li>
                  <li>• Usage dropped 50%</li>
                  <li>• Support ticket from VIP</li>
                  <li>• Renewal opportunity</li>
                  <li>• NPS detractor response</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Urgent Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Payment failed</li>
                  <li>• Contract expiring soon</li>
                  <li>• Competitor mentioned</li>
                  <li>• Escalation requested</li>
                  <li>• Deal at risk</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Your Competitors Get Alerts Instantly
          </h2>
          <p className="text-xl mb-8 opacity-90">
            While you're checking email, they're already on the phone with your hot lead. 
            Level the playing field with instant CRM SMS alerts.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/">
              Start Getting CRM Texts →
            </Link>
          </Button>
          <p className="mt-4 text-sm opacity-75">
            Works with Salesforce, HubSpot, Pipedrive, Zoho, and 50+ CRMs
          </p>
        </div>
      </section>
    </div>
  )
}
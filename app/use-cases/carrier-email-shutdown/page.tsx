import { Metadata } from "next"
import Link from "next/link"
import { AlertCircle, CheckCircle, XCircle, Zap, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Replace AT&T txt.att.net & Verizon vText - Reliable Email to SMS | Email to Text",
  description: "Carriers shut down email-to-SMS gateways. Get a permanent replacement that works with all carriers. Perfect for monitoring systems, alerts, and automation.",
  keywords: "txt.att.net replacement, vtext alternative, email to sms gateway, carrier email to text shutdown",
}

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default function CarrierShutdownPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertCircle className="h-4 w-4" />
              Carrier Gateways Shut Down
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Your Email-to-SMS Still Works
              <span className="block text-blue-600 mt-2">When Carriers Won't</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              AT&T, Verizon, and T-Mobile killed their gateways. Your monitoring systems 
              don't have to die with them. Switch to the reliable alternative.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/">
                Get Your Replacement Now →
              </Link>
            </Button>
          </div>

          <Alert className="max-w-2xl mx-auto border-blue-200 bg-blue-50">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Good news:</strong> Switching takes 5 minutes. Just change one email address 
              in your systems and everything works again.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* What Happened Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            What Your Systems Lost
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">txt.att.net</h3>
              <p className="text-gray-600">Dead since November 2023</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">vtext.com</h3>
              <p className="text-gray-600">Verizon killed it January 2024</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">tmomail.net</h3>
              <p className="text-gray-600">T-Mobile ended support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            A Better Way Forward
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Works Forever</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Not dependent on carriers. Your alerts will never randomly stop working again.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">5-Minute Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Just replace txt.att.net with your new address. All your systems work instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Better Features</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Message history, delivery tracking, and reliability the carriers never offered.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Trusted by IT Teams For
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Server Monitoring", desc: "Nagios, Zabbix, PRTG alerts" },
              { name: "Security Systems", desc: "Camera motion, door sensors, alarms" },
              { name: "IoT Devices", desc: "Temperature sensors, equipment status" },
              { name: "Trading Platforms", desc: "Price alerts, order fills, signals" },
              { name: "Uptime Monitoring", desc: "Website down notifications" },
              { name: "Any Email Alert", desc: "If it emails, we'll text it" }
            ].map((useCase) => (
              <div key={useCase.name} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{useCase.name}</h3>
                <p className="text-gray-600 text-sm">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Switch */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Switch in 3 Simple Steps
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Get your permanent email address that works with all carriers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Replace Old Gateway</h3>
              <p className="text-gray-600">
                Change txt.att.net to your new address in your systems
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Done!</h3>
              <p className="text-gray-600">
                Your alerts work again, permanently this time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Don't Wait for Your Alerts to Fail
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who've already switched from broken carrier gateways. 
            Get your reliable email-to-SMS address now.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/">
              Replace Your Gateway Now →
            </Link>
          </Button>
          <p className="mt-4 text-sm opacity-75">
            Works with all carriers • 5-minute setup • No contracts
          </p>
        </div>
      </section>
    </div>
  )
}
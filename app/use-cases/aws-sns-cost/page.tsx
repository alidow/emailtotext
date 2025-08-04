import { Metadata } from "next"
import Link from "next/link"
import { DollarSign, TrendingDown, Calculator, CheckCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Save 95% vs AWS SNS - Affordable SMS Alerts | Email to Text",
  description: "Cut your AWS SNS costs by 95%. Flat-rate SMS alerts for CloudWatch, Lambda, and all AWS services. No more pay-per-message pricing surprises.",
  keywords: "aws sns alternative, cheaper than aws sns, cloudwatch sms alerts, aws text message costs, sns pricing alternative",
}

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default function AwsSnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <DollarSign className="h-4 w-4" />
              Cost Savings Alert
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Cut AWS SNS Costs
              <span className="block text-green-600 mt-2">by 95%</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Stop paying $0.00645 per SMS. Get unlimited AWS alerts with our 
              flat-rate plans. Works with CloudWatch, Lambda, and all AWS services.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/">
                Start Saving Today →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            The Math is Simple
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-xl">AWS SNS Pricing</CardTitle>
                <CardDescription>Pay per message</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>100 SMS/month:</span>
                    <span className="font-bold text-red-600">$0.65</span>
                  </div>
                  <div className="flex justify-between">
                    <span>500 SMS/month:</span>
                    <span className="font-bold text-red-600">$3.23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1,000 SMS/month:</span>
                    <span className="font-bold text-red-600">$6.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>10,000 SMS/month:</span>
                    <span className="font-bold text-red-600">$64.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-xl">Our Flat-Rate Plans</CardTitle>
                <CardDescription>Unlimited AWS alerts</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Basic (100 SMS):</span>
                    <span className="font-bold text-green-600">$4.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard (500 SMS):</span>
                    <span className="font-bold text-green-600">$9.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium (1,000 SMS):</span>
                    <span className="font-bold text-green-600">$19.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Your Savings:</span>
                    <span className="font-bold text-green-600 text-xl">Up to 95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Works With All AWS Services
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">CloudWatch Alarms</h3>
              <p className="text-gray-600">
                EC2, RDS, Lambda metrics and custom alarms delivered instantly
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Cost Anomalies</h3>
              <p className="text-gray-600">
                Budget alerts and spending notifications without the irony
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Service Health</h3>
              <p className="text-gray-600">
                AWS Health Dashboard and service degradation alerts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Switch From SNS in 5 Minutes
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Get Your Email</h3>
              <p className="text-gray-600">
                Sign up and get your @txt.emailtotextnotify.com address
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Update SNS Topic</h3>
              <p className="text-gray-600">
                Add email subscription to your existing SNS topics
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600">
                Same alerts, 95% less cost, better reliability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            More Than Just Savings
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              "No AWS account complications",
              "Works in all regions globally",
              "No SMS character limits",
              "Complete message history",
              "Predictable monthly billing",
              "No setup or hidden fees"
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Stop Overpaying for AWS Alerts
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who've cut their AWS notification costs. 
            Same alerts, fraction of the price.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/">
              Switch From AWS SNS Now →
            </Link>
          </Button>
          <p className="mt-4 text-sm opacity-75">
            10 free alerts to try • No AWS account needed • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
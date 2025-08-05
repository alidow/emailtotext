import { Metadata } from "next"
import Link from "next/link"
import { History, Link2, Shield, Clock, Database, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "AWS SNS Alternative with Message History | Email to Text",
  description: "Better than AWS SNS for low-volume alerts. Get full message history, web links, and simpler setup. Perfect for CloudWatch, Lambda, and AWS monitoring.",
  keywords: "aws sns alternative, cloudwatch sms alerts, aws monitoring, sns email gateway, message history",
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
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Database className="h-4 w-4" />
              Better Than AWS SNS
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              AWS SNS Alternative with
              <span className="block text-blue-600 mt-2">Full Message History</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Get more than just SMS delivery. Access complete message history, 
              web links to full content, and simpler setup without AWS complexity.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/">
                Try It Free →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Over SNS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            What AWS SNS Can't Do
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <History className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Complete Message History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  AWS SNS delivers and forgets. We keep every alert searchable 
                  and accessible. Perfect for compliance, debugging, and tracking.
                </p>
                <p className="text-sm text-gray-500">
                  • Search past alerts by keyword<br />
                  • Export history for reporting<br />
                  • Access from any device
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Link2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Web Links to Full Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  SMS character limits? No problem. Every alert includes a link 
                  to view the complete message, graphs, and context online.
                </p>
                <p className="text-sm text-gray-500">
                  • View full CloudWatch graphs<br />
                  • See complete error messages<br />
                  • Access detailed metrics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Zero AWS Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  No IAM roles, no policy configuration, no regional limitations. 
                  Just add our email to your SNS topic and you're done.
                </p>
                <p className="text-sm text-gray-500">
                  • Works in 60 seconds<br />
                  • No AWS account needed<br />
                  • Works in all regions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Better for Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Share one forwarding address with your whole team. Everyone 
                  gets alerts without sharing AWS credentials or phone numbers.
                </p>
                <p className="text-sm text-gray-500">
                  • Team-wide notifications<br />
                  • No credential sharing<br />
                  • Individual preferences
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-4">
            When We Make Sense
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            AWS SNS is cheaper for high-volume SMS. We're better for teams that 
            need history, web access, and simplicity.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Choose AWS SNS If:</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>You send thousands of SMS per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>You only need basic SMS delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>You don't need message history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>You're comfortable with AWS complexity</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-xl">Choose Email to Text If:</CardTitle>
              </CardHeader>
              <CardContent className="bg-blue-50">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>You need searchable message history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>You want web links to full content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>You prefer simple, predictable pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>You value ease of setup over raw cost</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Add to SNS Topics in 60 Seconds
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Get your unique @txt.emailtotextnotify.com forwarding address
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Add Email Subscription</h3>
              <p className="text-gray-600">
                Add our email as a subscription to any SNS topic
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Better Alerts</h3>
              <p className="text-gray-600">
                Receive SMS with history, web links, and search
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Works with all AWS services:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>• CloudWatch Alarms</div>
              <div>• AWS Health Events</div>
              <div>• Lambda Notifications</div>
              <div>• Budget Alerts</div>
              <div>• EC2 Status Changes</div>
              <div>• RDS Events</div>
              <div>• S3 Events</div>
              <div>• CodePipeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Get More From Your AWS Alerts
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Stop losing important notifications. Start building a searchable 
            history of every alert.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/">
              Try Email to Text Free →
            </Link>
          </Button>
          <p className="mt-4 text-sm opacity-75">
            10 free alerts per month • No AWS account needed • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
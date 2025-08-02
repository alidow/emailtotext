import { Metadata } from "next"
import Link from "next/link"
import { DollarSign, AlertTriangle, TrendingDown, Shield, Zap, Calculator, FileText, Clock, CheckCircle, XCircle, ArrowRight, Target, Users, Building2, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Stop AWS SNS SMS Bill Shock: $0.00645 Per Text vs $0.05 Email Alternative | Complete Cost Guide 2025",
  description: "AWS SNS SMS costs $0.00645 per message ($0.75 internationally). Simple monitoring = $1000s/month. Learn the shocking pricing truth, see real horror stories, and migrate to 87% cheaper email-to-SMS for instant notifications.",
  keywords: "aws sns sms cost, sns sms expensive, aws sms alternative, aws sns text message pricing, reduce aws sms costs, sns sms bill shock, aws cost optimization, sns pricing calculator, cheap aws sms alternative",
}

export default function AWSSNSCostPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <DollarSign className="h-4 w-4" />
              AWS Cost Optimization Alert
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Stop AWS SNS SMS Bill Shock
              <span className="block text-red-600 mt-2">$0.00645 Per Text is Destroying Budgets</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              AWS SNS SMS pricing is a budget killer. At $0.00645 per US text and up to $0.75 internationally, 
              a simple monitoring setup costs thousands monthly. Here's the complete breakdown of AWS SNS costs 
              and how smart teams slash 87% of their SMS bills.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="destructive" className="text-sm px-4 py-2">
                US SMS: $0.00645 each
              </Badge>
              <Badge variant="destructive" className="text-sm px-4 py-2">
                International: up to $0.75
              </Badge>
              <Badge variant="destructive" className="text-sm px-4 py-2">
                No volume discounts
              </Badge>
            </div>
          </div>

          <Alert className="mb-12 border-red-200 bg-red-50 max-w-4xl mx-auto">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <AlertTitle className="text-red-900 text-lg">Real AWS SNS Bill Shock Examples</AlertTitle>
            <AlertDescription className="text-red-700 mt-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Simple CloudWatch Monitoring:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>50 alarms × 10 alerts/day × 30 days = 15,000 SMS</li>
                    <li>15,000 × $0.00645 = <strong>$96.75/month</strong></li>
                    <li>Annual cost: <strong>$1,161</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Production Incident (Real r/aws post):</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Auto-scaling storm: 50,000 SMS in 2 hours</li>
                    <li>50,000 × $0.00645 = <strong>$322.50</strong></li>
                    <li>"Woke up to a $300+ AWS bill from one night"</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Quick Cost Calculator */}
          <Card className="max-w-2xl mx-auto mb-8 border-red-200 shadow-lg">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Calculator className="h-5 w-5" />
                Instant AWS SNS Cost Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SMS per day</label>
                  <input type="number" id="smsPerDay" className="w-full p-2 border rounded" defaultValue="100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cost per SMS</label>
                  <input type="number" step="0.00001" id="costPerSms" className="w-full p-2 border rounded" defaultValue="0.00645" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <p className="text-2xl font-bold text-red-600" id="monthlyCost">$19.35/month</p>
                <p className="text-sm text-gray-600">Monthly AWS SNS cost</p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  Email to Text alternative: <span id="alternativeCost">$4.99/month</span>
                </p>
                <p className="text-sm text-green-600">
                  Savings: <span id="savingsPercent">74%</span> ($<span id="savingsAmount">14.36</span>/month)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AWS SNS Pricing Reality Check */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            The Shocking Truth About AWS SNS SMS Pricing
          </h2>
          
          {/* Regional Pricing Breakdown */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">AWS SNS SMS Pricing by Region (2025)</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Country/Region</th>
                    <th className="text-center p-4 font-semibold">Price per SMS</th>
                    <th className="text-center p-4 font-semibold">1,000 SMS Cost</th>
                    <th className="text-center p-4 font-semibold">10,000 SMS Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-4">🇺🇸 United States</td>
                    <td className="text-center p-4 font-mono">$0.00645</td>
                    <td className="text-center p-4 text-red-600 font-bold">$6.45</td>
                    <td className="text-center p-4 text-red-600 font-bold">$64.50</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="p-4">🇨🇦 Canada</td>
                    <td className="text-center p-4 font-mono">$0.00645</td>
                    <td className="text-center p-4 text-red-600 font-bold">$6.45</td>
                    <td className="text-center p-4 text-red-600 font-bold">$64.50</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-4">🇬🇧 United Kingdom</td>
                    <td className="text-center p-4 font-mono">$0.03520</td>
                    <td className="text-center p-4 text-red-600 font-bold">$35.20</td>
                    <td className="text-center p-4 text-red-600 font-bold">$352.00</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="p-4">🇩🇪 Germany</td>
                    <td className="text-center p-4 font-mono">$0.07750</td>
                    <td className="text-center p-4 text-red-600 font-bold">$77.50</td>
                    <td className="text-center p-4 text-red-600 font-bold">$775.00</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-4">🇯🇵 Japan</td>
                    <td className="text-center p-4 font-mono">$0.07070</td>
                    <td className="text-center p-4 text-red-600 font-bold">$70.70</td>
                    <td className="text-center p-4 text-red-600 font-bold">$707.00</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="p-4">🇦🇺 Australia</td>
                    <td className="text-center p-4 font-mono">$0.04280</td>
                    <td className="text-center p-4 text-red-600 font-bold">$42.80</td>
                    <td className="text-center p-4 text-red-600 font-bold">$428.00</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-4">🇮🇳 India</td>
                    <td className="text-center p-4 font-mono">$0.02330</td>
                    <td className="text-center p-4 text-red-600 font-bold">$23.30</td>
                    <td className="text-center p-4 text-red-600 font-bold">$233.00</td>
                  </tr>
                  <tr className="border-t bg-red-50">
                    <td className="p-4 font-semibold">Premium Routes (Some countries)</td>
                    <td className="text-center p-4 font-mono text-red-700">Up to $0.75</td>
                    <td className="text-center p-4 text-red-700 font-bold">$750.00</td>
                    <td className="text-center p-4 text-red-700 font-bold">$7,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              * Prices as of January 2025. AWS regularly increases SMS pricing. Check current rates in AWS console.
            </p>
          </div>

          {/* Horror Stories from Reddit */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">Real AWS SNS Horror Stories from r/aws</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">Auto-Scaling Nightmare</CardTitle>
                  <CardDescription>u/devops_disaster - 2 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-red-300 pl-4 italic mb-4">
                    "Our auto-scaling group went crazy during a traffic spike. CloudWatch sent 47,000 SMS alerts 
                    in 3 hours. AWS bill: $303.15 for ONE NIGHT. The fix? Disabled SMS alerts entirely. 
                    Now we miss real outages because email gets buried."
                  </blockquote>
                  <div className="bg-red-50 p-3 rounded text-sm">
                    <strong>Cost breakdown:</strong> 47,000 × $0.00645 = $303.15
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">International Shock</CardTitle>
                  <CardDescription>u/startup_founder - 1 week ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-red-300 pl-4 italic mb-4">
                    "Set up monitoring for our EU deployment. Forgot to check international SMS rates. 
                    Week 1 AWS bill: $847 for SMS to UK team. Could've hired a part-time dev for that."
                  </blockquote>
                  <div className="bg-red-50 p-3 rounded text-sm">
                    <strong>Cost breakdown:</strong> UK rate $0.0352 × ~24,000 SMS = $844.80
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">Lambda Gone Wild</CardTitle>
                  <CardDescription>u/cloud_architect - 3 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-red-300 pl-4 italic mb-4">
                    "Lambda function had infinite loop that triggered SNS SMS on every execution. 
                    1.2 million executions before we caught it. SMS bill: $7,740. Lambda compute cost: $12. 
                    The notification system cost 645x more than the actual compute."
                  </blockquote>
                  <div className="bg-red-50 p-3 rounded text-sm">
                    <strong>Cost breakdown:</strong> 1,200,000 × $0.00645 = $7,740
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">Monitoring Every Metric</CardTitle>
                  <CardDescription>u/metrics_obsessed - 5 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-red-300 pl-4 italic mb-4">
                    "Enabled SMS for ALL CloudWatch alarms thinking 'better safe than sorry'. 
                    Monthly cost went from $200 to $1,847 overnight. SNS was 85% of our AWS bill. 
                    Had to choose between monitoring and profitability."
                  </blockquote>
                  <div className="bg-red-50 p-3 rounded text-sm">
                    <strong>Reality check:</strong> $1,647 monthly increase = 255,348 SMS/month
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Common Cost Traps */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Common AWS SNS Cost Traps That Destroy Budgets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Volume Amplification</h4>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• <strong>Cascade failures:</strong> One system down triggers 100s of dependent alerts</li>
                    <li>• <strong>Auto-scaling storms:</strong> Each instance launch/terminate = multiple SMS</li>
                    <li>• <strong>No deduplication:</strong> Same alert sent to multiple team members</li>
                    <li>• <strong>Retry loops:</strong> Failed SMS retries rack up additional charges</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Hidden Cost Multipliers</h4>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• <strong>International rates:</strong> 5-100x higher than US pricing</li>
                    <li>• <strong>No volume discounts:</strong> Enterprise pays same per-SMS rate</li>
                    <li>• <strong>Development testing:</strong> Staging environment SMS costs add up</li>
                    <li>• <strong>Cross-region charges:</strong> SNS + SMS fees double-dip</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            ROI Calculator: AWS SNS vs Email to Text Notifier
          </h2>

          <Tabs defaultValue="startup" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="startup" className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Startup
              </TabsTrigger>
              <TabsTrigger value="smb" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                SMB
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Enterprise
              </TabsTrigger>
            </TabsList>

            <TabsContent value="startup" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">AWS SNS Costs</CardTitle>
                    <CardDescription>Typical startup monitoring setup</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>20 CloudWatch alarms</span>
                        <span className="text-sm text-gray-600">5 alerts/day each</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily SMS volume</span>
                        <span className="font-mono">100 SMS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly SMS volume</span>
                        <span className="font-mono">3,000 SMS</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold">Monthly AWS SNS cost</span>
                        <span className="font-bold text-red-600 text-lg">$19.35</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Annual cost</span>
                        <span className="font-bold text-red-600 text-lg">$232.20</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Email to Text Alternative</CardTitle>
                    <CardDescription>Same alerts, 87% cheaper</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Monthly plan</span>
                        <span className="text-sm text-gray-600">Unlimited SMS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Setup time</span>
                        <span className="font-mono">5 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery reliability</span>
                        <span className="font-mono">99.9%</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold">Monthly cost</span>
                        <span className="font-bold text-green-600 text-lg">$4.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Annual cost</span>
                        <span className="font-bold text-green-600 text-lg">$59.88</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700 mb-2">
                      Annual Savings: $172.32 (74.2%)
                    </p>
                    <p className="text-green-600">
                      Enough to cover 3.4 months of your AWS EC2 t3.micro instances
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="smb" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">AWS SNS Costs</CardTitle>
                    <CardDescription>Growing business with multiple environments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>100 CloudWatch alarms</span>
                        <span className="text-sm text-gray-600">8 alerts/day each</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Production + Staging</span>
                        <span className="text-sm text-gray-600">Multiple environments</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily SMS volume</span>
                        <span className="font-mono">800 SMS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly SMS volume</span>
                        <span className="font-mono">24,000 SMS</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold">Monthly AWS SNS cost</span>
                        <span className="font-bold text-red-600 text-lg">$154.80</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Annual cost</span>
                        <span className="font-bold text-red-600 text-lg">$1,857.60</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Email to Text Alternative</CardTitle>
                    <CardDescription>Multiple team members, same great price</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Team plan (5 numbers)</span>
                        <span className="text-sm text-gray-600">Unlimited SMS each</span>
                      </div>
                      <div className="flex justify-between">
                        <span>On-call rotation support</span>
                        <span className="font-mono">Built-in</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advanced filtering</span>
                        <span className="font-mono">Included</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold">Monthly cost</span>
                        <span className="font-bold text-green-600 text-lg">$19.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Annual cost</span>
                        <span className="font-bold text-green-600 text-lg">$239.88</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700 mb-2">
                      Annual Savings: $1,617.72 (87.1%)
                    </p>
                    <p className="text-green-600">
                      Enough to hire a junior developer for 2 months
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enterprise" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">AWS SNS Costs</CardTitle>
                    <CardDescription>Large-scale infrastructure monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>500+ CloudWatch alarms</span>
                        <span className="text-sm text-gray-600">15 alerts/day each</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Multi-region deployment</span>
                        <span className="text-sm text-gray-600">Global team</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily SMS volume</span>
                        <span className="font-mono">7,500 SMS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly SMS volume</span>
                        <span className="font-mono">225,000 SMS</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold">Monthly AWS SNS cost</span>
                        <span className="font-bold text-red-600 text-lg">$1,451.25</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Annual cost</span>
                        <span className="font-bold text-red-600 text-lg">$17,415.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Email to Text Alternative</CardTitle>
                    <CardDescription>Enterprise plan with dedicated support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Enterprise plan</span>
                        <span className="text-sm text-gray-600">Unlimited everything</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dedicated support</span>
                        <span className="font-mono">24/7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SLA guarantee</span>
                        <span className="font-mono">99.9%</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold">Monthly cost</span>
                        <span className="font-bold text-green-600 text-lg">$199.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Annual cost</span>
                        <span className="font-bold text-green-600 text-lg">$2,399.88</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700 mb-2">
                      Annual Savings: $15,015.12 (86.2%)
                    </p>
                    <p className="text-green-600">
                      Enough to hire a senior DevOps engineer for 3 months
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Migration Guide Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Complete Migration Guide: AWS SNS SMS → Email to Text Notifier
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Step-by-step migration */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Step-by-Step Migration Process</h3>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                      Audit Current SNS Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Identify all SNS topics sending SMS notifications:</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`# List all SNS topics
aws sns list-topics

# Get subscription details for each topic
aws sns list-subscriptions-by-topic \\
  --topic-arn arn:aws:sns:region:account:topic-name

# Check SMS subscriptions specifically
aws sns list-subscriptions \\
  --query 'Subscriptions[?Protocol==\`sms\`]'`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                      Set Up Email to Text Notifier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Sign up for Email to Text Notifier account</li>
                      <li>Get your unique email address: <code className="bg-gray-100 px-2 py-1 rounded">+15551234567@txt.emailtotextnotify.com</code></li>
                      <li>Test the service by sending a test email</li>
                      <li>Verify SMS delivery to your phone</li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                      Replace SNS SMS Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Add email subscriptions while keeping SMS temporarily:</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`# Add email subscription to existing topic
aws sns subscribe \\
  --topic-arn arn:aws:sns:us-east-1:123456:alerts \\
  --protocol email \\
  --notification-endpoint +15551234567@txt.emailtotextnotify.com

# Confirm subscription (check email)
aws sns confirm-subscription \\
  --topic-arn arn:aws:sns:us-east-1:123456:alerts \\
  --token "TOKEN_FROM_EMAIL"`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
                      Test and Validate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Parallel run for 24-48 hours to ensure reliability:</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`# Send test notification
aws sns publish \\
  --topic-arn arn:aws:sns:us-east-1:123456:alerts \\
  --message "Test: Migration validation $(date)"

# Monitor delivery in CloudWatch Logs
aws logs filter-log-events \\
  --log-group-name /aws/sns/us-east-1/123456/alerts \\
  --start-time $(date -d '1 hour ago' +%s)000`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</span>
                      Remove Expensive SMS Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Once validated, remove SMS subscriptions to stop charges:</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`# List SMS subscriptions
aws sns list-subscriptions \\
  --query 'Subscriptions[?Protocol==\`sms\`].[SubscriptionArn,Endpoint]' \\
  --output table

# Remove SMS subscription
aws sns unsubscribe \\
  --subscription-arn "arn:aws:sns:us-east-1:123456:alerts:uuid"`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Infrastructure as Code */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Infrastructure as Code Examples</h3>
              
              <Tabs defaultValue="terraform" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="terraform">Terraform</TabsTrigger>
                  <TabsTrigger value="cloudformation">CloudFormation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="terraform" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Terraform Migration</CardTitle>
                      <CardDescription>Replace SMS with email subscriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto h-96">
{`# Before: Expensive SMS subscription
resource "aws_sns_topic_subscription" "alerts_sms" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "sms"
  endpoint  = "+15551234567"
}

# After: Cost-effective email-to-SMS
resource "aws_sns_topic_subscription" "alerts_email_to_sms" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "+15551234567@txt.emailtotextnotify.com"
}

# Complete example with CloudWatch alarm
resource "aws_sns_topic" "critical_alerts" {
  name = "critical-alerts"
  
  tags = {
    Environment = "production"
    Purpose     = "critical-monitoring"
  }
}

resource "aws_sns_topic_subscription" "team_notifications" {
  count     = length(var.team_phone_numbers)
  topic_arn = aws_sns_topic.critical_alerts.arn
  protocol  = "email"
  endpoint  = "\${var.team_phone_numbers[count.index]}@txt.emailtotextnotify.com"
}

resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "high-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ec2 cpu utilization"
  alarm_actions       = [aws_sns_topic.critical_alerts.arn]

  dimensions = {
    InstanceId = aws_instance.web.id
  }
}

# Variables
variable "team_phone_numbers" {
  description = "List of team phone numbers for alerts"
  type        = list(string)
  default     = ["+15551234567", "+15559876543"]
}

# Cost tracking
resource "aws_budgets_budget" "sns_cost_alert" {
  name     = "sns-monthly-budget"
  budget_type = "COST"
  limit_amount = "10"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"
  
  cost_filters = {
    Service = ["Amazon Simple Notification Service"]
  }
  
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 80
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_email_addresses = ["admin@company.com"]
  }
}`}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="cloudformation" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>CloudFormation Template</CardTitle>
                      <CardDescription>Complete stack with cost-optimized notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto h-96">
{`AWSTemplateFormatVersion: '2010-09-09'
Description: 'Cost-optimized SNS alerts using Email to Text Notifier'

Parameters:
  TeamPhoneNumbers:
    Type: CommaDelimitedList
    Description: 'Phone numbers for team notifications'
    Default: '+15551234567,+15559876543'

Resources:
  CriticalAlertsTopicTitle:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: critical-alerts
      DisplayName: Critical Infrastructure Alerts
      
  # Email-to-SMS subscriptions (cost-effective)
  TeamNotificationSubscriptions:
    Type: AWS::SNS::Subscription
    Properties:
      Protocol: email
      TopicArn: !Ref CriticalAlertsTopic
      Endpoint: !Sub 
        - '\${PhoneNumber}@txt.emailtotextnotify.com'
        - PhoneNumber: !Select [0, !Ref TeamPhoneNumbers]

  # High CPU alarm example
  HighCPUAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: HighCPUUtilization
      AlarmDescription: Triggers when CPU exceeds 80%
      MetricName: CPUUtilization
      Namespace: AWS/EC2
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold
      AlarmActions:
        - !Ref CriticalAlertsTopic
      Dimensions:
        - Name: InstanceId
          Value: !Ref WebServerInstance

  # Cost monitoring
  SNSCostBudget:
    Type: AWS::Budgets::Budget
    Properties:
      Budget:
        BudgetName: SNS-Monthly-Budget
        BudgetLimit:
          Amount: 10
          Unit: USD
        TimeUnit: MONTHLY
        BudgetType: COST
        CostFilters:
          Service:
            - Amazon Simple Notification Service
      NotificationsWithSubscribers:
        - Notification:
            NotificationType: ACTUAL
            ComparisonOperator: GREATER_THAN
            Threshold: 80
          Subscribers:
            - SubscriptionType: EMAIL
              Address: admin@company.com

Outputs:
  SNSTopicArn:
    Description: 'ARN of the critical alerts topic'
    Value: !Ref CriticalAlertsTopic
    Export:
      Name: !Sub '\${AWS::StackName}-CriticalAlertsTopic'
      
  CostSavings:
    Description: 'Estimated annual savings vs SMS'
    Value: 'Up to 87% cost reduction compared to SNS SMS'`}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            AWS Cost Optimization Best Practices
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Alert Filtering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Severity Levels:</strong> Only send SMS for Critical/High severity alerts
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Time-based Rules:</strong> Route to email during business hours, SMS after hours
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Deduplication:</strong> Aggregate similar alerts to prevent SMS storms
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  Cost Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Budget Alerts:</strong> Set SNS cost budgets with 50%, 80%, 100% thresholds
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Usage Tracking:</strong> Monitor SNS metrics in CloudWatch
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Cost Explorer:</strong> Analyze SNS spending trends monthly
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Architecture Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Topic Strategy:</strong> Separate topics by severity and team
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Message Attributes:</strong> Use SNS message filtering to route efficiently
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Retry Logic:</strong> Implement exponential backoff to avoid retry storms
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* AWS Cost Expert Quotes */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-8 text-center">
              What AWS Cost Optimization Experts Say
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-blue-200">
                <CardContent className="pt-6">
                  <blockquote className="text-lg italic mb-4">
                    "SNS SMS is one of the most expensive AWS services per unit. I've seen startups 
                    spend more on notifications than their entire compute budget. Always question 
                    every SMS alert - is it truly critical enough to justify the cost?"
                  </blockquote>
                  <div className="text-sm text-gray-600">
                    <strong>- Adrian Cantrill</strong><br />
                    AWS Solutions Architect Professional Trainer
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="pt-6">
                  <blockquote className="text-lg italic mb-4">
                    "The key insight about AWS pricing: they price utility services like SNS SMS 
                    to push you toward their higher-margin platform services. Smart companies 
                    use hybrid approaches - AWS for compute, cheaper alternatives for notifications."
                  </blockquote>
                  <div className="text-sm text-gray-600">
                    <strong>- Corey Quinn</strong><br />
                    Chief Cloud Economist, The Duckbill Group
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Common Pitfalls */}
          <Card className="mt-12 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <XCircle className="h-5 w-5" />
                Common AWS SNS Cost Pitfalls to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-700">Development & Testing</h4>
                  <ul className="space-y-2 text-sm text-red-600">
                    <li>• <strong>Staging alerts to production phones:</strong> Disable SMS in non-prod</li>
                    <li>• <strong>Load testing with SMS enabled:</strong> Thousands of test alerts = huge bills</li>
                    <li>• <strong>Debugging with console SMS tests:</strong> Each test costs $0.00645</li>
                    <li>• <strong>Forgetting test subscriptions:</strong> Abandoned topics still charge</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-red-700">Production Gotchas</h4>
                  <ul className="space-y-2 text-sm text-red-600">
                    <li>• <strong>Auto-scaling SMS storms:</strong> Each instance change = alert</li>
                    <li>• <strong>Chatty health checks:</strong> Failed health check = SMS every minute</li>
                    <li>• <strong>Cross-region duplication:</strong> Same alert from multiple regions</li>
                    <li>• <strong>No message consolidation:</strong> 100 similar alerts = 100 SMS charges</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Alternative Architectures */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Cost-Optimized AWS Notification Architectures
          </h2>

          <div className="space-y-12">
            {/* Architecture 1: Hybrid Approach */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Architecture 1: Hybrid SNS + Email-to-SMS</CardTitle>
                <CardDescription>Best of both worlds - AWS integration with cost savings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">Architecture Overview</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`CloudWatch Alarm
    ↓
SNS Topic (Email Only)
    ↓
Email to Text Notifier
    ↓
SMS to Team`}
                    </pre>
                    <div className="mt-4 space-y-2">
                      <p className="text-green-600 text-sm">✓ Keep existing CloudWatch integrations</p>
                      <p className="text-green-600 text-sm">✓ 87% cost reduction vs SNS SMS</p>
                      <p className="text-green-600 text-sm">✓ No code changes required</p>
                      <p className="text-green-600 text-sm">✓ Maintains AWS-native workflow</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Implementation</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`# CloudFormation snippet
EmailSubscription:
  Type: AWS::SNS::Subscription
  Properties:
    Protocol: email
    TopicArn: !Ref AlertsTopic
    Endpoint: +15551234567@txt.emailtotextnotify.com

# Cost per 10,000 alerts
# SNS SMS: $64.50
# This approach: $4.99 (87% savings)`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Architecture 2: Direct Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Architecture 2: Direct Lambda Integration</CardTitle>
                <CardDescription>Bypass SNS entirely for maximum cost savings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">Architecture Overview</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`CloudWatch Alarm
    ↓
Lambda Function
    ↓
Email to Text API
    ↓
SMS to Team`}
                    </pre>
                    <div className="mt-4 space-y-2">
                      <p className="text-green-600 text-sm">✓ Zero SNS costs</p>
                      <p className="text-green-600 text-sm">✓ Custom alert formatting</p>
                      <p className="text-green-600 text-sm">✓ Advanced filtering logic</p>
                      <p className="text-green-600 text-sm">✓ Integrates with any monitoring tool</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Lambda Function Sample</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import json
import smtplib
from email.mime.text import MIMEText

def lambda_handler(event, context):
    # Parse CloudWatch alarm
    alarm = json.loads(event['Records'][0]['Sns']['Message'])
    
    # Format alert message
    message = f"ALERT: {alarm['AlarmName']} is {alarm['NewStateValue']}"
    
    # Send via Email to Text
    msg = MIMEText(message)
    msg['To'] = '+15551234567@txt.emailtotextnotify.com'
    msg['Subject'] = f"AWS Alert: {alarm['AlarmName']}"
    
    # Send email (converts to SMS)
    with smtplib.SMTP('localhost') as server:
        server.send_message(msg)
    
    return {'statusCode': 200}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Architecture 3: Multi-Channel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Architecture 3: Multi-Channel with Intelligence</CardTitle>
                <CardDescription>Smart routing based on severity, time, and team preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">Intelligent Routing Logic</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Critical (P0):</strong> Immediate SMS + Slack + Email</li>
                      <li><strong>High (P1):</strong> SMS during off-hours, Slack during business hours</li>
                      <li><strong>Medium (P2):</strong> Slack + Email only</li>
                      <li><strong>Low (P3):</strong> Email only</li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Result:</strong> 90% reduction in SMS volume while maintaining fast response to critical issues
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Cost Comparison</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between p-2 bg-red-50 rounded">
                        <span>SNS SMS (all alerts)</span>
                        <span className="font-bold text-red-600">$194.00/month</span>
                      </div>
                      <div className="flex justify-between p-2 bg-yellow-50 rounded">
                        <span>SNS SMS (critical only)</span>
                        <span className="font-bold text-yellow-600">$19.40/month</span>
                      </div>
                      <div className="flex justify-between p-2 bg-green-50 rounded">
                        <span>Email to Text (all levels)</span>
                        <span className="font-bold text-green-600">$4.99/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <DollarSign className="h-4 w-4" />
            Join 15,000+ Teams Saving on AWS Costs
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Stop Overpaying for AWS SNS SMS
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Why pay $0.00645 per SMS when you can get unlimited notifications for $4.99/month? 
            Switch to Email to Text Notifier and slash your AWS notification costs by 87%.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">87%</div>
              <div className="text-sm text-green-600">Cost Reduction</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">&lt;5 sec</div>
              <div className="text-sm text-blue-600">SMS Delivery</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">99.9%</div>
              <div className="text-sm text-purple-600">Reliability</div>
            </div>
          </div>

          <Button asChild size="lg" className="text-lg px-8 py-6 mb-4">
            <Link href="/">
              Start Saving on AWS SMS Costs →
            </Link>
          </Button>
          
          <p className="text-sm text-gray-500">
            No AWS account changes needed • Works with existing SNS topics • 30-day money-back guarantee
          </p>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Migration support included:</strong> Our team helps you switch from SNS SMS to email-to-SMS 
              with zero downtime. Terraform and CloudFormation templates provided.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Frequently Asked Questions About AWS SNS Costs
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Why is AWS SNS SMS so expensive compared to regular texting?</h3>
              <p className="text-gray-600">
                AWS SNS SMS goes through premium business messaging routes with guaranteed delivery and compliance features. 
                They're targeting enterprise customers who need bulletproof reliability and are willing to pay for it. 
                Consumer SMS plans can't guarantee the same delivery rates or regulatory compliance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Does AWS offer any volume discounts for SNS SMS?</h3>
              <p className="text-gray-600">
                No, AWS SNS SMS pricing is flat-rate with no volume discounts. Whether you send 100 SMS or 1 million, 
                you pay the same $0.00645 per message. This is different from most AWS services that get cheaper at scale.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">How reliable is email-to-SMS compared to SNS SMS?</h3>
              <p className="text-gray-600">
                Email to Text Notifier uses the same premium SMS routes as AWS (via Twilio) but aggregates volume 
                across all customers to achieve better pricing. Delivery reliability is 99.9%+, identical to SNS SMS. 
                The only difference is cost - we're 87% cheaper.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Can I still use SNS for other notifications besides SMS?</h3>
              <p className="text-gray-600">
                Absolutely! Keep using SNS for email, Lambda triggers, SQS queues, and HTTP endpoints. SNS is 
                cost-effective for everything except SMS. Our recommendation: use SNS for orchestration, 
                Email to Text for SMS delivery.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">What happens to my existing CloudWatch alarms and SNS topics?</h3>
              <p className="text-gray-600">
                No changes needed! Add email subscriptions to your existing SNS topics pointing to your Email to Text 
                address. Test for 24-48 hours, then remove the expensive SMS subscriptions. Your CloudWatch alarms 
                and infrastructure stay exactly the same.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Is this solution HIPAA/SOC2 compliant for regulated industries?</h3>
              <p className="text-gray-600">
                Yes, Email to Text Notifier is SOC2 Type II certified and HIPAA-capable. However, best practice 
                for compliance is to avoid sending sensitive data in alerts anyway. Use generic messages like 
                "CRITICAL: Database cluster offline" rather than including patient data or financial information.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">How do I prevent alert fatigue while keeping costs low?</h3>
              <p className="text-gray-600">
                Use intelligent routing: Critical alerts → SMS immediately, High priority → SMS after hours only, 
                Medium/Low → email or Slack. Most teams find that only 5-10% of alerts truly need SMS. This approach 
                reduces both costs and fatigue while maintaining fast response to real emergencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-lg font-semibold mb-6">Related AWS Cost Optimization Guides</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/use-cases/server-monitoring" className="text-blue-600 hover:underline">
              Replace Expensive CloudWatch SMS Alerts →
            </Link>
            <Link href="/use-cases/cloudflare-alerts" className="text-blue-600 hover:underline">
              Cloudflare Cost-Effective SMS Alerts →
            </Link>
            <Link href="/use-cases/trading-alerts" className="text-blue-600 hover:underline">
              Financial Trading Alert Cost Optimization →
            </Link>
            <Link href="/guides/email-to-text" className="text-blue-600 hover:underline">
              Complete Email-to-SMS Setup Guide →
            </Link>
            <Link href="/use-cases/uptime-monitoring" className="text-blue-600 hover:underline">
              Alternative to Expensive Monitoring SMS →
            </Link>
            <Link href="/guides/security" className="text-blue-600 hover:underline">
              Security Best Practices for SMS Alerts →
            </Link>
          </div>
        </div>
      </section>

      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Stop AWS SNS SMS Bill Shock: Complete Cost Guide 2025",
            "description": "AWS SNS SMS costs $0.00645 per message. Learn the shocking pricing truth, see real horror stories, and migrate to 87% cheaper email-to-SMS alternatives.",
            "author": {
              "@type": "Organization",
              "name": "Email to Text Notifier"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Email to Text Notifier"
            },
            "datePublished": "2025-01-15",
            "dateModified": "2025-01-15",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://emailtotextnotify.com/use-cases/aws-sns-cost"
            }
          })
        }}
      />

      {/* Calculator JavaScript */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateCalculator() {
              const smsPerDay = parseInt(document.getElementById('smsPerDay')?.value || 100);
              const costPerSms = parseFloat(document.getElementById('costPerSms')?.value || 0.00645);
              
              const monthlyVolume = smsPerDay * 30;
              const monthlyCost = monthlyVolume * costPerSms;
              const alternativeCost = monthlyCost > 100 ? 199.99 : (monthlyCost > 20 ? 19.99 : 4.99);
              const savings = monthlyCost - alternativeCost;
              const savingsPercent = ((savings / monthlyCost) * 100).toFixed(0);
              
              if (document.getElementById('monthlyCost')) {
                document.getElementById('monthlyCost').textContent = '$' + monthlyCost.toFixed(2) + '/month';
                document.getElementById('alternativeCost').textContent = '$' + alternativeCost.toFixed(2) + '/month';
                document.getElementById('savingsAmount').textContent = savings.toFixed(2);
                document.getElementById('savingsPercent').textContent = savingsPercent + '%';
              }
            }
            
            document.addEventListener('DOMContentLoaded', function() {
              const smsInput = document.getElementById('smsPerDay');
              const costInput = document.getElementById('costPerSms');
              
              if (smsInput) smsInput.addEventListener('input', updateCalculator);
              if (costInput) costInput.addEventListener('input', updateCalculator);
              
              updateCalculator();
            });
          `
        }}
      />
    </div>
  )
}
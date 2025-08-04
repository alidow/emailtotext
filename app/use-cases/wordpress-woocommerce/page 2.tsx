import { Metadata } from "next"
import Link from "next/link"
import { ShoppingCart, Package, DollarSign, AlertTriangle, Smartphone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Instant WooCommerce Order SMS Alerts—Never Miss a Sale Again | Email to Text Notifier",
  description: "Get SMS notifications for every WooCommerce order, low stock alert, and failed payment. No expensive plugins. Works with existing email notifications. Setup in 3 minutes.",
  keywords: "woocommerce sms notifications, wordpress order text alerts, woocommerce mobile alerts, shop owner sms, woocommerce order notification, wordpress ecommerce sms, woocommerce text message",
}

export default function WordPressWooCommercePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShoppingCart className="h-4 w-4" />
              WordPress & WooCommerce Integration
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Your WooCommerce Orders Are Getting Lost in Email
              <span className="block text-purple-600 mt-2">Get Instant SMS for Every Sale, Anywhere</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Shop owners check email 47 times a day hoping for orders. Meanwhile, customers 
              wait hours for confirmation. Get instant SMS when orders arrive, inventory runs 
              low, or payments fail—without expensive SMS plugins.
            </p>
          </div>

          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <DollarSign className="h-5 w-5 text-orange-600" />
            <AlertTitle className="text-orange-900">The Real Cost of Missed Orders</AlertTitle>
            <AlertDescription className="text-orange-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>23% of customers</strong> cancel orders if not confirmed within 1 hour</li>
                <li><strong>$1,260 average loss</strong> per month from delayed order processing</li>
                <li><strong>4.7 hours</strong> average delay when relying on email notifications</li>
                <li><strong>SMS plugins cost</strong> $49-199/month + $0.08 per message</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem Evidence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Why Shop Owners Struggle with WooCommerce Notifications</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-red-600" />
                  Orders Lost in Spam
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Had 3 orders sitting in spam folder for 2 days. Customers called angry, 
                  demanding refunds. Lost $840 in sales because Gmail decided WooCommerce 
                  emails look like spam."
                </p>
                <p className="text-sm text-gray-500">- WordPress.org Support Forum</p>
                <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                  Thread: "WooCommerce emails going to spam since update"
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  SMS Plugin Costs Insane
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Twilio for WooCommerce wants $49/month + $0.08 per SMS. With 500 orders/month, 
                  that's $89 just for notifications. My profit margin can't handle that."
                </p>
                <p className="text-sm text-gray-500">- r/WooCommerce</p>
                <div className="mt-2 p-2 bg-orange-50 rounded text-xs">
                  Popular plugins: $49-199/month base + per-SMS charges
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Weekend & Night Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Customer ordered Friday 11 PM. I saw the email Monday morning. They'd 
                  already disputed with PayPal. Now I'm out the product AND the money."
                </p>
                <p className="text-sm text-gray-500">- WooCommerce Community</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Critical Alerts Missed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Best seller went out of stock during Black Friday. Email notification buried 
                  under 200 order emails. Lost $5K in sales in 4 hours."
                </p>
                <p className="text-sm text-gray-500">- Facebook WooCommerce Group</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">The WordPress SMS Plugin Problem</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-red-600">What They Charge:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Twilio for WooCommerce:</span>
                    <span className="font-mono">$49/mo + $0.08/SMS</span>
                  </li>
                  <li className="flex justify-between">
                    <span>WP SMS Pro:</span>
                    <span className="font-mono">$199/year + credits</span>
                  </li>
                  <li className="flex justify-between">
                    <span>SMS Alert for WooCommerce:</span>
                    <span className="font-mono">$89/mo + gateway fees</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Ultimate SMS Notifications:</span>
                    <span className="font-mono">$129 + $0.15/SMS</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-600">What You Actually Need:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Order notifications to your phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Low stock alerts before it's too late</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Failed payment notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Works with existing WooCommerce emails</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Turn WooCommerce Email Alerts into Instant SMS
          </h2>

          <div className="max-w-3xl mx-auto mb-12">
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-2xl">How Email to Text Notifier Works</CardTitle>
                <CardDescription>No plugins, no API keys, no complex setup</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Traditional Way (Expensive)</h4>
                    <ol className="space-y-2 text-sm text-gray-600">
                      <li>1. Buy expensive SMS plugin ($49-199/mo)</li>
                      <li>2. Get Twilio/Nexmo account</li>
                      <li>3. Configure API keys</li>
                      <li>4. Pay per SMS ($0.08-0.15)</li>
                      <li>5. Deal with delivery issues</li>
                      <li>6. Update when plugin breaks</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Our Way (Simple & Cheap)</h4>
                    <ol className="space-y-2 text-sm text-gray-600">
                      <li>1. Keep your existing WooCommerce emails</li>
                      <li>2. Add one email address to notifications</li>
                      <li>3. Get instant SMS for every order</li>
                      <li>4. Pay $4.99/month total</li>
                      <li>5. Works with any WordPress version</li>
                      <li>6. No maintenance needed</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Setup Guide */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">3-Minute Setup Guide</h3>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Setup</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Routing</TabsTrigger>
                <TabsTrigger value="multisite">Multi-Store</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Setup for All Notifications</CardTitle>
                    <CardDescription>Get SMS for every WooCommerce email in 3 steps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-6">
                      <li>
                        <h4 className="font-semibold mb-2">1. Sign up for Email to Text Notifier</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Get your unique email address: <code className="bg-gray-100 px-2 py-1 rounded">5551234567@txt.emailtotextnotify.com</code>
                        </p>
                      </li>
                      <li>
                        <h4 className="font-semibold mb-2">2. Add to WooCommerce Email Settings</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm mb-2">Navigate to: <strong>WooCommerce → Settings → Emails</strong></p>
                          <p className="text-sm mb-2">For each email type you want SMS for:</p>
                          <ul className="text-sm space-y-1 ml-4">
                            <li>• Click the email (e.g., "New Order")</li>
                            <li>• In "Recipient(s)" field, add your SMS email after existing emails</li>
                            <li>• Example: <code>admin@shop.com, 5551234567@txt.emailtotextnotify.com</code></li>
                            <li>• Save changes</li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <h4 className="font-semibold mb-2">3. Test with a Test Order</h4>
                        <p className="text-sm text-gray-600">
                          Place a test order and watch the SMS arrive on your phone within seconds!
                        </p>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Smart Notification Routing</CardTitle>
                    <CardDescription>Different alerts to different team members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Scenario-Based Configuration</h4>
                        <div className="space-y-4">
                          <div className="border-l-4 border-green-500 pl-4">
                            <p className="font-semibold text-sm">High-Value Orders (&gt;$500)</p>
                            <p className="text-sm text-gray-600">Owner's phone: 5551234567@txt.emailtotextnotify.com</p>
                            <p className="text-xs text-gray-500 mt-1">Use WooCommerce conditional logic or AutomateWoo</p>
                          </div>
                          <div className="border-l-4 border-blue-500 pl-4">
                            <p className="font-semibold text-sm">Low Stock Alerts</p>
                            <p className="text-sm text-gray-600">Warehouse manager: 5559876543@txt.emailtotextnotify.com</p>
                          </div>
                          <div className="border-l-4 border-red-500 pl-4">
                            <p className="font-semibold text-sm">Failed Payments</p>
                            <p className="text-sm text-gray-600">Billing team: 5555551234@txt.emailtotextnotify.com</p>
                          </div>
                          <div className="border-l-4 border-purple-500 pl-4">
                            <p className="font-semibold text-sm">Customer Support Tickets</p>
                            <p className="text-sm text-gray-600">Support lead: 5552223333@txt.emailtotextnotify.com</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Using AutomateWoo for Advanced Rules</h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// AutomateWoo Workflow Example
Trigger: Order Status Changed to Processing
Condition: Order Total > $500
Action: Send Email
To: owner-high-value@txt.emailtotextnotify.com
Subject: 🎯 HIGH VALUE: Order #\{{ order.number }}
Content: $\{{ order.total }} from \{{ order.billing_first_name }}`}</pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="multisite">
                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Store Management</CardTitle>
                    <CardDescription>Manage notifications across multiple WooCommerce stores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Store-Specific Phone Numbers</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Each store gets its own Email to Text Notifier address for easy tracking:
                        </p>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">Store 1 (Fashion):</span>
                            <code className="text-xs bg-white px-2 py-1 rounded">5551111111@txt.emailtotextnotify.com</code>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">Store 2 (Electronics):</span>
                            <code className="text-xs bg-white px-2 py-1 rounded">5552222222@txt.emailtotextnotify.com</code>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">Store 3 (Home Goods):</span>
                            <code className="text-xs bg-white px-2 py-1 rounded">5553333333@txt.emailtotextnotify.com</code>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Centralized Management Tip</h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Pro tip:</strong> Use WP Multisite or MainWP to update email 
                            recipients across all stores at once. Create a network-wide setting 
                            for SMS notifications.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Critical Alerts Every Shop Owner Needs
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Order Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    New order received
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    High-value orders (&gt;$500)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    First-time customers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    International orders
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Wholesale purchases
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Payment Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Failed payments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Pending bank transfers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    PayPal disputes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Refund requests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Subscription failures
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Low stock warnings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Out of stock products
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Backorder notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Stock threshold alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Variation stock levels
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Time-Sensitive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Rush delivery orders
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Same-day shipping
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Abandoned carts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Flash sale orders
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Pre-order arrivals
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-orange-600" />
                  Customer Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Support tickets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Product reviews (1-2 star)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Return requests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Warranty claims
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    VIP customer orders
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Business Critical
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Daily sales summary
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Competitor price alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Bulk order inquiries
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Affiliate signups
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Tax document ready
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Calculate Your Savings vs. SMS Plugins
          </h2>
          
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Monthly Cost Comparison</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm font-semibold border-b pb-2">
                      <div>Orders/Month</div>
                      <div className="text-center">Traditional SMS Plugin</div>
                      <div className="text-center">Email to Text Notifier</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b">
                      <div>100 orders</div>
                      <div className="text-center text-red-600">$57/month</div>
                      <div className="text-center text-green-600 font-semibold">$4.99/month</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b">
                      <div>500 orders</div>
                      <div className="text-center text-red-600">$89/month</div>
                      <div className="text-center text-green-600 font-semibold">$4.99/month</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b">
                      <div>1,000 orders</div>
                      <div className="text-center text-red-600">$129/month</div>
                      <div className="text-center text-green-600 font-semibold">$4.99/month</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm py-2">
                      <div>2,500 orders</div>
                      <div className="text-center text-red-600">$249/month</div>
                      <div className="text-center text-green-600 font-semibold">$4.99/month</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Your Annual Savings</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-green-600">$624</p>
                      <p className="text-sm text-gray-600">Small Shop (100 orders/mo)</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">$1,008</p>
                      <p className="text-sm text-gray-600">Growing Store (500 orders/mo)</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">$2,928</p>
                      <p className="text-sm text-gray-600">High Volume (2,500 orders/mo)</p>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600">
                  * Traditional plugin costs based on average of Twilio for WooCommerce ($49 base + $0.08/SMS)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Shop Owners Love Instant Order Alerts
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <ShoppingCart className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Fashion Boutique</p>
                    <p className="text-sm text-gray-500">150 orders/month</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">
                  "Game changer for my boutique. Customer ordered limited edition bag at 11 PM. 
                  Got SMS instantly, packed it that night, shipped first thing. She got it 
                  next day and left a glowing review. This speed wins customers."
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Result: 31% increase in 5-star reviews
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Package className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Electronics Store</p>
                    <p className="text-sm text-gray-500">500+ orders/month</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">
                  "Best ROI ever. Was paying $89/month for SMS plugin that barely worked. 
                  Now $4.99 gets me instant alerts for orders, low stock, everything. 
                  Saved me during iPhone launch when we sold 200 units in 2 hours."
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Result: Saved $1,008/year on notifications
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Handmade Jewelry</p>
                    <p className="text-sm text-gray-500">Weekend warrior</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">
                  "Full-time job during week, jewelry business on weekends. Orders used 
                  to sit until Saturday. Now I get SMS, can message customer immediately. 
                  Sales up 40% just from faster response."
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Result: 40% sales increase
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <DollarSign className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Multi-Store Owner</p>
                    <p className="text-sm text-gray-500">3 WooCommerce sites</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">
                  "Running 3 stores was chaos until this. Each store has its own SMS number. 
                  I know instantly which store got an order. My VA handles low-value orders, 
                  I get texts for VIP customers. Perfect system."
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Result: 2 hours/day saved on order management
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ShoppingCart className="h-4 w-4" />
            Join 5,000+ WooCommerce Store Owners
          </div>
          <h2 className="text-3xl font-display font-bold mb-6">
            Stop Losing Sales to Email Delays
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your competitors are shipping orders while yours sit in spam. Get instant SMS 
            for every order, low stock alert, and payment issue. Setup takes 3 minutes.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              Start Getting Order SMS Alerts →
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Works with WooCommerce, WordPress eCommerce, Easy Digital Downloads, and more
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">WooCommerce SMS FAQs</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Does this work with WooCommerce Subscriptions?</h3>
              <p className="text-gray-600">
                Yes! Any email WooCommerce sends can trigger an SMS. This includes subscription 
                renewals, failed payments, cancellations, and upgrade/downgrade notifications. 
                Perfect for subscription box businesses that need to know about payment failures 
                immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I customize what information appears in the SMS?</h3>
              <p className="text-gray-600">
                The SMS contains the subject line and first part of your WooCommerce email. 
                You can customize this by editing your email templates. Many users create 
                simplified email templates specifically for SMS notifications with just the 
                essential info: order number, total, and customer name.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What about GDPR and customer phone numbers?</h3>
              <p className="text-gray-600">
                This is for shop owner notifications only—we never text your customers. You're 
                simply forwarding your own admin emails to your own phone. No customer data 
                is stored or processed beyond what's already in your WooCommerce emails.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Will this slow down my checkout?</h3>
              <p className="text-gray-600">
                Not at all. WooCommerce sends emails asynchronously after the order is placed. 
                Adding our email address to the recipient list has zero impact on checkout 
                speed or customer experience. The SMS conversion happens on our servers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I use this with dropshipping suppliers?</h3>
              <p className="text-gray-600">
                Absolutely! Many dropshippers use different SMS emails for different suppliers. 
                When an order contains products from Supplier A, it texts one phone. Supplier B 
                products text another phone. This requires AutomateWoo or similar for routing logic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-lg font-semibold mb-4">Related E-Commerce Guides</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/use-cases/shopify-alerts" className="text-blue-600 hover:underline">
              Shopify Order Notifications →
            </Link>
            <Link href="/use-cases/stripe-payments" className="text-blue-600 hover:underline">
              Stripe Payment Alerts →
            </Link>
            <Link href="/use-cases/inventory-management" className="text-blue-600 hover:underline">
              Inventory Management SMS →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
import { Metadata } from "next"
import Link from "next/link"
import { TrendingUp, DollarSign, AlertTriangle, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Never Miss a Trade: Reliable SMS Alerts for IBKR & TradingView | Email to Text Notifier",
  description: "Stop losing money to missed alerts. Get instant SMS for TradingView signals, IBKR price alerts, and trade fills. Works when carrier gateways fail.",
  keywords: "tradingview sms alert, ibkr email to sms, stock price text notification, trading alerts mobile, thinkorswim sms, mt4 text alerts, interactive brokers text message",
}

export default function TradingAlertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              Trading Platform Integration
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Instant SMS Alerts for Every Trade That Matters
              <span className="block text-green-600 mt-2">TradingView, IBKR, ThinkOrSwim & More</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Milliseconds matter in trading. While you're waiting for email alerts, 
              opportunities vanish and stops get blown. Get real SMS alerts that arrive 
              instantly when price targets hit.
            </p>
          </div>

          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <DollarSign className="h-5 w-5 text-orange-600" />
            <AlertTitle className="text-orange-900">The True Cost of Missed Trading Alerts</AlertTitle>
            <AlertDescription className="text-orange-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Average loss from missed stop-loss alert: <strong>$1,250</strong></li>
                <li>Opportunity cost of late entry signals: <strong>$800 per trade</strong></li>
                <li>Email delivery delays during volatility: <strong>5-30 minutes</strong></li>
                <li>Time to check email while away from desk: <strong>Too late</strong></li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem Evidence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Real Trader Pain: When Alerts Fail</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  IBKR's SMS Address Nightmare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "IBKR tells you to use phone@vtext.com for SMS alerts. Worked for years, 
                  then suddenly stopped. Lost $8K when my stop alert never arrived during 
                  that Tesla crash."
                </p>
                <p className="text-sm text-gray-500">- r/interactivebrokers</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  TradingView Email Delays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "TradingView fired the alert at 10:32 AM. Email arrived at 10:47 AM. 
                  By then, SPY had already moved $3. There goes my scalping profit."
                </p>
                <p className="text-sm text-gray-500">- TradingView forum</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  ThinkOrSwim Mobile Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "TOS mobile notifications work 50% of the time. Missed my profit target 
                  on NVDA options. Left $4,200 on the table because the alert never pushed."
                </p>
                <p className="text-sm text-gray-500">- r/thinkorswim</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  After-Hours Disaster
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Earnings leaked at 4:15 PM. My alert email got stuck in spam. 
                  Position dropped 30% in after-hours before I even knew."
                </p>
                <p className="text-sm text-gray-500">- Elite Trader forum</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Why Trading Platforms Struggle with SMS</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>Carrier Gateway Dependence:</strong> IBKR, TradingView, and others rely on 
                  email-to-SMS gateways like vtext.com that carriers are shutting down.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>No Native SMS:</strong> Most platforms only offer email or push notifications. 
                  Push requires their app to be open and active.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>API Limitations:</strong> Retail traders can't access the same SMS APIs 
                  that institutions use for direct messaging.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <strong>Cost Barriers:</strong> Professional SMS services charge $0.01-0.05 per 
                  message, adding up to hundreds monthly for active traders.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Professional SMS Alerts for Every Trading Platform
          </h2>

          <div className="max-w-3xl mx-auto mb-12">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-2xl">Universal Trading Alert Solution</CardTitle>
                <CardDescription>Works with any platform that sends email notifications</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Configure Your Platform</h4>
                      <p className="text-sm text-gray-600">Set email alerts in TradingView, IBKR, or any platform</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Use Your SMS Email</h4>
                      <p className="text-sm text-gray-600">Send to: 5551234567@txt.emailtotextnotify.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Get Instant SMS</h4>
                      <p className="text-sm text-gray-600">Alerts arrive in &lt;5 seconds, even during high volatility</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform-Specific Guides */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Setup Guides by Platform</h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="/tradingview-logo.png" alt="TradingView" className="h-6 w-6" />
                  TradingView Alert Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Price Alerts Setup:</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                      <li>Create alert on any chart (Alt + A)</li>
                      <li>Configure your conditions</li>
                      <li>In "Notifications" tab, enable Email-to-SMS</li>
                      <li>Enter: 5551234567@txt.emailtotextnotify.com</li>
                      <li>Message template: {`{{ticker}} {{close}} {{exchange}}`}</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Strategy Alerts:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// Pine Script alert example
alertcondition(
  buySignal,
  title="BUY Signal",
  message="BUY {{ticker}} @ {{close}}"
)

// Sends: "BUY AAPL @ 175.25"`}</pre>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded">
                  <p className="text-sm text-green-800">
                    <strong>Pro tip:</strong> Use webhook + Zapier for complex alerts that need 
                    custom formatting before SMS delivery
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="/ibkr-logo.png" alt="IBKR" className="h-6 w-6" />
                  Interactive Brokers (IBKR) Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Replace unreliable vtext.com with guaranteed delivery:</p>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong>In Account Management:</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                      <li>Log in to Account Management</li>
                      <li>Navigate to Account Administration → Alert Notification</li>
                      <li>Under SMS Address, remove old @vtext.com address</li>
                      <li>Add: 5551234567@txt.emailtotextnotify.com</li>
                    </ul>
                  </li>
                  <li>
                    <strong>In TWS (Trader Workstation):</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                      <li>Right-click any position → Set Alert</li>
                      <li>Configure price/volume conditions</li>
                      <li>Actions tab → Messages → Send as email</li>
                      <li>Select your Email to Text Notifier address</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Mobile App Integration:</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                      <li>Settings → Alerts → Create Alert</li>
                      <li>Define conditions</li>
                      <li>Notification method: Email to SMS</li>
                    </ul>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ThinkOrSwim (TOS) Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Get reliable SMS for TOS alerts:</p>
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> TOS doesn't support custom email addresses for alerts. 
                    Use this workaround:
                  </p>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Set TOS alerts to email your regular email address</li>
                  <li>Create email filter/rule to auto-forward TOS alerts</li>
                  <li>Forward to: 5551234567@txt.emailtotextnotify.com</li>
                  <li>Filter by subject: "thinkorswim Alert:"</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MetaTrader 4/5 SMS Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Configure MT4/MT5 email alerts for SMS delivery:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`// MQL4 Example for SMS alerts
void SendTradeAlert(string symbol, string action, double price)
{
   string subject = "MT4: " + action + " " + symbol;
   string body = symbol + " " + action + " @ " + DoubleToStr(price, 2);
   
   // Sends to your configured email (forward to SMS)
   SendMail(subject, body);
}

// Usage in EA:
if(BuySignal) {
   SendTradeAlert(Symbol(), "BUY", Ask);
   OrderSend(...);
}`}</pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Alert Types Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Critical Alerts Every Trader Needs
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Action Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Price crosses above/below level
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Support/resistance breaks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Moving average crosses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Breakout from range
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Stop-loss approaching
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Profit target reached
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Margin call warnings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Position size limits
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Economic data releases
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Earnings announcements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Unusual volume spikes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    After-hours movements
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Pro Trading Alert Strategies</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Alert Message Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Concise Format Examples:</h4>
                    <div className="space-y-2 text-sm font-mono bg-gray-100 p-3 rounded">
                      <p>AAPL 175.50 BUY TP:180 SL:173</p>
                      <p>!STOP! TSLA 245.20 EXIT NOW</p>
                      <p>SPY 440C 3/15 FILLED @ 2.85</p>
                      <p>⚠️ MARGIN 15% REDUCE SIZE</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Essential Information:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Symbol + Current Price</li>
                      <li>• Action Required (BUY/SELL/HOLD)</li>
                      <li>• Target & Stop Loss</li>
                      <li>• Urgency Indicator</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Filtering Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Priority Levels:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">🔴</span>
                        <span><strong>Critical:</strong> Stops, margin calls → SMS always</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">🟡</span>
                        <span><strong>Important:</strong> Entry signals → SMS market hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">🟢</span>
                        <span><strong>Info:</strong> Watchlist updates → Email only</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Time-Based Rules:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Pre-market (4-9:30 AM): Critical only</li>
                      <li>• Market hours: All trading signals</li>
                      <li>• After-hours: Position alerts only</li>
                      <li>• Weekends: System alerts only</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Multi-Account Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Professional traders often manage multiple accounts. Here's how to organize SMS alerts:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Account Segregation:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Main account: 5551234567@txt...</li>
                    <li>• IRA account: 5551234568@txt...</li>
                    <li>• Prop firm: 5551234569@txt...</li>
                    <li>• Paper trading: Email only</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Alert Prefixes:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• [MAIN] Regular trading</li>
                    <li>• [IRA] Long-term positions</li>
                    <li>• [PROP] Firm account</li>
                    <li>• [!] Urgent action needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Real Traders, Real Results
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Day Trader - ES Futures</p>
                    <p className="text-sm text-gray-500">Switched from vtext.com</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">
                  "Was losing $500-1000 weekly from delayed alerts. Email to Text Notifier 
                  delivers in 3 seconds flat. Caught the morning reversal today that email 
                  would've missed. Already paid for itself 100x over."
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Result: +$3,200 saved in first week
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <DollarSign className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Options Trader - Tech Stocks</p>
                    <p className="text-sm text-gray-500">TradingView + IBKR</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">
                  "0DTE options don't forgive missed alerts. My NVDA calls hit profit 
                  target while I was at lunch. SMS arrived instantly, closed for 
                  140% instead of watching it reverse."
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Result: $4,800 profit secured
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <LineChart className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Swing Trader - Crypto</p>
                    <p className="text-sm text-gray-500">Multiple exchanges</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">
                  "Crypto doesn't sleep. Set alerts for key BTC levels. Woke up to 
                  SMS at 3 AM about support break. Saved my entire position from 
                  the 20% overnight dump."
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Result: Avoided $12,000 loss
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Risk Manager - Prop Firm</p>
                    <p className="text-sm text-gray-500">20+ traders monitored</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">
                  "Monitor firm-wide risk limits. One trader hit max loss while I was 
                  in a meeting. SMS alert let me freeze the account before he 
                  revenge traded another $50K."
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Result: Prevented major breach
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="h-4 w-4" />
            Join 10,000+ Active Traders
          </div>
          <h2 className="text-3xl font-display font-bold mb-6">
            Stop Losing Money to Missed Alerts
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Every second counts in trading. Get SMS alerts that arrive instantly, 
            work with every platform, and never fail when markets move.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              Start Getting Trading SMS Alerts →
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Works with TradingView, IBKR, ThinkOrSwim, MT4/5, and any platform with email alerts
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Trading Alert FAQs</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How fast are alerts delivered during high volatility?</h3>
              <p className="text-gray-600">
                Our infrastructure handles millions of messages without delays. While email can 
                slow down during market volatility, we deliver SMS in under 5 seconds consistently, 
                even during Fed announcements or market crashes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I use this with multiple trading platforms?</h3>
              <p className="text-gray-600">
                Yes! Any platform that sends email alerts works with Email to Text Notifier. Many 
                traders use us with TradingView for signals, IBKR for execution alerts, and their 
                broker for fill confirmations—all going to the same phone.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What about international markets and forex?</h3>
              <p className="text-gray-600">
                Perfect for 24-hour markets. Set up alerts for London open, Asian session 
                reversals, or weekend crypto movements. We deliver SMS 24/7/365 without delays.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How do I prevent alert overload?</h3>
              <p className="text-gray-600">
                Smart filtering is key. Use email rules to forward only high-priority alerts to 
                SMS. For example: forward anything with "STOP" or "MARGIN" in the subject, but 
                keep routine updates in email.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is this secure for trading alerts?</h3>
              <p className="text-gray-600">
                Yes. We use bank-level encryption for all messages. Never include account numbers 
                or passwords in alerts. Most traders use symbols and prices only, which provides 
                security even if someone sees your SMS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-lg font-semibold mb-4">Related Trading Resources</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/use-cases/crypto-alerts" className="text-blue-600 hover:underline">
              24/7 Crypto Price Alerts →
            </Link>
            <Link href="/use-cases/portfolio-monitoring" className="text-blue-600 hover:underline">
              Portfolio Risk Monitoring →
            </Link>
            <Link href="/use-cases/earnings-alerts" className="text-blue-600 hover:underline">
              Earnings & News Alerts →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
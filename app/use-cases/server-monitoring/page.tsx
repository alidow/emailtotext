import { Metadata } from "next"
import Link from "next/link"
import { Server, AlertTriangle, CheckCircle, Zap, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Server Monitoring SMS Alerts - Nagios, Zabbix, PRTG | Email to Text",
  description: "Get instant SMS alerts from your server monitoring tools. Works with Nagios, Zabbix, PRTG, and any monitoring system that sends email alerts.",
  keywords: "server monitoring sms, nagios text alerts, zabbix sms notifications, prtg mobile alerts, server down text",
}

export default function ServerMonitoringPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="h-4 w-4" />
              Critical Infrastructure
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Email Alerts from Nagios?
              <span className="block text-red-600 mt-2">Get Them as SMS Instead</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Your monitoring tools send emails that sit unread. We convert Nagios, Zabbix, 
              and PRTG alerts to instant SMS. Know about downtime in seconds, not hours.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/">
                Enable SMS Alerts Now →
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
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">3-Second Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Critical alerts reach you instantly, not when you check email hours later.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">100% Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Redundant infrastructure ensures your alerts always get through.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Any Tool Works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  If your monitoring system sends emails, we'll deliver them as SMS.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Monitoring Tools */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Works With Every Monitoring Stack
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Nagios", desc: "Host/service alerts, performance warnings" },
              { name: "Zabbix", desc: "Trigger actions, problem notifications" },
              { name: "PRTG", desc: "Sensor alerts, threshold notifications" },
              { name: "Prometheus", desc: "AlertManager notifications" },
              { name: "Datadog", desc: "Monitor alerts, anomaly detection" },
              { name: "Any Tool", desc: "Custom scripts, cron jobs, anything" }
            ].map((tool) => (
              <div key={tool.name} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alert Types */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Never Miss Critical Alerts
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Infrastructure Alerts</h3>
              <ul className="space-y-3">
                {[
                  "Server down or unreachable",
                  "High CPU/Memory usage",
                  "Disk space warnings",
                  "Network connectivity issues",
                  "Service failures"
                ].map((alert) => (
                  <li key={alert} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Application Alerts</h3>
              <ul className="space-y-3">
                {[
                  "Database connection failures",
                  "API response time spikes",
                  "Error rate thresholds",
                  "Queue backup warnings",
                  "SSL certificate expiry"
                ].map((alert) => (
                  <li key={alert} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Set Up in Minutes
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Get Your Email</h3>
              <p className="text-gray-600">
                Sign up and receive your unique monitoring email address
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Add to Alerts</h3>
              <p className="text-gray-600">
                Add this email to your monitoring tool's notification contacts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Sleep Better</h3>
              <p className="text-gray-600">
                Critical alerts now wake you up, non-critical ones don't
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-3xl px-4">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8 text-center">
              <p className="text-xl text-gray-700 italic mb-4">
                "Our database server crashed at 2 AM on Black Friday. The SMS alert 
                saved us from losing $50K in sales. Worth every penny."
              </p>
              <p className="text-gray-600 font-medium">— DevOps Lead, E-commerce Platform</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Protect Your Infrastructure 24/7
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of DevOps teams who never miss critical alerts. 
            Start monitoring smarter today.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/">
              Set Up Monitoring Alerts →
            </Link>
          </Button>
          <p className="mt-4 text-sm opacity-75">
            Works with all monitoring tools • 10 free alerts/month • No contracts
          </p>
        </div>
      </section>
    </div>
  )
}
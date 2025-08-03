import { Metadata } from "next"
import Link from "next/link"
import { GitBranch, XCircle, CheckCircle, AlertTriangle, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "GitHub Actions Email Alerts → SMS in Seconds | Email to Text",
  description: "GitHub Actions only sends email when builds fail. Convert those emails to instant SMS. Know about failed tests, broken deployments, and CI issues immediately.",
  keywords: "github actions sms, ci failed text alert, build failure sms notification, github workflow sms, github actions mobile alerts, ci cd sms notifications",
}

export default function GitHubActionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GitBranch className="h-4 w-4" />
              GitHub Actions Integration
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              GitHub Actions Failed?
              <span className="block text-red-600 mt-2">Get SMS, Not Email</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Your CI/CD pipeline failed 3 hours ago. The email is buried under 50 PR notifications. 
              Convert GitHub Actions emails to instant SMS and fix breaks before they block your team.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/">
                Get Build Failure SMS Alerts →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Why Developers Miss Critical Build Failures
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Email Overload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  GitHub sends emails for everything. Failed actions get lost among PR reviews, 
                  comments, and notifications.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Delayed Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Average time to notice failed build via email: 3.5 hours. Your team is blocked 
                  while you're unaware.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Broken Deploys</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Production deployment failed at 2 AM. You find out at 9 AM when users complain 
                  about missing features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
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
              <h3 className="font-semibold mb-2">Add to GitHub</h3>
              <p className="text-gray-600">
                Settings → Notifications → Add custom routing email address
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Instant SMS</h3>
              <p className="text-gray-600">
                Every failed action, deployment issue, or CI problem texts you immediately
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Never Miss These Critical Failures
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { icon: XCircle, title: "Test Suite Failures", desc: "Unit tests, integration tests, E2E failures" },
              { icon: AlertTriangle, title: "Build Errors", desc: "Compilation failures, dependency issues" },
              { icon: GitBranch, title: "Deploy Failures", desc: "Production, staging deployment breaks" },
              { icon: Clock, title: "Timeout Issues", desc: "Long-running jobs that exceed limits" },
              { icon: CheckCircle, title: "Security Scans", desc: "Vulnerability alerts, SAST failures" },
              { icon: Zap, title: "Performance Tests", desc: "Benchmark regressions, load test failures" }
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 border rounded-lg">
                <item.icon className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Stop Finding Out About Failures Hours Later
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Your team is waiting. Your deployment is broken. Get SMS alerts the moment 
            GitHub Actions fail. Fix issues before anyone notices.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/">
              Enable GitHub Actions SMS →
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
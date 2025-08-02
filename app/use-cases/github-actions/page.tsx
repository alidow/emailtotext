import { Metadata } from "next"
import Link from "next/link"
import { GitBranch, XCircle, CheckCircle2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Stop Missing Failed GitHub Actions - Get Real SMS Alerts in 3 Minutes | Email to Text Notifier",
  description: "GitHub Actions failures hiding in your inbox? Get instant SMS notifications when builds fail, tests break, or deployments crash. No complex webhooks needed.",
  keywords: "github actions sms, ci failed text alert, build failure sms notification, github workflow sms, github actions mobile alerts, ci cd sms notifications",
}

export default function GitHubActionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GitBranch className="h-4 w-4" />
              GitHub Actions Integration
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Never Miss a Failed GitHub Action Again
              <span className="block text-green-600 mt-2">Get SMS Alerts in Seconds</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              That critical deployment failed at 2 AM. The build broke during lunch. 
              Stop digging through emails—get instant text alerts when your CI/CD pipeline needs attention.
            </p>
          </div>

          <Alert className="mb-8 border-red-200 bg-red-50">
            <XCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900">The Hidden Cost of Missed CI/CD Failures</AlertTitle>
            <AlertDescription className="text-red-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Production deployments sitting broken for hours</li>
                <li>Team blocked waiting for fixes to failed tests</li>
                <li>Security patches not deployed due to build failures</li>
                <li>Customer-facing features delayed by unnoticed errors</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Why Developers Miss GitHub Actions Failures</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Email Notification Overload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  GitHub sends all notifications to email. Between PR comments, issue updates, 
                  and workflow runs, critical failure alerts get buried.
                </p>
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                  "I had 47 GitHub emails. The deployment failure was #31. Found it 3 hours later 
                  when users reported the site was down."
                  <span className="block text-sm mt-2 not-italic">- r/devops</span>
                </blockquote>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">No Native SMS Option</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  GitHub doesn't offer SMS notifications. The common StackOverflow answer? 
                  "Use a webhook to trigger a Lambda function that calls SNS..." 
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Reality check:</strong> Setting up webhooks + Lambda + SNS for simple 
                    SMS alerts takes hours and costs more than our entire service.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Real Developer Pain Points</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <strong>Late Night Failures:</strong> "Pushed code at 11 PM, went to bed. 
                  Woke up to find the deployment failed and site was down all night."
                  <a href="https://stackoverflow.com/questions/47221035/integrating-sms-service-in-jenkins" 
                     className="text-blue-600 text-sm block mt-1 hover:underline"
                     target="_blank"
                     rel="noopener noreferrer">
                    Similar issue on StackOverflow →
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <strong>Matrix Build Failures:</strong> "Running tests on 5 Node versions. 
                  One fails randomly. Never know until I manually check each run."
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <strong>Flaky Test Fatigue:</strong> "That one test fails 30% of the time. 
                  Now I ignore all failure emails. Missed an actual breaking change."
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
            Add SMS to GitHub Actions in 3 Minutes
          </h2>

          <div className="max-w-3xl mx-auto mb-12">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-2xl">Simple 3-Step Setup</CardTitle>
                <CardDescription>No webhooks, no Lambda functions, no complex configuration</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <h4 className="font-semibold mb-1">Get Your SMS Email Address</h4>
                      <p className="text-gray-600">Sign up and get: <code className="bg-gray-100 px-2 py-1 rounded text-sm">5551234567@txt.emailtotextnotify.com</code></p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <h4 className="font-semibold mb-1">Add to GitHub Notifications</h4>
                      <p className="text-gray-600">Settings → Notifications → Add custom routing → Workflow runs</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <h4 className="font-semibold mb-1">Receive Instant SMS Alerts</h4>
                      <p className="text-gray-600">Failed workflows trigger immediate text messages</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Examples */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Configuration Examples</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Option 1: Global GitHub Notification Settings</CardTitle>
                <CardDescription>Get SMS for all workflow failures across all repositories</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 mb-4">
                  <li>Go to GitHub Settings → Notifications</li>
                  <li>Under "Workflow runs", click "Add custom routing"</li>
                  <li>Enter your Email to Text Notifier address</li>
                  <li>Select "Only failed workflows" to avoid spam</li>
                </ol>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">
                    <strong>Pro tip:</strong> Use "Participating" to only get alerts for repos you're actively working on
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Option 2: Per-Workflow Configuration</CardTitle>
                <CardDescription>Add SMS notifications directly to critical workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Add this job to any workflow that needs SMS alerts:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: ./deploy.sh
      
  notify-failure:
    needs: deploy
    if: ${{ failure() }}
    runs-on: ubuntu-latest
    steps:
      - name: Send SMS Alert
        run: |
          curl -X POST \\
            -u "api:${{ secrets.MAILGUN_API_KEY }}" \\
            https://api.mailgun.net/v3/${{ vars.MAILGUN_DOMAIN }}/messages \\
            -F from="GitHub Actions <actions@yourdomain.com>" \\
            -F to="5551234567@txt.emailtotextnotify.com" \\
            -F subject="Deploy Failed: ${{ github.repository }}" \\
            -F text="Production deployment failed! Check: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"`}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Option 3: Smart Filtering with Email Rules</CardTitle>
                <CardDescription>Use Gmail filters for advanced SMS routing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Forward only critical failures to SMS while keeping others in email:
                </p>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <p className="font-semibold text-sm mb-1">Filter: Production Deployments</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      from:notifications@github.com subject:"workflow run failed" "main branch"
                    </code>
                    <p className="text-sm text-gray-600 mt-1">→ Forward to SMS immediately</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="font-semibold text-sm mb-1">Filter: Security Scans</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      from:notifications@github.com "security" OR "vulnerability" failed
                    </code>
                    <p className="text-sm text-gray-600 mt-1">→ Forward to SMS immediately</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="font-semibold text-sm mb-1">Filter: Test Failures (Dev Branches)</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      from:notifications@github.com subject:"workflow run failed" -"main branch"
                    </code>
                    <p className="text-sm text-gray-600 mt-1">→ Keep in email only</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Real Teams Using SMS for GitHub Actions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  E-commerce Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Our checkout flow deployment failed on Black Friday eve. Got the SMS at 10 PM, 
                  fixed it before the morning rush. Saved potentially $100K in lost sales."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Setup:</strong> SMS alerts only for main branch deployments
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-blue-600" />
                  Open Source Maintainer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Managing 5 popular repos. Set up SMS for security workflow failures only. 
                  Caught a dependency vulnerability within minutes of the advisory."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Setup:</strong> Filtered to security and release workflows
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Mobile App Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "iOS builds take 45 minutes. Used to check email constantly. Now I get a text 
                  only if it fails. Productivity game changer."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Setup:</strong> SMS for iOS/Android build failures only
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  DevOps Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  "Terraform apply failed at 3 AM, left infrastructure half-deployed. SMS woke 
                  me up, rolled back before anyone noticed."
                </p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Setup:</strong> Critical infrastructure workflows only
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Advanced GitHub Actions SMS Patterns</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Smart Notification Strategies</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Branch-based Routing:</strong> Production branches → SMS, 
                    feature branches → email only
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Time-based Filtering:</strong> After-hours failures → SMS, 
                    business hours → regular email
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Failure Patterns:</strong> First failure → SMS, 
                    subsequent retries → email only
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Team Rotation:</strong> Different SMS endpoints based on 
                    who's on-call this week
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Workflow Optimization Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Failure Context:</strong> Include branch name, commit SHA, 
                    and failure type in SMS body
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Quick Actions:</strong> Add re-run URL in SMS for one-tap 
                    retry from your phone
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Matrix Jobs:</strong> Aggregate multiple failures into one 
                    SMS to avoid spam
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">•</span>
                  <div>
                    <strong>Cost Monitoring:</strong> Get SMS when Actions minutes are 
                    running low
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-lg border">
            <h4 className="font-semibold mb-3">Sample: Enhanced Failure Notification</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`- name: Enhanced SMS Alert
  if: ${{ failure() }}
  run: |
    BRANCH="${{ github.ref_name }}"
    COMMIT="${{ github.sha }}"
    WORKFLOW="${{ github.workflow }}"
    RUN_URL="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
    
    MESSAGE="🚨 $WORKFLOW failed on $BRANCH
    Commit: ${COMMIT:0:7}
    Fix: $RUN_URL"
    
    # Send via your email service to Email to Text Notifier
    echo "$MESSAGE" | mail -s "CI Failed: ${{ github.repository }}" \\
      5551234567@txt.emailtotextnotify.com`}</pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GitBranch className="h-4 w-4" />
            Trusted by 1000+ Development Teams
          </div>
          <h2 className="text-3xl font-display font-bold mb-6">
            Stop Missing Critical Build Failures
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your CI/CD pipeline is too important for email delays. Get instant SMS alerts 
            for GitHub Actions failures. Setup takes 3 minutes.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/">
              Get GitHub Actions SMS Alerts →
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Free tier includes 10 alerts/month • No webhook configuration needed
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-display font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Do I need to modify my workflows?</h3>
              <p className="text-gray-600">
                No! The simplest setup requires zero workflow changes. Just add your Email to Text 
                Notifier address to your GitHub notification settings. For advanced use cases, you 
                can add custom notification steps.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I filter which workflows send SMS?</h3>
              <p className="text-gray-600">
                Yes, multiple ways: Use GitHub's custom routing rules, set up email filters, or add 
                conditional notification steps in your workflows. Most teams filter to only production 
                deployments and security scans.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How fast are the notifications?</h3>
              <p className="text-gray-600">
                GitHub sends the email within seconds of a workflow failure. We deliver the SMS in 
                under 5 seconds after receiving the email. Total time from failure to SMS: typically 
                under 10 seconds.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What about successful runs?</h3>
              <p className="text-gray-600">
                We recommend SMS only for failures to avoid notification fatigue. You can configure 
                GitHub to send success notifications too, but most teams keep those in email or Slack.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can multiple team members get alerts?</h3>
              <p className="text-gray-600">
                Yes! Each team member signs up for their own Email to Text Notifier address. You can 
                add multiple addresses to GitHub notifications or use email forwarding rules for 
                on-call rotations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-lg font-semibold mb-4">Related Guides</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/use-cases/jenkins-ci" className="text-blue-600 hover:underline">
              Jenkins Build Failure SMS Alerts →
            </Link>
            <Link href="/use-cases/gitlab-ci" className="text-blue-600 hover:underline">
              GitLab CI/CD SMS Notifications →
            </Link>
            <Link href="/use-cases/circleci" className="text-blue-600 hover:underline">
              CircleCI Failed Build Alerts →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
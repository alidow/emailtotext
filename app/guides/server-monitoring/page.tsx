export default function ServerMonitoringGuide() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Setting Up Server Monitoring Alerts</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8">
            Learn how to forward critical server alerts, uptime monitoring notifications, and system logs to your 
            phone via SMS using Email to Text Notifier.
          </p>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Why Use SMS for Server Alerts?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Instant notifications even without internet access</li>
            <li>Wake up to critical alerts in the middle of the night</li>
            <li>Never miss an important system notification</li>
            <li>Works when email and Slack are down</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Common Monitoring Tools</h2>
          <p>
            Email to Text Notifier works with any monitoring tool that can send email alerts:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uptime Monitoring</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>UptimeRobot:</strong> Free monitoring for up to 50 monitors</li>
            <li><strong>Pingdom:</strong> Enterprise-grade monitoring</li>
            <li><strong>StatusCake:</strong> Website and server monitoring</li>
            <li><strong>Better Uptime:</strong> Modern incident management</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Server Monitoring</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Nagios:</strong> Open-source monitoring solution</li>
            <li><strong>Zabbix:</strong> Enterprise monitoring platform</li>
            <li><strong>Datadog:</strong> Cloud monitoring as a service</li>
            <li><strong>New Relic:</strong> Application performance monitoring</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Setup Instructions</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Step 1: Get Your Forwarding Address</h3>
          <p>
            Sign up at emailtotextnotify.com and get your unique email address (e.g., 5551234567@txt.emailtotextnotify.com)
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Step 2: Configure Your Monitoring Tool</h3>
          <p>
            Add your Email to Text Notifier address as an alert contact. Here's how for popular tools:
          </p>

          <h4 className="text-lg font-semibold mt-4 mb-2">UptimeRobot Example:</h4>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to My Settings → Alert Contacts</li>
            <li>Click "Add Alert Contact"</li>
            <li>Choose "Email" as the type</li>
            <li>Enter your @txt.emailtotextnotify.com address</li>
            <li>Set notification preferences</li>
          </ol>

          <h4 className="text-lg font-semibold mt-4 mb-2">Nagios Example:</h4>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
{`define contact {
  contact_name    sms-alert
  alias           SMS Alert Contact
  email           5551234567@txt.emailtotextnotify.com
  service_notification_commands   notify-service-by-email
  host_notification_commands      notify-host-by-email
}`}
          </pre>

          <h3 className="text-xl font-semibold mt-6 mb-3">Step 3: Configure Alert Rules</h3>
          <p>
            Best practices for SMS alerts:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Only send critical alerts via SMS</li>
            <li>Use email subjects that clearly identify the issue</li>
            <li>Keep alert messages concise (remember SMS limit)</li>
            <li>Set up escalation rules to avoid alert fatigue</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Example Alert Formats</h2>
          <p>
            Here's how different alerts will appear as SMS:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Server Down Alert</h3>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-mono text-sm">
              From: alerts@uptimerobot.com<br/>
              Subj: CRITICAL: Server web01 is DOWN<br/>
              Body: Server web01 (192.168.1.10) is not responding. Last check: 2:34 AM EST
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">High CPU Usage</h3>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-mono text-sm">
              From: monitoring@datadog.com<br/>
              Subj: WARNING: High CPU on db-master<br/>
              Body: CPU usage is 89% on db-master. Threshold: 80%. Duration: 5 minutes
            </p>
          </div>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Tips for Effective Monitoring</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Prioritize alerts:</strong> Only forward truly critical issues to SMS</li>
            <li><strong>Use clear subjects:</strong> Include server name and issue type</li>
            <li><strong>Test regularly:</strong> Ensure alerts are working before you need them</li>
            <li><strong>Monitor usage:</strong> Track your SMS usage to avoid exceeding limits</li>
            <li><strong>Set quiet hours:</strong> Configure monitoring tools to respect sleep (unless critical)</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Advanced Configuration</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Custom Scripts</h3>
          <p>
            You can also send alerts from custom scripts:
          </p>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
{`#!/bin/bash
# Send alert via email-to-SMS
echo "Disk space critical on server01" | \
  mail -s "CRITICAL: Disk Space" \
  5551234567@txt.emailtotextnotify.com`}
          </pre>

          <h3 className="text-xl font-semibold mt-6 mb-3">Python Example</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
{`import smtplib
from email.mime.text import MIMEText

def send_sms_alert(message, subject):
    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = 'alerts@yourserver.com'
    msg['To'] = '5551234567@txt.emailtotextnotify.com'
    
    s = smtplib.SMTP('localhost')
    s.send_message(msg)
    s.quit()`}
          </pre>

          <h2 className="text-2xl font-display font-semibold mt-8 mb-4">Get Started</h2>
          <p>
            Ready to never miss a critical server alert again? Sign up for Email to Text Notifier and start 
            receiving instant SMS notifications for your most important system events.
          </p>
          <div className="mt-6">
            <a 
              href="/" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
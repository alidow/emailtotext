import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Instant SMS for Stripe Payments | Email to Text Notifier",
  description: "Get SMS alerts for Stripe payments and disputes.",
  keywords: "stripe sms notifications, stripe payment alerts",
}

export default function StripePaymentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <h1>Stripe Payment SMS Alerts</h1>
      <p>Page content coming soon...</p>
    </div>
  )
}
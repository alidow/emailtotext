import * as Sentry from '@sentry/nextjs';
import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"]
})

export const metadata: Metadata = {
  title: "Email to Text Forwarding Service | SMS Gateway for Email Alerts",
  description: "Forward any email to SMS instantly. Best email to text service for alerts, notifications, and monitoring. Replace AT&T email-to-text with our secure gateway.",
  keywords: "email to text, email to sms, forward email to phone, email forwarding to text, sms gateway, email alerts, text message forwarding, email to text message, att email to text replacement",
  openGraph: {
    title: "Email to Text Notifier - Forward Emails to Your Phone",
    description: "Get instant text messages from important emails. Simple setup, secure delivery, affordable pricing.",
    type: "website",
    url: "https://emailtotextnotify.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Email to Text Notifier - Forward Emails to SMS",
    description: "Convert emails to text messages instantly. Perfect for alerts and notifications.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💬</text></svg>",
  },
  other: {
    ...Sentry.getTraceData()
  }
}

// Check if we have valid Clerk credentials
const hasValidClerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_test_xxx')

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const content = (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )

  // Only wrap with ClerkProvider if we have valid credentials
  if (hasValidClerkKey) {
    return <ClerkProvider>{content}</ClerkProvider>
  }
  
  return content
}
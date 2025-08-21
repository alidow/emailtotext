import * as Sentry from '@sentry/nextjs';
import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { CookieConsent } from "@/components/cookie-consent"
import { TestModeBanner } from "@/components/test-mode-banner"
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"]
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.emailtotextnotify.com'),
  alternates: {
    canonical: 'https://www.emailtotextnotify.com',
  },
  title: "Email to Text Forwarding Service | SMS Gateway for Email Alerts",
  description: "Forward any email to SMS instantly. Best email to text service for alerts, notifications, and monitoring. Replace AT&T email-to-text with our secure gateway.",
  keywords: "email to text, email to sms, forward email to phone, email forwarding to text, sms gateway, email alerts, text message forwarding, email to text message, att email to text replacement",
  openGraph: {
    title: "Email to Text Notifier - Forward Emails to Your Phone",
    description: "Get instant text messages from important emails. Simple setup, secure delivery, affordable pricing.",
    type: "website",
    url: "https://www.emailtotextnotify.com",
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
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-M7GMCQX9'
  const BING_UET_ID = process.env.NEXT_PUBLIC_BING_UET_ID || '343206284'
  const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-11473435972' // Replace with your actual Google Ads ID
  
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <ClerkProvider>
          <TestModeBanner />
          {children}
        </ClerkProvider>
        <CookieConsent />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Analytics />
        
        {/* Google Ads Global Site Tag (gtag.js) */}
        <Script
          id="google-ads-gtag"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
        <Script
          id="google-ads-config"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-CB0Q6E7ND3'}');
          `}
        </Script>
        
        {/* Bing UET Tag */}
        <Script 
          id="bing-uet-tag"
          strategy="beforeInteractive"
        >
          {`
            (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"${BING_UET_ID}", enableAutoSpaTracking: true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");
          `}
        </Script>
      </body>
    </html>
  )
}
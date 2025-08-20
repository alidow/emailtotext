import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get Started - Email to Text",
  description: "Create your free account and start forwarding emails to SMS in minutes. Trusted, secure, and simple.",
}

interface StartLayoutProps {
  children: React.ReactNode
}

export default function StartLayout({ children }: StartLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {children}
    </div>
  )
}
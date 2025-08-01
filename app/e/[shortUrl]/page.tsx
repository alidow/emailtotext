import { supabaseAdmin } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    shortUrl: string
  }
}

export default async function EmailViewerPage({ params }: PageProps) {
  const { shortUrl } = params
  
  // Fetch email by short URL
  const { data: email, error } = await supabaseAdmin
    .from("emails")
    .select("*")
    .eq("short_url", shortUrl)
    .single()
  
  if (error || !email) {
    notFound()
  }
  
  // Check if email has expired
  const isExpired = new Date(email.expires_at) < new Date()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Email to Text Notifier
          </h1>
        </div>

        {isExpired ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This email has expired and is no longer available.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{email.subject || "(no subject)"}</CardTitle>
                  <CardDescription>
                    From: {email.from_email}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {formatDistanceToNow(new Date(email.created_at), { addSuffix: true })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{email.body}</pre>
              </div>
              
              <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                <p>This email will expire {formatDistanceToNow(new Date(email.expires_at), { addSuffix: true })}.</p>
                <p className="mt-2">
                  This message was delivered via Email to Text Notifier. 
                  Visit <a href="https://emailtotextnotify.com" className="underline">emailtotextnotify.com</a> to learn more.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
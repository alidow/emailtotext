import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, Mail, Paperclip, Lock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { notFound } from "next/navigation"
import { AttachmentItem } from "@/components/AttachmentItem"
import Link from "next/link"

interface PageProps {
  params: {
    shortUrl: string
  }
}

export default async function EmailViewerPage({ params }: PageProps) {
  const { shortUrl } = params
  
  // Check authentication
  const { userId } = await auth()
  
  // Fetch email with attachments by short URL
  const { data: email, error } = await supabaseAdmin
    .from("emails")
    .select(`
      *,
      email_attachments (
        id,
        filename,
        content_type,
        size_bytes,
        storage_path,
        thumbnail_path
      )
    `)
    .eq("short_url", shortUrl)
    .single() as { 
      data: {
        id: string;
        user_id: string;
        from_email: string;
        subject: string;
        body: string;
        preview_text: string;
        received_at: string;
        created_at: string;
        short_url: string;
        expires_at: string;
        email_attachments: Array<{
          id: string;
          filename: string;
          content_type: string;
          size_bytes: number;
          storage_path: string;
          thumbnail_path: string | null;
        }>;
      } | null;
      error: any;
    }
  
  if (error || !email) {
    notFound()
  }
  
  // Check if email has expired
  const isExpired = new Date(email.expires_at) < new Date()
  
  // If user is not authenticated, show login prompt
  if (!userId) {
    // Get user data to check if this is their email
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id, clerk_id")
      .eq("id", email.user_id)
      .single() as { data: { id: string; clerk_id: string } | null; error: any }
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Email to Text Notifier
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Authentication Required
              </CardTitle>
              <CardDescription>
                This email is private and requires authentication to view.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  To view this email, please sign in to your account.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-2">
                <Link href={`/sign-in?redirect_url=/e/${shortUrl}`}>
                  <Button className="w-full">Sign In to View Email</Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  Don't have an account?{" "}
                  <Link href="/sign-up" className="underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  // User is authenticated - verify they own this email
  const { data: currentUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single() as { data: { id: string } | null; error: any }
  
  if (!currentUser || currentUser.id !== email.user_id) {
    // User is logged in but doesn't own this email
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Email to Text Notifier
            </h1>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to view this email.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // User owns this email - show content
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

              {/* Attachments section */}
              {email.email_attachments && email.email_attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments ({email.email_attachments.length})
                  </h3>
                  <div className="space-y-2">
                    {email.email_attachments.map((attachment: any) => (
                      <AttachmentItem key={attachment.id} attachment={attachment} />
                    ))}
                  </div>
                </div>
              )}
              
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
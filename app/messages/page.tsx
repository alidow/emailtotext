import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { ChevronDown, Paperclip, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Email {
  id: string
  from_email: string
  subject: string
  body: string
  preview_text: string
  created_at: string
  short_url: string
  has_attachments: boolean
  attachment_count: number
}

async function getEmails(userId: string) {
  const { data: userData } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single()
  
  if (!userData) {
    return []
  }
  
  const { data: emails } = await supabaseAdmin
    .from("emails")
    .select("*")
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false })
    .limit(20)
  
  return emails || []
}

function EmailCard({ 
  email, 
  isLatest = false 
}: { 
  email: Email
  isLatest?: boolean 
}) {
  const timeAgo = formatDistanceToNow(new Date(email.created_at), { addSuffix: true })
  
  return (
    <div className="border-b border-gray-200">
      <details open={isLatest} className="group">
        <summary className="px-4 py-4 cursor-pointer list-none select-none">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <div className="text-sm text-gray-600 truncate">
                {email.from_email}
              </div>
              <div className="font-medium text-gray-900 line-clamp-1">
                {email.subject || "(no subject)"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {timeAgo}
                {email.has_attachments && (
                  <span className="ml-2 inline-flex items-center">
                    <Paperclip className="w-3 h-3 mr-1" />
                    {email.attachment_count}
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0" />
          </div>
        </summary>
        
        <div className="px-4 pb-4">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap break-words text-gray-700 text-sm leading-relaxed">
              {email.body || email.preview_text}
            </div>
          </div>
          
          {email.has_attachments && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 flex items-center">
                <Paperclip className="w-3 h-3 mr-1" />
                {email.attachment_count} attachment{email.attachment_count !== 1 ? 's' : ''}
              </div>
            </div>
          )}
          
          {/* View full email link for complex emails */}
          <div className="mt-3">
            <Link 
              href={`/email/${email.short_url}`}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View full email →
            </Link>
          </div>
        </div>
      </details>
    </div>
  )
}

export default async function MessagesPage() {
  const { userId } = await auth()
  
  if (!userId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your messages</p>
          <Link 
            href="/sign-in"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }
  
  const emails = await getEmails(userId)
  
  if (emails.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Mobile header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="px-4 py-3 flex items-center">
            <Link href="/dashboard" className="mr-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold">Messages</h1>
          </div>
        </div>
        
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No messages yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Emails sent to your Email to Text address will appear here
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold">Messages</h1>
          </div>
          <span className="text-sm text-gray-500">{emails.length} total</span>
        </div>
      </div>
      
      {/* Email list */}
      <div className="divide-y divide-gray-200">
        {emails.map((email, index) => (
          <EmailCard 
            key={email.id} 
            email={email} 
            isLatest={index === 0}
          />
        ))}
      </div>
      
      {/* Bottom padding for scroll */}
      <div className="h-20" />
    </div>
  )
}
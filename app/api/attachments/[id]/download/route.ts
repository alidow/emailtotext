import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const user = await currentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get user data from database
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single() as { data: { id: string } | null; error: any }

    if (userError || !userData) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Verify user owns this attachment
    const { data: attachment, error: attachmentError } = await supabaseAdmin
      .from("email_attachments")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userData.id)
      .single() as { data: { 
        id: string;
        expires_at: string;
        storage_path: string;
        content_type: string;
        filename: string;
        size_bytes: number;
      } | null; error: any }

    if (attachmentError || !attachment) {
      return new NextResponse("Attachment not found", { status: 404 })
    }

    // Check if attachment has expired
    if (new Date(attachment.expires_at) < new Date()) {
      return new NextResponse("Attachment has expired", { status: 410 })
    }

    // Generate signed URL for temporary access
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from("email-attachments")
      .createSignedUrl(attachment.storage_path, 300) // 5 minute expiry

    if (signedUrlError || !signedUrlData) {
      console.error("Error generating signed URL:", signedUrlError)
      return new NextResponse("Error generating download link", { status: 500 })
    }

    // Set proper headers for download
    const response = await fetch(signedUrlData.signedUrl)
    const blob = await response.blob()

    return new NextResponse(blob, {
      headers: {
        "Content-Type": attachment.content_type,
        "Content-Disposition": `attachment; filename="${attachment.filename}"`,
        "Content-Length": attachment.size_bytes.toString(),
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
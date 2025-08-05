import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@/utils/supabase/server"

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
    const supabase = createClient()
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single()

    if (userError || !userData) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Verify user owns this attachment
    const { data: attachment, error: attachmentError } = await supabase
      .from("email_attachments")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userData.id)
      .single()

    if (attachmentError || !attachment) {
      return new NextResponse("Attachment not found", { status: 404 })
    }

    // Check if attachment has expired
    if (new Date(attachment.expires_at) < new Date()) {
      return new NextResponse("Attachment has expired", { status: 410 })
    }

    // Only allow preview for images and PDFs
    const previewableTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"]
    if (!previewableTypes.includes(attachment.content_type)) {
      return new NextResponse("Preview not available for this file type", { status: 400 })
    }

    // Generate signed URL for temporary access
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("email-attachments")
      .createSignedUrl(attachment.storage_path, 300) // 5 minute expiry

    if (signedUrlError || !signedUrlData) {
      console.error("Error generating signed URL:", signedUrlError)
      return new NextResponse("Error generating preview link", { status: 500 })
    }

    // Fetch and return the file with appropriate headers for preview
    const response = await fetch(signedUrlData.signedUrl)
    const blob = await response.blob()

    return new NextResponse(blob, {
      headers: {
        "Content-Type": attachment.content_type,
        "Content-Disposition": `inline; filename="${attachment.filename}"`,
        "Content-Length": attachment.size_bytes.toString(),
        "Cache-Control": "private, max-age=300", // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error("Preview error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
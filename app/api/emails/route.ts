import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { isMockMode, mockEmails } from "@/lib/mock-mode"

export async function GET() {
  try {
    // In mock mode, return mock emails
    if (isMockMode) {
      return NextResponse.json({ emails: mockEmails })
    }
    
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Get user from database
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single()
    
    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Get recent emails
    const { data: emails, error: emailsError } = await supabaseAdmin
      .from("emails")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false })
      .limit(20)
    
    if (emailsError) {
      throw emailsError
    }
    
    return NextResponse.json({ emails: emails || [] })
  } catch (error) {
    console.error("Error fetching emails:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
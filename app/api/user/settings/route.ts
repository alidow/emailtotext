import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { isMockMode } from "@/lib/mock-mode"

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
  try {
    // In mock mode, skip authentication
    if (isMockMode) {
      // Since we're removing 24/7 settings, just return success
      return NextResponse.json({ success: true })
    }
    
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { accepts_24hr_texts } = await req.json()
    
    // Update user settings
    const { error } = await supabaseAdmin
      .from("users")
      .update({ accepts_24hr_texts })
      .eq("clerk_id", user.id)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
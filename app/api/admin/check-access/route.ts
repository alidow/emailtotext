import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Admin emails allowed to access admin features
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean)

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user email from Clerk
    const userEmail = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json()).then(data => data.email_addresses?.[0]?.email_address)

    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ 
      success: true,
      email: userEmail,
      isAdmin: true
    })
  } catch (error) {
    console.error("Admin check error:", error)
    return NextResponse.json(
      { error: "Failed to check admin access" },
      { status: 500 }
    )
  }
}
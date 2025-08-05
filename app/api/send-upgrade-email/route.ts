import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { userId, fromPlan, toPlan } = await req.json()
    
    // Get user details
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("email, phone")
      .eq("id", userId)
      .single() as { data: { email: string | null; phone: string } | null; error: any }
    
    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // In production, this would send an actual email via SendGrid/Mailgun
    // For now, we'll log it and return success
    const emailContent = {
      to: user.email || `${user.phone}@txt.emailtotextnotify.com`,
      subject: "Your Email to Text Notifier plan has been upgraded",
      html: `
        <h2>Plan Upgrade Notification</h2>
        <p>Hello,</p>
        <p>You've exceeded your free plan limit of 10 messages this month. As per our terms of service, we've automatically upgraded your account to the Basic plan.</p>
        
        <h3>What this means:</h3>
        <ul>
          <li>Your new plan: <strong>Basic ($4.99/month)</strong></li>
          <li>You now have: <strong>100 messages per month</strong></li>
          <li>Extended message history: <strong>30 days</strong></li>
          <li>Priority support</li>
        </ul>
        
        <p>Your card will be charged $4.99 within the next 24 hours. This will then recur monthly on the same date.</p>
        
        <h3>Want to change your plan?</h3>
        <p>You can downgrade back to the free plan or upgrade to Pro at any time from your <a href="https://emailtotextnotify.com/settings">account settings</a>.</p>
        
        <p>If you have any questions, please don't hesitate to <a href="https://emailtotextnotify.com/contact">contact us</a>.</p>
        
        <p>Thank you for using Email to Text Notifier!</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          Email to Text Notifier<br>
          This is an automated message regarding your account.<br>
          To unsubscribe from service emails, please visit your account settings.
        </p>
      `
    }
    
    console.log("Sending upgrade email:", emailContent)
    
    // Log the upgrade event
    await supabaseAdmin
      .from("usage_logs")
      .insert({
        user_id: userId,
        event_type: "plan_upgrade",
        details: {
          from_plan: fromPlan,
          to_plan: toPlan,
          reason: "exceeded_free_limit"
        }
      })
    
    return NextResponse.json({ 
      success: true, 
      message: "Upgrade email sent successfully" 
    })
    
  } catch (error) {
    console.error("Error sending upgrade email:", error)
    return NextResponse.json({ 
      error: "Failed to send upgrade email" 
    }, { status: 500 })
  }
}
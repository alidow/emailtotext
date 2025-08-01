"use client"

import { useEffect, useState } from "react"
// import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, MessageSquare, User } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Check if we're in mock mode
const isMockMode = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

interface UserData {
  id: string
  phone: string
  email: string
  plan_type: string
  accepts_24hr_texts: boolean
  stripe_customer_id: string
  stripe_subscription_id: string
}

export default function SettingsPage() {
  // const { user, isLoaded } = useUser()
  const router = useRouter()
  const isLoaded = true // Mock mode
  const user = { id: "mock-user" } // Mock user
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [accepts24hr, setAccepts24hr] = useState(false)

  useEffect(() => {
    // In mock mode, always fetch data
    if (isMockMode) {
      fetchUserData()
    } else if (isLoaded && !user) {
      router.push("/sign-in")
    } else if (user) {
      fetchUserData()
    }
  }, [isLoaded, user, router])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user")
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
        setAccepts24hr(data.accepts_24hr_texts)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accepts_24hr_texts: accepts24hr
        })
      })
      
      if (response.ok) {
        alert("Settings saved successfully!")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleManageBilling = async () => {
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST"
      })
      
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Error creating portal session:", error)
      alert("Failed to open billing portal")
    }
  }

  if (loading || !userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="sms">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS Settings
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <p className="text-sm text-muted-foreground">{userData.phone}</p>
                </div>
                <div>
                  <Label>Your Email-to-Text Address</Label>
                  <code className="block text-sm bg-muted px-2 py-1 rounded mt-1">
                    {userData.phone.replace('+1', '')}@txt.emailtotextnotify.com
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" id="sms">
            <Card>
              <CardHeader>
                <CardTitle>SMS Delivery Settings</CardTitle>
                <CardDescription>
                  Configure when you want to receive text messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="24hr"
                      checked={accepts24hr}
                      onCheckedChange={(checked) => setAccepts24hr(checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="24hr" className="text-base cursor-pointer">
                        Enable 24/7 message delivery
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        When enabled, you'll receive SMS messages at any time of day. 
                        When disabled, messages are only sent between 8am-9pm in your timezone.
                      </p>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertDescription>
                      Messages received outside of allowed hours will be queued and delivered 
                      at the next available time.
                    </AlertDescription>
                  </Alert>
                  
                  <Button onClick={handleSaveSettings} disabled={saving}>
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" id="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your plan and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Plan</Label>
                  <p className="text-lg font-semibold capitalize">{userData.plan_type}</p>
                </div>
                
                {userData.stripe_subscription_id ? (
                  <Button onClick={handleManageBilling}>
                    Manage Subscription
                  </Button>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      You're currently on the free plan. Upgrade to get more texts per month.
                    </p>
                    <Button onClick={() => router.push("/onboarding")}>
                      Upgrade Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
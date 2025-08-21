"use client"

import { useEffect, useState } from "react"
// import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CreditCard, User, AlertTriangle } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { PlanChangeModal } from "@/components/plan-change-modal"
import { CancelAccountModal } from "@/components/cancel-account-modal"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Check if we're in mock mode
const isMockMode = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

interface UserData {
  id: string
  phone: string
  email: string
  plan_type: string
  stripe_customer_id: string
  stripe_subscription_id: string
  billing_cycle?: string
  usage_count: number
}

export default function SettingsPage() {
  // const { user, isLoaded } = useUser()
  const router = useRouter()
  const isLoaded = true // Mock mode
  const user = { id: "mock-user" } // Mock user
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPlanChange, setShowPlanChange] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancellationStatus, setCancellationStatus] = useState<{
    status: string
    pendingCancellation: boolean
    cancellationDate: string | null
  } | null>(null)

  useEffect(() => {
    // In mock mode, always fetch data
    if (isMockMode) {
      fetchUserData()
      fetchCancellationStatus()
    } else if (isLoaded && !user) {
      router.push("/sign-in")
    } else if (user) {
      fetchUserData()
      fetchCancellationStatus()
    }
  }, [isLoaded, user, router])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user")
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCancellationStatus = async () => {
    try {
      const response = await fetch("/api/cancel-subscription")
      if (response.ok) {
        const data = await response.json()
        setCancellationStatus(data)
      }
    } catch (error) {
      console.error("Error fetching cancellation status:", error)
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
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold capitalize">{userData.plan_type}</p>
                    {userData.billing_cycle && (
                      <Badge variant="secondary" className="text-xs">
                        {userData.billing_cycle}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {userData.stripe_subscription_id ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button onClick={handleManageBilling}>
                        Manage Payment Method
                      </Button>
                      <Button variant="outline" onClick={() => setShowPlanChange(!showPlanChange)}>
                        Change Plan
                      </Button>
                    </div>
                    
                    {showPlanChange && (
                      <PlanChangeModal 
                        currentPlan={userData.plan_type}
                        currentBillingCycle={userData.billing_cycle || 'monthly'}
                        currentUsage={userData.usage_count}
                        onClose={() => setShowPlanChange(false)}
                        onSuccess={() => {
                          setShowPlanChange(false)
                          fetchUserData()
                        }}
                      />
                    )}
                    
                    {cancellationStatus?.pendingCancellation && (
                      <Alert className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Your subscription is scheduled to cancel on{' '}
                          {new Date(cancellationStatus.cancellationDate!).toLocaleDateString()}.
                          You can continue using your plan until then.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
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
            
            <Card className="mt-4 border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Permanent account actions that cannot be undone
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userData.account_status === 'cancelled' ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your account has been cancelled. You can reactivate it by upgrading to a paid plan.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Cancelling your account will stop all email-to-text services and you'll lose access to your message history after 30 days.
                      {userData.stripe_subscription_id && " You can choose to cancel immediately or at the end of your billing period."}
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={() => setShowCancelModal(true)}
                      disabled={cancellationStatus?.pendingCancellation}
                    >
                      {cancellationStatus?.pendingCancellation ? "Cancellation Pending" : "Cancel Account"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {showCancelModal && (
          <CancelAccountModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onSuccess={() => {
              setShowCancelModal(false)
              fetchUserData()
              fetchCancellationStatus()
            }}
            hasSubscription={!!userData.stripe_subscription_id}
            currentPlan={userData.plan_type}
            phoneNumber={userData.phone}
          />
        )}
      </div>
    </div>
  )
}
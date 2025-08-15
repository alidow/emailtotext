"use client"

import { useEffect, useState } from "react"
// import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Settings, Copy, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface UserData {
  id: string
  phone: string
  email: string
  plan_type: string
  usage_count: number
  usage_reset_at: string
}

interface Email {
  id: string
  from_email: string
  subject: string
  body: string
  short_url: string
  created_at: string
}

// Check if we're in mock mode
const isMockMode = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

export default function DashboardPage() {
  // const { user, isLoaded } = useUser()
  const router = useRouter()
  const isLoaded = true // Mock mode
  const user = { id: "mock-user" } // Mock user
  const [userData, setUserData] = useState<UserData | null>(null)
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

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
      const [userResponse, emailsResponse] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/emails")
      ])
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserData(userData)
      }
      
      if (emailsResponse.ok) {
        const emailsData = await emailsResponse.json()
        setEmails(emailsData.emails || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyEmailAddress = () => {
    if (userData) {
      const emailAddress = `${userData.phone.replace('+1', '')}@txt.emailtotextnotify.com`
      navigator.clipboard.writeText(emailAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getUsageLimit = (planType: string) => {
    const limits: Record<string, number> = {
      free: 10,
      basic: 100,
      pro: 500
    }
    return limits[planType] || 10
  }

  if (loading || !userData) {
    return <div>Loading...</div>
  }

  const usageLimit = getUsageLimit(userData.plan_type)
  const usagePercentage = (userData.usage_count / usageLimit) * 100
  const emailAddress = `${userData.phone.replace('+1', '')}@txt.emailtotextnotify.com`

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={() => router.push("/settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Email Address</CardTitle>
              <CardDescription>
                Send emails to this address and they'll be forwarded to your phone as SMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <code className="text-lg font-mono bg-muted px-3 py-2 rounded">
                  {emailAddress}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyEmailAddress}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {userData.plan_type.charAt(0).toUpperCase() + userData.plan_type.slice(1)}
                  </Badge>
                  <Button variant="link" onClick={() => router.push("/settings#billing")}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{userData.usage_count} / {usageLimit} texts</span>
                    <span>{Math.round(usagePercentage)}%</span>
                  </div>
                  <Progress value={usagePercentage} />
                  <p className="text-xs text-muted-foreground">
                    Resets {formatDistanceToNow(new Date(userData.usage_reset_at), { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Recent Emails</CardTitle>
                <CardDescription>
                  Your last 20 emails that were converted to SMS
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/messages')}
              >
                View All Messages
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {emails.length === 0 ? (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  No emails received yet. Try sending an email to {emailAddress}
                </AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell className="font-medium">
                        {email.from_email}
                      </TableCell>
                      <TableCell>{email.subject}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(email.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => router.push('/messages')}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
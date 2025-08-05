"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Search, RefreshCw, Download, AlertCircle } from "lucide-react"
import { isTestMode, getTestModeMessage } from "@/lib/test-mode"

interface SMSLog {
  id: string
  user_id: string
  phone: string
  message: string
  type: 'verification' | 'notification' | 'email_forward'
  status: 'sent' | 'failed' | 'test_mode' | 'queued'
  twilio_sid?: string
  error_message?: string
  metadata: Record<string, any>
  created_at: string
}

// Admin emails allowed to view logs
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").filter(Boolean)

export default function SMSLogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<SMSLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchLogs()
    }
  }, [isAdmin, typeFilter, statusFilter])

  async function checkAdminAccess() {
    try {
      // Get current user from Clerk via API
      const response = await fetch('/api/user')
      if (!response.ok) {
        router.push('/sign-in')
        return
      }
      
      const userData = await response.json()
      const email = userData.email
      
      if (!email || !ADMIN_EMAILS.includes(email)) {
        router.push('/dashboard')
        return
      }
      
      setUserEmail(email)
      setIsAdmin(true)
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/dashboard')
    }
  }

  async function fetchLogs() {
    try {
      setLoading(true)
      
      let query = supabase
        .from('sms_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter)
      }
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'sent':
        return 'success'
      case 'failed':
        return 'destructive'
      case 'test_mode':
        return 'secondary'
      case 'queued':
        return 'outline'
      default:
        return 'default'
    }
  }

  function getTypeColor(type: string) {
    switch (type) {
      case 'verification':
        return 'blue'
      case 'notification':
        return 'yellow'
      case 'email_forward':
        return 'green'
      default:
        return 'default'
    }
  }

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      log.phone.includes(searchTerm) ||
      log.message.toLowerCase().includes(searchLower) ||
      log.metadata?.from_email?.toLowerCase().includes(searchLower)
    )
  })

  async function exportLogs() {
    const csv = [
      ['ID', 'Phone', 'Message', 'Type', 'Status', 'Created At'].join(','),
      ...filteredLogs.map(log => [
        log.id,
        log.phone,
        `"${log.message.replace(/"/g, '""')}"`,
        log.type,
        log.status,
        new Date(log.created_at).toISOString()
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sms-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          SMS Logs
        </h1>
        <p className="text-muted-foreground mt-2">
          View all SMS messages sent through the system
        </p>
      </div>

      {isTestMode() && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-semibold">
            {getTestModeMessage()}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>SMS Activity</CardTitle>
          <CardDescription>
            Monitor all SMS messages including test mode logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by phone or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="verification">Verification</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="email_forward">Email Forward</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="test_mode">Test Mode</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={fetchLogs} size="icon" variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button onClick={exportLogs} size="icon" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No SMS logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono">{log.phone}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={log.message}>
                          {log.message}
                        </div>
                        {log.error_message && (
                          <div className="text-sm text-destructive mt-1">
                            Error: {log.error_message}
                          </div>
                        )}
                        {log.metadata?.from_email && (
                          <div className="text-sm text-muted-foreground mt-1">
                            From: {log.metadata.from_email}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(log.type) as any}>
                          {log.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(log.status) as any}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
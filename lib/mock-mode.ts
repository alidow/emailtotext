// Check if we're in mock mode (development without real services)
export const isMockMode = process.env.NODE_ENV === 'development' && 
  (process.env.TWILIO_ACCOUNT_SID === 'mock_account_sid' ||
   process.env.STRIPE_SECRET_KEY === 'sk_test_mock')

// Mock data for development
export const mockUserData = {
  id: "mock-user-id",
  clerk_id: "user_mock123",
  phone: "+15551234567",
  phone_verified: true,
  email: "demo@example.com",
  plan_type: "basic",
  usage_count: 42,
  usage_reset_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
}

export const mockEmails = [
  {
    id: "email1",
    user_id: "mock-user-id",
    from_email: "john.doe@example.com",
    subject: "Meeting Tomorrow",
    body: "Don't forget about our meeting tomorrow at 2pm. Looking forward to discussing the project updates with you.",
    short_url: "abc12345",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: "email2", 
    user_id: "mock-user-id",
    from_email: "notifications@github.com",
    subject: "New pull request",
    body: "You have a new pull request waiting for review. The changes look good but need some minor adjustments.",
    short_url: "def67890",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  },
  {
    id: "email3",
    user_id: "mock-user-id", 
    from_email: "alerts@monitoring.com",
    subject: "Server Alert: High CPU Usage",
    body: "Your server is experiencing high CPU usage (95%). Please check the application logs for more details.",
    short_url: "ghi13579",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
]
# Development Mode Guide

This guide shows you how to run the app in development mode without needing external services like Twilio, Mailgun, or Stripe.

## Quick Start

1. **Copy the development environment file:**
```bash
cp .env.local.example .env.local
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open the app:**
Visit [http://localhost:3000](http://localhost:3000)

## Mock Mode Features

When running with mock credentials, the app operates in "mock mode" which allows you to:

### ✅ Preview the Landing Page
- See the full landing page with phone input
- Test the phone number formatting
- View TCPA consent checkboxes

### ✅ Test Phone Verification
- Enter any phone number
- **Use verification code: `123456`**
- No actual SMS will be sent

### ✅ View the Dashboard
- See a mock user dashboard with:
  - Your email address: `5551234567@txt.emailtotextnotify.com`
  - Usage statistics (42/100 texts used)
  - Sample email history
  - Plan information (Basic plan)

### ✅ Explore Settings
- View account settings
- Toggle 24/7 SMS delivery preference
- See billing options (mock data)

## What Works in Mock Mode

- ✅ Landing page and UI
- ✅ Phone verification flow (use code: `123456`)
- ✅ Dashboard with mock data
- ✅ Email history view
- ✅ Settings pages
- ✅ All UI components and styling

## What Doesn't Work in Mock Mode

- ❌ Actual SMS sending
- ❌ Real email processing
- ❌ Stripe payments
- ❌ Database operations
- ❌ Clerk authentication (unless you add real Clerk keys)

## Console Messages

In mock mode, you'll see console messages like:
```
[MOCK MODE] Would send SMS to +15551234567 with code: 123456
[MOCK MODE] Would store verification code: 123456 for phone: +15551234567
```

These indicate what would happen in production.

## Adding Real Services

To test with real services, replace the mock values in `.env.local` with real credentials:

1. **Clerk**: Get test keys from [clerk.com](https://clerk.com)
2. **Supabase**: Create a free project at [supabase.com](https://supabase.com)
3. **Twilio**: Get trial credentials from [twilio.com](https://twilio.com)
4. **Stripe**: Use test keys from [stripe.com](https://stripe.com)

## Tips

- The mock verification code is always `123456`
- You can use any phone number format
- The dashboard shows realistic sample data
- All UI interactions work normally
- Perfect for UI/UX testing and development
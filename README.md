# Email to Text Notifier

A simple SMS gateway service that converts emails to text messages. Perfect replacement for AT&T's discontinued email-to-text feature.

## Features

- 📱 **Email-to-SMS Gateway**: Send emails to your unique address and receive them as text messages
- 🔒 **Secure Authentication**: Phone verification and user accounts via Clerk
- 💳 **Flexible Plans**: Free tier + paid subscriptions via Stripe
- 📊 **Usage Tracking**: Monitor your monthly SMS usage
- ⏰ **Delivery Control**: Choose between 24/7 or standard hours (8am-9pm) delivery
- 🔗 **Short Links**: Long emails are truncated with a link to view full content
- 📜 **TCPA Compliant**: Proper consent collection and opt-out mechanisms

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Postgres + Edge Functions)
- **Authentication**: Clerk
- **Payments**: Stripe
- **SMS**: Twilio
- **Email**: Mailgun
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Accounts with: Supabase, Clerk, Stripe, Twilio, Mailgun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/emailtotext.git
cd emailtotext
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` with your service credentials

5. Set up the database:
```bash
# Run the schema SQL in your Supabase project
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
emailtotext/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── onboarding/        # Plan selection
│   ├── sign-up/           # Authentication
│   └── verify/            # Phone verification
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
├── supabase/             # Database schema & functions
│   ├── schema.sql        # Database schema
│   └── functions/        # Edge functions
├── docs/                 # Documentation
└── public/               # Static assets
```

## Configuration

### Mailgun Setup
See [docs/MAILGUN_SETUP.md](docs/MAILGUN_SETUP.md) for detailed instructions.

### Deployment
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment guide.

## Usage

1. **Sign Up**: Enter your phone number and verify it with SMS code
2. **Choose Plan**: Select free or paid plan
3. **Get Email**: Your unique email is `[phone]@txt.emailtotextnotify.com`
4. **Send Emails**: Any email sent to your address will be delivered as SMS

## Plans

- **Free**: 10 texts/month, 7-day email history
- **Basic** ($4.99/mo): 100 texts/month, 30-day history
- **Pro** ($9.99/mo): 500 texts/month, 90-day history

## TCPA Compliance

This service is designed with TCPA compliance in mind:
- Explicit consent required before sending any SMS
- Clear opt-out instructions in every message
- Time-based delivery restrictions (optional 24/7 delivery)
- Consent logging with timestamps and IP addresses

## API Routes

- `POST /api/send-verification` - Send SMS verification code
- `POST /api/verify-phone` - Verify phone number
- `POST /api/create-user` - Create user account
- `GET /api/user` - Get user data
- `GET /api/emails` - Get user's emails
- `PATCH /api/user/settings` - Update user settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@emailtotextnotify.com or open an issue on GitHub.
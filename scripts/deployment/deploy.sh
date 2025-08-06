#!/bin/bash

echo "🚀 Email to Text Notifier - Deployment Script"
echo "============================================"

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please copy .env.production.example to .env.production and fill in your values"
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

echo ""
echo "📋 Pre-deployment Checklist:"
echo "----------------------------"

# Check required environment variables
required_vars=(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "TWILIO_ACCOUNT_SID"
    "TWILIO_AUTH_TOKEN"
    "TWILIO_PHONE_NUMBER"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_SECRET_KEY"
    "MAILGUN_API_KEY"
    "MAILGUN_DOMAIN"
)

all_set=true
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [[ "${!var}" == *"xxx"* ]]; then
        echo "❌ $var is not set or contains placeholder"
        all_set=false
    else
        echo "✅ $var is configured"
    fi
done

if [ "$all_set" = false ]; then
    echo ""
    echo "❌ Please configure all environment variables before deploying"
    exit 1
fi

echo ""
echo "🔄 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔨 Step 2: Building application..."
npm run build

echo ""
echo "📤 Step 3: Deploying to Vercel..."
echo "Make sure you have:"
echo "1. Connected your GitHub repo to Vercel"
echo "2. Added all environment variables in Vercel dashboard"
echo "3. Configured your custom domain"
echo ""
echo "Ready to deploy? (y/n)"
read -r response

if [ "$response" = "y" ]; then
    vercel --prod
else
    echo "Deployment cancelled"
fi
#!/bin/bash

# Deploy attachment support migration to Supabase

echo "=== Deploying Attachment Support Migration ==="
echo ""
echo "This script will deploy the attachment support migration to your Supabase database."
echo "Make sure you have the Supabase CLI installed and configured."
echo ""

# Check if migration file exists
if [ ! -f "supabase/migrations/20250108_add_attachment_support.sql" ]; then
    echo "Error: Migration file not found at supabase/migrations/20250108_add_attachment_support.sql"
    exit 1
fi

# Get Supabase database URL from user
echo "Please enter your Supabase database URL:"
echo "(Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres)"
read -r DB_URL

if [ -z "$DB_URL" ]; then
    echo "Error: Database URL is required"
    exit 1
fi

echo ""
echo "Running migration..."

# Run the migration
psql "$DB_URL" < supabase/migrations/20250108_add_attachment_support.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Deploy the updated process-email edge function:"
    echo "   cd supabase/functions/process-email"
    echo "   supabase functions deploy process-email --project-ref [YOUR_PROJECT_REF]"
    echo ""
    echo "2. Set the MAILGUN_API_KEY secret if not already set:"
    echo "   supabase secrets set MAILGUN_API_KEY=[YOUR_API_KEY] --project-ref [YOUR_PROJECT_REF]"
    echo ""
    echo "3. Deploy the Next.js application to Vercel"
else
    echo ""
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi
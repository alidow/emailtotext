#!/bin/bash

# Script to update Supabase Edge Functions with Sentry DSN
# This ensures all edge functions can report errors to Sentry

SENTRY_DSN="https://0804f22cc0057578b74a75a5b0530be6@o4509786899349505.ingest.us.sentry.io/4509786930413568"
SUPABASE_PROJECT_REF="yeqhslferewupusmvggo"

echo "Setting Sentry DSN for Supabase Edge Functions..."

# Set the Sentry DSN as a secret for edge functions
supabase secrets set SENTRY_DSN="$SENTRY_DSN" --project-ref $SUPABASE_PROJECT_REF
supabase secrets set SENTRY_ENVIRONMENT="production" --project-ref $SUPABASE_PROJECT_REF

echo "Sentry configuration updated!"
echo ""
echo "The following secrets have been set:"
echo "- SENTRY_DSN: Configured for error reporting"
echo "- SENTRY_ENVIRONMENT: Set to 'production'"
echo ""
echo "Sentry will now capture the following critical errors:"
echo "✓ SMS delivery failures (error codes 30007, 30008, 21610)"
echo "✓ Messages that fail even with safe templates"
echo "✓ Provider API errors"
echo "✓ Edge function crashes"
echo "✓ Auto-upgrade and auto-buy failures"
echo ""
echo "Critical alerts (level: fatal) will be sent for:"
echo "• Messages blocked by carrier filtering"
echo "• Undelivered messages after successful send"
echo "• Safe template failures"
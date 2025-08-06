#!/bin/bash

# Fix all critical API routes with supabaseAdmin null checks

echo "Fixing critical API routes..."

# List of critical files that need immediate fixing
files=(
  "app/api/verify-phone/route.ts"
  "app/api/send-verification/route.ts"
  "app/api/create-checkout/route.ts"
  "app/api/stripe-webhook/route.ts"
  "app/api/health/route.ts"
)

for file in "${files[@]}"; do
  echo "Processing $file..."
  
  # Check if file exists
  if [ ! -f "$file" ]; then
    echo "  File not found, skipping..."
    continue
  fi
  
  # Check if already has the import
  if grep -q "supabase-helpers" "$file"; then
    echo "  Already has helper import, skipping import..."
  else
    # Add import after the supabase import line
    sed -i '' '/import.*supabaseAdmin.*from.*supabase/a\
import { requireSupabaseAdmin } from "@/lib/supabase-helpers"' "$file"
    echo "  Added helper import"
  fi
  
  # Add the check after the first function declaration
  # This is a simplified approach - manual review recommended
  echo "  Manual fix needed: Add adminCheck after function start"
  echo "    const adminCheck = requireSupabaseAdmin('operation-name')"
  echo "    if (adminCheck.error) return adminCheck.response"
  echo "    Replace all 'supabaseAdmin' with 'adminCheck.admin'"
  echo ""
done

echo "Done! Manual review and testing required."
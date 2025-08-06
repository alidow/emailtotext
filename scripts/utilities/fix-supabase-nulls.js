#!/usr/bin/env node

/**
 * Script to help identify and fix supabaseAdmin null check issues
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Find all files with supabaseAdmin usage
const files = execSync('grep -l "supabaseAdmin" app/api/**/*.ts', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)

console.log(`Found ${files.length} files using supabaseAdmin\n`)

// Categorize files by priority
const criticalRoutes = []
const otherRoutes = []

files.forEach(file => {
  if (file.includes('create-user') || 
      file.includes('verify-phone') || 
      file.includes('send-verification') ||
      file.includes('create-checkout') ||
      file.includes('stripe-webhook')) {
    criticalRoutes.push(file)
  } else {
    otherRoutes.push(file)
  }
})

console.log('Critical routes that need immediate fixing:')
criticalRoutes.forEach(file => console.log(`  - ${file}`))

console.log('\nOther routes:')
otherRoutes.forEach(file => console.log(`  - ${file}`))

console.log('\nTo fix each file:')
console.log('1. Import: import { requireSupabaseAdmin } from "@/lib/supabase-helpers"')
console.log('2. Add check at the beginning of the handler:')
console.log('   const adminCheck = requireSupabaseAdmin("operation name")')
console.log('   if (adminCheck.error) return adminCheck.response')
console.log('3. Replace supabaseAdmin with adminCheck.admin')

// Generate fix for a specific file
function generateFix(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  
  // Check if already has the import
  const hasImport = content.includes('supabase-helpers')
  
  console.log(`\n\nFix for ${filePath}:`)
  console.log('========================')
  
  if (!hasImport) {
    console.log('Add import after other imports:')
    console.log('import { requireSupabaseAdmin } from "@/lib/supabase-helpers"\n')
  }
  
  // Find the main handler function
  const handlerLine = lines.findIndex(line => 
    line.includes('export async function') && 
    (line.includes('GET') || line.includes('POST') || line.includes('PUT') || line.includes('DELETE'))
  )
  
  if (handlerLine !== -1) {
    console.log('Add after try { line:')
    console.log('    const adminCheck = requireSupabaseAdmin("' + path.basename(filePath, '.ts') + '")')
    console.log('    if (adminCheck.error) return adminCheck.response\n')
    console.log('Replace all "supabaseAdmin" with "adminCheck.admin"')
  }
}

// Show fix for the first critical route
if (criticalRoutes.length > 0) {
  generateFix(criticalRoutes[0])
}
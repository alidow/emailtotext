# Vercel Environment Variables Setup Guide

## CRITICAL: Do NOT Use Quotes in Vercel Dashboard

When setting environment variables in Vercel's dashboard (Project Settings > Environment Variables), **DO NOT include quotes** around values. Everything you type in the input field becomes the literal value.

### ❌ WRONG (in Vercel Dashboard):
```
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY = "0x4AAAAAABoVFK7-iacy2kr5"
```

### ✅ CORRECT (in Vercel Dashboard):
```
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY = 0x4AAAAAABoVFK7-iacy2kr5
```

## Why This Matters

- In local `.env` files, quotes might be needed for certain values
- In Vercel's dashboard, the entire content you enter becomes the value
- Adding quotes in Vercel will make those quotes part of the actual value
- This causes errors like: `Invalid input for parameter "sitekey", got ""0x4AAA...""` (double quotes)

## The Root Cause

When you enter `"value"` in Vercel's input field, it's stored as `"value"` (with quotes).
When Next.js reads this, it becomes `"\"value\""` in JavaScript, causing the double quotes error.

## Local .env Files vs Vercel Dashboard

| Context | Format | Example |
|---------|--------|---------|
| Local `.env` file | May need quotes | `API_KEY="my-secret-key"` |
| Local `.env` file | No quotes for simple values | `API_KEY=my-secret-key` |
| Vercel Dashboard | NEVER use quotes | `my-secret-key` |

## After Updating Environment Variables

Remember to **redeploy** your application after making any changes to environment variables in Vercel.

## Troubleshooting

If you see errors like:
- `Invalid input for parameter "sitekey", got ""0x4AAA...""` 
- Environment variable appears as object instead of string
- Double quotes in error messages

Check your Vercel dashboard and remove any quotes from the environment variable values.
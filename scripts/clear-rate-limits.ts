#!/usr/bin/env tsx

import { config } from "dotenv"
import path from "path"

// Load environment variables
config({ path: path.join(__dirname, "../.env.production") })

import { redis } from "../lib/rate-limit"

async function clearRateLimits(phoneNumber?: string) {
  console.log("🗑️  Clearing rate limits...")
  
  try {
    if (phoneNumber) {
      // Clear specific phone number rate limits
      const phoneKeys = [
        `rl:per-phone:${phoneNumber}`,
        `rl:per-phone:+1${phoneNumber}`,
        `rl:per-phone:1${phoneNumber}`,
      ]
      
      for (const key of phoneKeys) {
        const result = await redis.del(key)
        if (result > 0) {
          console.log(`✅ Cleared rate limit for key: ${key}`)
        }
      }
    } else {
      // Clear all rate limits (be careful!)
      console.log("⚠️  Clearing ALL rate limits...")
      
      // Get all rate limit keys
      const patterns = [
        "rl:phone-verify:*",
        "rl:per-phone:*",
        "rl:global-ip:*",
        "rl:burst:*",
        "suspicious:*",
        "suspicious-count:*",
        "blocked-ip:*",
      ]
      
      for (const pattern of patterns) {
        let cursor = 0
        do {
          const result = await redis.scan(cursor, { match: pattern, count: 100 })
          cursor = result[0]
          const keys = result[1]
          
          if (keys.length > 0) {
            await Promise.all(keys.map(key => redis.del(key)))
            console.log(`✅ Cleared ${keys.length} keys matching pattern: ${pattern}`)
          }
        } while (cursor !== 0)
      }
    }
    
    console.log("✨ Rate limits cleared successfully!")
  } catch (error) {
    console.error("❌ Error clearing rate limits:", error)
    process.exit(1)
  }
}

// Parse command line arguments
const phoneNumber = process.argv[2]

if (phoneNumber) {
  console.log(`Clearing rate limits for phone number: ${phoneNumber}`)
} else {
  console.log("Clearing ALL rate limits (no phone number specified)")
}

clearRateLimits(phoneNumber).then(() => process.exit(0))
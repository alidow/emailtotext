import { Redis } from "@upstash/redis"

// Create Redis client directly
const redis = new Redis({
  url: "https://eminent-donkey-9333.upstash.io",
  token: "ASR1AAIjcDEwMzUzNzVmZGJjMWM0ZmYwYTAzOTBhMmQ3NDJjYjdiOXAxMA",
})

async function clearRateLimits(phoneNumber?: string) {
  console.log("🗑️  Clearing rate limits...")
  
  try {
    if (phoneNumber) {
      // Clean the phone number
      const cleanPhone = phoneNumber.replace(/\D/g, "")
      
      // Clear specific phone number rate limits
      const phoneKeys = [
        `rl:per-phone:${cleanPhone}`,
        `rl:per-phone:+${cleanPhone}`,
        `rl:per-phone:+1${cleanPhone}`,
        `rl:per-phone:1${cleanPhone}`,
      ]
      
      for (const key of phoneKeys) {
        const result = await redis.del(key)
        if (result > 0) {
          console.log(`✅ Cleared rate limit for key: ${key}`)
        } else {
          console.log(`   No rate limit found for key: ${key}`)
        }
      }
    } else {
      console.log("⚠️  Clearing ALL rate limits...")
      
      // Clear common patterns
      const patterns = [
        "rl:phone-verify:*",
        "rl:per-phone:*",
        "rl:global-ip:*",
        "rl:burst:*",
      ]
      
      let totalCleared = 0
      
      for (const pattern of patterns) {
        const keys = await redis.keys(pattern)
        if (keys.length > 0) {
          const results = await Promise.all(keys.map(key => redis.del(key)))
          const cleared = results.reduce((sum, result) => sum + result, 0)
          totalCleared += cleared
          console.log(`✅ Cleared ${cleared} keys matching pattern: ${pattern}`)
        } else {
          console.log(`   No keys found for pattern: ${pattern}`)
        }
      }
      
      console.log(`\n✨ Total keys cleared: ${totalCleared}`)
    }
    
    console.log("\n✅ Done!")
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
  console.log("To clear for a specific phone, run: npx tsx scripts/clear-rate-limits-simple.ts PHONENUMBER")
}

clearRateLimits(phoneNumber).then(() => process.exit(0))
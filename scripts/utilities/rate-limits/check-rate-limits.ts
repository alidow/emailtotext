import { Redis } from "@upstash/redis"

// Create Redis client directly
const redis = new Redis({
  url: "https://eminent-donkey-9333.upstash.io",
  token: "ASR1AAIjcDEwMzUzNzVmZGJjMWM0ZmYwYTAzOTBhMmQ3NDJjYjdiOXAxMA",
})

async function checkRateLimits(phoneNumber?: string) {
  console.log("🔍 Checking rate limits...")
  
  try {
    if (phoneNumber) {
      // Clean the phone number
      const cleanPhone = phoneNumber.replace(/\D/g, "")
      
      // Check specific phone number rate limits
      const phoneKeys = [
        `rl:per-phone:${cleanPhone}`,
        `rl:per-phone:+${cleanPhone}`,
        `rl:per-phone:+1${cleanPhone}`,
        `rl:per-phone:1${cleanPhone}`,
      ]
      
      console.log(`\nChecking rate limits for phone: ${phoneNumber}`)
      for (const key of phoneKeys) {
        const data = await redis.get(key)
        if (data) {
          console.log(`\n📱 Found rate limit for key: ${key}`)
          console.log("Data:", JSON.stringify(data, null, 2))
        }
      }
    } 
    
    // Check all rate limit keys
    console.log("\n📊 All rate limit keys:")
    const patterns = [
      "rl:phone-verify:*",
      "rl:per-phone:*",
      "rl:global-ip:*",
      "rl:burst:*",
    ]
    
    for (const pattern of patterns) {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        console.log(`\n Pattern: ${pattern}`)
        for (const key of keys.slice(0, 10)) { // Show first 10 of each type
          const data = await redis.get(key)
          console.log(`  ${key}: ${JSON.stringify(data)}`)
        }
        if (keys.length > 10) {
          console.log(`  ... and ${keys.length - 10} more`)
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking rate limits:", error)
    process.exit(1)
  }
}

// Parse command line arguments
const phoneNumber = process.argv[2]

checkRateLimits(phoneNumber).then(() => process.exit(0))
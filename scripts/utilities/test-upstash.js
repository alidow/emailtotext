// Test Upstash Redis connection
import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testUpstash() {
  console.log('🔍 Testing Upstash Redis connection...\n')
  
  try {
    // Check if environment variables are set
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Missing Upstash environment variables')
    }
    
    console.log('✅ Environment variables found')
    console.log(`📍 URL: ${process.env.UPSTASH_REDIS_REST_URL.substring(0, 30)}...`)
    
    // Create Redis client
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    
    // Test basic operations
    console.log('\n🧪 Testing basic operations...')
    
    // Set a test value
    await redis.set('test:connection', 'success')
    console.log('✅ SET operation successful')
    
    // Get the test value
    const value = await redis.get('test:connection')
    console.log(`✅ GET operation successful: ${value}`)
    
    // Test increment (for rate limiting)
    await redis.incr('test:counter')
    const counter = await redis.get('test:counter')
    console.log(`✅ INCR operation successful: ${counter}`)
    
    // Test TTL operations
    await redis.setex('test:ttl', 60, 'expires in 60 seconds')
    const ttl = await redis.ttl('test:ttl')
    console.log(`✅ TTL operation successful: ${ttl} seconds remaining`)
    
    // Clean up test keys
    await redis.del('test:connection', 'test:counter', 'test:ttl')
    console.log('✅ Cleanup successful')
    
    console.log('\n🎉 All tests passed! Upstash Redis is properly configured.')
    
  } catch (error) {
    console.error('\n❌ Error testing Upstash:', error.message)
    console.error('\nPlease check:')
    console.error('1. Your Upstash credentials are correct')
    console.error('2. The Redis database is active')
    console.error('3. Environment variables are properly set')
  }
}

testUpstash()
import { test, expect } from '@playwright/test'

// Test configuration
const TEST_EMAIL = 'test@example.com'
const TEST_PHONE = '5555551234' // Use a test phone number
const TEST_VERIFICATION_CODE = '123456'

test.describe('Complete Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set test mode environment
    await page.addInitScript(() => {
      window.localStorage.setItem('testMode', 'true')
    })
  })

  test('should complete full onboarding flow', async ({ page }) => {
    // 1. Start at homepage
    await page.goto('/')
    
    // 2. Click sign up
    await page.click('text=Get Started')
    
    // 3. Wait for Clerk sign-up page
    await page.waitForURL('**/sign-up**')
    
    // 4. Fill in sign-up form (mocking Clerk auth)
    // Note: In a real test, you'd need to handle Clerk's auth flow
    // For now, we'll assume the user is already authenticated
    
    // 5. Navigate directly to onboarding (simulating post-auth redirect)
    await page.goto('/onboarding')
    
    // 6. Verify we're on the onboarding page
    await expect(page.locator('h1')).toContainText('Get Started')
    
    // 7. Enter phone number
    await page.fill('input[type="tel"]', TEST_PHONE)
    
    // 8. Complete Turnstile captcha (should be handled automatically in test mode)
    // Wait for Turnstile to be ready
    await page.waitForTimeout(2000)
    
    // 9. Submit phone verification
    await page.click('button:has-text("Send Verification Code")')
    
    // 10. Wait for verification code input
    await page.waitForSelector('input[placeholder*="verification code" i]', { timeout: 10000 })
    
    // 11. Enter verification code
    await page.fill('input[placeholder*="verification code" i]', TEST_VERIFICATION_CODE)
    
    // 12. Submit verification
    await page.click('button:has-text("Verify")')
    
    // 13. Wait for plan selection
    await page.waitForSelector('text=Choose Your Plan', { timeout: 10000 })
    
    // 14. Select free plan
    await page.click('[data-plan="free"]')
    
    // 15. Verify redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    
    // 16. Verify dashboard loaded
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should handle verification errors gracefully', async ({ page }) => {
    // Navigate to onboarding
    await page.goto('/onboarding')
    
    // Enter phone number
    await page.fill('input[type="tel"]', TEST_PHONE)
    
    // Wait for Turnstile
    await page.waitForTimeout(2000)
    
    // Submit
    await page.click('button:has-text("Send Verification Code")')
    
    // Wait for verification input
    await page.waitForSelector('input[placeholder*="verification code" i]')
    
    // Enter wrong code
    await page.fill('input[placeholder*="verification code" i]', '000000')
    await page.click('button:has-text("Verify")')
    
    // Should show error
    await expect(page.locator('text=Invalid verification code')).toBeVisible()
  })

  test('should show test mode indicators', async ({ page }) => {
    await page.goto('/onboarding')
    
    // Check for test mode banner
    await expect(page.locator('text=TEST MODE ACTIVE')).toBeVisible()
  })
})

// Helper to mock Clerk authentication
async function mockClerkAuth(page: any, userId: string) {
  await page.addInitScript((uid: string) => {
    // Mock Clerk's window.__clerk object
    (window as any).__clerk = {
      user: {
        id: uid,
        primaryEmailAddress: {
          emailAddress: TEST_EMAIL
        }
      },
      session: {
        id: 'test-session',
        status: 'active'
      }
    }
  }, userId)
}
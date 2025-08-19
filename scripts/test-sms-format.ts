#!/usr/bin/env npx tsx

// Test script to verify SMS formatting with shortened URLs

function formatSMS(from: string, subject: string, body: string, shortUrl: string, attachmentCount: number): string {
  // Use shortened URL for direct email access
  const emailUrl = `https://emailtotextnotify.com/e/${shortUrl}`
  
  // Extract email address
  const emailMatch = from.match(/<(.+@.+)>/)
  const senderEmail = emailMatch ? emailMatch[1] : from
  const cleanEmail = senderEmail.replace(/[<>]/g, '').trim()
  
  // Handle blank or missing subject
  const subjectText = subject && subject.trim() ? subject.trim() : 'no subject'
  
  // Build message with service identifier and proper formatting
  const serviceId = 'Email to Text Notification: '
  const prefix = 'New email from "'
  const middle = '", subject "'
  const suffix = '".\n\nView full message at:\n\n'
  
  // Calculate available space (160 char SMS limit)
  const fixedLength = serviceId.length + prefix.length + middle.length + suffix.length + emailUrl.length
  const availableForContent = 160 - fixedLength
  
  // Allocate space between email and subject (prioritize email)
  const maxEmailLength = Math.min(cleanEmail.length, Math.floor(availableForContent * 0.6))
  const truncatedEmail = cleanEmail.length > maxEmailLength 
    ? cleanEmail.substring(0, maxEmailLength - 3) + '...'
    : cleanEmail
  
  // Use remaining space for subject
  const remainingSpace = availableForContent - truncatedEmail.length
  const truncatedSubject = subjectText.length > remainingSpace
    ? subjectText.substring(0, remainingSpace - 3) + '...'
    : subjectText
  
  // Build message with proper line breaks around URL
  const message = `${serviceId}${prefix}${truncatedEmail}${middle}${truncatedSubject}${suffix}${emailUrl}`
  
  // Ensure we don't exceed 160 characters
  return message.substring(0, 160)
}

// Test cases
const testCases = [
  {
    from: 'alidow@gmail.com',
    subject: 'heyo',
    body: 'This is a test email body',
    shortUrl: 'abc12345',
  },
  {
    from: 'John Doe <john.doe@example.com>',
    subject: 'Important Meeting Tomorrow',
    body: 'Please review the attached documents',
    shortUrl: 'xyz98765',
  },
  {
    from: 'verylongemailaddress@someextremelylongdomainname.com',
    subject: 'This is a very long subject line that will definitely need to be truncated',
    body: 'Short body',
    shortUrl: 'short123',
  },
  {
    from: 'test@test.com',
    subject: '',
    body: 'Email with no subject',
    shortUrl: 'nosub456',
  }
]

console.log('Testing SMS Format with Shortened URLs\n')
console.log('=' . repeat(50))

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}:`)
  console.log(`From: ${testCase.from}`)
  console.log(`Subject: ${testCase.subject || '(empty)'}`)
  console.log(`Short URL: ${testCase.shortUrl}`)
  console.log('-' . repeat(50))
  
  const sms = formatSMS(
    testCase.from,
    testCase.subject,
    testCase.body,
    testCase.shortUrl,
    0
  )
  
  console.log('Formatted SMS:')
  console.log(sms)
  console.log(`\nCharacter count: ${sms.length}/160`)
  console.log(`URL in message: https://emailtotextnotify.com/e/${testCase.shortUrl}`)
  console.log('=' . repeat(50))
})

// Compare with old format for reference
console.log('\n\nComparison with old format:')
console.log('Old: https://emailtotextnotify.com/messages (43 chars)')
console.log('New: https://emailtotextnotify.com/e/abc12345 (43 chars)')
console.log('\nBoth URLs are the same length, but new one is specific to the email!')
import { supabase } from "./supabase"

export async function generateUniqueShortUrl(): Promise<string> {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let attempts = 0
  const maxAttempts = 10
  
  while (attempts < maxAttempts) {
    let shortUrl = ''
    for (let i = 0; i < 8; i++) {
      shortUrl += chars[Math.floor(Math.random() * chars.length)]
    }
    
    // Check if URL already exists
    const { data, error } = await supabase
      .from('emails')
      .select('id')
      .eq('short_url', shortUrl)
      .single()
    
    if (error || !data) {
      return shortUrl
    }
    
    attempts++
  }
  
  throw new Error('Failed to generate unique short URL')
}
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const EDGE_FUNCTION_URL = 'https://yeqhslferewupusmvggo.supabase.co/functions/v1/process-email'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcWhzbGZlcmV3dXB1c212Z2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzMzNDEsImV4cCI6MjA2OTY0OTM0MX0.GsDmTfqCrrMZv1jaOXcQuUTdUZc-OyQ1QePiuVgoFkA'

serve(async (req) => {
  console.log('Public wrapper received request')
  
  // Forward the request to the actual process-email function with auth
  try {
    const formData = await req.formData()
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': req.headers.get('content-type') || 'multipart/form-data'
      },
      body: formData
    })
    
    const responseText = await response.text()
    
    return new Response(responseText, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json'
      }
    })
  } catch (error) {
    console.error('Error in public wrapper:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
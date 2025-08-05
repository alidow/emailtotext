# Email Attachment Support Implementation Plan

## Overview
This plan outlines how to add attachment support to the Email to Text Notifier service using Mailgun, Supabase Storage, and Vercel/Supabase Edge Functions.

## Current State
- Attachments are completely ignored in the current implementation
- The database schema has no fields for storing attachment information
- Documentation correctly states "Attachments are not forwarded"

## Architecture Design

### 1. Attachment Flow
```
Email with Attachments → Mailgun → Webhook → Process Email Function → Store in Supabase Storage → SMS with Links
```

### 2. Storage Strategy
Use **Supabase Storage** instead of AWS S3:
- Native integration with our existing Supabase setup
- Built-in authentication and authorization
- No additional AWS dependencies
- Cost-effective for our use case

### 3. Database Schema Changes

Add new table for attachments:
```sql
-- Attachments table
create table if not exists public.email_attachments (
  id uuid primary key default uuid_generate_v4(),
  email_id uuid references public.emails(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  filename text not null,
  content_type text not null,
  size_bytes integer not null,
  storage_path text not null,
  mailgun_url text, -- Original Mailgun attachment URL (temporary)
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone -- Same as parent email expiry
);

-- Index for quick lookups
create index idx_email_attachments_email_id on public.email_attachments(email_id);
create index idx_email_attachments_user_id on public.email_attachments(user_id);
```

## Implementation Steps

### Phase 1: Database Setup
1. Create the `email_attachments` table
2. Create a Supabase Storage bucket named `email-attachments`
3. Set up storage policies for secure access

### Phase 2: Webhook Processing Updates

Update `/supabase/functions/process-email/index.ts`:

```typescript
// Parse attachments from Mailgun webhook
const attachmentCount = parseInt(formData.get('attachment-count') || '0')
const attachments = []

for (let i = 1; i <= attachmentCount; i++) {
  const attachment = formData.get(`attachment-${i}`)
  if (attachment && attachment instanceof File) {
    attachments.push({
      file: attachment,
      filename: attachment.name,
      contentType: attachment.type,
      size: attachment.size
    })
  }
}

// After storing the email, process attachments
if (attachments.length > 0) {
  await processAttachments(email.id, user.id, attachments, email.expires_at)
}
```

### Phase 3: Attachment Processing Function

```typescript
async function processAttachments(
  emailId: string, 
  userId: string, 
  attachments: Array<{file: File, filename: string, contentType: string, size: number}>,
  expiresAt: string
) {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  for (const attachment of attachments) {
    // Generate unique storage path
    const timestamp = Date.now()
    const safeName = attachment.filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${userId}/${emailId}/${timestamp}-${safeName}`

    try {
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('email-attachments')
        .upload(storagePath, attachment.file.stream(), {
          contentType: attachment.contentType,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Store attachment metadata
      await supabaseAdmin
        .from('email_attachments')
        .insert({
          email_id: emailId,
          user_id: userId,
          filename: attachment.filename,
          content_type: attachment.contentType,
          size_bytes: attachment.size,
          storage_path: storagePath,
          expires_at: expiresAt
        })
    } catch (error) {
      console.error(`Failed to process attachment ${attachment.filename}:`, error)
      // Continue processing other attachments
    }
  }
}
```

### Phase 4: SMS Message Updates

Update the SMS formatting to include attachment information:

```typescript
function formatSMS(from: string, subject: string, body: string, shortUrl: string, attachmentCount: number): string {
  const baseUrl = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'https://emailtotextnotify.com'
  const fullUrl = `${baseUrl}/e/${shortUrl}`
  
  // ... existing formatting logic ...
  
  // Add attachment indicator if present
  if (attachmentCount > 0) {
    const attachmentText = attachmentCount === 1 
      ? '📎 1 attachment' 
      : `📎 ${attachmentCount} attachments`
    
    // Adjust message to fit attachment info
    sms = `${senderName}: ${subject}\n${attachmentText}\n${fullUrl}`
  }
  
  return sms.substring(0, 140)
}
```

### Phase 5: Web Viewer Updates

Update the email viewer page (`/app/e/[id]/page.tsx`) to display attachments:

```typescript
// Fetch email with attachments
const { data: email } = await supabase
  .from('emails')
  .select(`
    *,
    email_attachments (
      id,
      filename,
      content_type,
      size_bytes,
      storage_path
    )
  `)
  .eq('short_url', params.id)
  .single()

// Display attachments section
{email.email_attachments && email.email_attachments.length > 0 && (
  <div className="mt-6 border-t pt-6">
    <h3 className="font-semibold mb-3">Attachments ({email.email_attachments.length})</h3>
    <div className="space-y-2">
      {email.email_attachments.map(attachment => (
        <AttachmentItem key={attachment.id} attachment={attachment} />
      ))}
    </div>
  </div>
)}
```

### Phase 6: Secure Attachment Download

Create an API route for secure attachment downloads:

```typescript
// /app/api/attachments/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await currentUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Verify user owns this attachment
  const { data: attachment } = await supabaseAdmin
    .from('email_attachments')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userData.id)
    .single()

  if (!attachment) {
    return new Response('Not found', { status: 404 })
  }

  // Generate signed URL for temporary access
  const { data: signedUrl } = await supabaseAdmin.storage
    .from('email-attachments')
    .createSignedUrl(attachment.storage_path, 300) // 5 minute expiry

  if (!signedUrl) {
    return new Response('Error generating download link', { status: 500 })
  }

  // Redirect to signed URL
  return Response.redirect(signedUrl.signedUrl)
}
```

### Phase 7: Cleanup Job

Create a scheduled function to clean up expired attachments:

```typescript
// Run daily
async function cleanupExpiredAttachments() {
  // Find expired attachments
  const { data: expiredAttachments } = await supabaseAdmin
    .from('email_attachments')
    .select('storage_path')
    .lt('expires_at', new Date().toISOString())

  // Delete from storage
  for (const attachment of expiredAttachments) {
    await supabaseAdmin.storage
      .from('email-attachments')
      .remove([attachment.storage_path])
  }

  // Delete records
  await supabaseAdmin
    .from('email_attachments')
    .delete()
    .lt('expires_at', new Date().toISOString())
}
```

## Security Considerations

1. **Authentication**: All attachment downloads require user authentication
2. **Authorization**: Users can only access attachments from their own emails
3. **Expiration**: Attachments expire with their parent email (30 days by default)
4. **Storage Policies**: Implement RLS policies on Supabase Storage bucket
5. **File Type Validation**: Validate and sanitize file types before storage
6. **Size Limits**: Implement reasonable file size limits (e.g., 10MB per attachment, 25MB total per email)

## Limitations & Considerations

1. **Mailgun Limitations**: 
   - Temporary attachment URLs require API key authentication
   - URLs expire after 3 days
   - Need to download quickly after webhook receipt

2. **Storage Costs**: 
   - Supabase Storage: $0.021 per GB stored per month
   - $0.09 per GB transferred
   - Consider implementing storage quotas per plan tier

3. **Performance**: 
   - Large attachments may slow webhook processing
   - Consider using background tasks for large files

4. **SMS Character Limit**: 
   - Must balance attachment info with message content
   - May need to truncate message body further

## Migration Plan

1. Deploy database changes
2. Update Supabase Edge Function with attachment handling
3. Deploy web viewer updates
4. Test with small group of users
5. Update documentation and marketing materials
6. Roll out to all users

## Success Metrics

- Attachment processing success rate > 95%
- Average processing time < 5 seconds
- User engagement with attachments
- Storage costs within budget

## Future Enhancements

1. **Preview Generation**: Generate thumbnails for images
2. **Virus Scanning**: Integrate with virus scanning service
3. **Compression**: Auto-compress large attachments
4. **Selective Forwarding**: Let users choose which attachments to forward
5. **Direct S3-compatible Integration**: If Supabase storage becomes limiting
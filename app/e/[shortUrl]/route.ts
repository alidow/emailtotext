import { redirect } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: { params: { shortUrl: string } }
) {
  // Redirect old /e/ URLs to new /email/ path
  redirect(`/email/${params.shortUrl}`)
}
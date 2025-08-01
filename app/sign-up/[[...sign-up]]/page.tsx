import { SignUp } from "@clerk/nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  const cookieStore = await cookies()
  const verifiedPhone = cookieStore.get("verified_phone")
  
  if (!verifiedPhone) {
    redirect("/")
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <SignUp 
        path="/sign-up"
        afterSignUpUrl="/onboarding"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
      />
    </div>
  )
}
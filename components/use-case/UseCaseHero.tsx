import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

interface UseCaseHeroProps {
  badge?: string
  headline: string
  subheadline: string
  ctaText: string
  ctaHref: string
  badgeColor?: string
}

export function UseCaseHero({ 
  badge, 
  headline, 
  subheadline, 
  ctaText, 
  ctaHref,
  badgeColor = "red"
}: UseCaseHeroProps) {
  const badgeColors: Record<string, string> = {
    red: "bg-red-100 text-red-800 border-red-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
  }

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 -z-10" />
      <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.3))] -z-10" />
      
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 animate-fadeInUp">
          {badge && (
            <div className={`inline-flex items-center gap-2 ${badgeColors[badgeColor]} px-4 py-2 rounded-full text-sm font-medium mb-6 border`}>
              <Sparkles className="h-4 w-4" />
              {badge}
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {headline.split('\n').map((line, i) => (
              <span key={i} className={i > 0 ? "block text-blue-600 mt-2" : ""}>
                {line}
              </span>
            ))}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            {subheadline}
          </p>
          <Button 
            asChild 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Link href={ctaHref}>
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
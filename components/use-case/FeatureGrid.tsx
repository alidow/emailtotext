import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, Zap, Shield, Globe, Wrench, Filter, Users, FileText, CheckCircle } from "lucide-react"

interface Feature {
  title: string
  description: string
  icon?: string
}

interface FeatureGridProps {
  features: Feature[]
  title?: string
}

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Shield,
  Globe,
  Wrench,
  Filter,
  Users,
  FileText,
  CheckCircle,
  Tool: Wrench, // Alias for backward compatibility
}

export function FeatureGrid({ features, title = "Key Features" }: FeatureGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-display font-bold text-center mb-12">
          {title}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon ? iconMap[feature.icon] || CheckCircle : CheckCircle
            
            return (
              <Card 
                key={idx}
                className="border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
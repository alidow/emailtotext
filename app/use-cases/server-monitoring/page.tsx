import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getUseCase, generateUseCaseJsonLd } from "@/lib/use-cases"
import { UseCaseHero } from "@/components/use-case/UseCaseHero"
import { FeatureGrid } from "@/components/use-case/FeatureGrid"
import { TestimonialSection } from "@/components/use-case/TestimonialSection"
import { SetupSteps } from "@/components/use-case/SetupSteps"
import { FAQSection } from "@/components/use-case/FAQSection"
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"

const useCase = getUseCase('server-monitoring')!

export const metadata: Metadata = {
  title: useCase.seo.title,
  description: useCase.seo.description,
  keywords: useCase.seo.keywords.join(', '),
  openGraph: {
    title: useCase.seo.title,
    description: useCase.seo.description,
    images: [useCase.seo.ogImage || '/og-image.png'],
  }
}

export default function ServerMonitoringPage() {
  const jsonLd = generateUseCaseJsonLd(useCase)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <UseCaseHero
          badge={useCase.content.hero.badge}
          headline={useCase.content.hero.headline}
          subheadline={useCase.content.hero.subheadline}
          ctaText={useCase.content.hero.cta.text}
          ctaHref={useCase.content.hero.cta.href}
          badgeColor="red"
        />

        {/* Key Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {useCase.content.solution.benefits.map((benefit, idx) => {
                const icons: Record<string, any> = {
                  "Zap": TrendingUp,
                  "Shield": AlertTriangle,
                  "Globe": CheckCircle
                }
                const Icon = icons[benefit.icon || ''] || CheckCircle
                const colors = ["red", "blue", "green"]
                const colorClasses: Record<string, string> = {
                  red: "bg-red-100 text-red-600",
                  blue: "bg-blue-100 text-blue-600",
                  green: "bg-green-100 text-green-600"
                }
                
                return (
                  <Card key={idx} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="p-8">
                      <div className={`w-16 h-16 ${colorClasses[colors[idx]]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Monitoring Tools */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Works With Every Monitoring Stack
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCase.content.integrations.map((tool) => (
                <div key={tool} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <h3 className="font-semibold text-lg mb-2">{tool}</h3>
                  <p className="text-gray-600 text-sm">
                    {tool === "Nagios" && "Host/service alerts, performance warnings"}
                    {tool === "Zabbix" && "Trigger actions, problem notifications"}
                    {tool === "PRTG" && "Sensor alerts, threshold notifications"}
                    {tool === "Prometheus" && "AlertManager notifications"}
                    {tool === "Datadog" && "Monitor alerts, anomaly detection"}
                    {tool === "Custom Scripts" && "Any tool that sends email"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alert Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Never Miss Critical Alerts
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Infrastructure Alerts</h3>
                <ul className="space-y-3">
                  {[
                    "Server down or unreachable",
                    "High CPU/Memory usage",
                    "Disk space warnings",
                    "Network connectivity issues",
                    "Service failures"
                  ].map((alert) => (
                    <li key={alert} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Application Alerts</h3>
                <ul className="space-y-3">
                  {[
                    "Database connection failures",
                    "API response time spikes",
                    "Error rate thresholds",
                    "Queue backup warnings",
                    "SSL certificate expiry"
                  ].map((alert) => (
                    <li key={alert} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Setup Steps */}
        <SetupSteps steps={useCase.content.setupSteps} />

        {/* Features */}
        <FeatureGrid features={useCase.content.features} />

        {/* Testimonials */}
        <TestimonialSection testimonials={useCase.content.testimonials} />

        {/* FAQ */}
        <FAQSection faqs={useCase.content.faqs} />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Protect Your Infrastructure 24/7
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of DevOps teams who never miss critical alerts. 
              Start monitoring smarter today.
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/">
                Set Up Monitoring Alerts →
              </Link>
            </Button>
            <p className="mt-4 text-sm opacity-75">
              Works with all monitoring tools • 10 free alerts/month • No contracts
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
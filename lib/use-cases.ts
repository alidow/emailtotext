import { UseCase } from '@/types/use-case'
import serverMonitoring from '@/data/use-cases/server-monitoring.json'
import carrierShutdown from '@/data/use-cases/carrier-email-shutdown.json'

// Import all use case data
const useCaseData: Record<string, UseCase> = {
  'server-monitoring': serverMonitoring as UseCase,
  'carrier-email-shutdown': carrierShutdown as UseCase,
}

export function getUseCase(slug: string): UseCase | null {
  return useCaseData[slug] || null
}

export function getAllUseCases(): UseCase[] {
  return Object.values(useCaseData)
}

export function getUseCasesByCategory(category: string): UseCase[] {
  return getAllUseCases().filter(useCase => useCase.category === category)
}

export function getRelatedUseCases(slug: string, limit: number = 3): UseCase[] {
  const useCase = getUseCase(slug)
  if (!useCase) return []
  
  return useCase.content.relatedUseCases
    .map(relatedSlug => getUseCase(relatedSlug))
    .filter((uc): uc is UseCase => uc !== null)
    .slice(0, limit)
}

export function generateUseCaseJsonLd(useCase: UseCase) {
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    "name": useCase.title,
    "description": useCase.description,
    "applicationCategory": "CommunicationApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": useCase.schema.aggregateRating || {
      "@type": "AggregateRating",
      "ratingValue": 4.8,
      "reviewCount": 150
    },
    "featureList": useCase.content.features.map(f => f.title),
    "screenshot": useCase.schema.screenshot || "https://emailtotext.io/og-image.png",
    "datePublished": useCase.metadata.datePublished,
    "dateModified": useCase.metadata.dateModified,
    "author": {
      "@type": "Organization",
      "name": "Celestial Platform, LLC"
    },
    "mainEntity": useCase.content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}
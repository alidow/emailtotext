import { UseCase } from '@/types/use-case'

interface UseCaseJsonLdProps {
  useCase: UseCase
}

export function UseCaseJsonLd({ useCase }: UseCaseJsonLdProps) {
  const jsonLd = {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
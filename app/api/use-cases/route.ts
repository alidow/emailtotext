import { NextResponse } from 'next/server'
import { getAllUseCases } from '@/lib/use-cases'

export async function GET() {
  const useCases = getAllUseCases()
  
  // Structure optimized for AI agents
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Email to Text Notifier Use Cases",
    "description": "Comprehensive list of use cases for email-to-SMS notification solutions",
    "numberOfItems": useCases.length,
    "itemListElement": useCases.map((useCase, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "@id": `https://emailtotext.io/use-cases/${useCase.slug}`,
        "name": useCase.title,
        "description": useCase.description,
        "applicationCategory": useCase.category,
        "url": `https://emailtotext.io/use-cases/${useCase.slug}`,
        "datePublished": useCase.metadata.datePublished,
        "dateModified": useCase.metadata.dateModified,
        "aggregateRating": useCase.schema.aggregateRating,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": useCase.content.features.map(f => f.title),
        "keywords": useCase.seo.keywords,
        "mainEntity": {
          "@type": "FAQPage",
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
    }))
  }

  return NextResponse.json(structuredData, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
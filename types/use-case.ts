export interface UseCase {
  id: string
  slug: string
  title: string
  description: string
  category: string
  priority: number
  icon: string
  color: string
  metadata: UseCaseMetadata
  content: UseCaseContent
  seo: UseCaseSEO
  schema: UseCaseSchema
}

export interface UseCaseMetadata {
  datePublished: string
  dateModified: string
  author: string
  readTime: number
  featured: boolean
}

export interface UseCaseContent {
  hero: {
    headline: string
    subheadline: string
    badge?: string
    cta: {
      text: string
      href: string
    }
  }
  problem: {
    title: string
    description: string
    painPoints: string[]
  }
  solution: {
    title: string
    description: string
    benefits: Array<{
      title: string
      description: string
      icon?: string
    }>
  }
  features: Array<{
    title: string
    description: string
    icon?: string
  }>
  setupSteps: Array<{
    title: string
    description: string
    duration?: string
  }>
  testimonials: Array<{
    quote: string
    author: string
    role?: string
    company?: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  relatedUseCases: string[]
  integrations: string[]
  metrics?: {
    savingsPercentage?: number
    uptimePercentage?: number
    deliverySpeed?: string
    userCount?: number
  }
}

export interface UseCaseSEO {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
}

export interface UseCaseSchema {
  "@context": string
  "@type": string | string[]
  name: string
  description: string
  applicationCategory?: string
  offers?: {
    "@type": string
    price?: string
    priceCurrency?: string
  }
  aggregateRating?: {
    "@type": string
    ratingValue: number
    reviewCount: number
  }
  featureList?: string[]
  screenshot?: string
  datePublished?: string
  dateModified?: string
  author?: {
    "@type": string
    name: string
  }
  mainEntity?: Array<{
    "@type": string
    name: string
    acceptedAnswer: {
      "@type": string
      text: string
    }
  }>
}
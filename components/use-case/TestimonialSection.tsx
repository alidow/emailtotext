import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface Testimonial {
  quote: string
  author: string
  role?: string
  company?: string
}

interface TestimonialSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-display font-bold text-center mb-12">
          What Our Users Say
        </h2>
        
        <div className={`grid ${testimonials.length > 1 ? 'md:grid-cols-2' : ''} gap-8`}>
          {testimonials.map((testimonial, idx) => (
            <Card 
              key={idx}
              className="relative border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-gray-200" />
              <CardContent className="p-8">
                <p className="text-lg text-gray-700 italic mb-6 relative z-10">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-sm text-gray-600">
                        {testimonial.role}{testimonial.role && testimonial.company && ', '}{testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
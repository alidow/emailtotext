import { Disclosure } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  title?: string
}

export function FAQSection({ faqs, title = "Frequently Asked Questions" }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-display font-bold text-center mb-12">
          {title}
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Disclosure key={idx}>
              {({ open }) => (
                <div className="bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                  <Disclosure.Button className="flex w-full justify-between items-center px-6 py-4 text-left">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  )
}
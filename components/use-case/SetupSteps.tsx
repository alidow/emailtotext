import { Clock } from "lucide-react"

interface Step {
  title: string
  description: string
  duration?: string
}

interface SetupStepsProps {
  steps: Step[]
  title?: string
}

export function SetupSteps({ steps, title = "Quick Setup Process" }: SetupStepsProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-3xl font-display font-bold text-center mb-12">
          {title}
        </h2>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-indigo-300 -z-10 hidden md:block" />
          
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    idx % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                  }`}>
                    <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    {step.duration && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Clock className="h-4 w-4" />
                        <span>{step.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    {idx + 1}
                  </div>
                </div>
                
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
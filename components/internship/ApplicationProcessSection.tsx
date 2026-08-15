'use client'

import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

export function ApplicationProcessSection() {
  const steps = [
    { number: '1', title: 'Choose a Position' },
    { number: '2', title: 'Complete Application' },
    { number: '3', title: 'Application Review' },
    { number: '4', title: 'Shortlisting' },
    { number: '5', title: 'Interview/Assessment' },
    { number: '6', title: 'Selection' },
    { number: '7', title: 'Internship Onboarding' },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Application Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's how our internship selection process works
          </p>
        </div>

        {/* Desktop Process */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Card className="p-4 min-w-fit bg-primary text-primary-foreground">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{step.number}</span>
                    <span className="text-xs text-center mt-1 max-w-[120px] leading-tight">
                      {step.title}
                    </span>
                  </div>
                </Card>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-6 h-6 text-primary flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Process */}
        <div className="md:hidden flex flex-col gap-3">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <Card className="p-3 min-w-fit bg-primary text-primary-foreground">
                <span className="text-lg font-bold">{step.number}</span>
              </Card>
              <div className="flex-1">
                <p className="font-semibold text-primary">{step.title}</p>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 -rotate-90" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

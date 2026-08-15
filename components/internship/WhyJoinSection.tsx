'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Lightbulb,
  Users,
  Award,
  Globe,
  Code,
  Handshake,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react'

export function WhyJoinSection() {
  const benefits = [
    {
      icon: Lightbulb,
      title: 'Practical Professional Experience',
      description: 'Work on real projects and gain hands-on experience in your field',
    },
    {
      icon: Users,
      title: 'Mentorship and Guidance',
      description: 'Learn from experienced professionals who care about your growth',
    },
    {
      icon: Award,
      title: 'Portfolio Development',
      description: 'Build a professional portfolio with real work examples',
    },
    {
      icon: Globe,
      title: 'Climate & Environmental Impact',
      description: 'Contribute to projects that create a positive environmental impact',
    },
    {
      icon: Code,
      title: 'Digital Skills Development',
      description: 'Learn and develop in-demand digital and technical skills',
    },
    {
      icon: Handshake,
      title: 'Professional Networking',
      description: 'Build relationships with industry professionals and peers',
    },
    {
      icon: GraduationCap,
      title: 'Certificate Upon Completion',
      description: 'Receive a professional certificate recognizing your internship',
    },
    {
      icon: CheckCircle2,
      title: 'Opportunity to Contribute',
      description: 'Make a real difference by contributing to meaningful projects',
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Why Intern With Shara Eco Solutions?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gain valuable experience, develop new skills, and contribute to environmental sustainability while building your professional network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <Card key={idx} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-primary">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

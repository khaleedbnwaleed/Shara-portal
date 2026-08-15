import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import { OpportunitiesSection } from '@/components/internship/OpportunitiesSection'
import { WhyJoinSection } from '@/components/internship/WhyJoinSection'
import { ApplicationProcessSection } from '@/components/internship/ApplicationProcessSection'

export const metadata: Metadata = {
  title: 'Internship Programme - Shara Eco Solutions',
  description: 'Join Shara Eco Solutions Limited as an intern and contribute to environmental sustainability',
}

export default function InternshipPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Join Us in Building a Cleaner, Smarter and More Sustainable Future
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Shara Eco Solutions Limited is inviting passionate, creative and committed individuals
              to join our team as interns and contribute to environmental sustainability, climate
              education, digital communication and innovation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/internship/apply">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Apply Now
                </Button>
              </Link>
              <Link href="#opportunities">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Unpaid Internship Notice */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-y border-primary/20">
        <div className="max-w-7xl mx-auto">
          <Alert className="bg-accent/5 border-accent/50 shadow-sm">
            <AlertCircle className="h-5 w-5 text-accent" />
            <AlertTitle className="text-accent font-bold text-lg">
              IMPORTANT: THIS IS AN UNPAID INTERNSHIP PROGRAMME
            </AlertTitle>
            <AlertDescription className="text-foreground text-base mt-3 space-y-3">
              <p>
                The internship positions offered by Shara Eco Solutions Limited are unpaid learning
                and professional development opportunities. No salary, stipend, allowance, or
                financial remuneration is attached to these positions.
              </p>
              <p className="font-semibold">
                Applicants should only apply if they understand and are willing to participate
                under these conditions.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Opportunities Section */}
      <div id="opportunities">
        <OpportunitiesSection />
      </div>

      {/* Why Join Section */}
      <WhyJoinSection />

      {/* Application Process Section */}
      <ApplicationProcessSection />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Apply?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Start your application today and take the first step towards joining Shara Eco
            Solutions Limited.
          </p>
          <Link href="/internship/apply">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Begin Application
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

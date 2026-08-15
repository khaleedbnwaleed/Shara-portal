import Header from '@/components/header'
import Footer from '@/components/footer'
import { InternshipApplicationForm } from '@/components/internship/InternshipApplicationForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apply Now - Shara Eco Solutions Internship Programme',
  description: 'Submit your application for the Shara Eco Solutions internship programme',
}

export default function InternshipApplyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              Internship Application Form
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete the form below to apply for your desired internship position at Shara Eco
              Solutions Limited.
            </p>
          </div>

          <InternshipApplicationForm />
        </div>
      </div>

      <Footer />
    </main>
  )
}

import Header from '@/components/header'
import Footer from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Application Submitted - Shara Eco Solutions Internship',
  description: 'Your internship application has been successfully submitted',
}

export default async function InternshipSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }> | { ref?: string }
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const applicationRef = resolvedSearchParams?.ref

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              Application Submitted Successfully!
            </h1>
          </div>

          {/* Message Card */}
          <div className="bg-secondary/50 border border-primary/20 rounded-lg p-8 mb-8">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Thank you for your interest in joining Shara Eco Solutions Limited. Your internship
              application has been successfully received. Our recruitment team will review your
              application and contact shortlisted applicants.
            </p>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold">What's next?</span> Our recruitment team will
                review all applications and contact shortlisted candidates for further assessment
                or interviews. This process typically takes 2 weeks.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Return to Website
            </a>
            <a
              href="/#about"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-foreground border border-primary rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
            >
              Learn More About Shara
            </a>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg p-6 border border-primary/20">
            <h3 className="font-semibold text-primary mb-4">Frequently Asked Questions</h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-foreground mb-1">
                  When will I hear back about my application?
                </p>
                <p className="text-muted-foreground">
                  Our recruitment team typically reviews applications within 2 weeks. Only
                  shortlisted candidates will be contacted.
                </p>
              </div>

              <hr className="my-3" />

              <div>
                <p className="font-semibold text-foreground mb-1">
                  Is this internship position paid?
                </p>
                <p className="text-muted-foreground">
                  No, this is an unpaid internship programme. As you confirmed in your application,
                  no salary, stipend, allowance, or financial remuneration is attached to this
                  position.
                </p>
              </div>

              <hr className="my-3" />

              <div>
                <p className="font-semibold text-foreground mb-1">
                  Can I apply for multiple positions?
                </p>
                <p className="text-muted-foreground">
                  You can submit separate applications for different positions using the same or
                  different email addresses.
                </p>
              </div>

              <hr className="my-3" />

              <div>
                <p className="font-semibold text-foreground mb-1">How do I contact support?</p>
                <p className="text-muted-foreground">
                  If you have questions about your application, please email{' '}
                  <a
                    href="mailto:sharaecosolutions@gmail.com"
                    className="text-primary font-semibold hover:underline"
                  >
                    sharaecosolutions@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

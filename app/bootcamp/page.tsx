import { Metadata } from 'next'
import { CheckCircle, Users, Clock, Award, Leaf, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '3-Days Youth Bootcamp | Climate Entrepreneurship & Green Business Innovation',
  description: 'Join our 3-day youth bootcamp on climate entrepreneurship and green business innovation. Learn sustainable business modeling, pitching, and earn a certification.',
}

export default function BootcampPage() {
  const highlights = [
    {
      icon: Leaf,
      title: 'Green Business Skills',
      description: 'Build practical climate entrepreneurship skills for real-world impact.',
    },
    {
      icon: Users,
      title: 'Industry Experts',
      description: 'Learn from experienced professionals in sustainability and innovation.',
    },
    {
      icon: Clock,
      title: '3 Days Intensive',
      description: 'Fast-paced training delivered over 16th to 18th June 2026.',
    },
    {
      icon: Award,
      title: 'Certification',
      description: 'Receive a certificate of participation and pitch for recognition.',
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-green-700 to-emerald-900 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              3-Days Youth Bootcamp
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-4 font-semibold">
              Climate Entrepreneurship & Green Business Innovation
            </p>
            <p className="text-green-100 leading-relaxed">
              Turn climate challenges into business opportunities with a focused youth bootcamp designed to equip aspiring entrepreneurs with sustainable business model design, market pitching skills, and mentorship from industry practitioners.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="text-center p-6 bg-white rounded-3xl shadow-sm border border-gray-200">
                  <Icon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What You Will Learn Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">What You Will Learn</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              A complete 3-day experience for youth leaders ready to launch climate-conscious enterprises and pitch green business ideas with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                day: 'Day 1',
                title: 'Understanding Climate Change',
                topics: [
                  'Climate change fundamentals and local impact',
                  'Green economy opportunities for youth',
                  'Introduction to sustainable business thinking',
                ],
              },
              {
                day: 'Day 2',
                title: 'Designing Sustainable Business Models',
                topics: [
                  'Building viable green business concepts',
                  'Value proposition for climate solutions',
                  'Market positioning and customer discovery',
                ],
              },
              {
                day: 'Day 3',
                title: 'Pitching Green Business Ideas',
                topics: [
                  'Pitch structure and storytelling',
                  'Investor-ready presentation skills',
                  'Feedback, refinement, and next steps',
                ],
              },
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-shadow bg-white">
                <div className="text-sm font-semibold text-emerald-600 mb-3">{item.day}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{item.title}</h3>
                <ul className="space-y-4">
                  {item.topics.map((topic, topicIdx) => (
                    <li key={topicIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16 md:py-24 bg-emerald-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] items-stretch">
            <div className="rounded-4xl bg-white/10 p-8 md:p-12 ring-1 ring-white/10 shadow-2xl backdrop-blur-xl">
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-emerald-100/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
                  3-Day Youth Bootcamp
                </span>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-white">Secure your place in the next climate innovation cohort.</h2>
                <p className="mt-6 text-lg text-emerald-100 leading-relaxed">
                  Applications are open from 7th June to 14th June 2026. The bootcamp runs from 16th to 18th June 2026 and includes coaching, mentorship, and a certificate of participation.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Application window</p>
                  <p className="mt-3 text-xl font-semibold text-white">7th June – 14th June 2026</p>
                </div>

                <div className="rounded-3xl bg-white/10 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Bootcamp dates</p>
                  <p className="mt-3 text-xl font-semibold text-white">16th – 18th June 2026</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Training fee</p>
                  <p className="mt-3 text-3xl font-bold text-white">₦3,000</p>
                  <p className="mt-2 text-sm text-emerald-100">Inclusive certification fee.</p>
                </div>

                <div className="rounded-3xl bg-white/10 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Limited slots</p>
                  <p className="mt-3 text-3xl font-bold text-white">Available now</p>
                  <p className="mt-2 text-sm text-emerald-100">Reserve your seat early for the best experience.</p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl bg-white p-8 md:p-10 text-gray-900 shadow-2xl">
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-4">Apply for the bootcamp</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete the registration form before 14th June to reserve your place in this youth climate innovation cohort. You will receive confirmation and next steps by email.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">What you get</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700">
                    <li>• Certification of participation</li>
                    <li>• Mentorship from climate experts</li>
                    <li>• Pitch guidance and feedback</li>
                  </ul>
                </div>

                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdG3V73B1CJAqIStjWubAa7CIkr5SxoJ_moYHLJ-Fb-DaA-oA/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                    Apply Now
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Need help?</p>
                  <p className="mt-2">Email <a href="mailto:sharaecosolutions@gmail.com" className="font-semibold text-emerald-700 underline">sharaecosolutions@gmail.com</a> or call <a href="tel:+2348169525295" className="font-semibold text-emerald-700 underline">08169525295</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-10">
            {[
              {
                q: 'Who can attend this bootcamp?',
                a: 'Young people with an interest in climate action, entrepreneurship, and green innovation are all welcome.',
              },
              {
                q: 'What are the bootcamp dates?',
                a: 'The bootcamp runs from 16th to 18th June 2026, with applications open from 7th to 14th June.',
              },
              {
                q: 'What is included in the ₦3,000 fee?',
                a: 'The fee covers bootcamp participation, training materials, mentoring, and a certificate of participation.',
              },
              {
                q: 'Do I need prior business experience?',
                a: 'No prior experience is needed. The bootcamp is designed to guide you from idea to pitch, step by step.',
              },
              {
                q: 'Will I get a certificate?',
                a: 'Yes. Every participant who completes the bootcamp receives a certificate of participation.',
              },
              {
                q: 'How do I apply?',
                a: 'Click the Apply Now button and complete the registration form before 14th June 2026.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need help?</h2>
          <p className="text-gray-600 mb-8">
            Contact our bootcamp team for questions about registration, pricing, or sponsorship opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sharaecosolutions@gmail.com"
              className="px-6 py-3 bg-emerald-700 text-white rounded-full font-semibold hover:bg-emerald-800 transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:+2348169525295"
              className="px-6 py-3 border border-emerald-700 text-emerald-700 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Metadata } from 'next'
import { CheckCircle, Users, Clock, Award, Leaf, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Sustainable Home Gardening Bootcamp | Shara Eco Solutions',
  description: 'Join our 3-day intensive bootcamp on sustainable home gardening. Learn practical techniques to grow your own food sustainably.',
}

export default function BootcampPage() {
  const highlights = [
    {
      icon: Leaf,
      title: 'Sustainable Methods',
      description: 'Learn eco-friendly gardening techniques and organic practices',
    },
    {
      icon: Users,
      title: 'Expert Training',
      description: 'Learn from experienced practitioners in sustainable agriculture',
    },
    {
      icon: Clock,
      title: '3 Days Intensive',
      description: 'Comprehensive hands-on training from fundamentals to advanced',
    },
    {
      icon: Award,
      title: 'Certification',
      description: 'Receive a certificate of completion upon finishing the bootcamp',
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Sustainable Home Gardening Bootcamp
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-4">
              Learn to grow your own food sustainably in just 3 days
            </p>
            <p className="text-green-50">
              Master soil health, composting, pest management, and organic gardening techniques to establish a thriving home garden.
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
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What You'll Learn</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                day: 'Day 1',
                title: 'Soil Health & Fundamentals',
                topics: [
                  'Introduction to sustainable gardening',
                  'Soil composition and analysis',
                  'Soil amendments and fertility management',
                  'Climate-smart gardening practices',
                ]
              },
              {
                day: 'Day 2',
                title: 'Planting & Composting',
                topics: [
                  'Seed selection and planting techniques',
                  'Water management and conservation',
                  'Composting methods',
                  'Natural pest management',
                ]
              },
              {
                day: 'Day 3',
                title: 'Garden Planning & Harvest',
                topics: [
                  'Organic vegetable growing',
                  'Container gardening',
                  'Creating a personalized garden plan',
                  'Harvesting and sustainability',
                ]
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-green-600 mb-2">{item.day}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">{item.title}</h3>
                <ul className="space-y-3">
                  {item.topics.map((topic, topicIdx) => (
                    <li key={topicIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
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
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Ready to Get Started?</h2>
          <p className="text-center text-gray-600 mb-12">
            Join our next cohort and start your sustainable gardening journey. Click the button below to apply now and secure your spot.
          </p>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">Fill out our registration form to apply for the bootcamp.</p>
              <p className="text-sm text-gray-500 mb-6">The certification fee is <strong>₦1,000</strong></p>
            </div>
            
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdjhShX-L0aYAWLE_Rxj8_RtvECt25poaprcpODTAZ_FsFoSg/viewform?usp=publish-editor" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Apply Now
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            {[
              {
                q: 'Who can attend this bootcamp?',
                a: 'Everyone is welcome! Whether you are a complete beginner or have some gardening experience, our bootcamp is designed to accommodate all skill levels.'
              },
              {
                q: 'What is the cost?',
                a: 'The certification fee is ₦1,000. This includes expert instruction, learning materials, and a certificate of completion.'
              },
              {
                q: 'Do I need any experience?',
                a: 'No prior gardening experience is required. Our instructors will guide you through every step, from basics to advanced techniques.'
              },
              {
                q: 'Can I attend only certain days?',
                a: 'Yes! You can select which days you would like to attend during registration. However, we recommend attending all three days for the complete experience.'
              },
              {
                q: 'What will I receive?',
                a: 'You will receive expert training, learning materials, hands-on demonstrations, and a certificate of completion upon finishing the bootcamp.'
              },
              {
                q: 'How do I apply?',
                a: 'Simply fill out the registration form above with your details and submit. We will confirm your spot and send you further instructions via email.'
              }
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-green-50 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Get in touch with our team for more information about the bootcamp or to discuss your gardening goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:sharaecosolutions@gmail.com"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Email Us
            </a>
            <a 
              href="tel:+2348169525295"
              className="px-6 py-3 border border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

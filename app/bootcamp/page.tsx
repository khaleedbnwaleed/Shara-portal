import { Metadata } from 'next'
import BootcampForm from '@/components/bootcamp-form'
import { CheckCircle, Users, Clock, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sustainable Home Gardening Bootcamp | Shara Eco Solutions',
  description: 'Join our 3-day intensive bootcamp on sustainable home gardening. Learn soil health, composting, pest management, and organic gardening techniques.',
}

export default function BootcampPage() {
  const bootcampFeatures = [
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from experienced sustainable gardening practitioners and environmental specialists.',
    },
    {
      icon: Clock,
      title: '3-Day Intensive',
      description: 'Comprehensive curriculum covering fundamentals to advanced sustainable gardening practices.',
    },
    {
      icon: Award,
      title: 'Certificate of Completion',
      description: 'Receive a certificate upon completing the bootcamp to showcase your new skills.',
    },
    {
      icon: CheckCircle,
      title: 'Hands-On Learning',
      description: 'Practical demonstrations and interactive activities to apply concepts in real-world scenarios.',
    },
  ]

  const bootcampDays = [
    {
      day: 'Day 1',
      title: 'Fundamentals & Soil Health',
      topics: [
        'Introduction to sustainable gardening',
        'Soil composition and analysis',
        'Soil amendments and fertility',
        'pH management and testing',
      ],
    },
    {
      day: 'Day 2',
      title: 'Composting & Pest Management',
      topics: [
        'Composting methods and techniques',
        'Managing garden waste effectively',
        'Natural pest management strategies',
        'Beneficial insects and biodiversity',
      ],
    },
    {
      day: 'Day 3',
      title: 'Sustainable Practices & Planning',
      topics: [
        'Water conservation techniques',
        'Organic vegetable and herb growing',
        'Container and balcony gardening',
        'Creating your personalized garden plan',
      ],
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              Sustainable Home Gardening Bootcamp
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-6">
              A 3-day intensive workshop to transform your gardening habits and create a thriving, sustainable home garden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-green-200" />
                <span>3 Days Intensive</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} className="text-green-200" />
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={20} className="text-green-200" />
                <span>Certificate Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">Why Join This Bootcamp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bootcampFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Icon size={32} className="text-green-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">What You'll Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bootcampDays.map((schedule, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  {schedule.day}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{schedule.title}</h3>
                <ul className="space-y-3">
                  {schedule.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BootcampForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Who can attend this bootcamp?</h3>
              <p className="text-gray-600">
                This bootcamp is designed for everyone - from complete beginners with no gardening experience to advanced gardeners looking to adopt more sustainable practices. All experience levels are welcome!
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Do I need any prior gardening experience?</h3>
              <p className="text-gray-600">
                No prior experience is necessary. Our curriculum is structured to accommodate beginners while also providing valuable insights for experienced gardeners. We'll guide you through every step.
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">What's included in the bootcamp?</h3>
              <p className="text-gray-600">
                The bootcamp includes expert instruction, hands-on demonstrations, learning materials, refreshments, and a certificate of completion. Some sessions may include starter plants or seeds to take home.
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Can I attend only certain days?</h3>
              <p className="text-gray-600">
                Yes! While we recommend attending all three days for the complete experience, you can select which days you'd like to participate in during registration.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">How do I get my certificate?</h3>
              <p className="text-gray-600">
                A certificate of completion will be provided to all participants who attend at least 2 of the 3 days. It will be emailed to you within a week after the bootcamp ends.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

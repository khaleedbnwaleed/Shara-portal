'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BootcampSuccessPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-green-700 mb-2">Application Received!</h1>
          <p className="text-gray-600 mb-6">Thank you for applying to our bootcamp.</p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Confirmation Email</p>
                <p className="text-sm text-green-700">We've sent a confirmation email to your inbox with your application details.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">We'll Contact You Soon</p>
                <p className="text-sm text-green-700">Our team will reach out within 24 hours to confirm your spot and provide payment details.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>Questions?</strong> Contact us at{' '}
              <a href="mailto:sharaecosolutions@gmail.com" className="font-medium hover:underline">
                sharaecosolutions@gmail.com
              </a>
              {' '}or{' '}
              <a href="tel:+2348169525295" className="font-medium hover:underline">
                +234 816 952 5295
              </a>
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/bootcamp')} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Back to Bootcamp
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RegistrationSuccessPage() {
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
          <h1 className="text-2xl font-bold text-green-700 mb-2">Registration Successful!</h1>
          <p className="text-gray-600 mb-6">Thank you for registering for the 3-Day Sustainable Home Gardening Bootcamp.</p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left space-y-3">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Payment Verification</p>
                <p className="text-sm text-gray-600">Your payment receipt is being verified. This usually takes 24 hours.</p>
              </div>
            </div>

            <div className="border-t border-green-200 pt-3">
              <p className="text-sm text-gray-700">
                <strong>Next Steps:</strong>
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside mt-2 space-y-1">
                <li>Check your email for a confirmation receipt</li>
                <li>Wait for payment verification (within 24 hours)</li>
                <li>You'll receive a final confirmation email when verified</li>
                <li>Bootcamp details will be sent before the event</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-blue-900 mb-2">Questions?</p>
            <p className="text-sm text-blue-800">
              Contact us at <a href="mailto:sharaecosolutions@gmail.com" className="underline font-medium">sharaecosolutions@gmail.com</a> 
              {' '} or call <a href="tel:+2348169525295" className="underline font-medium">+234 816 952 5295</a>
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => router.push('/')} className="w-full bg-green-600 hover:bg-green-700">
              Return to Home
            </Button>
            <Button
              onClick={() => router.push('/bootcamp')}
              variant="outline"
              className="w-full"
            >
              View Bootcamp Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

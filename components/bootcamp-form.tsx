'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

const CERTIFICATION_FEE = 1000

const bootcampSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  daysAttending: z.array(z.string()).min(1, 'Select at least one day'),
  paymentReceipt: z.any().refine(
    (files) => files?.length === 1,
    'Payment receipt is required'
  ),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to terms and conditions',
  }),
})

type BootcampFormValues = z.infer<typeof bootcampSchema>

export default function BootcampForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receiptFileName, setReceiptFileName] = useState<string>('')

  const validatePaymentReceipt = (file: File): string | null => {
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

    if (file.size > MAX_SIZE) {
      return 'File must be less than 5MB'
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, or PDF files are allowed'
    }

    return null
  }

  const form = useForm<BootcampFormValues>({
    resolver: zodResolver(bootcampSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      experienceLevel: 'Beginner',
      daysAttending: [],
      agreeTerms: false,
    },
  })

  async function onSubmit(values: BootcampFormValues) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('fullName', values.fullName)
      formData.append('email', values.email)
      formData.append('phone', values.phone)
      formData.append('experienceLevel', values.experienceLevel)
      formData.append('daysAttending', JSON.stringify(values.daysAttending))
      
      // Add payment receipt file
      const paymentReceipt = values.paymentReceipt[0]
      if (paymentReceipt) {
        formData.append('paymentReceipt', paymentReceipt)
      }

      const res = await fetch('/api/bootcamp/register', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast({
        title: 'Successfully Applied!',
        description: 'Thank you for applying to the bootcamp. We will review your payment and contact you shortly to confirm your spot.',
      })

      form.reset()
      setReceiptFileName('')

      // Redirect to success page
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/bootcamp/success'
        }
      }, 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit application',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg border border-gray-200">
          
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+234 (XXX) XXX-XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bootcamp Preferences Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Bootcamp Details</h3>

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gardening Experience Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner - No gardening experience</SelectItem>
                      <SelectItem value="Intermediate">Intermediate - Some gardening experience</SelectItem>
                      <SelectItem value="Advanced">Advanced - Significant gardening experience</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="daysAttending"
              render={() => (
                <FormItem>
                  <FormLabel>Which Days Will You Attend? *</FormLabel>
                  <FormDescription>
                    Select the days that work best for you. We recommend attending all three days.
                  </FormDescription>
                  <div className="space-y-3 mt-4">
                    {[
                      { id: 'day1', label: 'Day 1 - Soil Health & Fundamentals' },
                      { id: 'day2', label: 'Day 2 - Planting & Composting' },
                      { id: 'day3', label: 'Day 3 - Garden Planning & Harvest' },
                    ].map((day) => (
                      <FormField
                        key={day.id}
                        control={form.control}
                        name="daysAttending"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(day.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || []
                                  if (checked) {
                                    field.onChange([...currentValue, day.id])
                                  } else {
                                    field.onChange(currentValue.filter((v) => v !== day.id))
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">{day.label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <div className="font-semibold text-amber-900">Certification Fee: ₦{CERTIFICATION_FEE.toLocaleString()}</div>
              <div className="text-sm text-amber-800 space-y-1">
                <div><strong>Bank Name:</strong> Sterling Bank</div>
                <div><strong>Account Name:</strong> Shara Eco Solutions Ltd</div>
                <div><strong>Account Number:</strong> 0132173778</div>
              </div>
              <p className="text-xs text-amber-700 italic">Please make a bank transfer and keep your payment receipt to upload below.</p>
            </div>

            <FormField
              control={form.control}
              name="paymentReceipt"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Upload Payment Receipt *</FormLabel>
                  <FormDescription>
                    Upload a screenshot or PDF of your payment confirmation. Accepted: JPEG, PNG, PDF (Max 5MB)
                  </FormDescription>
                  <FormControl>
                    <div className="mt-2">
                      <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-700">
                            {receiptFileName || 'Click to upload payment receipt'}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">or drag and drop</span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => {
                            const files = e.target.files
                            if (files && files[0]) {
                              const file = files[0]
                              const error = validatePaymentReceipt(file)
                              
                              if (error) {
                                toast({
                                  title: 'Invalid File',
                                  description: error,
                                  variant: 'destructive',
                                })
                                setReceiptFileName('')
                                onChange(null)
                                return
                              }
                              
                              setReceiptFileName(file.name)
                              onChange(files)
                            }
                          }}
                          {...field}
                        />
                      </label>
                      {receiptFileName && (
                        <p className="text-sm text-green-600 mt-2">✓ {receiptFileName} selected</p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Terms & Agreement */}
          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal cursor-pointer">
                    I confirm I have made the payment of ₦{CERTIFICATION_FEE.toLocaleString()} and agree to the terms and conditions *
                  </FormLabel>
                  <FormDescription>
                    We respect your privacy. Your information will only be used for bootcamp purposes.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </Button>
            <p className="text-sm text-gray-500 text-center mt-4">
              Your payment will be verified within 24 hours
            </p>
          </div>
        </form>
      </Form>

      <Toaster />
    </div>
  )
}

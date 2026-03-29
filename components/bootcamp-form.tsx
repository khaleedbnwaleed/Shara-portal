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

const CERTIFICATION_FEE = 1000 // 1,000 naira

const bootcampSchema = z
  .object({
    fullName: z.string().min(2, 'Please enter your full name'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    experienceLevel: z.enum(
      ['Beginner', 'Intermediate', 'Advanced'],
      { errorMap: () => ({ message: 'Please select your experience level' }) }
    ),
    daysAttending: z.array(z.string()).min(1, 'Please select at least one day'),
    dietaryRestrictions: z.string().optional(),
    whyInterested: z.string().min(10, 'Please tell us why you are interested (minimum 10 characters)'),
    paymentReceipt: z.any().refine(
      (files) => files?.length === 1,
      'Payment receipt is required'
    ),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })

type BootcampFormValues = z.infer<typeof bootcampSchema>

const daysOptions = [
  { id: 'day1', label: 'Day 1 - Foundations of Sustainable Gardening (Understanding the Basics)' },
  { id: 'day2', label: 'Day 2 - Planting Techniques and Garden Setup (From Seed to Garden)' },
  { id: 'day3', label: 'Day 3 - Garden Maintenance, Harvest, and Sustainability (Growing, Protecting, and Sustaining)' },
]



export default function BootcampForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receiptFileName, setReceiptFileName] = useState<string>('')

  // Validate payment receipt file
  const validatePaymentReceipt = (file: File): string | null => {
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

    if (file.size > MAX_SIZE) {
      return 'Payment receipt must be less than 5MB'
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Payment receipt must be a JPEG, PNG, or PDF file'
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
      dietaryRestrictions: '',
      whyInterested: '',
      agreeTerms: false,
    },
  })

  async function onSubmit(values: BootcampFormValues) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      
      // Add all form fields
      formData.append('fullName', values.fullName)
      formData.append('email', values.email)
      formData.append('phone', values.phone)
      formData.append('experienceLevel', values.experienceLevel)
      formData.append('daysAttending', JSON.stringify(values.daysAttending))
      formData.append('dietaryRestrictions', values.dietaryRestrictions || '')
      formData.append('whyInterested', values.whyInterested)
      
      // Add payment receipt file
      const paymentReceipt = values.paymentReceipt[0]
      if (paymentReceipt) {
        formData.append('paymentReceipt', paymentReceipt)
      }

      const res = await fetch('/api/bootcamp/register', {
        method: 'POST',
        body: formData,
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to submit registration')
      }

      toast({
        title: 'Registration Successful!',
        description: responseData.message || 'Thank you for registering for the 3-Day Sustainable Home Gardening Bootcamp. Your payment receipt has been received and is pending verification. You will receive a confirmation email shortly.',
      })

      form.reset()
      setReceiptFileName('')
      
      // Redirect to success page
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/bootcamp/registration-success'
        }
      }, 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit registration. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">3-Day Bootcamp on Sustainable Home Gardening</h1>
        <p className="text-gray-600 mb-2 font-semibold">Theme: Grow What You Eat – Sustain the Future</p>
        <p className="text-gray-600 text-sm mb-3">Learn to grow vegetables using low-cost and environmentally friendly methods, practice composting and water conservation, and establish a thriving home garden.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>

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

          {/* Bootcamp Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Bootcamp Details</h2>

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gardening Experience Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner - No prior gardening experience</SelectItem>
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
                    Day 1: Soil health, climate-smart practices, sustainable gardening foundations | 
                    Day 2: Seed selection, planting techniques, water management, composting | 
                    Day 3: Pest management, garden maintenance, harvesting, income opportunities
                  </FormDescription>
                  <div className="space-y-3 mt-3">
                    {daysOptions.map((day) => (
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

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Additional Information</h2>

            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please let us know of any dietary restrictions (e.g., vegan, nut allergy, etc.)"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This helps us arrange refreshments during the bootcamp</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whyInterested"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why Are You Interested in This Bootcamp? *</FormLabel>
                  <FormDescription>
                    Share what motivated you to join and how you plan to use what you learn.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what motivated you to join this sustainable gardening bootcamp and how you plan to apply the knowledge (e.g., establish a home garden, improve nutrition, generate income, contribute to sustainability)?..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Payment Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Details</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-3">Certification Fee: ₦{CERTIFICATION_FEE.toLocaleString()}</h3>
              <div className="space-y-2 text-sm text-amber-800">
                <p><strong>Bank Name:</strong> Sterling Bank</p>
                <p><strong>Account Name:</strong> Shara Eco Solutions Ltd</p>
                <p><strong>Account Number:</strong> 0132173778</p>
                <p><strong>Amount:</strong> ₦{CERTIFICATION_FEE.toLocaleString()}</p>
              </div>
              <p className="text-xs text-amber-700 mt-3 italic">Please make a transfer using any bank and keep the payment receipt/confirmation.</p>
            </div>

            <FormField
              control={form.control}
              name="paymentReceipt"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Upload Payment Receipt *</FormLabel>
                  <FormDescription>
                    Upload a screenshot or PDF of your payment confirmation. Accepted formats: JPEG, PNG, PDF (Max 5MB)
                  </FormDescription>
                  <FormControl>
                    <div className="mt-2">
                      <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-700">
                            {receiptFileName || 'Click to upload payment receipt'}
                          </span>
                          <span className="text-xs text-gray-500">or drag and drop</span>
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

          {/* Terms & Conditions */}
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
                    I agree to the terms and conditions, have made the payment of ₦{CERTIFICATION_FEE.toLocaleString()}, and understand the bootcamp schedule *
                  </FormLabel>
                  <FormDescription>We respect your privacy and will only use your information for bootcamp purposes. Your payment receipt will be verified.</FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Questions? Contact us at sharaecosolutions@gmail.com or call +234 8169525295. We look forward to seeing you at the bootcamp and helping you grow your sustainable home garden!
          </p>
        </form>
      </Form>

      <Toaster />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

const volunteerSchema = z
  .object({
    name: z.string().min(2, 'Please enter your full name'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(7, 'Please enter a phone number'),
    education: z.enum([
      'PhD',
      'MSc.',
      'BSc.',
      'HND',
      'Diploma',
      'SSCE',
      'Other',
    ]),
    educationOther: z.string().optional(),
    stateOfOrigin: z.string().min(1, 'Please enter your state of origin'),
    lga: z.string().min(1, 'Please enter your LGA'),
    address: z.string().min(5, 'Please enter your address'),
    initiatives: z.array(z.string()).optional(),
    initiativeOther: z.string().optional(),
    skills: z.array(z.string()).optional(),
    hoursAvailability: z.enum([
      '0-2 hours',
      '2-5 hours',
      '5-10 hours',
      'Flexible (varies week to week)',
    ]),
    whyInterested: z.string().min(5, 'Please share why you are interested'),
    hopeGain: z.string().min(5, 'Please share what you hope to gain'),
    signature: z.string().min(1, 'Please sign with your full name'),
  })
  .refine(
    (data) => data.education !== 'Other' || (data.educationOther && data.educationOther.trim().length > 0),
    {
      message: 'Please specify your education',
      path: ['educationOther'],
    },
  )

type VolunteerFormValues = z.infer<typeof volunteerSchema>

export default function VolunteerForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      education: 'BSc.',
      educationOther: '',
      stateOfOrigin: '',
      lga: '',
      address: '',
      initiatives: [],
      initiativeOther: '',
      skills: [],
      hoursAvailability: '0-2 hours',
      whyInterested: '',
      hopeGain: '',
      signature: '',
    },
  })

  const education = form.watch('education')

  async function onSubmit(values: VolunteerFormValues) {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const message = body?.error ?? 'Failed to submit'
        throw new Error(message)
      }

      toast({
        title: 'Thank you!',
        description: 'We received your interest and will reach out soon.',
      })

      form.reset()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Something went wrong while sending your info.'

      toast({
        title: 'Submission failed',
        description: errorMessage,
        variant: 'destructive',
      })
      console.error('Volunteer submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
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
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. +234 801 234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Educational qualification</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your highest qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="MSc.">MSc.</SelectItem>
                      <SelectItem value="BSc.">BSc.</SelectItem>
                      <SelectItem value="HND">HND</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="SSCE">SSCE</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {education === 'Other' ? (
            <FormField
              control={form.control}
              name="educationOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Please specify</FormLabel>
                  <FormControl>
                    <Input placeholder="Your qualification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <FormField
            control={form.control}
            name="stateOfOrigin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State of origin</FormLabel>
                <FormControl>
                  <Input placeholder="State of origin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LGA</FormLabel>
                <FormControl>
                  <Input placeholder="Local Government Area" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="initiatives"
            render={({ field }) => {
              const value = field.value || []

              const toggle = (option: string) => {
                if (value.includes(option)) {
                  field.onChange(value.filter((v: string) => v !== option))
                } else {
                  field.onChange([...value, option])
                }
              }

              return (
                <FormItem>
                  <FormLabel>
                    Which of Shara&apos;s initiatives are you most interested in supporting?
                  </FormLabel>
                  <FormDescription>
                    Select all that apply.
                  </FormDescription>
                  <FormControl>
                    <div className="grid gap-2">
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Smart Waste Collection')}
                          onChange={(event) => toggle('Smart Waste Collection')}
                        />
                        <span>
                          Smart Waste Collection (Assisting with bin deployment, data collection, etc.)
                        </span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Partnerships & Circular Economy')}
                          onChange={() => toggle('Partnerships & Circular Economy')}
                        />
                        <span>
                          Partnerships & Circular Economy (Supporting collaborations with businesses, etc.)
                        </span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Technology & Innovation')}
                          onChange={() => toggle('Technology & Innovation')}
                        />
                        <span>
                          Technology & Innovation (Supporting data analysis, outreach on tech solutions)
                        </span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Environmental sanitations')}
                          onChange={() => toggle('Environmental sanitations')}
                        />
                        <span>Environmental sanitations</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Other initiative')}
                          onChange={() => toggle('Other initiative')}
                        />
                        <span>Other</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          {form.watch('initiatives')?.includes('Other initiative') ? (
            <FormField
              control={form.control}
              name="initiativeOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Please specify other initiative</FormLabel>
                  <FormControl>
                    <Input placeholder="Other initiative" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => {
              const value = field.value || []

              const toggle = (option: string) => {
                if (value.includes(option)) {
                  field.onChange(value.filter((v: string) => v !== option))
                } else {
                  field.onChange([...value, option])
                }
              }

              return (
                <FormItem>
                  <FormLabel>What skills or experience do you have that could benefit Shara?</FormLabel>
                  <FormDescription>Select all that apply.</FormDescription>
                  <FormControl>
                    <div className="grid gap-2">
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Community Engagement')}
                          onChange={() => toggle('Community Engagement')}
                        />
                        <span>Community Engagement</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Data Entry/Analysis')}
                          onChange={() => toggle('Data Entry/Analysis')}
                        />
                        <span>Data Entry/Analysis</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Marketing/Communications')}
                          onChange={() => toggle('Marketing/Communications')}
                        />
                        <span>Marketing/Communications</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Technology/IT')}
                          onChange={() => toggle('Technology/IT')}
                        />
                        <span>Technology/IT</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Environmental Science')}
                          onChange={() => toggle('Environmental Science')}
                        />
                        <span>Environmental Science</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Logistics/Operations')}
                          onChange={() => toggle('Logistics/Operations')}
                        />
                        <span>Logistics/Operations</span>
                      </label>
                      <label className="flex items-start gap-2">
                        <Input
                          type="checkbox"
                          className="!h-4 !w-4 !p-0 self-start mt-1"
                          checked={value.includes('Partnership Development')}
                          onChange={() => toggle('Partnership Development')}
                        />
                        <span>Partnership Development</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="hoursAvailability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How many hours per week are you available?</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2 hours">0-2 hours</SelectItem>
                      <SelectItem value="2-5 hours">2-5 hours</SelectItem>
                      <SelectItem value="5-10 hours">5-10 hours</SelectItem>
                      <SelectItem value="Flexible (varies week to week)">
                        Flexible (varies week to week)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whyInterested"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why are you interested in volunteering with Shara?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us why" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hopeGain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you hope to gain from your volunteer experience?</FormLabel>
                <FormControl>
                  <Textarea placeholder="What do you hope to gain?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="signature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  I understand that volunteering is unpaid and agree to be contacted. Type your full name as&nbsp;signature.
                </FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send request'}
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  )
}

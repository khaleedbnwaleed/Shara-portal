'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Please enter your name'),
  serviceType: z.string().min(2, 'Please describe the service you need'),
  industryType: z.string().min(2, 'Please describe your industry'),
  notes: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingSchema>

export default function BookingForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: '',
      serviceType: '',
      industryType: '',
      notes: '',
    },
  })

  async function onSubmit(values: BookingFormValues) {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const body = await res.json().catch(() => null)

      if (!res.ok || !body?.ok) {
        throw new Error(body?.error || 'Failed to submit booking')
      }

      toast({
        title: 'Booking submitted',
        description: body.warning ?? 'Your request has been sent. We will follow up soon.',
      })

      form.reset()
      router.refresh()
    } catch (error) {
      toast({
        title: 'Unable to submit booking',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Recycling consultation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industryType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry / sector</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Agriculture, Retail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit booking'}
        </Button>
      </form>
    </Form>
  )
}

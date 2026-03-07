'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { useToast } from '@/hooks/use-toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

type ProfileFormProps = {
  name: string
  email: string
  phone?: string | null
  address?: string | null
  avatar?: string | null
}

export default function ProfileForm({ name, email, phone, address, avatar }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatar ?? null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name,
      email,
      phone: phone ?? '',
      address: address ?? '',
      avatar: avatar ?? '',
    },
  })

  // Keep the form values in sync when the server provides updated user data.
  // This is important after a successful save + router.refresh(), as useForm does not
  // automatically update its internal state when defaultValues change.
  useEffect(() => {
    form.reset({
      name,
      email,
      phone: phone ?? '',
      address: address ?? '',
      avatar: avatar ?? '',
    })
    setAvatarPreview(avatar ?? null)
  }, [name, email, phone, address, avatar, form])

  function handleAvatarChange(file?: File) {
    if (!file) {
      setAvatarPreview(null)
      form.setValue('avatar', '')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      form.setValue('avatar', result)
    }
    reader.readAsDataURL(file)
  }

  async function onSubmit(values: ProfileFormValues) {
    setIsSaving(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Unable to update profile')
      }

      toast({
        title: 'Profile updated',
        description: 'Your account information has been saved.',
      })

      // Refresh server data (avatar, name, etc.)
      router.refresh()
    } catch (error) {
      toast({
        title: 'Update failed',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Your profile</h2>
        <p className="text-sm text-muted-foreground">
          Keep your contact details up to date. This information is used for account access.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input type="email" {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
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
                <FormLabel>Residential Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Profile picture</FormLabel>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-muted">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    No photo
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="text-sm"
                onChange={(event) => handleAvatarChange(event.target.files?.[0])}
              />
            </div>
          </FormItem>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type BinRequest = {
  id: number
  bin_type: string
  quantity: number
  address: string
  pickup_date?: string | null
  notes?: string | null
  created_at: string
}

export default function RequestBinForm() {
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [requests, setRequests] = useState<BinRequest[]>([])

  useEffect(() => {
    fetch('/api/bin')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.requests)) {
          setRequests(data.requests)
        }
      })
      .catch(() => {})
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    setIsSaving(true)
    setStatus(null)

    const form = new FormData(formElement)
    const rawPickupDate = form.get('pickupDate') as string
    const rawNotes = form.get('notes') as string

    const body = {
      binType: form.get('binType') as string,
      quantity: Number(form.get('quantity')),
      address: form.get('address') as string,
      pickupDate: rawPickupDate?.trim() ? rawPickupDate : undefined,
      notes: rawNotes?.trim() ? rawNotes : undefined,
    }

    try {
      const res = await fetch('/api/bin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? 'Unable to submit request')
      }

      setStatus('Request submitted! We will follow up soon.')
      formElement.reset()

      const refreshed = await fetch('/api/bin')
      const refreshedData = await refreshed.json().catch(() => null)
      if (Array.isArray(refreshedData?.requests)) {
        setRequests(refreshedData.requests)
      }
    } catch (error) {
      setStatus((error as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>New bin request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium">Bin type</span>
                <select name="binType" className="rounded-md border border-border bg-card px-3 py-2">
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Recycling">Recycling</option>
                  <option value="Organic">Organic</option>
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium">Quantity</span>
                <Input name="quantity" type="number" defaultValue={1} min={1} />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Delivery / pickup address</span>
              <Input name="address" />
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium">Pickup date (optional)</span>
                <Input name="pickupDate" type="date" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Notes (optional)</span>
                <Textarea name="notes" rows={2} />
              </label>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Submitting…' : 'Submit request'}
            </Button>

            {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Your recent bin requests</h2>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bin requests yet.</p>
        ) : (
          <div className="grid gap-4">
            {requests.slice(0, 5).map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">{request.bin_type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Quantity: {request.quantity}</p>
                  <p className="text-sm text-muted-foreground">Address: {request.address}</p>
                  {request.pickup_date ? (
                    <p className="text-sm text-muted-foreground">Pickup: {new Date(request.pickup_date).toLocaleDateString()}</p>
                  ) : null}
                  {request.notes ? (
                    <p className="text-sm text-muted-foreground">Notes: {request.notes}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

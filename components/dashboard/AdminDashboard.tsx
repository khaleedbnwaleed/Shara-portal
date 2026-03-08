'use client'

import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type User = { id: number; name: string; email: string; role: string; created_at: string }
type Booking = { id: number; user_id: number | null; full_name: string; service_type: string; industry_type: string; created_at: string }
type Volunteer = { id: number; user_id: number | null; name: string; email: string; phone: string; created_at: string }
type BinRequest = { id: number; user_id: number | null; bin_type: string; quantity: number; address: string; created_at: string }

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

export default function AdminDashboard() {
  const toast = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [binRequests, setBinRequests] = useState<BinRequest[]>([])
  const [loading, setLoading] = useState(false)

  const [notifySubject, setNotifySubject] = useState('')
  const [notifyMessage, setNotifyMessage] = useState('')
  const [notifyTo, setNotifyTo] = useState('')

  const stats = useMemo(
    () => (
      [
        { label: 'Users', value: users.length },
        { label: 'Bookings', value: bookings.length },
        { label: 'Volunteers', value: volunteers.length },
        { label: 'Bin requests', value: binRequests.length },
      ]
    ),
    [users.length, bookings.length, volunteers.length, binRequests.length],
  )

  async function fetchAll() {
    setLoading(true)
    try {
      const [uRes, bRes, vRes, rRes] = await Promise.all([
        fetch('/api/admin/users').then((res) => res.json()),
        fetch('/api/admin/bookings').then((res) => res.json()),
        fetch('/api/admin/volunteers').then((res) => res.json()),
        fetch('/api/admin/bin-requests').then((res) => res.json()),
      ])

      setUsers(uRes.users ?? [])
      setBookings(bRes.bookings ?? [])
      setVolunteers(vRes.volunteers ?? [])
      setBinRequests(rRes.binRequests ?? [])
    } catch (error) {
      toast.toast({
        title: 'Unable to load admin data',
        description: 'Something went wrong while fetching admin data.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  async function deleteRecord(type: 'users' | 'bookings' | 'volunteers' | 'bin-requests', id: number) {
    try {
      const res = await fetch(`/api/admin/${type}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error || 'Failed')
      toast.toast({ title: 'Deleted', description: 'Record removed successfully.' })
      fetchAll()
    } catch (error) {
      toast.toast({
        title: 'Delete failed',
        description: (error as Error).message,
        variant: 'destructive',
      })
    }
  }

  async function sendNotification(event: React.FormEvent) {
    event.preventDefault()
    try {
      const res = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: notifySubject, message: notifyMessage, to: notifyTo || undefined }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error || 'Failed to send')
      toast.toast({ title: 'Notification sent', description: `Sent to ${body.sentTo} recipient(s)` })
      setNotifySubject('')
      setNotifyMessage('')
      setNotifyTo('')
    } catch (error) {
      toast.toast({ title: 'Send failed', description: (error as Error).message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <header id="stats" className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage users, bookings, volunteers, bin requests, and send notifications.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardTitle className="text-base">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </header>

      <section id="notifications" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send notification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={sendNotification} className="space-y-4">
              <div>
                <Label htmlFor="notifyTo">Send to (email, optional)</Label>
                <Input
                  id="notifyTo"
                  value={notifyTo}
                  onChange={(e) => setNotifyTo(e.target.value)}
                  placeholder="Leave blank to send to all users"
                />
              </div>
              <div>
                <Label htmlFor="notifySubject">Subject</Label>
                <Input
                  id="notifySubject"
                  value={notifySubject}
                  onChange={(e) => setNotifySubject(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="notifyMessage">Message</Label>
                <Textarea
                  id="notifyMessage"
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                Send notification
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the tables below to manage the data. Deletions are permanent.
            </p>
            <ul className="space-y-1">
              <li className="text-sm">• Delete a user and their associated data</li>
              <li className="text-sm">• Delete bookings, volunteers, and bin requests</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card id="users">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRecord('users', user.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Manage registered users.</TableCaption>
            </Table>
          </CardContent>
        </Card>

        <Card id="bookings">
          <CardHeader>
            <CardTitle>Latest bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Full name</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.full_name}</TableCell>
                    <TableCell>{booking.service_type}</TableCell>
                    <TableCell>{booking.industry_type}</TableCell>
                    <TableCell>
                      {new Date(booking.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRecord('bookings', booking.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>All booking requests submitted.</TableCaption>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card id="volunteers">
          <CardHeader>
            <CardTitle>Volunteer applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers.map((vol) => (
                  <TableRow key={vol.id}>
                    <TableCell>{vol.id}</TableCell>
                    <TableCell>{vol.name}</TableCell>
                    <TableCell>{vol.email}</TableCell>
                    <TableCell>{vol.phone}</TableCell>
                    <TableCell>
                      {new Date(vol.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRecord('volunteers', vol.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Volunteer applications.</TableCaption>
            </Table>
          </CardContent>
        </Card>

        <Card id="bin-requests">
          <CardHeader>
            <CardTitle>Bin requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Bin type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {binRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.id}</TableCell>
                    <TableCell>{req.bin_type}</TableCell>
                    <TableCell>{req.quantity}</TableCell>
                    <TableCell>{req.address}</TableCell>
                    <TableCell>
                      {new Date(req.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRecord('bin-requests', req.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Bin pickup requests.</TableCaption>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

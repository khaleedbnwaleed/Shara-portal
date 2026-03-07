import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getUserFromSession } from '@/lib/auth'
import { getDbInfo } from '@/lib/db'
import { getUserBookings, getUserVolunteerApplications, getUserBinRequests } from '@/lib/dashboard'
import BookingChart from '@/components/dashboard/BookingChart'
import BinRequestChart from '@/components/dashboard/BinRequestChart'
import StatCard from '@/components/dashboard/StatCard'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Bell, ClipboardList, Users } from 'lucide-react'

export default async function DashboardPage() {
  let sessionToken: string | undefined

  try {
    const cookieStore = await cookies()
    sessionToken = cookieStore.get('session')?.value
  } catch {
    // On some environments (especially dev with invalid sourcemaps), `cookies()`
    // can throw; treat it as unauthenticated and redirect.
    sessionToken = undefined
  }

  if (!sessionToken) {
    redirect('/login')
  }

  const user = await getUserFromSession(sessionToken)
  if (!user) {
    redirect('/login')
  }

  const bookings = await getUserBookings(user.id)
  const volunteerApplications = await getUserVolunteerApplications(user.id)
  const binRequests = await getUserBinRequests(user.id)

  const dbInfo = getDbInfo()
  const dbLabel = dbInfo.mode === 'neon' ? 'Neon DB' : 'Local JSON DB'
  const dbDescription =
    dbInfo.mode === 'neon'
      ? 'Connected to Neon/Postgres database.'
      : 'Using local data.json (development fallback).'

  return (
    <DashboardShell user={user}>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, bookings, and volunteer applications from one place.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Database: <span className="font-medium">{dbLabel}</span> — {dbDescription}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              className="w-72 rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </span>
          </div>
          <button className="relative rounded-full bg-card p-2 shadow-sm hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
              3
            </span>
          </button>
          <div className="flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-sm">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
              {user.name[0].toUpperCase()}
            </span>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        </div>
      </header>

      {/* Stats cards */}
      <section id="stats" className="grid gap-6 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          title="Bookings"
          value={bookings.length}
          subtitle="Total booking requests submitted"
        />
        <StatCard
          icon={ClipboardList}
          title="This month"
          value={bookings.filter((booking) => {
            const date = new Date(booking.created_at)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
          }).length}
          subtitle="Bookings made this month"
        />
        <StatCard
          icon={Users}
          title="Volunteers"
          value={volunteerApplications.length}
          subtitle="Volunteer applications submitted"
        />
        <StatCard
          icon={Bell}
          title="Bin requests"
          value={binRequests.length}
          subtitle="Bin requests submitted"
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <BookingChart bookings={bookings} />
          <BinRequestChart binRequests={binRequests} />
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent bookings</CardTitle>
              <CardDescription>
                Your latest service requests (most recent displayed first).
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Industry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.slice(0, 5).map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        {new Date(booking.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>{booking.service_type}</TableCell>
                      <TableCell>{booking.industry_type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>
                  Showing {Math.min(5, bookings.length)} of {bookings.length} bookings
                </TableCaption>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  )
}

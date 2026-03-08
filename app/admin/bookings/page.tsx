import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import AdminShell from '@/components/admin/AdminShell'
import { getAdminUserFromSession, getAllBookings } from '@/lib/admin'

export default async function AdminBookingsPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const user = await getAdminUserFromSession(sessionToken)

  if (!user) {
    redirect('/login')
  }

  const bookings = await getAllBookings()

  return (
    <AdminShell user={user}>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View all booking requests submitted by users.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Back to overview
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] table-auto">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Service</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Industry</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Created</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-border">
                <td className="px-4 py-3 text-sm">{booking.full_name}</td>
                <td className="px-4 py-3 text-sm">{booking.service_type}</td>
                <td className="px-4 py-3 text-sm">{booking.industry_type}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(booking.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}

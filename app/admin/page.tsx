import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import AdminShell from '@/components/admin/AdminShell'
import StatCard from '@/components/dashboard/StatCard'
import { Bell, ClipboardList, Users, Box, GraduationCap } from 'lucide-react'
import { getUserFromSession } from '@/lib/auth'
import { getAllUsers, getAllBookings, getAllVolunteerApplications, getAllBinRequests, getAllBootcampRegistrations } from '@/lib/admin'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  if (!sessionToken) {
    redirect('/login')
  }

  const user = await getUserFromSession(sessionToken)
  if (!user) {
    redirect('/login')
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  const isAdmin =
    adminEmails.length > 0
      ? adminEmails.includes(user.email?.toLowerCase() ?? '')
      : user.id === 1

  if (!isAdmin) {
    redirect('/login')
  }

  const [users, bookings, volunteers, binRequests, bootcampRegistrations] = await Promise.all([
    getAllUsers(),
    getAllBookings(),
    getAllVolunteerApplications(),
    getAllBinRequests(),
    getAllBootcampRegistrations(),
  ])

  return (
    <AdminShell user={user}>
      <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Overview of registered users and site activity.
          </p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-5">
        <StatCard icon={Users} title="Users" value={users.length} subtitle="Total registered accounts" />
        <StatCard icon={ClipboardList} title="Bookings" value={bookings.length} subtitle="Bookings submitted" />
        <StatCard icon={Bell} title="Volunteers" value={volunteers.length} subtitle="Volunteer applications" />
        <StatCard icon={Box} title="Bin requests" value={binRequests.length} subtitle="Bin requests submitted" />
        <Link href="/admin/bootcamp-registrations" className="hover:opacity-80 transition-opacity">
          <StatCard icon={GraduationCap} title="Bootcamp" value={bootcampRegistrations.length} subtitle="Bootcamp registrations" />
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Recent users</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] table-auto">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(-10).reverse().map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-4 py-3 text-sm">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(user.created_at).toLocaleDateString(undefined, {
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
      </section>
    </AdminShell>
  )
}

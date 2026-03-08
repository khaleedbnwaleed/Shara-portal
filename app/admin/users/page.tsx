import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import AdminShell from '@/components/admin/AdminShell'
import { getAdminUserFromSession, getAllUsers } from '@/lib/admin'

export default async function AdminUsersPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const user = await getAdminUserFromSession(sessionToken)

  if (!user) {
    redirect('/login')
  }

  const users = await getAllUsers()

  return (
    <AdminShell user={user}>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage registered users.
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
        <table className="w-full min-w-[640px] table-auto">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
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
    </AdminShell>
  )
}

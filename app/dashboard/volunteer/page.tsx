import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getUserFromSession } from '@/lib/auth'
import VolunteerForm from '@/components/volunteer-form'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { ArrowLeft } from 'lucide-react'

export default async function DashboardVolunteerPage() {
  let sessionToken: string | undefined

  try {
    const cookieStore = await cookies()
    sessionToken = cookieStore.get('session')?.value
  } catch {
    sessionToken = undefined
  }

  if (!sessionToken) {
    redirect('/login')
  }

  const user = await getUserFromSession(sessionToken)
  if (!user) {
    redirect('/login')
  }

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Volunteer with us</h1>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          Join our community of volunteers and help us drive sustainable impact.
        </p>

        <div className="grid gap-6">
          <VolunteerForm />
        </div>
      </div>
    </DashboardShell>
  )
}

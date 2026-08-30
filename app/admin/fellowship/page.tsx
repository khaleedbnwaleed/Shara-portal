import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { getAdminUserFromSession } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { FellowshipAdminPanel } from '@/components/admin/FellowshipAdminPanel'

export default async function AdminFellowshipPage() {
  const user = await getAdminUserFromSession((await cookies()).get('session')?.value)
  if (!user) redirect('/login')
  const applicants = await prisma.fellowshipApplicant.findMany({ orderBy: { createdAt: 'desc' }, select: { applicationId: true, fullName: true, email: true, phone: true, state: true, gender: true, education: true, climateInterests: true, status: true, score: true, reviewerNotes: true, createdAt: true } })
  return <AdminShell user={user}><div className="mb-8"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-muted-foreground">Shara Climate Academy</p><h1 className="mt-2 text-3xl font-black">Climate Champions Fellowship</h1><p className="mt-2 text-sm text-muted-foreground">Review applicants, manage statuses and export the current cohort.</p></div><div className="flex gap-2"><a href="/admin/fellowship/settings" className="rounded-lg border border-border px-4 py-2 text-sm font-bold">Settings</a><a href="/fellowship" target="_blank" rel="noreferrer" className="hidden rounded-lg border border-border px-4 py-2 text-sm font-bold sm:block">View portal</a></div></div></div><FellowshipAdminPanel applicants={applicants.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} /></AdminShell>
}
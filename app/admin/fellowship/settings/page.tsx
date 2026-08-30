import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { FellowshipSettingsForm } from '@/components/admin/FellowshipSettingsForm'
import { getAdminUserFromSession } from '@/lib/admin'
import { getFellowshipConfig } from '@/lib/fellowship'

export default async function AdminFellowshipSettingsPage() {
  const user = await getAdminUserFromSession((await cookies()).get('session')?.value)
  if (!user) redirect('/login')
  const settings = await getFellowshipConfig()
  return <AdminShell user={user}><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-muted-foreground">Climate fellowship</p><h1 className="mt-2 text-3xl font-black">Portal settings</h1><p className="mt-2 text-sm text-muted-foreground">Control the public fellowship message and application availability.</p></div><FellowshipSettingsForm initialSettings={{ title: settings.title, description: settings.description, duration: settings.duration, format: settings.format, contactEmail: settings.contactEmail, applicationOpen: settings.applicationOpen, maxApplications: settings.maxApplications ?? null }} /></AdminShell>
}
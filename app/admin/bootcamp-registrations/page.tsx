import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromSession } from '@/lib/auth'
import { getAdminUserFromSession, getAllBootcampRegistrations } from '@/lib/admin'
import AdminShell from '@/components/admin/AdminShell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default async function BootcampRegistrationsPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value

  const user = await getAdminUserFromSession(sessionToken)
  if (!user) {
    redirect('/login')
  }

  const registrations = await getAllBootcampRegistrations()

  const totalRegistrations = registrations.length
  const beginnerCount = registrations.filter(
    (r) => r.experience_level === 'Beginner'
  ).length
  const intermediateCount = registrations.filter(
    (r) => r.experience_level === 'Intermediate'
  ).length
  const advancedCount = registrations.filter(
    (r) => r.experience_level === 'Advanced'
  ).length

  return (
    <AdminShell user={user}>
      <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bootcamp Registrations</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage and view all Sustainable Home Gardening Bootcamp registrations.
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Beginners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beginnerCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Intermediate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{intermediateCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Advanced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advancedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
          <CardDescription>
            A complete list of all bootcamp registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No registrations yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Experience Level</TableHead>
                    <TableHead>Days Attending</TableHead>
                    <TableHead>Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration: any) => {
                    const daysAttending = Array.isArray(registration.days_attending)
                      ? registration.days_attending
                      : JSON.parse(registration.days_attending || '[]')

                    return (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium">
                          {registration.full_name}
                        </TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.phone}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              registration.experience_level === 'Beginner'
                                ? 'secondary'
                                : registration.experience_level === 'Intermediate'
                                ? 'outline'
                                : 'default'
                            }
                          >
                            {registration.experience_level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {daysAttending.length > 0 ? (
                            <div className="space-y-1">
                              {daysAttending.map((day: string, idx: number) => (
                                <div key={idx} className="text-xs text-muted-foreground">
                                  {day}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {registration.created_at
                            ? format(
                              new Date(registration.created_at),
                              'MMM d, yyyy p'
                            )
                            : '-'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Details */}
      {registrations.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Registration Details</CardTitle>
            <CardDescription>
              Detailed view of all registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {registrations.map((registration: any) => {
                const daysAttending = Array.isArray(registration.days_attending)
                  ? registration.days_attending
                  : JSON.parse(registration.days_attending || '[]')
                const interests = Array.isArray(registration.interests)
                  ? registration.interests
                  : JSON.parse(registration.interests || '[]')

                return (
                  <div
                    key={registration.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {registration.full_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {registration.email} • {registration.phone}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {registration.experience_level}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">Days Attending</p>
                        <p>{daysAttending.join(', ')}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Dietary Restrictions</p>
                        <p>{registration.dietary_restrictions || 'None'}</p>
                      </div>
                    </div>

                    {interests.length > 0 && (
                      <div>
                        <p className="font-medium text-muted-foreground text-sm mb-2">
                          Interests
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-muted-foreground text-sm mb-1">
                        Why interested
                      </p>
                      <p className="text-sm text-gray-600">
                        {registration.why_interested}
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Registered on{' '}
                      {registration.created_at
                        ? format(
                          new Date(registration.created_at),
                          'MMMM d, yyyy p'
                        )
                        : '-'}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </AdminShell>
  )
}

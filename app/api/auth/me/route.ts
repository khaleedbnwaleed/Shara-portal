import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { getUserFromSession } from '@/lib/auth'

export async function GET() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  if (!sessionToken) {
    return NextResponse.json({ user: null })
  }

  const user = await getUserFromSession(sessionToken)
  return NextResponse.json({ user })
}

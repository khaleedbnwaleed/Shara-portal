import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { getDb } from '@/lib/db'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value

  if (sessionToken) {
    const db = getDb()
    await db.query('DELETE FROM sessions WHERE token = $1', [sessionToken])
  }

  const url = new URL(request.url)
  url.pathname = '/login'

  const response = NextResponse.redirect(url, { status: 303 })
  response.cookies.set({
    name: 'session',
    value: '',
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}

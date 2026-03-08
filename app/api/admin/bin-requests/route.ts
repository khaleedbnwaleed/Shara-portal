import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getDb } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

async function requireAdmin() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  if (!sessionToken) return null

  const user = await getUserFromSession(sessionToken)
  if (!user || user.role !== 'admin') return null

  return user
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  await db.query(`
    CREATE TABLE IF NOT EXISTS bin_requests (
      id SERIAL PRIMARY KEY,
      user_id integer,
      bin_type text NOT NULL,
      quantity integer NOT NULL,
      address text NOT NULL,
      pickup_date timestamptz,
      notes text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const result = await db.query('SELECT * FROM bin_requests ORDER BY id DESC')
  return NextResponse.json({ binRequests: result.rows })
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const id = body?.id ?? new URL(request.url).searchParams.get('id')
  const binRequestId = Number(id)
  if (!binRequestId || Number.isNaN(binRequestId)) {
    return NextResponse.json({ error: 'Invalid bin request id' }, { status: 400 })
  }

  const db = getDb()
  await db.query('DELETE FROM bin_requests WHERE id = $1', [binRequestId])
  return NextResponse.json({ ok: true })
}

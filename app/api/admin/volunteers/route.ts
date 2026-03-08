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
    CREATE TABLE IF NOT EXISTS volunteers (
      id SERIAL PRIMARY KEY,
      user_id integer,
      name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      education text NOT NULL,
      education_other text,
      state_of_origin text NOT NULL,
      lga text NOT NULL,
      address text NOT NULL,
      initiatives text,
      skills text,
      hours_availability text NOT NULL,
      why_interested text NOT NULL,
      hope_gain text NOT NULL,
      signature text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const result = await db.query('SELECT * FROM volunteers ORDER BY id DESC')
  return NextResponse.json({ volunteers: result.rows })
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const id = body?.id ?? new URL(request.url).searchParams.get('id')
  const volunteerId = Number(id)
  if (!volunteerId || Number.isNaN(volunteerId)) {
    return NextResponse.json({ error: 'Invalid volunteer id' }, { status: 400 })
  }

  const db = getDb()
  await db.query('DELETE FROM volunteers WHERE id = $1', [volunteerId])
  return NextResponse.json({ ok: true })
}

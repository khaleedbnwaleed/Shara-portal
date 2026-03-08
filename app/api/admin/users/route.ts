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
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      avatar text,
      phone text,
      address text,
      role text NOT NULL DEFAULT 'user',
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  // Ensure role column exists
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'")

  const result = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC')
  return NextResponse.json({ users: result.rows })
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const id = body?.id ?? new URL(request.url).searchParams.get('id')
  const userId = Number(id)
  if (!userId || Number.isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 })
  }

  const db = getDb()
  await db.query('DELETE FROM users WHERE id = $1', [userId])
  return NextResponse.json({ ok: true })
}

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getDb } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

const binRequestSchema = z.object({
  binType: z.string().min(1),
  quantity: z.number().min(1),
  address: z.string().min(5),
  pickupDate: z
    .string()
    .optional()
    .transform((val) => (typeof val === 'string' && val.trim() ? val : undefined)),
  notes: z
    .string()
    .optional()
    .transform((val) => (typeof val === 'string' && val.trim() ? val : undefined)),
})

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await getUserFromSession(sessionToken)
  if (!user) {
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

  const result = await db.query('SELECT * FROM bin_requests WHERE user_id = $1 ORDER BY id DESC', [user.id])
  return NextResponse.json({ requests: result.rows })
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = binRequestSchema.parse(body)

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

    await db.query(
      `INSERT INTO bin_requests (user_id, bin_type, quantity, address, pickup_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, data.binType, data.quantity, data.address, data.pickupDate ?? null, data.notes ?? null],
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json({ error: 'Unable to create bin request' }, { status: 500 })
  }
}


import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = signupSchema.parse(body)

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

    // Ensure schema includes optional profile fields (for existing DBs)
    await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar text')
    await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text')
    await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS address text')
    await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'")

    const passwordHash = await hashPassword(data.password)

    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, avatar, phone, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [data.name, data.email.toLowerCase(), passwordHash, null, null, null],
    )

    const userId = result.rows[0]?.id
    if (!userId) {
      throw new Error('Unable to determine new user id')
    }

    const sessionToken = await createSession(userId)

    const response = NextResponse.json({ ok: true })
    response.cookies.set({
      name: 'session',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }

    // Unique constraint violation / email already exists
    if (error instanceof Error && /unique|duplicate/i.test(error.message)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    console.error(error)

    const isDev = process.env.NODE_ENV !== 'production'
    const message = isDev && error instanceof Error ? error.message : 'Unable to sign up'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

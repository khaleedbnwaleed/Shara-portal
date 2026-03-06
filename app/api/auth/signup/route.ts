import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPool } from '@/lib/db'
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

    const pool = getPool()

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    const passwordHash = await hashPassword(data.password)

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [data.name, data.email.toLowerCase(), passwordHash],
    )

    const userId = result.rows[0].id
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
    return NextResponse.json({ error: 'Unable to sign up' }, { status: 500 })
  }
}

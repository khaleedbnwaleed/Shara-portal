import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getDb } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
})

export async function PATCH(request: Request) {
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
    const data = profileSchema.parse(body)

    const db = getDb()

    // Ensure email remains unique
    await db.query(
      'UPDATE users SET name = $1, email = $2, avatar = $3, phone = $4, address = $5 WHERE id = $6',
      [
        data.name,
        data.email.toLowerCase(),
        data.avatar ?? null,
        data.phone ?? null,
        data.address ?? null,
        user.id,
      ],
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }

    if (error instanceof Error && /unique|duplicate/i.test(error.message)) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    console.error(error)
    return NextResponse.json({ error: 'Unable to update profile' }, { status: 500 })
  }
}

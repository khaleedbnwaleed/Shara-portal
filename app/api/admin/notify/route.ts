import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

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

const notifySchema = z.object({
  subject: z.string().min(2),
  message: z.string().min(2),
  to: z.string().email().optional(),
})

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const data = notifySchema.parse(body)

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return NextResponse.json({ error: 'Email credentials not configured' }, { status: 500 })
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

  const result = await db.query('SELECT email FROM users')
  const emails: string[] = result.rows.map((r: any) => r.email).filter(Boolean)
  const recipients = data.to ? [data.to] : emails

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipients,
    subject: data.subject,
    html: `<p>${data.message}</p>`,
  })

  return NextResponse.json({ ok: true, sentTo: recipients.length })
}

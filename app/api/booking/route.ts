import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

import { getDb } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

const bookingSchema = z.object({
  fullName: z.string().min(2),
  serviceType: z.string().min(2),
  industryType: z.string().min(2),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = bookingSchema.parse(body)

    // Try to associate the booking with the logged-in user
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session')?.value
    const user = sessionToken ? await getUserFromSession(sessionToken) : null

    const db = getDb()
    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id integer,
        full_name text NOT NULL,
        service_type text NOT NULL,
        industry_type text NOT NULL,
        notes text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    // Ensure older schema versions have the notes column
    await db.query('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes text')

    await db.query(
      'INSERT INTO bookings (user_id, full_name, service_type, industry_type, notes) VALUES ($1, $2, $3, $4, $5)',
      [user?.id ?? null, data.fullName, data.serviceType, data.industryType, data.notes ?? null],
    )

    let emailWarning: string | null = null

    // Try sending notification email if credentials are available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        })

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'sharaecosolutions@gmail.com',
          subject: 'New Service Booking Request',
          html: `
            <h2>New Booking Request</h2>
            <p><strong>Full Name:</strong> ${data.fullName}</p>
            <p><strong>Service Type:</strong> ${data.serviceType}</p>
            <p><strong>Industry Type:</strong> ${data.industryType}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            ${user ? `<p><strong>Submitted by:</strong> ${user.name} (${user.email})</p>` : ''}
          `,
        }

        await transporter.sendMail(mailOptions)
      } catch (emailError) {
        console.error('Booking email error:', emailError)
        emailWarning = 'Booking saved, but failed to send notification email.'
      }
    } else {
      emailWarning = 'Booking saved, but email notifications are not configured.'
    }

    return NextResponse.json({ ok: true, warning: emailWarning })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }

    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Unable to submit booking' }, { status: 500 })
  }
}

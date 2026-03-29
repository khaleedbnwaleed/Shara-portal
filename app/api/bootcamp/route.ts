import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb, getDbInfo } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

export const runtime = 'nodejs'

const bootcampSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  daysAttending: z.array(z.string()).min(1, 'Please select at least one day'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  dietaryRestrictions: z.string().optional(),
  whyInterested: z.string().min(10),
  agreeTerms: z.boolean().refine((val) => val === true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = bootcampSchema.parse(body)

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session')?.value
    const user = sessionToken ? await getUserFromSession(sessionToken) : null

    const db = getDb()

    // Create table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS bootcamp_registrations (
        id SERIAL PRIMARY KEY,
        user_id integer,
        full_name text NOT NULL,
        email text NOT NULL,
        phone text NOT NULL,
        experience_level text NOT NULL,
        days_attending text NOT NULL,
        interests text NOT NULL,
        dietary_restrictions text,
        why_interested text NOT NULL,
        agree_terms boolean NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    // For SQLite/local JSON we store arrays as JSON strings
    const dbInfo = getDbInfo()

    const daysAttendingValue = dbInfo.mode === 'neon'
      ? data.daysAttending
      : JSON.stringify(data.daysAttending)
    const interestsValue = dbInfo.mode === 'neon'
      ? data.interests
      : JSON.stringify(data.interests)

    const result = await db.query(
      `INSERT INTO bootcamp_registrations (
        user_id,
        full_name,
        email,
        phone,
        experience_level,
        days_attending,
        interests,
        dietary_restrictions,
        why_interested,
        agree_terms
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`,
      [
        user?.id ?? null,
        data.fullName,
        data.email,
        data.phone,
        data.experienceLevel,
        daysAttendingValue,
        interestsValue,
        data.dietaryRestrictions ?? null,
        data.whyInterested,
        data.agreeTerms,
      ],
    )

    // Send confirmation email
    try {
      await sendEmail({
        to: data.email,
        subject: 'Bootcamp Registration Confirmation - Shara Eco Solutions',
        html: `
          <h2>Welcome to the Sustainable Home Gardening Bootcamp!</h2>
          <p>Dear ${data.fullName},</p>
          <p>Thank you for registering for our 3-day Sustainable Home Gardening Bootcamp. We're excited to have you join us!</p>
          
          <h3>Registration Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${data.fullName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Experience Level:</strong> ${data.experienceLevel}</li>
            <li><strong>Days Attending:</strong> ${data.daysAttending.join(', ')}</li>
          </ul>

          <h3>What's Next?</h3>
          <p>We will send you more details about the bootcamp schedule, location, and what to bring via email shortly. If you have any questions, feel free to reach out to us at <strong>bootcamp@sharaecosolutions.com</strong></p>

          <p>Looking forward to seeing you!</p>
          <p>Best regards,<br/>The Shara Eco Solutions Team</p>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json(
      {
        ok: true,
        message: 'Registration successful! Check your email for confirmation details.',
        id: result.rows[0]?.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Bootcamp registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 },
      )
    }

    const message = error instanceof Error ? error.message : 'Unable to save bootcamp registration'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// GET endpoint to retrieve bootcamp registrations (admin only)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session')?.value
    const user = sessionToken ? await getUserFromSession(sessionToken) : null

    // Check if user is admin
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const db = getDb()
    const result = await db.query(
      'SELECT * FROM bootcamp_registrations ORDER BY created_at DESC'
    )

    return NextResponse.json({ registrations: result.rows })
  } catch (error) {
    console.error('Error fetching bootcamp registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

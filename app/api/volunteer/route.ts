import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb, getDbInfo } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

export const runtime = 'nodejs'

const volunteerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7),
    education: z.enum([
      'PhD',
      'MSc.',
      'BSc.',
      'HND',
      'Diploma',
      'SSCE',
      'Other',
    ]),
    educationOther: z.string().optional(),
    stateOfOrigin: z.string().min(1),
    lga: z.string().min(1),
    address: z.string().min(5),
    initiatives: z.array(z.string()).optional(),
    initiativeOther: z.string().optional(),
    skills: z.array(z.string()).optional(),
    hoursAvailability: z.enum([
      '0-2 hours',
      '2-5 hours',
      '5-10 hours',
      'Flexible (varies week to week)',
    ]),
    whyInterested: z.string().min(5),
    hopeGain: z.string().min(5),
    signature: z.string().min(1),
  })
  .refine(
    (data) => data.education !== 'Other' || (data.educationOther && data.educationOther.trim().length > 0),
    {
      message: 'Please specify your education',
      path: ['educationOther'],
    },
  )

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = volunteerSchema.parse(body)

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session')?.value
    const user = sessionToken ? await getUserFromSession(sessionToken) : null

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

    // Ensure older schemas have the user_id field (this can happen when the table was created before we added tracking)
    await db.query('ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS user_id integer')

    // For SQLite/local JSON we store arrays as JSON strings, but in Postgres we can use a text[] column value.
    const dbInfo = getDbInfo()

    const initiativesValue = data.initiatives
      ? dbInfo.mode === 'neon'
        ? data.initiatives
        : JSON.stringify(data.initiatives)
      : null
    const skillsValue = data.skills
      ? dbInfo.mode === 'neon'
        ? data.skills
        : JSON.stringify(data.skills)
      : null

    await db.query(
      `INSERT INTO volunteers (
        user_id,
        name,
        email,
        phone,
        education,
        education_other,
        state_of_origin,
        lga,
        address,
        initiatives,
        skills,
        hours_availability,
        why_interested,
        hope_gain,
        signature
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        user?.id ?? null,
        data.name,
        data.email,
        data.phone,
        data.education,
        data.educationOther ?? null,
        data.stateOfOrigin,
        data.lga,
        data.address,
        initiativesValue,
        skillsValue,
        data.hoursAvailability,
        data.whyInterested,
        data.hopeGain,
        data.signature,
      ],
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Volunteer request error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 },
      )
    }

    const message = error instanceof Error ? error.message : 'Unable to save volunteer request'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

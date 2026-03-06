import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Pool } from 'pg'

export const runtime = 'nodejs'

function getPool() {
  if ((global as any).volunteerPool) {
    return (global as any).volunteerPool as Pool
  }

  const connectionString = process.env.NEON_DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing NEON_DATABASE_URL environment variable')
  }

  const pool = new Pool({
    connectionString,
  })

  if (process.env.NODE_ENV !== 'production') {
    ;(global as any).volunteerPool = pool
  }

  return pool
}

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

    const pool = getPool()

    await pool.query(`
      CREATE TABLE IF NOT EXISTS volunteers (
        id serial PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL,
        phone text NOT NULL,
        education text NOT NULL,
        education_other text,
        state_of_origin text NOT NULL,
        lga text NOT NULL,
        address text NOT NULL,
        initiatives text[] DEFAULT ARRAY[]::text[],
        skills text[] DEFAULT ARRAY[]::text[],
        hours_availability text NOT NULL,
        why_interested text NOT NULL,
        hope_gain text NOT NULL,
        signature text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    // Ensure any missing columns are added if the table already exists
    await pool.query(`
      ALTER TABLE volunteers
      ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS education text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS education_other text,
      ADD COLUMN IF NOT EXISTS state_of_origin text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS lga text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS initiatives text[] DEFAULT ARRAY[]::text[],
      ADD COLUMN IF NOT EXISTS skills text[] DEFAULT ARRAY[]::text[],
      ADD COLUMN IF NOT EXISTS hours_availability text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS why_interested text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS hope_gain text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS signature text NOT NULL DEFAULT ''
    `)

    await pool.query(
      `INSERT INTO volunteers (
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        data.name,
        data.email,
        data.phone,
        data.education,
        data.educationOther ?? null,
        data.stateOfOrigin,
        data.lga,
        data.address,
        data.initiatives ?? [],
        data.skills ?? [],
        data.hoursAvailability,
        data.whyInterested,
        data.hopeGain,
        data.signature,
      ],
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: 'Unable to save volunteer request' }, { status: 500 })
  }
}

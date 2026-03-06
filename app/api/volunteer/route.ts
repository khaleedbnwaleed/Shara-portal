import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/db'

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

    const db = getDb()

    await db.query(`
      CREATE TABLE IF NOT EXISTS volunteers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        created_at datetime NOT NULL DEFAULT (datetime('now'))
      )
    `)

    // For SQLite, arrays are stored as JSON. For Postgres, we use native arrays.
    const initiativesValue = data.initiatives ? JSON.stringify(data.initiatives) : null
    const skillsValue = data.skills ? JSON.stringify(data.skills) : null

    await db.query(
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

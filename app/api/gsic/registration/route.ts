import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const fallbackFilePath = path.join(process.cwd(), 'data', 'gsic-applications.json')

function writeFallbackApplication(application: Record<string, unknown>) {
  const directory = path.dirname(fallbackFilePath)
  fs.mkdirSync(directory, { recursive: true })

  const existing = fs.existsSync(fallbackFilePath)
    ? JSON.parse(fs.readFileSync(fallbackFilePath, 'utf8'))
    : []

  const records = Array.isArray(existing) ? existing : []
  records.push({
    ...application,
    storedAt: new Date().toISOString(),
    storage: 'local-fallback',
  })

  fs.writeFileSync(fallbackFilePath, JSON.stringify(records, null, 2))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      schoolName,
      schoolType,
      schoolAddress,
      teacherName,
      teacherPhone,
      teacherEmail,
      studentOne,
      studentTwo,
      studentThree,
      projectFocus,
      projectIdea,
    } = body ?? {}

    if (!schoolName || !schoolAddress || !teacherName || !teacherPhone || !teacherEmail || !studentOne || !studentTwo || !projectIdea) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 })
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phonePattern = /^\+?[0-9\s-]{7,15}$/

    if (!emailPattern.test(String(teacherEmail))) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (!phonePattern.test(String(teacherPhone))) {
      return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 })
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
    })

    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "GsicRegistration" (
          id SERIAL PRIMARY KEY,
          "schoolName" TEXT NOT NULL,
          "schoolType" TEXT NOT NULL,
          "schoolAddress" TEXT NOT NULL,
          "teacherName" TEXT NOT NULL,
          "teacherPhone" TEXT NOT NULL,
          "teacherEmail" TEXT NOT NULL,
          "studentOne" TEXT NOT NULL,
          "studentTwo" TEXT NOT NULL,
          "studentThree" TEXT,
          "projectFocus" TEXT NOT NULL,
          "projectIdea" TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await pool.query(
        `INSERT INTO "GsicRegistration" ("schoolName", "schoolType", "schoolAddress", "teacherName", "teacherPhone", "teacherEmail", "studentOne", "studentTwo", "studentThree", "projectFocus", "projectIdea", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
        [
          schoolName,
          schoolType,
          schoolAddress,
          teacherName,
          teacherPhone,
          teacherEmail,
          studentOne,
          studentTwo,
          studentThree ?? '',
          projectFocus,
          projectIdea,
        ],
      )

      return NextResponse.json({ success: true, storage: 'database' })
    } finally {
      await pool.end()
    }
  } catch (error) {
    console.error('GSIC registration save failed:', error)
    writeFallbackApplication({
      schoolName: body?.schoolName,
      schoolType: body?.schoolType,
      schoolAddress: body?.schoolAddress,
      teacherName: body?.teacherName,
      teacherPhone: body?.teacherPhone,
      teacherEmail: body?.teacherEmail,
      studentOne: body?.studentOne,
      studentTwo: body?.studentTwo,
      studentThree: body?.studentThree,
      projectFocus: body?.projectFocus,
      projectIdea: body?.projectIdea,
    })
    return NextResponse.json({ success: true, storage: 'local-fallback', message: 'Your application was saved locally while the database connection was unavailable.' })
  }
}

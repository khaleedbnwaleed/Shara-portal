import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const FALLBACK_FILE = path.join(process.cwd(), 'data', 'climate-tech-registrations.json')

function createRegistrationRef() {
  return `CTM-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function saveFallback(data: Record<string, unknown>) {
  fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true })
  const existing = fs.existsSync(FALLBACK_FILE)
    ? JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'))
    : []
  const records = Array.isArray(existing) ? existing : []
  records.push({ ...data, storedAt: new Date().toISOString(), storage: 'local-fallback' })
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(records, null, 2))
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {}

  try {
    body = await request.json()
    const required = ['organisationName', 'organisationType', 'contactName', 'email', 'phone', 'category', 'lga', 'description', 'stage']
    const missing = required.filter((field) => !String(body[field] ?? '').trim())

    if (missing.length) {
      return NextResponse.json({ ok: false, error: 'Please complete all required fields.' }, { status: 400 })
    }

    const email = String(body.email).trim().toLowerCase()
    const phone = String(body.phone).trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (!/^\+?[0-9\s()-]{7,20}$/.test(phone)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid phone number.' }, { status: 400 })
    }

    const registrationRef = createRegistrationRef()
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
    })

    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "ClimateTechRegistration" (
          "id" TEXT PRIMARY KEY,
          "registrationRef" TEXT UNIQUE NOT NULL,
          "organisationName" TEXT NOT NULL,
          "organisationType" TEXT NOT NULL,
          "contactName" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "website" TEXT,
          "category" TEXT NOT NULL,
          "lga" TEXT NOT NULL,
          "address" TEXT,
          "description" TEXT NOT NULL,
          "stage" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'submitted',
          "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await pool.query(
        `INSERT INTO "ClimateTechRegistration"
          ("id", "registrationRef", "organisationName", "organisationType", "contactName", "email", "phone", "website", "category", "lga", "address", "description", "stage", "status", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW())`,
        [
          `ctm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          registrationRef,
          String(body.organisationName).trim(), String(body.organisationType).trim(), String(body.contactName).trim(),
          email, phone, String(body.website ?? '').trim() || null, String(body.category).trim(),
          String(body.lga).trim(), String(body.address ?? '').trim() || null,
          String(body.description).trim(), String(body.stage).trim(), 'submitted',
        ],
      )

      return NextResponse.json({ ok: true, registrationRef, storage: 'database' }, { status: 201 })
    } finally {
      await pool.end()
    }
  } catch (error) {
    console.error('Climate Tech registration failed:', error)
    const registrationRef = createRegistrationRef()
    try {
      saveFallback({ ...body, registrationRef, status: 'submitted' })
      return NextResponse.json({ ok: true, registrationRef, storage: 'local-fallback' }, { status: 201 })
    } catch (fallbackError) {
      console.error('Climate Tech fallback save failed:', fallbackError)
      return NextResponse.json({ ok: false, error: 'Registration could not be saved. Please try again.' }, { status: 500 })
    }
  }
}

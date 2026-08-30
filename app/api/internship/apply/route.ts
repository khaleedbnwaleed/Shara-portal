import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateApplicationRef } from '@/lib/internship'

const FALLBACK_FILE = path.join(process.cwd(), 'data', 'internship-applications.json')
const globalForFallbacks = globalThis as typeof globalThis & {
  __internshipFallbacks?: any[]
}

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 100
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      if (
        error.code === 'P1001' ||
        error.code === 'P1002' ||
        error.message?.includes('Connection terminated') ||
        error.message?.includes('database server')
      ) {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)))
          continue
        }
      } else {
        throw error
      }
    }
  }

  throw lastError || new Error('Failed after retries')
}

function readApplicationsFromFallback(): any[] {
  if (globalForFallbacks.__internshipFallbacks) {
    return globalForFallbacks.__internshipFallbacks
  }

  try {
    if (!fs.existsSync(FALLBACK_FILE)) {
      fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true })
      fs.writeFileSync(FALLBACK_FILE, '[]', 'utf-8')
      globalForFallbacks.__internshipFallbacks = []
      return []
    }

    const content = fs.readFileSync(FALLBACK_FILE, 'utf-8')
    const parsed = JSON.parse(content)
    const records = Array.isArray(parsed) ? parsed : []
    globalForFallbacks.__internshipFallbacks = records
    return records
  } catch (error) {
    console.error('Failed to read fallback internship applications:', error)
    globalForFallbacks.__internshipFallbacks = []
    return []
  }
}

function writeApplicationsToFallback(applications: any[]) {
  globalForFallbacks.__internshipFallbacks = applications

  try {
    fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true })
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(applications, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Failed to write fallback internship applications:', error)
    return false
  }
}

async function createFallbackApplication(data: any) {
  const records = readApplicationsFromFallback()
  const normalizedEmail = String(data.email || '').trim().toLowerCase()
  const normalizedPosition = String(data.position || '').trim()

  const duplicate = records.some(
    (item) =>
      String(item.email || '').trim().toLowerCase() === normalizedEmail &&
      String(item.position || '').trim() === normalizedPosition
  )

  if (duplicate) {
    return { duplicate: true }
  }

  let applicationRef = generateApplicationRef()
  let attemptCount = 0

  while (
    records.some((item) => String(item.applicationRef || '').toUpperCase() === applicationRef)
      && attemptCount < 10
  ) {
    applicationRef = generateApplicationRef()
    attemptCount += 1
  }

  const now = new Date().toISOString()
  const record = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...data,
    applicationRef,
    status: 'pending',
    submittedAt: now,
    updatedAt: now,
    storage: 'local-fallback',
  }

  records.push(record)
  const saved = writeApplicationsToFallback(records)

  return {
    duplicate: false,
    record,
    persisted: saved,
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.fullName || !data.email || !data.position) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const preferredStartDateValue = data.preferredStartDate
      ? new Date(data.preferredStartDate)
      : null

    if (preferredStartDateValue === null) {
      return NextResponse.json(
        { ok: false, error: 'Please provide a valid preferred start date.' },
        { status: 400 }
      )
    }

    if (Number.isNaN(preferredStartDateValue.getTime())) {
      return NextResponse.json(
        { ok: false, error: 'Please provide a valid preferred start date.' },
        { status: 400 }
      )
    }

    const preferredStartDate = preferredStartDateValue

    const normalizedData = {
      ...data,
      email: String(data.email).trim().toLowerCase(),
      fullName: String(data.fullName).trim(),
      position: String(data.position).trim(),
      preferredStartDate,
    }

    try {
      const existingApp = await executeWithRetry(() =>
        prisma.internshipApplication.findFirst({
          where: {
            email: normalizedData.email,
            position: normalizedData.position,
          },
        })
      )

      if (existingApp) {
        return NextResponse.json(
          {
            ok: false,
            error: 'You have already submitted an application for this position',
          },
          { status: 409 }
        )
      }

      let applicationRef = generateApplicationRef()
      let refExists = true
      let attemptCount = 0

      while (refExists && attemptCount < 10) {
        const existing = await executeWithRetry(() =>
          prisma.internshipApplication.findUnique({
            where: { applicationRef },
          })
        )

        if (!existing) {
          refExists = false
        } else {
          applicationRef = generateApplicationRef()
          attemptCount += 1
        }
      }

      if (refExists) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Failed to generate unique application reference. Please try again.',
          },
          { status: 500 }
        )
      }

      const application = await executeWithRetry(() =>
        prisma.internshipApplication.create({
          data: {
            ...normalizedData,
            preferredStartDate,
            applicationRef,
            status: 'pending',
          },
        })
      )

      return NextResponse.json({
        ok: true,
        applicationRef: application.applicationRef,
        applicationId: application.id,
        storage: 'database',
      })
    } catch (dbError: any) {
      console.error('Database submission failed:', dbError)

      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { ok: false, error: 'You have already submitted an application for this position' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        {
          ok: false,
          error: 'Unable to save your internship application to the database. Please try again in a moment.',
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to process application. Please try again later.',
      },
      { status: 500 }
    )
  }
}

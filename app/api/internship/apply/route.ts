import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateApplicationRef } from '@/lib/internship'

const FALLBACK_FILE = path.join(process.cwd(), 'data', 'internship-applications.json')

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
  try {
    if (!fs.existsSync(FALLBACK_FILE)) {
      fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true })
      fs.writeFileSync(FALLBACK_FILE, '[]', 'utf-8')
      return []
    }

    const content = fs.readFileSync(FALLBACK_FILE, 'utf-8')
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to read fallback internship applications:', error)
    return []
  }
}

function writeApplicationsToFallback(applications: any[]) {
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

  if (!saved) {
    throw new Error('Failed to save application locally. Please try again.')
  }

  return { duplicate: false, record }
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

    const normalizedData = {
      ...data,
      email: String(data.email).trim().toLowerCase(),
      fullName: String(data.fullName).trim(),
      position: String(data.position).trim(),
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
      console.error('Database submission failed, falling back to local storage:', dbError)

      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { ok: false, error: 'You have already submitted an application for this position' },
          { status: 409 }
        )
      }

      const fallbackResult = await createFallbackApplication(normalizedData)

      if (fallbackResult.duplicate) {
        return NextResponse.json(
          {
            ok: false,
            error: 'You have already submitted an application for this position',
          },
          { status: 409 }
        )
      }

      return NextResponse.json({
        ok: true,
        applicationRef: fallbackResult.record.applicationRef,
        applicationId: fallbackResult.record.id,
        storage: 'local-fallback',
      })
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
